# ShetiMitra AI – Backend Analysis Document

> Generated: 2026-10-29  
> Analyst: ShetiMitra Backend Implementation Team  
> Phase: 1 (Frontend Analysis) + Phase 2 (Architecture Design)

---

## 1. Project Overview

ShetiMitra AI is an agricultural AI assistant built for Indian farmers. The frontend is a React 19 + Vite SPA with TailwindCSS v4 and React Router v7, deployed under the `client/` directory. The backend (new) is a Node.js/Express/MongoDB API under `backend/`.

---

## 2. Frontend Feature Inventory

| Page | Route | Current State | Backend Requirement |
|------|-------|--------------|---------------------|
| Dashboard | `/` | Static feature cards | Optional: `/api/v1/dashboard/summary` |
| Scan (Disease Detection) | `/scan` | Fully mocked with SAMPLE_DATASETS | **Core**: POST image → AI inference → save Detection |
| Voice Assistant | `/assistant` | Browser Web Speech API + hardcoded advisory | Low priority: log queries optionally |
| History | `/history` | localStorage (`shetimitra-scan-history`) | GET/DELETE scan records; fallback to localStorage |
| Settings | `/settings` | localStorage keys (language, district, crops…) | GET/PATCH user preferences (optional) |
| Weather | `/weather` | Hardcoded static Pune data | GET `/api/v1/weather?location=` with OpenWeatherMap |
| Guidance | `/guidance` | Hardcoded DISEASES_DB (5 entries) | GET `/api/v1/crops` seeded from same data |

---

## 3. User Flows

### 3.1 Disease Detection Flow
1. User opens `/scan`
2. User uploads or photographs a crop leaf
3. Frontend POSTs `multipart/form-data` to `POST /api/v1/detections`
4. Backend: receives image → uploads to Cloudinary → calls Gemini Vision API → saves Detection document
5. Backend returns structured result `{ diseaseName, confidence, status, predictions, symptoms, ... }`
6. Frontend renders result panel + saves to history

### 3.2 Authentication Flow (Future)
1. User registers → `POST /api/v1/auth/register`
2. JWT stored in HttpOnly cookie
3. Subsequent requests send cookie automatically
4. `GET /api/v1/auth/me` returns profile
5. Scan records linked to `userId`

### 3.3 History Sync Flow
1. `GET /api/v1/detections` (authenticated) returns DB records
2. Falls back to localStorage if unauthenticated (401)
3. `DELETE /api/v1/detections/:id` removes from DB

### 3.4 Weather Flow
1. `GET /api/v1/weather?location=Pune`
2. Backend calls OpenWeatherMap, calculates disease risk, returns JSON
3. Frontend renders live data; falls back to static if 503

---

## 4. API Endpoint Reference

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | None | Server + DB status |

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | None | Register new user |
| POST | `/api/v1/auth/login` | None | Login, set cookie |
| GET | `/api/v1/auth/me` | Required | Get current user |
| POST | `/api/v1/auth/logout` | None | Clear cookie |

### Detections
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/detections` | Optional | Submit image for AI detection |
| GET | `/api/v1/detections` | Required | List user's detections (paginated) |
| GET | `/api/v1/detections/:id` | Required | Get single detection |
| DELETE | `/api/v1/detections/:id` | Required | Soft delete detection |

### Crops / Disease DB
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/crops` | None | List all diseases (filterable by `?crop=`) |
| GET | `/api/v1/crops/:id` | None | Get single disease record |

### Weather
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/weather` | None | Get weather + disease risk for `?location=` |

---

## 5. Database Schema

### User
```
name: String (required)
email: String (unique, lowercase)
passwordHash: String (hidden from JSON)
preferredLanguage: 'mr' | 'hi' | 'en'
role: 'user' | 'admin'
timestamps
```

### Detection
```
userId: ObjectId (ref User, nullable for anonymous)
cropType: String
imageUrl: String (Cloudinary URL)
imageThumbnailUrl: String
cloudinaryPublicId: String
diseaseName: String
scientificName: String
confidence: Number (0-100)
status: 'high' | 'uncertain' | 'healthy'
predictions: [{ name, score }]
symptoms: String
culturalControl: String
chemicalPrecautions: String
proTip: String
selectedLanguage: 'mr' | 'hi' | 'en'
modelVersion: String
isDeleted: Boolean (soft delete)
timestamps
```

### Crop (Disease Knowledge Base)
```
slug: String (unique)
crop: String (Tomato, Cotton, Potato…)
name: String (common disease name)
scientificName: String
pathogenType: String
reviewedBy: String
weatherRisk: String
symptoms: [String]
cultural: [String]
chemical: [String]
timestamps
```

---

## 6. External Service Dependencies

| Service | Purpose | Required | Env Var |
|---------|---------|----------|---------|
| MongoDB Atlas | Primary database | **Yes** | `MONGODB_URI` |
| Cloudinary | Persistent image storage | Optional | `CLOUDINARY_*` |
| Google Gemini Vision | Real AI leaf disease inference | Optional | `AI_API_KEY` |
| OpenWeatherMap | Live weather data | Optional | `WEATHER_API_KEY` |

---

## 7. Known Limitations

1. **AI Inference**: Without `AI_API_KEY`, the `/api/v1/detections` endpoint returns `503 AI_UNAVAILABLE`. The frontend SAMPLE_DATASETS demo still works client-side.
2. **Image Storage**: Without Cloudinary credentials, `imageUrl` is null in the database. Detection still works but images are not persisted.
3. **Weather**: Without `WEATHER_API_KEY`, the weather endpoint returns `503 WEATHER_KEY_NOT_CONFIGURED`. Frontend falls back to static hardcoded data.
4. **Authentication**: No login/register UI exists in the frontend yet. The auth endpoints are implemented and ready for future frontend integration.
5. **Voice Assistant**: Browser Web Speech API (no backend dependency). Advisory logic remains hardcoded in frontend.

---

## 8. Security Measures

- Helmet for HTTP security headers
- CORS restricted to `FRONTEND_URL` env var
- JWT stored in HttpOnly cookies (XSS-safe)
- bcrypt password hashing (12 rounds)
- Zod input validation on all endpoints
- Rate limiting: 100 req/15min general; 10 req/15min auth; 20 req/min detection
- File upload: 5MB limit, JPEG/PNG/WebP only
- Soft delete for detections (data integrity)
- No secrets logged or exposed in responses

---

## 9. Setup Instructions

See the root `README.md` for complete setup. Quick start:

```bash
# Backend
cd backend
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev

# Frontend
cd client
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api/v1
npm install
npm run dev
```

---

*This document reflects the as-built backend architecture.*
