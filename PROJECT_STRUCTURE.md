# 📁 PROJECT FILE MAP — main_project

> Comprehensive structure and file mapping for both the Frontend and Backend of the application.

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

The project is structured as a full-stack application with a decoupled architecture:
- **Frontend:** React + Vite, leveraging Tailwind/Custom CSS, with multiple gamified UI components and routes.
- **Backend:** Node.js + Express REST API, using Prisma as the ORM with PostgreSQL.

---

## 🖥️ FRONTEND STRUCTURE (`/frontend`)

### Root Files
| File | Purpose |
|------|---------|
| `index.html` | Entry point shell — loads React via `src/main.jsx` |
| `package.json` | Dependencies and npm scripts for the frontend |
| `vite.config.js` | Vite dev server + build configuration |
| `eslint.config.js` | Code linting rules |
| `.gitignore` | Ignored files for version control |

### 📁 src/ (Main Application Source)

#### Entry Points
| File | Purpose |
|------|---------|
| `main.jsx` | Mounts `<App />` into the DOM. |
| `App.jsx` | Root component — manages active tabs/routes and renders corresponding pages. |
| `App.css` | Scoped styles for the main App layout. |
| `index.css` | Global styles, design tokens, and base CSS resetting. |

#### 📁 components/ (Reusable UI)
Layout components used across different views:
- `Sidebar.jsx`: Main navigation menu for tab switching.
- `Header.jsx`: Top navigation and profile summary.
- `Footer.jsx`: Page footer.
- `PublicNavbar.jsx`: Navbar for unauthenticated views.

#### 📁 pages/ (Views/Routes)
Each page acts as a standalone feature module:
- **Core Dashboards:** `Dashboard.jsx`, `Profile.jsx`, `Analytics.jsx`
- **Career & Jobs:** `JobTracker.jsx`, `Resume.jsx`, `CareerRoadmap.jsx`, `CareerGenie.jsx`, `CareerHub.jsx`, `CareerAlerts.jsx`, `MarketVulnerability.jsx`, `SalaryInsights.jsx`
- **Learning & Skills:** `SkillPaths.jsx`, `EnglishLearning.jsx`, `CommunicationAssistant.jsx`, `TestSystem.jsx`, `LearningHub.jsx`, `CertificationHub.jsx`
- **Gamified Modules:** `CodeEscapeHouse.jsx` (SkillPredict rooms), `Rooms.jsx` (Coding Escape tasks), `EscapeChallenge.jsx`, `EscapeGamesHub.jsx`, `GamesHub.jsx`, `MultiplayerArena.jsx`, `SolarSystem.jsx`, `UrbanWarzone.jsx`
- **Other Pages:** `Landing.jsx`, `Login.jsx`, `Register.jsx`, `Chatbot.jsx`, `HabitTracker.jsx`, `CommunityHub.jsx`, `EventHub.jsx`, `Marketplace.jsx`, `Resources.jsx`

#### 📁 services/ (API & External Connectors)
- `gemini.js`: Configuration and functions for Google Generative AI (Gemini).
- `ChallengeService.js`: Logic for dynamic task generation.

#### 📁 data/ (Static/Mock Data)
- `challengesMaster.js`, `coursesMaster.js`: Pre-defined content for courses and challenges.

#### 📁 game_engine/
- **cpp/**: Native C++ modules (`CityGenerator.cpp`, `WorldManager.cpp`) potentially compiled to WebAssembly for performance-heavy game features.

---

## ⚙️ BACKEND STRUCTURE (`/backend`)

### Root Setup & Config Files
| File | Purpose |
|------|---------|
| `server.js` | Entry point for the Node server — starts listening on port. |
| `app.js` | Express app configuration — middleware setup, router mounting. |
| `package.json` | Backend dependencies and start scripts. |
| `prismaClient.js` | Prisma generated client initialization. |
| `test_db.js` / `test_env.js` | Scripts to verify Database connections and ENV variables. |
| `seed_admin.js` / `seed_jobs.js` | Database seeder scripts for initial data. |
| `.env` | Environment secrets and Database URLs (ignored in git). |

### 📁 prisma/ (Database Schema)
- `schema.prisma`: Defines PostgreSQL tables (Models), relations, and generator configs. Includes models for Users, Resumes, Jobs, Habits.

### 📁 controllers/ (Business Logic)
Handlers for incoming requests, executing logic and interacting with DB:
- `authController.js`: Registration, login, secure token handling.
- `userController.js`: User profile management.
- `resumeController.js`: Resume operations, saving CV data.
- `jobController.js`: Handling job applications/kanban logic.
- `dashboardController.js`: Aggregating data for frontend dashboards.
- `habitController.js`: Tracking user habits.
- `communicationController.js`: Communication task records.
- `testSystemController.js`: Handling test scores and metrics.

### 📁 routes/ (API Endpoints)
Mapping HTTP methods (GET, POST, etc.) and paths to specific controllers:
- `authRoutes.js` 
- `userRoutes.js`
- `resumeRoutes.js`
- `jobRoutes.js`
- `dashboardRoutes.js`
- `habitRoutes.js`
- `communicationRoutes.js`
- `testSystemRoutes.js`

### 📁 middleware/ (Request Interceptors)
- **Authorization/Checks**: Verifies JWT tokens, handles protected routes authorization before hitting controllers.

### � utils/ (Helpers)
- `generateToken.js`: Helper function to sign and verify JWT tokens cleanly.

---

## 🔄 DATA FLOW (Frontend ↔ Backend)

1. **Client Interaction**: User triggers an action on a feature page (e.g., `JobTracker.jsx`).
2. **API Request**: Frontend dynamically constructs a request hitting `http://localhost:<PORT>/api/jobs/...`.
3. **Route Handling**: `backend/app.js` catches `/api/jobs` and forwards to `jobRoutes.js`.
4. **Middleware Protection**: If the route is protected, auth middleware validates the session token.
5. **Controller Logic**: `jobController.js` processes the payload.
6. **Database Operation**: `prismaClient` executes a CRUD query against PostgreSQL based on `schema.prisma`.
7. **Response to Client**: JSON data gets returned to the Frontend and `App.jsx`/Route state updates.
