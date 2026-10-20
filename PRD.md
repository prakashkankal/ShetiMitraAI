# Product Requirements Document (PRD)

## ShetiMitra AI: An AI-Powered Multilingual Crop Disease Detection and Agricultural Advisory System

**Document status:** Initial draft\
**Project status:** Planned --- implementation and evaluation results
are not yet available\
**Primary platform:** Responsive web application\
**Primary users:** Farmers, with authorized administrators for verified
advisory content

------------------------------------------------------------------------

## 1. Product Overview

ShetiMitra AI helps farmers submit crop-leaf images, receive AI-assisted
disease predictions, and access understandable agricultural guidance in
Marathi, Hindi, or English. The system must communicate uncertainty
rather than present every prediction as certain. Weather-based
disease-risk alerts are a supporting feature.

The initial implementation should prioritize tomato diseases. Other
crops, including cotton, potato, and chilli, must only be enabled when a
suitable dataset, model support, and verified advisory content are
available.

## 2. Problem Statement

Farmers may have difficulty identifying crop diseases and may receive
unsuitable advice. Models evaluated on clean laboratory images may
perform less reliably on real farm images. Text-only English interfaces
can also be difficult for farmers who prefer Marathi or voice
interaction. A prediction without an uncertainty mechanism can encourage
unsafe decisions.

ShetiMitra AI aims to combine image-based disease detection,
multilingual/voice interaction, verified advisory content, and an
explicit uncertain-result workflow.

## 3. Goals

1.  Let a farmer submit a leaf image from a phone or computer.
2.  Return supported disease predictions with confidence information.
3.  Show an explicit "unable to identify reliably" outcome when the
    model is uncertain.
4.  Provide expert-reviewed disease information and precautions in
    supported languages.
5.  Support Marathi voice input and spoken responses, subject to
    measured speech quality.
6.  Show disease-specific weather risk alerts based on documented
    agricultural rules.
7.  Evaluate performance on public datasets and separately collected
    field images.
8.  Minimize personal data collection and protect uploaded images and
    records.

## 4. Non-Goals for the Initial Release

-   Replacing an agricultural officer or qualified agronomist.
-   Providing autonomous pesticide prescriptions or unverified chemical
    doses.
-   Claiming guaranteed disease identification or a predetermined
    accuracy.
-   Covering every crop or disease from the beginning.
-   Satellite crop monitoring, pest counting, mandi-price prediction, or
    IoT hardware.
-   WhatsApp bot integration unless it is approved as a later extension.
-   Native Android packaging in the first web release.

## 5. Target Users

### 5.1 Farmer

Needs a simple, mobile-friendly interface, minimal typing, clear
results, language selection, and actionable but safe guidance.

### 5.2 Content Administrator / Agricultural Reviewer

Maintains disease descriptions, translations, approved precautions, and
weather-risk rules. Only authorized users may publish or modify advisory
content.

### 5.3 Project Researcher

Uses labeled datasets and evaluation tools to measure model performance,
uncertainty behavior, Marathi speech recognition, and usability.
Research tools must not expose private farmer information unnecessarily.

## 6. Functional Requirements

### FR-01: Language Selection

-   The interface should offer Marathi, Hindi, and English.
-   All supported static UI strings should use a consistent translation
    mechanism.
-   Missing translations must be clearly handled rather than silently
    replaced with misleading text.
-   The actual quality of speech recognition and generated speech must
    be evaluated; language selection alone does not prove language
    quality.

### FR-02: Leaf Image Submission

-   The user can select an image from the device or capture one using a
    supported browser camera flow.
-   Show a preview and allow retaking or replacing the image.
-   Validate file type and size on both client and server.
-   Reject unsupported, corrupted, or empty files with a useful error.
-   Do not store image files permanently unless persistent storage is
    explicitly enabled and disclosed.

### FR-03: Disease Inference

-   Submit an accepted image to the configured AI inference service.
-   Return only labels supported by the deployed model.
-   Include model/service status and a request identifier for debugging.
-   Handle timeout, unavailable model, and invalid-image errors.
-   Do not use hardcoded predictions as production results.

### FR-04: Confidence and Uncertainty

-   Define and document a confidence threshold only after model
    validation.
-   Show top predictions and their scores when the model provides them
    reliably.
-   When confidence is below the validated threshold, show an uncertain
    result and recommend consulting an agricultural expert or Krishi
    Kendra.
-   Do not show disease-specific treatment as confirmed when the result
    is uncertain.
-   Evaluate the trade-off between accuracy on answered cases and the
    proportion of cases answered.

### FR-05: Advisory Content

-   Retrieve advice from a curated database linked to supported
    crop/disease labels.
-   Include symptoms, prevention, and reviewed guidance where available.
-   Every published treatment-related entry must have a
    reviewer/source/status field.
-   Unreviewed content must not be presented as approved treatment
    advice.
-   Keep AI prediction output separate from verified advisory content.

### FR-06: Voice Input

-   Allow the user to record speech with permission.
-   Convert speech to text using the configured speech-to-text service.
-   Display recognized text where feasible so the user can detect
    errors.
-   Handle denied microphone permissions, recording failures, and
    recognition errors.
-   Store recordings only when necessary, with consent and a defined
    retention policy.

### FR-07: Spoken Advisory

-   Provide text output and, when supported, audio output in the
    selected language.
