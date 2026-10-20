# ShetiMitra AI — Project Context

## 1. Project Overview
Build ShetiMitra AI, a mobile-first, responsive web application that helps farmers identify crop diseases from leaf images and receive safe agricultural guidance in Marathi, Hindi, and English. The initial scope is tomato disease detection, with cotton considered only if a suitable dataset is available.

## 2. Technology Stack
- Frontend: React.js with Vite and JavaScript (not TypeScript).
- Styling: Tailwind CSS.
- Backend: Node.js and Express.js REST API.
- Database: MongoDB Atlas with Mongoose.
- AI service: Python 3.10, YOLOv8 for disease inference, and Whisper for speech-to-text.
- Text-to-speech: gTTS.
- Weather: OpenWeather API with documented, disease-specific risk rules.
- Image storage: Use temporary processing or configured image storage; do not assume credentials exist.

## 3. Core Modules
1. Farmer dashboard and language selection.
2. Leaf image capture, upload, validation, and preview.
3. AI disease detection.
4. Confidence-aware results, top-three predictions, and an uncertain-result state.
5. Marathi voice input.
6. Multilingual text and voice advisory.
7. Weather and disease-risk alerts.
8. Scan history and reports.
9. Expert-verified agricultural knowledge database.
10. Admin and content management.
11. AI model evaluation and research tools.
12. Security, privacy, and monitoring.

## 4. Architecture
- React communicates with the Express backend through versioned REST endpoints.
- Express handles validation, authorization, business logic, and MongoDB access.
- Express calls the Python AI service for image inference and speech processing.
- MongoDB stores scan metadata, disease information, approved advisories, and weather alerts.
- Secrets are stored in environment variables and never committed to Git.
- Keep the AI service independent so it can be deployed separately.

## 5. Safety Requirements
- Never invent model accuracy, confidence thresholds, disease predictions, or research results.
- If confidence is below a threshold established through evaluation, clearly say the result is uncertain and recommend consulting an agricultural expert.
- Do not provide unverified pesticide names or doses.
- Treatment and prevention content must be reviewed by a qualified agricultural expert before publication.
- Clearly distinguish weather risk warnings from confirmed disease diagnoses.
- Collect minimal personal data and obtain consent for speech recordings and farmer surveys.

## 6. Coding Rules
- Use JavaScript, not TypeScript, for React and Node.js.
- Use reusable React components and a consistent design system.
- Use modular Express routes, controllers, services, and models.
- Validate and handle errors on both frontend and backend.
- Never use hardcoded or dummy data as if it were real production data. Mock data is permitted only when clearly labeled for development and isolated from production.
- Do not invent API keys, credentials, model files, or database connection strings.
- Do not install unnecessary dependencies or rewrite working code without a reason.
- Keep frontend, backend, and AI-service responsibilities separate.
- Add loading, empty, error, and success states to user-facing workflows.
- Make the interface responsive and accessible, prioritizing farmers using phones.

## 7. Development Workflow
- First inspect the existing repository and report its current structure.
- Implement only the explicitly requested phase.
- Before editing, identify affected files and explain the planned changes briefly.
- Preserve existing working functionality and avoid unrelated changes.
- Run relevant checks and report actual results; never claim tests passed without running them.
- Update documentation when architecture, API contracts, or environment variables change.

## 8. Initial Milestone
Create the React application shell with routing, a mobile-first layout, a language selector, a farmer dashboard, and clearly defined placeholder states for the not-yet-connected modules. Do not pretend AI detection, weather, voice processing, authentication, or database features work until their integrations are implemented.

## 9. Expected Root Structure
ShetiMitra-AI/
  PROJECT_CONTEXT.md
  client/
  server/
  ai-service/
  README.md
  .gitignore

Adapt to the actual repository if files already exist. Do not overwrite existing project files without inspection.