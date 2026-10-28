"""FastAPI entry point for the ShetiMitra voice-assistant module."""
from __future__ import annotations

import os
import shutil
import tempfile
import uuid
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from .advisory_service import get_advisory
    from .speech_service import (
        SUPPORTED_AUDIO_MIME_TYPES,
        SUPPORTED_LANGUAGES,
        SpeechService,
        SpeechUnavailableError,
    )
except ImportError:
    # Supports: python -m uvicorn main:app (run from server/).
    from advisory_service import get_advisory
    from speech_service import (
        SUPPORTED_AUDIO_MIME_TYPES,
        SUPPORTED_LANGUAGES,
        SpeechService,
        SpeechUnavailableError,
    )

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
AUDIO_DIR = BASE_DIR / "generated_audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", "26214400"))
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

app = FastAPI(title="ShetiMitra Voice Assistant", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.mount("/static/audio", StaticFiles(directory=AUDIO_DIR), name="audio")
speech = SpeechService(AUDIO_DIR, WHISPER_MODEL)


class ChatRequest(BaseModel):
    text: str = Field(min_length=1, max_length=3000)
    language: Literal["mr", "hi", "en"] = "en"


class HealthResponse(BaseModel):
    status: str
    service: str
    speech_configured: bool
    whisper_available: bool
    gtts_available: bool
    ffmpeg_available: bool
    supported_languages: dict[str, str]


def validate_language(language: str) -> None:
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=422, detail="Language must be mr, hi, or en.")


def validate_audio(upload: UploadFile) -> None:
    if not upload.filename:
        raise HTTPException(status_code=400, detail="An audio filename is required.")
    extension = Path(upload.filename).suffix.lower()
    mime_type = (upload.content_type or "").split(";", 1)[0].strip().lower()
    if mime_type not in SUPPORTED_AUDIO_MIME_TYPES.get(extension, set()):
        raise HTTPException(
            status_code=415,
            detail="Unsupported audio format. Use WAV, MP3, WebM, OGG, or M4A.",
        )


def save_upload(upload: UploadFile) -> tuple[Path, int]:
    suffix = Path(upload.filename or "upload").suffix.lower()
    file_descriptor, temp_name = tempfile.mkstemp(prefix="sheti-", suffix=suffix)
    os.close(file_descriptor)
    temp_path = Path(temp_name)
    size = 0
    try:
        with temp_path.open("wb") as destination:
            while chunk := upload.file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="Upload exceeds the 25 MB limit.")
                destination.write(chunk)
        if size == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    except Exception:
        temp_path.unlink(missing_ok=True)
        raise
    return temp_path, size


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="ShetiMitra Voice Assistant",
        speech_configured=speech.configured,
        whisper_available=speech.whisper_available,
        gtts_available=speech.gtts_available,
        ffmpeg_available=speech.ffmpeg_available,
        supported_languages=SUPPORTED_LANGUAGES,
    )


@app.post("/api/chat")
def chat(payload: ChatRequest):
    reply = get_advisory(payload.text, payload.language)
    return {
        "selected_language": payload.language,
        "assistant_reply": reply,
        "status": "completed",
    }


@app.post("/api/voice")
def voice(
    audio: UploadFile = File(...),
    language: Literal["mr", "hi", "en"] = Form(...),
):
    validate_language(language)
    validate_audio(audio)
    temp_path = None
    try:
        temp_path, _ = save_upload(audio)
        recognized = speech.transcribe(temp_path, language)
        reply = get_advisory(recognized, language)
        filename = speech.generate_speech(reply, language)
    except SpeechUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    finally:
        audio.file.close()
        if temp_path:
            temp_path.unlink(missing_ok=True)

    return {
        "selected_language": language,
        "audio_url": f"/static/audio/{filename}",
        "status": "completed",
    }



@app.delete("/api/audio/{filename}")
def delete_audio(filename: str):
    if Path(filename).name != filename or not filename.lower().endswith(".mp3"):
        raise HTTPException(status_code=400, detail="Invalid audio filename.")
    target = (AUDIO_DIR / filename).resolve()
    if not target.is_file() or AUDIO_DIR.resolve() not in target.parents:
        raise HTTPException(status_code=404, detail="Audio file not found.")
    target.unlink()
    return {"status": "deleted"}