-   Provide play/replay controls and a readable text alternative.
-   Handle audio generation failure without blocking the text advisory.
-   Do not imply that generated speech is correct merely because it is
    audible.

### FR-08: Weather and Disease Risk

-   Retrieve forecast/current conditions from the configured weather
    provider.
-   Calculate risk using documented disease-specific rules and supported
    weather variables.
-   Show the location/forecast period and explain the reason for an
    alert.
-   Distinguish a weather risk warning from a confirmed disease
    diagnosis.
-   Handle unavailable location permission, missing coordinates, API
    limits, and stale data.
-   Do not invent risk thresholds; record their agricultural source and
    review status.

### FR-09: Scan History

-   If history is enabled, save scan metadata and results with a
    timestamp.
-   Avoid collecting names, phone numbers, or precise location unless
    required and consented to.
-   Provide a way to view and delete stored records.
-   Apply access controls so one user cannot access another user's
    private history.
-   State whether images themselves are retained.

### FR-10: Administration

-   Restrict admin features behind authentication and role-based
    authorization.
-   Allow authorized administrators to create/update disease
    information, translations, and risk rules.
-   Track publication status, reviewer/source, and update timestamps.
-   Validate all changes and prevent unauthorized publication.

### FR-11: Research Evaluation

-   Keep laboratory and field test sets distinguishable.
-   Avoid evaluating on images that were used to train or tune the
    model.
-   Calculate accuracy, precision, recall, F1-score, and a confusion
    matrix; use mAP only if the chosen task/model requires it.
-   Measure uncertainty threshold performance and coverage.
-   Evaluate Marathi speech with word error rate and
    farmer-understanding feedback where feasible.
-   Report only measured results; do not pre-fill or fabricate results.

### FR-12: Errors and Feedback

-   Provide clear loading, empty, success, and error states.
-   Log technical errors without unnecessarily logging raw audio,
    images, secrets, or personal information.
-   Allow users/testers to report incorrect predictions or advisory
    issues.
-   Feedback must not automatically become verified training data.

## 7. Non-Functional Requirements

### Performance

-   The UI should remain responsive on common mobile devices.
-   Image upload and inference should show progress or loading state.
-   Response-time targets must be set after a baseline test; do not
    invent a benchmark.

### Security

-   Use HTTPS in deployed environments.
-   Store credentials in environment variables or a secret manager.
-   Validate request bodies, parameters, and uploaded files.
-   Apply rate limits to expensive endpoints.
-   Restrict admin routes and protect against unauthorized access.
-   Do not commit `.env` files or API keys.

### Reliability

-   Handle database, AI service, and weather-provider outages
    gracefully.
-   Use timeouts and predictable error responses between services.
-   Do not return fake successful results when a dependency is
    unavailable.

### Accessibility and Usability

-   Use readable typography, adequate contrast, large touch targets, and
    clear icons with labels.
-   Design mobile-first for users who may have limited technical
    experience.
-   Support keyboard navigation for relevant controls.
-   Avoid relying on color alone to communicate risk.

### Privacy and Ethics

-   Obtain permission before recording speech or conducting farmer
    surveys.
-   Minimize personal data collection.
-   Define image/audio retention before enabling persistent storage.
-   Explain that the system is advisory support and not a replacement
    for an agricultural expert.

## 8. Initial Acceptance Criteria

The first usable release is acceptable when: 1. The React app runs and
has routes for dashboard, scan, history, weather, and guidance. 2. The
backend exposes a health endpoint and validates incoming requests. 3. A
supported leaf image can reach the configured inference service. 4. Real
model results are distinguished from errors and uncertain results. 5.
The app does not issue treatment guidance for uncertain predictions. 6.
Advisory content comes from stored, reviewable records rather than
arbitrary generated text. 7. Weather alerts identify their source/period
and are explicitly described as risk estimates. 8. Tests cover key
validation, failure, and authorization paths. 9. Documentation lists
environment variables without exposing secret values. 10. Research
metrics are calculated from actual test data and not fabricated.

## 9. Assumptions and Open Decisions

-   Initial crop and disease list: finalize with the project guide and
    dataset review.
-   AI implementation: the synopsis proposes Python 3.10, YOLOv8,
    Whisper, and gTTS. If the team instead chooses TensorFlow.js
    inference in Node.js, document the model format and migration
    decision before implementation.
-   Authentication for farmers: decide whether anonymous use is
    sufficient for the first release; admin authentication is required
    for content management.
-   Image/audio retention: decide and document before enabling
    persistence.
-   Weather risk thresholds and advisory content: require credible
    agricultural sources and expert review.
-   Deployment providers and service limits: decide before production
    deployment.
-   Accuracy, confidence threshold, response time, speech quality, and
    farmer-study results: pending measurement; none are assumed in this
    document.

## 10. Delivery Phases

1.  Foundation: repository structure, React shell, Express server,
    MongoDB connection, environment configuration.
2.  Image workflow: upload validation, AI service contract, inference
    integration.
3.  Safety and advice: confidence handling, curated advisory schema,
    uncertain-result UX.
4.  Language and voice: translations, speech input, text/audio output.
5.  Weather: provider integration, documented risk rules, alert UI.
6.  History and admin: access controls, content management, retention
    controls.
7.  Evaluation and release: automated tests, field evaluation,
    accessibility/usability review, deployment documentation.
