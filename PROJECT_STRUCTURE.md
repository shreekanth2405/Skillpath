# 📁 PROJECT FILE MAP — main_project

> Every file, what it does, and how it connects to the rest of the project.

---

## ROOT FILES

| File | Purpose |
|------|---------|
| `index.html` | Single HTML shell — loads React via `src/main.jsx` |
| `package.json` | npm scripts, dependencies list |
| `vite.config.js` | Vite dev server + build settings |
| `eslint.config.js` | Code lint rules |
| `.gitignore` | Files excluded from Git |
| `README.md` | Full project documentation |

---

## 📁 public/

Static assets served directly at root URL (`/`).

| File | Purpose |
|------|---------|
| `sentinel_cyber_guardian_1771604404204.png` | AI Guardian avatar used in SkillPredict and Coding Escape |
| `vite.svg` | Vite logo (default) |

---

## 📁 src/

### Entry Points

| File | Purpose |
|------|---------|
| `main.jsx` | Mounts `<App />` into `#root` in `index.html` |
| `App.jsx` | Root component — owns tab-state, loads all pages, passes props to Sidebar + Header |
| `App.css` | Per-component scoped styles for App |
| `index.css` | Global CSS design system: variables, dark theme, glass panels, animations |

---

## 📁 src/components/

Reusable layout components shared across all pages.

| File | Exports | Connected to |
|------|---------|-------------|
| `Sidebar.jsx` | `<Sidebar>` | `App.jsx` → sets `activeTab` which controls page rendering |
| `Header.jsx` | `<Header>` | `App.jsx` → displays active page title |

**Sidebar tabs (with route keys):**
```
dashboard | profile | skillpaths | resume | englishlearning
communication | careerroadmap | careergenie | jobtracker
chatbot | rooms | escape-house | testsystem | analytics
```

---

## 📁 src/pages/

Each page is a standalone React component, rendered when its `activeTab` matches.

### `Dashboard.jsx`
- Role: Home overview
- Shows: XP summary, quick links to all features
- AI: None (static)

### `Profile.jsx`
- Role: User identity & settings
- Shows: Avatar, XP bar, badges, skill summary, streak
- AI: Gemini generates skill summary paragraph

### `SkillPaths.jsx`
- Role: Curated learning roadmap explorer
- Shows: 150+ skill paths across 15 domains with phases, videos, exercises
- AI: None (static data)

### `Chatbot.jsx`
- Role: AI career mentor chat
- Shows: Conversation UI, quick prompts, RAG file upload
- AI: Gemini with `careerAiSystemInstruction` + uploaded document context
- State: `messages`, `input`, `knowledgeBase`

### `TestSystem.jsx`
- Role: Quiz & assessment engine
- Shows: Multiple-choice questions, timer, result analysis
- AI: Gemini generates questions per topic

### `Analytics.jsx`
- Role: Performance data visualization
- Shows: Charts for XP gains, challenge completion, skill radar

### `Resume.jsx`
- Role: AI Resume builder + ATS scanner
- Shows: Template editor, PDF preview, ATS score meter
- AI: Gemini builds resume from profile data + scores against JD

### `EnglishLearning.jsx`
- Role: English tutor
- Shows: Lessons, exercises, pronunciation judge
- AI: Gemini evaluates pronunciation/grammar + Web Speech API

### `CareerRoadmap.jsx`
- Role: AI career path generator
- Shows: Milestone timeline, resource links, skills per stage
- AI: Gemini generates full roadmap for any role input

### `JobTracker.jsx`
- Role: Application pipeline manager
- Shows: Kanban board (Applied → Interview → Offer → Rejected)
- AI: None (CRUD state)

### `CommunicationAssistant.jsx`
- Role: Soft skills & presentation coach
- Shows: Speaking scenarios, AI feedback, tip library
- AI: Gemini evaluates spoken/written communication samples

### `CareerGenie.jsx`
- Role: Akinator-style career game
- Shows: Yes/No question flow → AI guesses your ideal career
- AI: Gemini directs the 20-question game and makes final prediction

### `Rooms.jsx` — **Coding Escape** (40 Chambers)
- Role: Gamified coding platform with Cyber Throne aesthetic
- Shows: 40 room doors, SENTINEL-7 guardian, code editor, key animations
- AI: Gemini evaluates code, generates dynamic tasks (up to 150/room)
- Data: Imports from `src/data/challengesData.js`
- Key features:
  - Dynamic task generation when hardcoded tasks are exhausted
  - Task progression tracker (TASK N/150)
  - Cyber Throne CSS animations (cyberPulse, scanDown, blink)

