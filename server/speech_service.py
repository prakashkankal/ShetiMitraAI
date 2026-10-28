"""Speech processing: Whisper transcription and gTTS response generation."""
from __future__ import annotations

import os
import shutil
import threading
import uuid
from pathlib import Path

SUPPORTED_LANGUAGES = {"mr": "Marathi", "hi": "Hindi", "en": "English"}
SUPPORTED_AUDIO_MIME_TYPES = {
    ".wav": {"audio/wav", "audio/x-wav"},
    ".mp3": {"audio/mpeg", "audio/mp3"},
    ".webm": {"audio/webm"},
    ".ogg": {"audio/ogg", "application/ogg"},
    ".m4a": {"audio/mp4", "audio/x-m4a"},
}

try:
    import whisper
except ImportError:
    whisper = None

try:
    from gtts import gTTS
except ImportError:
    gTTS = None


class SpeechUnavailableError(RuntimeError):
    pass


class SpeechService:
    def __init__(self, audio_directory: Path, whisper_model: str = "small"):
        self.audio_directory = audio_directory
        self.whisper_model_name = whisper_model
        self.audio_directory.mkdir(parents=True, exist_ok=True)
        self._model = None
        self._model_lock = threading.Lock()

    @property
    def whisper_available(self) -> bool:
        return whisper is not None

    @property
    def gtts_available(self) -> bool:
        return gTTS is not None

    def _ffmpeg_path(self) -> str | None:
        configured_path = os.getenv("FFMPEG_PATH")
        if configured_path and Path(configured_path).is_file():
            return configured_path
        return shutil.which("ffmpeg")

    @property
    def ffmpeg_available(self) -> bool:
        return self._ffmpeg_path() is not None

    @property
    def configured(self) -> bool:
        return self.whisper_available and self.gtts_available and self.ffmpeg_available

    def _load_model(self):
        if not self.whisper_available:
            raise SpeechUnavailableError(
                "OpenAI Whisper is not installed. Install server/requirements.txt."
            )
        ffmpeg_path = self._ffmpeg_path()
        if not ffmpeg_path:
            raise SpeechUnavailableError(
                "FFmpeg was not found. Set FFMPEG_PATH in server/.env or add FFmpeg to PATH."
            )
        os.environ["PATH"] = f"{Path(ffmpeg_path).parent}{os.pathsep}{os.environ.get('PATH', '')}"
        if self._model is None:
            with self._model_lock:
                if self._model is None:
                    try:
                        self._model = whisper.load_model(self.whisper_model_name)
                    except Exception as exc:
                        raise SpeechUnavailableError(
                            f"Whisper model '{self.whisper_model_name}' could not be loaded. "
                            "Check the first-download internet connection and available disk space."
                        ) from exc
        return self._model

    def transcribe(self, audio_path: Path, language: str) -> str:
        if language not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language: {language}")
        if audio_path.suffix.lower() not in SUPPORTED_AUDIO_MIME_TYPES:
            raise ValueError("Unsupported audio format. Use WAV, MP3, WebM, OGG, or M4A.")
        model = self._load_model()
        try:
            # Whisper decodes the uploaded media through FFmpeg inside transcribe().
            result = model.transcribe(str(audio_path), language=language)
        except Exception as exc:
            raise SpeechUnavailableError(
                f"Whisper could not process this recording: {exc}"
            ) from exc
        text = str(result.get("text", "")).strip()
        if not text:
            raise SpeechUnavailableError(
                "Whisper did not recognize speech. Please record a clearer, longer clip."
            )
        return text

    def generate_speech(self, text: str, language: str) -> str:
        if not self.gtts_available:
            raise SpeechUnavailableError(
                "gTTS is not installed. Install server/requirements.txt."
            )
        if language not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language: {language}")

        filename = f"{uuid.uuid4().hex}.mp3"
        output_path = self.audio_directory / filename
        try:
            gTTS(text=text, lang=language).save(str(output_path))
        except Exception as exc:
            output_path.unlink(missing_ok=True)
            raise SpeechUnavailableError(
                f"gTTS could not generate audio: {exc}"
            ) from exc
        return filename
