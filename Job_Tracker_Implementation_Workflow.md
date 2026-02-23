# AI Smart Job Tracker & Notification Engine - Architecture & Design

## 1. System Architecture

The AI Smart Job Tracker follows a distributed microservices architecture to handle the scale of continuously monitoring 150-200 sources while performing heavy NLP matching operations.

**Components:**
*   **Web Scraper Cluster (Python/Scrapy/Playwright):** A fleet of distributed workers that rotate proxies and user-agents to scrape job boards and company career pages.
*   **Job Ingestion Pipeline (Apache Kafka / RabbitMQ):** Queues raw scraped job data to handle bursts in volume and decouple scraping from processing.
*   **Data Processing & Normalization Service:** Cleans raw text, extracts entities (skills, location, salary), and normalizes job titles into a standard taxonomy.
*   **AI Matching Engine (Python/FastAPI):** Uses NLP (e.g., SentenceTransformers or LLM APIs) to calculate semantic similarity scores between normalized jobs and user profiles.
*   **Database Cluster (MongoDB + Redis):** MongoDB stores user profiles, scraped jobs (with raw/normalized data), and match history. Redis caches frequent queries and manages rate limits for scrapers.
*   **Notification Engine (Node.js/Go):** Listens for high-scoring match events and dispatches asynchronous notifications via Email (SendGrid) and WhatsApp (Twilio).
*   **Frontend Dashboard (React/Vite):** User-facing portal for profile management, viewing job matches, and analytics.

---

## 2. Data Flow Diagram

1.  **Trigger:** Scheduler (Celery/Cron) initiates scraping jobs every 30-60 minutes.
2.  **Scrape:** Scraper Cluster fetches data from 150+ sources -> Outputs raw JSON.
3.  **Queue:** Raw JSON is pushed to the Ingestion Queue.
4.  **Normalize:** Normalization Service consumes queue -> Cleaned JSON.
5.  **Deduplicate:** Cleaned jobs are checked against the Database (using URL hashing and similarity checks) -> Discard duplicates.
6.  **Analyze:** New jobs are sent to the AI Matching Engine.
7.  **Match:** AI cross-references new jobs against active User Profiles in DB -> Generates Relevance Scores.
8.  **Store:** Job + Scores saved to Database.
9.  **Notify:** If Score > Threshold (e.g., 85%), trigger Notification Engine.
10. **Deliver:** Notification dispatched via Email/WhatsApp to User.
11. **Interact:** User clicks link -> Redirects to official company page; Dashboard registers "Viewed/Applied" status.

---

## 3. Database Schema (MongoDB Example)

**Collection: `Users`**
```json
{
  "_id": "ObjectId",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "department": "Computer Science (CSE)",
  "experienceLevel": "Fresher",
  "preferredRole": ["Software Developer", "Data Analyst"],
  "skills": ["Python", "React", "Machine Learning", "SQL"],
  "preferredLocation": ["Bangalore", "Gurgaon", "Remote"],
  "notificationPreferences": {
    "email": true,
    "whatsapp": true,
    "minScoreThreshold": 80
  }
}
```

**Collection: `Jobs`**
```json
{
  "_id": "ObjectId",
  "sourceUrl": "https://careers.google.com/jobs/results/123",
  "sourceDomain": "google.com",
  "companyName": "Google",
  "jobTitle": "Software Engineer, Early Career",
  "location": ["Bangalore"],
  "experienceRequired": "0-2 years",
  "skillsRequired": ["Python", "Java", "Data Structures", "Algorithms"],
  "rawDescription": "Join our team to build...",
  "postedAt": "2026-02-20T10:00:00Z",
  "discoveredAt": "2026-02-20T10:30:00Z",
  "isDuplicate": false
}
```