### `CodeEscapeHouse.jsx` — **SkillPredict** (25 Chambers)
- Role: Skill evaluation platform — users write full code from scratch
- Shows: 5×5 room grid, Matrix Rain canvas, floating orbs, key animations
- AI: SENTINEL-7 (Gemini) — 7-pass deep evaluation (no template code given)
- Data: Imports from `src/data/escapeHouseChallenges.js`
- Key features:
  - 25 rooms × 10 challenges = 250 total
  - No starter code — write full solutions
  - Score = base - time penalty - hint penalty - attempt penalty
  - Dashboard with Skill Matrix (5×5 grid per room)
  - Animations: Matrix Rain, Floating Orbs, Glitch Title, Card Entrance, Ripple, etc.

---

## 📁 src/services/

AI and backend service connectors.

| File | Exports | Used by |
|------|---------|---------|
| `gemini.js` | `genAI`, `careerAiSystemInstruction` | All AI-powered pages |
| `ChallengeService.js` | `generateChallengeTask()` | `Rooms.jsx` for dynamic task generation |

### `gemini.js`
```js
import { GoogleGenerativeAI } from '@google/generative-ai';
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export const careerAiSystemInstruction = "...";
```

### `ChallengeService.js`
```js
// Generates new coding challenges via Gemini when room runs out of static tasks
export const generateChallengeTask = async (roomTopic, difficulty, taskIndex) => { ... }
```

---

## 📁 src/data/

Static game data files.

| File | Size | Contents |
|------|------|----------|
| `escapeHouseChallenges.js` | 48 KB | 25 rooms × 10 challenges for SkillPredict |
| `challengesData.js` | 33 KB | Rooms 21–50 for Coding Escape (`EXTENDED_CHALLENGES`) |

### `escapeHouseChallenges.js` — exported constant
```js
export const ESCAPE_HOUSE_ROOMS = [
  { id, title, icon, color, domain, difficulty, xpReward, description,
    challenges: [ { id, title, statement }, × 10 ] }
  × 25 rooms
];
```

### `challengesData.js` — exported constant
```js
export const EXTENDED_CHALLENGES = [
  { id, title, difficulty, topic, icon, color, xp,
    tasks: [ { id, title, description, initialCode, tests, hints } ] }
  × 30 rooms (21–50)
];
```

---

## 🔗 Data Flow Diagram

```
User clicks sidebar tab
        │
        ▼
    App.jsx  (activeTab state)
        │
        ├─── "escape-house" ──► CodeEscapeHouse.jsx
        │                              │
        │                    escapeHouseChallenges.js (room data)
        │                    gemini.js (AI evaluator)
        │
        ├─── "rooms" ─────► Rooms.jsx
        │                              │
        │                    challengesData.js (room data)
        │                    ChallengeService.js + gemini.js
        │
        ├─── "chatbot" ───► Chatbot.jsx
        │                    gemini.js
        │
        └─── [other tabs] ──► [respective page]
                               gemini.js (where AI is used)
```

---

## ✅ All Files Checklist

### Root
- [x] `index.html`
- [x] `package.json`
- [x] `vite.config.js`
- [x] `eslint.config.js`
- [x] `.gitignore`
- [x] `README.md`
- [x] `PROJECT_STRUCTURE.md`

### public/
- [x] `sentinel_cyber_guardian_1771604404204.png`
- [x] `vite.svg`

### src/
- [x] `main.jsx`
- [x] `App.jsx`
- [x] `App.css`
- [x] `index.css`

### src/components/
- [x] `Sidebar.jsx`
- [x] `Header.jsx`

### src/pages/
- [x] `Dashboard.jsx`
- [x] `Profile.jsx`
- [x] `SkillPaths.jsx`
- [x] `Chatbot.jsx`
- [x] `TestSystem.jsx`
- [x] `Analytics.jsx`
- [x] `Resume.jsx`
- [x] `EnglishLearning.jsx`
- [x] `CareerRoadmap.jsx`
- [x] `JobTracker.jsx`
- [x] `CommunicationAssistant.jsx`
- [x] `CareerGenie.jsx`
- [x] `Rooms.jsx`
- [x] `CodeEscapeHouse.jsx`

### src/services/
- [x] `gemini.js`
- [x] `ChallengeService.js`

### src/data/
- [x] `escapeHouseChallenges.js`
- [x] `challengesData.js`

---

**Total: 27 source files + 2 assets + 7 config/doc files = 36 files**
