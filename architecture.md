# ShetiMitra AI --- System Architecture

**Status:** Initial architecture proposal\
**Platform:** Responsive React web application\
**Application stack:** MongoDB, Express.js, React.js, Node.js (MERN)\
**AI approach in project synopsis:** Python 3.10, YOLOv8, Whisper, gTTS\
**Important:** The architecture separates the MERN application from AI
processing. If the team confirms TensorFlow.js inference inside Node.js
instead, update this document and the service contracts before
implementation.

------------------------------------------------------------------------

## 1. Architectural Goals

-   Keep frontend, backend, database, and AI inference responsibilities
    separate.
-   Support mobile-first use and multilingual UI.
-   Keep uncertain predictions from triggering unsafe advice.
-   Make model and weather-provider failures explicit.
-   Make the system testable and suitable for research evaluation.
-   Minimize collection and retention of personal data.

## 2. High-Level Architecture

``` mermaid
flowchart TD
    F[Farmer using mobile browser] --> R[React + Vite frontend]
    A[Authorized administrator] --> R
    R -->|HTTPS REST API| E[Node.js + Express API]
    E --> M[(MongoDB Atlas)]
    E -->|Image inference request| AI[Python AI service]
    AI --> Y[YOLOv8 disease model]
    AI --> W[Whisper speech-to-text]
    AI --> T[gTTS text-to-speech]
    E --> O[OpenWeather API]
    E --> C[Curated advisory and risk rules]
    M --> E
    O --> E
    C --> E
    E --> R
    R --> F
```

The AI service may be deployed separately from the Express API. Do not
expose internal AI service endpoints directly to public clients unless a
specific security design requires it.

## 3. Main Components

### 3.1 Frontend --- `client/`

**Technology:** React.js, Vite, JavaScript, React Router, Tailwind CSS.

Responsibilities: - Dashboard and navigation. - Language selection and
translated UI. - Leaf image selection/capture, preview, and upload. -
Prediction, confidence, and uncertain-result views. - Text advisory and
audio playback. - Weather-risk cards. - Scan history and admin
interface. - Loading, empty, validation, and failure states.

The frontend must not contain database credentials, private API keys, or
trusted business rules.

### 3.2 Backend API --- `server/`

**Technology:** Node.js, Express.js, Mongoose.

Responsibilities: - Expose versioned REST endpoints. - Validate inputs
and uploaded files. - Coordinate requests to the AI service and weather
provider. - Retrieve verified advisory content. - Apply
confidence/uncertainty policy consistently. - Store scan metadata,
advisories, and risk alerts in MongoDB. - Enforce authentication and
authorization for protected routes. - Apply rate limiting, timeouts, and
safe error handling.

Suggested internal layers: - `routes/`: endpoint definitions. -
`controllers/`: HTTP request/response handling. - `services/`:
application logic and external-service calls. - `models/`: Mongoose
schemas. - `middleware/`: validation, authentication, authorization,
upload handling, and error handling. - `config/`: database and
environment configuration. - `utils/`: shared helpers.

### 3.3 AI Service --- `ai-service/`

**Technology from synopsis:** Python 3.10, YOLOv8, Whisper, gTTS. A
small HTTP service (for example, FastAPI) can expose these capabilities
to Express.

Responsibilities: - Validate inference requests and image format. - Run
the configured disease model. - Return supported labels, scores, model
version, and processing status. - Transcribe permitted speech input. -
Generate audio for approved response text when requested. - Return
structured errors when a model or dependency is unavailable.

Do not train a model inside a normal user-facing request. Train and
evaluate models in a separate development workflow, then deploy a
versioned model artifact.

### 3.4 Database --- MongoDB Atlas

Responsibilities: - Store supported crop/disease definitions. - Store
expert-reviewed advisory content and translations. - Store scan metadata
and prediction results when history is enabled. - Store weather-risk
alerts and their source/rule metadata. - Store admin accounts/roles if
using application-managed authentication. - Store model/evaluation
metadata where appropriate.

Do not store large image/audio files directly in MongoDB by default. Use
temporary processing or a configured object-storage service if retention
is necessary.

### 3.5 External Services

-   **Weather provider:** OpenWeather, accessed from the backend.
-   **Image storage:** optional, only when persistent image retention is
    approved.
-   **Speech/model dependencies:** hosted or locally deployed according
    to the chosen AI service.
-   External service credentials must be held server-side and configured
    through environment variables.

## 4. Primary Data Flows

### 4.1 Leaf Disease Scan

1.  Farmer selects a crop and submits a leaf image.
2.  React validates basic file constraints and sends the image to
    Express.
3.  Express validates the request and forwards the image to the AI
    service.
4.  AI service returns candidate labels, scores, and model metadata.
5.  Backend applies the validated confidence policy.
6.  If sufficiently reliable, backend retrieves matching reviewed
    advisory content.
7.  If uncertain, backend returns an uncertain status and avoids
    presenting disease-specific treatment as confirmed.
8.  Backend optionally stores scan metadata according to retention
    settings.
9.  React displays the result, advisory, and next steps.

### 4.2 Marathi Voice Question

1.  Farmer grants microphone permission and records speech.
2.  The recording is sent securely to the backend/AI service.
3.  Speech-to-text returns recognized text and status.
4.  The application displays the recognized text where feasible.
5.  The question is routed only to supported application functionality;
    arbitrary questions must not be treated as verified agricultural
    advice.
6.  Approved response text may be converted to audio.
7.  The UI presents text and audio, with failure handling.

