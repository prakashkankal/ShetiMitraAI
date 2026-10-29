# ShetiMitra AI (शेतमित्र AI)

An AI-driven agricultural companion and crop diagnostic platform built for Indian farmers. It provides real-time crop disease detection from leaf imagery, regional agro-meteorological advisory, multilingual assistance (Marathi, Hindi, English), and expert-curated agronomic disease protocols.

---

## Architecture Overview

```
ShetiMitraAI/
├── client/                     # Frontend Application (React 19, Vite 8, TailwindCSS v4)
│   ├── src/
│   │   ├── components/         # Shared layout (AppLayout, Icons, PageHeading, StatusPanel)
│   │   ├── lib/api.js          # Unified API client (fetch wrapper with credentials & error handling)
│   │   ├── pages/              # 7 Core views (ScanPage, GuidancePage, WeatherPage, HistoryPage, etc.)
│   │   ├── i18n.jsx            # Trilingual context (Marathi / Hindi / English)
│   │   └── translations.js     # Comprehensive agricultural phrase dictionary
│   ├── .env.example            # Frontend environment variable template
│   └── package.json
│
├── backend/                    # Backend API Service (Node.js ES Modules, Express 4, MongoDB/Mongoose 8)
│   ├── src/
│   │   ├── config/             # Environment, Database (Mongoose), and Cloudinary configuration
│   │   ├── controllers/        # Request handlers (auth, detections, crops, weather)
│   │   ├── middleware/         # Security (Helmet, CORS), Auth (JWT), Upload (Multer), Rate Limiters
│   │   ├── models/             # Mongoose schemas (User, Detection, Crop)
│   │   ├── routes/             # RESTful API endpoints (/api/v1/*)
│   │   ├── services/           # External integrations (Gemini Vision AI, Cloudinary, OpenWeatherMap)
│   │   ├── utils/              # Standardized ApiResponse, ApiError, asyncHandler
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── app.js              # Express app initialization & security pipeline
│   │   └── server.js           # Server startup & graceful shutdown lifecycle
│   ├── seeds/                  # Database seed scripts (diseases.seed.js)
│   ├── tests/                  # Automated integration & unit tests (Jest, Supertest)
│   ├── .env.example            # Backend environment variable template
│   └── package.json
│
└── docs/
    └── backend-analysis.md     # Detailed architecture analysis and specification document
```

---

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Mobile-First CSS modules
- **Routing**: React Router v7
- **Voice & Speech**: Web Speech Synthesis API & Web Speech Recognition
- **Multilingual Support**: Marathi (`mr`), Hindi (`hi`), English (`en`)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4
- **Database**: MongoDB Atlas via Mongoose 8
- **Authentication**: JWT stored in HttpOnly cookies + Bearer token support
- **Password Hashing**: bcryptjs (12 salt rounds)
- **Input Validation**: Zod
- **Image Storage**: Cloudinary (optional fallback to memory/data URLs)
- **AI Inference Engine**: Google Gemini Vision API (`gemini-1.5-flash`)
- **Weather Service**: OpenWeatherMap API with rule-based agro-meteorological disease risk modeling
- **Security**: Helmet, express-rate-limit, cors with exact origin matching
- **Testing**: Jest 29 + Supertest

---

## Quick Start & Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- (Optional) MongoDB Atlas account, Cloudinary account, Google Gemini API key, OpenWeatherMap key

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Open `backend/.env` and configure your credentials:

```ini
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (Required in production)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/shetimitra?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# Cloudinary Image Storage (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OpenWeatherMap (Optional)
WEATHER_API_KEY=

# Gemini Vision AI for Leaf Disease Detection (Optional)
AI_PROVIDER=gemini
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
```

#### Run Database Seed Script
To seed the crop disease advisory knowledge base (Tomato, Cotton, Potato):
```bash
npm run seed
```

#### Start Development Server
```bash
npm run dev
```
The API server will listen on `http://localhost:5000`. Test health at `http://localhost:5000/api/v1/health`.

#### Run Backend Automated Tests
```bash
npm test
```
Runs 20 automated unit and integration tests across health, crops, authentication, and detections.

---

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Ensure `client/.env` points to your backend instance:
```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### Start Development Server
```bash
npm run dev
```
Access the application in your browser at `http://localhost:5173`.

#### Build for Production
```bash
npm run build
```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### 1. System Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns service status, version, and server timestamp |

### 2. Authentication (`/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user account with name, email, password |
| `POST` | `/auth/login` | Public | Authenticate user, returns JWT and sets HttpOnly cookie |
| `GET` | `/auth/me` | Protected | Returns authenticated user profile |
| `POST` | `/auth/logout` | Public | Clears authentication cookie |

### 3. Leaf Disease Detection (`/detections`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/detections` | Optional | Upload crop leaf image (multipart/form-data) for AI inference |
| `GET` | `/detections` | Protected | List user's historical detection scans (paginated) |
| `GET` | `/detections/:id` | Protected | Retrieve full diagnostic details of a scan |
| `DELETE` | `/detections/:id` | Protected | Soft-delete a diagnostic record |

### 4. Crop Disease Knowledge Base (`/crops`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/crops` | Public | List all diseases (supports `?crop=tomato` filter) |
| `GET` | `/crops/:id` | Public | Get expert agronomic protocol for a specific disease |

### 5. Agro-Meteorological Weather (`/weather`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/weather?location=Pune` | Public | Get live weather conditions and calculated fungal disease risk |

---

## Graceful Fallback Strategy (Offline / Demo Mode)

ShetiMitra AI is architected with a resilient **zero-crash fallback hierarchy**:
1. **AI Disease Inference**: If `AI_API_KEY` is not provided or the remote service is unreachable, the API returns a structured `503` response. The frontend seamlessly handles this by allowing the user to explore sample datasets and rule-based diagnostic steps without crashing.
2. **Weather Data**: If `WEATHER_API_KEY` is unconfigured, the frontend automatically displays default agro-meteorological metrics for Maharashtra with a clear informational tag.
3. **Scan History**: If the user is unauthenticated or the backend database is offline, scan records and user preferences are automatically stored and managed in browser `localStorage`.
4. **Disease Directory**: Guidance protocols default to the locally bundled agronomist-reviewed database if the backend database has not been seeded yet.

---

## License & Agricultural Safety Disclaimer

> **Important Agricultural Disclaimer**: Diagnoses, predictions, and recommendations provided by ShetiMitra AI are decision-support aids based on computer vision models and agricultural reference protocols. They do not substitute on-site physical evaluation by certified agricultural extension officers or Krishi Vigyan Kendra (KVK) agronomists. Adhere strictly to product labels and regional Pre-Harvest Intervals (PHI) before applying chemical crop protection products.

