# AI Smart Job Tracker & Notification Engine - System Architecture

## 1. Overview
The **AI Smart Job Tracker** is a distributed, real-time system designed to monitor 150-200 job sources (MNC portals, job boards, and startup career pages). It leverages NLP for high-precision skill matching and triggers instant multi-channel notifications.

---

## 2. System Architecture
The system follows a **Microservices Architecture** to ensure scalability across hundreds of scrapers.

### A. Data Acquisition Layer (The "Harvester")
- **Scraper Cluster**: Distributed Node.js (Puppeteer/Playwright) and Python (Scrapy) instances.
- **Proxy Rotator**: Prevents IP blocking by cycling through residential proxies.
- **Fingerprint Manager**: Mimics real browser behavior to bypass anti-bot systems (Cloudflare, Akamai).

### B. Intelligent Processing Layer (The "Brain")
- **Parser Engine**: Normalizes inconsistent job data into a standard schema.
- **AI Matching Engine (LLM-Based)**: Uses Sentence-Transformers (BERT/RoBERTa) to calculate Cosine Similarity between User Skills and Job Descriptions.
- **Deduplication Engine**: Uses MinHash/LSH to filter identical job postings across multiple portals.

### C. Storage Layer
- **PostgreSQL**: Stores relational data (User Profiles, Application Status).
- **MongoDB**: Stores semi-structured job data (Full job descriptions, metadata).
- **Redis**: Caching frequently accessed jobs and managing the task queue.

### D. Communication Layer (The "Messenger")
- **Notification Manager**: Orchestrates alerts via Twilio (WhatsApp), SendGrid (Email), and Firebase (Push).
- **Scheduler**: Celery/Redis for managing scrape intervals (every 30 mins).

---

## 3. Data Flow Diagram
`USER_PROFILE -> SKILLS_EXTRACTION -> VECTOR_DB_SYNC`
`SCRAPERS -> RAW_DATA -> PARSER -> CLEAN_DATA -> AI_RANKING -> JOB_MATCH_DB`
`NEW_MATCH_TRIGGER -> NOTIFICATION_MANAGER -> (WhatsApp/Email) -> REDIRECT_TO_OFFICIAL_URL`

---

## 4. Database Schema (PostgreSQL)

### Table: `users`
- `id` (UUID, PK)
- `name` (String)
- `department` (Enum: CSE, ECE, Mech, etc.)
- `experience_level` (Enum: Fresher, Junior, Senior)
- `location_preference` (String)
- `resume_vector` (Vector - stores skill embeddings)

### Table: `jobs`
- `id` (UUID, PK)
- `title` (String)
- `company` (String)
- `location` (String)
- `official_url` (URL)
- `posted_at` (Timestamp)
- `description_text` (Text)
- `source_domain` (String - e.g., google.com)
- `is_active` (Boolean)

### Table: `matches`
- `user_id` (FK)
- `job_id` (FK)
- `relevance_score` (Float: 0-100)
- `status` (Enum: New, Viewed, Applied, Saved)

---

## 5. Job Scraping Strategy
1. **API First**: Use official APIs (LinkedIn Partners, Indeed API) where possible.
2. **Headless Scraping**: For company career pages (e.g., Apple, Google), use Playwright with `stealth` plugins.
3. **Structured Extraction**: Use LLM-based extraction (e.g., GPT-3.5-Turbo-16k) to pull Job Title, Salary, and Skills from messy HTML blobs.

---

## 6. AI Matching Logic
1. **Embedding generation**: Convert both the user's skills and the job description into 768-dimensional vectors.
2. **Weighted Matching**:
   - `0.6` weight for Domain Skills (e.g., Python, React).
   - `0.2` weight for Location.
   - `0.2` weight for Experience Level overlap.
3. **Relevance Score**: `Score = (v_user · v_job) / (|v_user| * |v_job|) * 100`

---

## 7. Sample JSON Job Data
```json
{
  "job_id": "job_88a2b5",
  "title": "Full Stack AI Engineer",
  "company": "Microsoft",
  "location": "Hyderabad, India / Remote",
  "salary": "₹15L - ₹30L",
  "official_link": "https://careers.microsoft.com/jobs/88a2b5",
  "posted_time": "2026-02-20T21:00:00Z",
  "matching_score": 94.2,
  "skills_required": ["React", "Python", "OpenAI API", "PostgreSQL"],
  "domain": "Artificial Intelligence"
}
```

---

## 8. Sample API Endpoints (FastAPI/Node.js)
- `GET /api/jobs/matches`: Fetch all jobs matching user profile.
- `POST /api/user/profile`: Update user skills and preferences.
- `PATCH /api/jobs/{id}/status`: Mark job as 'Applied' or 'Saved'.
- `GET /api/analytics/trends`: Get trending skills based on current job market.

---

## 9. Notification Workflow (Email/WhatsApp)
1. Match is found (>80% score).
2. Check `last_notification_time` to avoid spamming.
3. Format payload: `Hi ${name}, Microsoft in ${loc} just posted a ${title} role. Your skills match 94%. Apply here: ${link}`.
4. Send via Twilio/SendGrid.