### 4.3 Weather Risk

1.  The user selects or grants a location, or enters a location through
    a supported flow.
2.  Backend retrieves weather data.
3.  Backend evaluates documented disease-specific rules using supported
    weather variables.
4.  The application returns risk category, forecast period, reason, data
    timestamp, and rule/source metadata.
5.  UI labels the result as a risk warning, not a disease diagnosis.

### 4.4 Advisory Content Update

1.  An authenticated administrator edits a disease/advisory record.
2.  Backend validates the record and authorization.
3.  Reviewer/source/status metadata are recorded.
4.  Only approved content is available to the farmer-facing advisory
    workflow.

## 5. Proposed REST API Contract

Prefix: `/api/v1`

  --------------------------------------------------------------------------
  Method                  Endpoint                   Purpose
  ----------------------- -------------------------- -----------------------
  GET                     `/health`                  API health status

  GET                     `/crops`                   List enabled crops

  GET                     `/diseases?cropId=...`     List supported diseases
                                                     for a crop

  POST                    `/scans`                   Submit an image for
                                                     analysis

  GET                     `/scans/:id`               Retrieve a permitted
                                                     scan record

  GET                     `/scans`                   List the current user's
                                                     history, if
                                                     history/auth are
                                                     enabled

  DELETE                  `/scans/:id`               Delete a permitted scan
                                                     record

  POST                    `/voice/transcriptions`    Transcribe an uploaded
                                                     recording

  POST                    `/voice/speech`            Generate speech for
                                                     approved text

  GET                     `/weather/risk`            Retrieve weather-based
                                                     risk for a supported
                                                     location/crop

  GET                     `/advisories/:diseaseId`   Retrieve approved
                                                     advisory content

  GET/POST/PUT            `/admin/advisories`        Protected advisory
                                                     management

  GET/POST/PUT            `/admin/weather-rules`     Protected weather-rule
                                                     management
  --------------------------------------------------------------------------

The exact request/response schemas, authentication requirements,
pagination, and upload limits must be documented alongside
implementation. Do not claim endpoints exist until implemented.

## 6. Example Disease Scan Response

Illustrative API shape only; values below are not real model output.

``` json
{
  "scanId": "example-id",
  "status": "uncertain",
  "crop": "tomato",
  "predictions": [
    { "label": "supported-label-a", "score": 0.42 },
    { "label": "supported-label-b", "score": 0.31 },
    { "label": "healthy", "score": 0.12 }
  ],
  "advisory": null,
  "messageKey": "scan.uncertain",
  "modelVersion": "configured-model-version"
}
```

The response schema must be finalized based on the selected model.
Confidence scores must not be described as calibrated probabilities
unless calibration has been evaluated.

## 7. Data Model Proposal

### Crop

-   `name`
-   `slug`
-   `enabled`
-   `supportedDiseases`

### Disease

-   `cropId`
-   `name`
-   `label`
-   `description`
-   `enabled`
-   `modelLabel`

### Advisory

-   `diseaseId`
-   `language`
-   `symptoms`
-   `prevention`
-   `treatmentGuidance`
-   `reviewStatus`
-   `reviewedBy` (only if needed and approved)
-   `sourceReferences`
-   `updatedAt`

### Scan

-   `cropId`
-   `predictions`
-   `status` (`completed`, `uncertain`, `failed`)
-   `modelVersion`
-   `createdAt`
-   `imageReference` (optional; only if persistent image storage is
    enabled)
-   `ownerId` (only if authenticated history is implemented)

### WeatherRisk

-   `cropId`
-   `diseaseId`
-   `riskLevel`
-   `explanation`
-   `weatherSnapshotTime`
-   `ruleVersion`
-   `sourceReferences`
-   `createdAt`

These are proposed fields, not an instruction to store every field.
Collect only what the application needs.

## 8. Security and Privacy

-   Use HTTPS in deployment.
-   Validate and limit uploads by size and MIME/content type.
-   Generate safe temporary filenames; do not trust user-supplied paths.
-   Keep secrets in `.env` locally and a secret manager/environment
    configuration in deployment.
-   Commit `.env.example` with variable names and placeholders only.
-   Add rate limiting and timeouts to expensive endpoints.
-   Protect admin routes with authentication and role checks.
-   Do not log raw audio, raw images, tokens, passwords, or private data
    by default.
-   Define retention and deletion behavior for images, audio, and
    history.
-   Obtain consent for speech recording and research surveys.

## 9. Deployment Topology

-   Frontend: static hosting such as Vercel.
-   Express API: a Node.js-capable host.
-   AI service: a Python-capable host with sufficient memory/compute for
    the model.
-   Database: MongoDB Atlas.
-   Image storage: optional object storage if retention is enabled.

The services need secure URLs, configured CORS, timeouts, health checks,
and compatible request-size limits. Free-tier availability and resource
limits must be verified at deployment time.

## 10. Architecture Decisions Still Required

1.  Confirm the model implementation: Python YOLOv8 as in the synopsis,
    or TensorFlow.js inside Node.js. Avoid maintaining two inference
    paths without a clear reason.
2.  Finalize the first crop and supported disease labels after dataset
    review.
3.  Decide whether farmer scans require accounts or can be anonymous.
4.  Define image/audio retention and deletion.
5.  Select and validate confidence thresholds using held-out evaluation
    data.
6.  Document approved weather-risk rules and sources.
7.  Define deployment providers and operational limits.
