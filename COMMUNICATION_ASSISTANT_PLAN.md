 a# AI English Communication Assistant: Project Blueprint

## 1. System Architecture
The platform is designed as a **Multimodal AI Pipeline**. 

- **Edge Layer (Client)**: Captures user audio/video streams via WebRTC (`getUserMedia`). Handles real-time Speech-to-Text (STT) and Text-to-Speech (TTS) locally via Web Speech API or Cloud via Whisper.
- **Intelligence Layer (Gemini 1.5 Pro)**: Core engine for semantic analysis. It processes the conversation transcript to perform **Grammar Audit**, **Vocabulary Grading**, and **CEFR Level Detection**.
- **Acoustic Logic**: Calculates **Fluency** by measuring Word-per-Minute (WPM) and pause frequencies.
- **Report Engine**: Uses `jsPDF` and `html2canvas` to render high-fidelity session summaries from JSON analytics.

---

## 2. Feature Workflow
1. **Initialization**: User selects a mode (e.g., Mock Interview). Camera/Mic requested.
2. **Active Session**:
   - User speaks -> STT Transcript generated.
   - AI analyzes transcript in 30s buffers for live feedback panel updates.
   - AI generates a conversational response based on the chosen topic.
3. **Analysis**:
   - NLP models compare user input against correct grammatical structures.
   - Sentiment analysis and filler-word detection (um, uh) calculate the **Confidence Score**.
4. **Termination**: Session closure triggers the `Report Generation` event.

---

## 3. Database Schema (PostgreSQL/MongoDB)
```json
{
  "session_record": {
    "session_id": "UUID",
    "user_id": "UUID",
    "topic": "Interview Practice",
    "metrics": {
      "fluency_wpm": 124,
      "grammar_accuracy": 92.5,
      "vocab_complexity": "B2 Plus",
      "confidence_index": 8.5
    },
    "history": [
      {"speaker": "AI", "text": "Tell me about yourself.", "timestamp": "..."},
      {"speaker": "User", "text": "I am a software engineer...", "timestamp": "...", "mistakes": ["I am a software"]}
    ],
    "final_cefr_level": "B2"
  }
}
```

---

## 4. API Structure
- **POST `/api/v1/session/start`**: Initializes storage for a new practice session.
- **POST `/api/v1/analyze/realtime`**: Processes text chunks to update the live feedback panel.
- **GET `/api/v1/report/{session_id}`**: Retrieves the full summary for dashboard rendering.
- **POST `/api/v1/export/pdf`**: Server-side PDF generation (fallback for client-side).

---

## 5. Sample Analysis JSON (Gemini Output)
```json
{
  "fluency": 78,
  "pronunciation": 82,
  "grammar": {
    "score": 90,
    "mistakes": [
      { "error": "I goes to work", "correction": "I go to work", "rule": "Subject-verb agreement" }
    ]
  },
  "vocabulary": {
    "variety": "High",
    "level": "C1",
    "suggestions": ["Utilize" instead of "Use"]
  },
  "confidence": {
    "filler_count": 3,
    "speed_consistency": "Stable"
  },
  "overall_level": "B2"
}
```

---

## 6. Report Format Template
- **Header**: Session Title, Date, User Name.
- **Scorecard**: Radar chart with 5 axis (Fluency, Pronunciation, Grammar, Vocab, Confidence).
- **Executive Summary**: One-paragraph AI summary of the performance.
- **Correction Table**: Original text vs Corrected version.
- **Vocabulary Mastery**: List of advanced words used during the session.
- **Action Plan**: 3 specific steps for the next 7 days.

---

## 7. Dashboard UI Structure
- **Sidebar**: Mode selection (Casual / Interview / GD).
- **Navigation**: Progress Trends, Session History, Saved Reports.
- **Main View**:
  - **Upper**: Real-time Video/Avatar and Transcript.
  - **Right Sidebar**: Live Analysis Gauges (0-100%).
  - **Bottom**: "Level Indicator" (A1 to C1) that moves as you speak.
