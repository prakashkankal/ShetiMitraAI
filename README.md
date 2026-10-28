# ShetiMitra AI — Voice Assistant Module

A beginner-friendly, independent voice-assistant module for crop advisory. The FastAPI backend is separate from the temporary React/Vite frontend, so a partner's real UI can later call the same `/api` endpoints without backend changes.

> **Safety:** This project is a demonstration. The advisory service uses fixed Marathi/Hindi/English rules, does not diagnose diseases, and does not invent pesticide names or doses.

## Folder structure

```text
ShetiMitra-Voice-Module/
├── server/
│   ├── main.py                 # FastAPI routes, validation, CORS, static audio
│   ├── speech_service.py       # Lazy Whisper and gTTS integration
│   ├── advisory_service.py     # Replaceable demo-only rule-based advice
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Safe configuration template
├── client/
│   ├── public/
│   ├── src/
│   │   ├── services/api.js     # Single place for all backend calls
│   │   ├── App.jsx             # Temporary dashboard and MediaRecorder logic
│   │   ├── App.css             # Responsive agricultural theme
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Dev proxy to FastAPI
├── .gitignore
└── README.md
```

## One-time setup in VS Code

Open a PowerShell terminal in the project folder:

```powershell
cd "d:\College project\EDI VOICE MODULE\ShetiMitra-Voice-Module"

# Use the existing environment already in this project.
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
# Python 3.12 is recommended for the pinned Whisper version.
py -3.12 -m pip install -r .\server\requirements.txt
Copy-Item .\server\.env.example .\server\.env
```

If PowerShell blocks the activate command, run this once for the current terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

## FFmpeg and Whisper

OpenAI Whisper requires FFmpeg. Check whether it is already available:

```powershell
ffmpeg -version
```

If `ffmpeg` is not recognized, install it in a normal way (for example with `winget install Gyan.FFmpeg`) and restart VS Code/PowerShell. The backend's `speech_configured` health field will remain false until Whisper, gTTS, and FFmpeg are usable.

The server uses the `small` multilingual Whisper model by default. It is downloaded lazily on the first `/api/voice` request. The first request can therefore be slow and requires internet access. No real speech processing is claimed to work unless you test it.

## Run the backend

```powershell
cd "d:\College project\EDI VOICE MODULE\ShetiMitra-Voice-Module"
.\venv\Scripts\Activate.ps1
python -m uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API documentation. Stop the server with `Ctrl+C`.

## Run the temporary frontend

Open a second VS Code terminal:

```powershell
cd "d:\College project\EDI VOICE MODULE\ShetiMitra-Voice-Module\client"
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend proxies `/api` and `/static` to FastAPI, while all fetch calls live in `src/services/api.js`.

To create a production build:

```powershell
npm run build
```

## API contract

All routes are below `/api`. CORS is limited by `CORS_ORIGINS` in `server/.env`.

### `GET /api/health`

Returns backend status and component availability.

Example:

```json
{
  "status": "ok",
  "service": "ShetiMitra Voice Assistant",
  "speech_configured": false,
  "whisper_available": true,
  "gtts_available": true,
  "ffmpeg_available": false,
  "supported_languages": {"mr":"Marathi","hi":"Hindi","en":"English"}
}
```

### `POST /api/chat`

`Content-Type: application/json`

```json
{ "text": "My crop leaves have yellow spots", "language": "en" }
```

Response:

```json
{
  "selected_language": "en",
  "assistant_reply": "...safe demo guidance...",
  "status": "completed"
}
```

The text endpoint returns text only and does not generate speech. The response is in the language selected explicitly; it does not silently auto-detect a language.

### `POST /api/voice`

A `multipart/form-data` request with:

- `audio`: WAV, MP3, WebM, OGG, or M4A file (maximum 25 MB)
- `language`: `mr`, `hi`, or `en`

Response:

```json
{
  "selected_language": "hi",
  "audio_url": "/static/audio/<uuid>.mp3",
  "status": "completed"
}
```

Whisper, FFmpeg, and gTTS must be available. The voice endpoint transcribes the uploaded audio with Whisper, uses the selected language for the advisory, and returns generated audio for playback. Empty or unintelligible recordings return a useful 503 error, and temporary upload files are removed.

### `DELETE /api/audio/{filename}`

Deletes a generated MP3 from the controlled temporary audio directory. It is optional cleanup support.

## Calling this backend from another React frontend

Use the three requests and audio URL behavior:

```js
const health = await fetch('/api/health').then(r => r.json())

const chat = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'yellow leaves', language: 'en' })
}).then(r => r.json())

const voiceForm = new FormData()
voiceForm.append('audio', recordedAudio, 'recording.webm')
voiceForm.append('language', 'en')
const voice = await fetch('/api/voice', { method: 'POST', body: voiceForm }).then(r => r.json())
const audio = new Audio(voice.audio_url)
await audio.play()
```

For voice, create `multipart/form-data` and append `audio` plus `language`. The temporary frontend can also show browser live speech text; the final response uses Whisper transcription from the backend.
## Configuration

Copy `server/.env.example` to `server/.env` if not already created:

- `WHISPER_MODEL=small`: multilingual Whisper model (change only after testing).
- `CORS_ORIGINS`: comma-separated frontend origins.
- `MAX_UPLOAD_BYTES`: upload limit in bytes.
- `HOST` and `PORT`: values for manual future startup; Uvicorn command options take precedence.

Never commit API keys or secrets to `.env` or source files.

## Demo test checklist

### Text/chat

1. Start the backend and frontend.
2. Confirm the green backend indicator says **Backend connected**.
3. In each language, ask about crop leaves or symptoms and verify a disclaimer appears.
4. Ask an unrelated question and verify uncertainty points to a Krishi Kendra/agriculture officer.
5. Confirm no disease name, pesticide name, or chemical dose is invented.

### Voice (test only after FFmpeg is configured)

1. Allow browser microphone permission.
2. Record a clearly spoken 5–10 second question in Marathi.
3. Verify only short status messages are visible while processing and the generated answer plays automatically.
4. Repeat for Hindi and English.

### Text assistant

1. Select **Text Assistant** and type an agricultural question.
2. Verify the advisory appears as text and no audio is generated or played.

### Leaf demo

1. Upload JPEG/PNG/WebP.
2. Confirm the response says **DEMO** and that no disease was detected.
3. Confirm an image preview is shown and unsupported files are rejected.

### Failure cases

- Try with backend stopped: verify a friendly connection error appears.
- Deny microphone permission: verify a permission explanation appears.
- Upload an empty/unsupported file: verify a backend 400/415 error appears.