**Collection: `JobMatches` (Mapping between Users and Jobs)**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId(Jane_Doe)",
  "jobId": "ObjectId(Google_SWE)",
  "relevanceScore": 92,
  "matchStatus": "New", // New, Viewed, Applied, Rejected
  "skillGap": ["Java"], // Skills required by job but missing in profile
  "notified": true,
  "notifiedAt": "2026-02-20T10:35:00Z"
}
```

---

## 4. Job Scraping Strategy

*   **Technology:** `Playwright` (for SPA/React based career pages that require JS rendering) and `Scrapy` (for fast, static HTML crawling).
*   **Bypassing Blocks:** Use commercial proxy rotation services (e.g., BrightData, ScraperAPI) and randomized User-Agent switching to avoid IP bans.
*   **RSS/XML Feeds:** Always prioritize parsing `.xml` sitemaps or RSS feeds of career pages first, as they are specifically designed for web crawlers and require zero HTML parsing.
*   **Deduplication:** Hash the job official URL and composite keys (Company Name + Job Title + Location) to prevent processing the same job multiple times across different aggregators. Always try to trace back aggregator links (like Indeed) to the source URL.

---

## 5. AI Matching Logic

1.  **Feature Extraction:** Convert User profile and Job requirements into text embeddings using models like `all-MiniLM-L6-v2` (HuggingFace) or OpenAI's text-embedding API.
2.  **Hard Filters:** Before running heavy AI models, perform exact matches for dealbreakers: `Location` exact match (or Remote) and `Experience Level` match.
3.  **Semantic Similarity:** Calculate Cosine Similarity between the User's concatenated skills/roles and the Job's required skills/description.
4.  **Scoring Formula:**
    *   `Score = (Cosine_Similarity * 0.6) + (Skill_Overlap_Percentage * 0.4)`
5.  **Skill Gap Analysis:** Perform Set difference operations: `Missing_Skills = Job.skillsRequired - User.skills`. Connect these missing skills to the platform's Course database to generate "Recommended Courses".

---

## 6. Notification Workflow

1.  **Event Trigger:** When the AI Matcher inserts a `JobMatch` document with a score > threshold.
2.  **Formatter:** A microservice formats the message payload based on the channel.
3.  **WhatsApp Structure (Template):**
    ```text
    🚨 *New Job Match Alert (92% Match)* 🚨
    
    *Role:* Software Engineer, Early Career
    *Company:* Google
    *Location:* Bangalore
    *Exp Required:* Fresher
    
    *Missing Skill:* Java (Consider brushing up!)
    
    Apply directly here: [Official Link]
    ```
4.  **Dispatcher:** Calls Twilio/SendGrid APIs. Retries failed dispatches using exponential backoff.

---

## 7. Sample API Endpoints (FastAPI)

```python
# GET /api/v1/jobs/matches
# Returns list of matched jobs for the authenticated user, sorted by score
# Query Params: ?status=New&min_score=80

# POST /api/v1/jobs/{job_id}/apply
# Updates matchStatus to "Applied" and triggers internal analytics tracking
# Body: { "status": "Applied" }

# GET /api/v1/analysis/skill-gaps
# Returns aggregated skill gaps across all highly-matched jobs
# Response: { "Java": 15, "Docker": 8 } # Seen in 15 matching jobs but missing in profile

# GET /api/v1/jobs/trending
# Returns top required skills and roles scraped in the last 24 hours across all sources
```

---

## 8. Dashboard UI Structure (React)

Create a highly modern, dashboard interface containing these primary views:

1.  **Overview Tab:**
    *   **KPI Cards:** Total Jobs Matched, Jobs Applied, Average Match Score, Live Scraping Status (e.g., "Scanning 152 sources...").
    *   **Live Feed Panel:** A scrolling ticker or list of the absolute newest matched jobs appearing in real-time.
2.  **Job Alerts Tab:**
    *   **Filter Sidebar:** Filter by Score (>90%, etc.), Domain, Location, and Company.
    *   **Job Cards:** Detailed cards showing Company Logo, Title, Relevance Score (with a circular progress bar), and "Apply Officially" button.
3.  **Tracker Tab:**
    *   **Kanban Board:** Columns for "New Matches", "Viewed", "Applied", "In Progress", "Rejected". Drag-and-drop functionality to move jobs between statuses.
4.  **Analytics / Skill Gap Tab:**
    *   **Radar Chart:** Comparing User Skills vs Market Demand.
    *   **Course Recommendations:** "You missed 5 High-Match jobs due to lacking Docker. Take this Docker Crash Course."
5.  **Settings Sidebar:** Let users configure notification frequency (Instant vs Daily Digest) and WhatsApp numbers.
