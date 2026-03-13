import json
import psycopg2
from psycopg2.extras import execute_values
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uuid
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')
DB_URL = os.getenv('DATABASE_URL')
if DB_URL and "?" in DB_URL:
    DB_URL = DB_URL.split("?")[0]

def get_db_connection():
    try:
        conn = psycopg2.connect(DB_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def calculate_match_score(user_text, job_text, user_location, job_location):
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([user_text, job_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except:
        similarity = 0.0
    
    base_score = float(similarity * 100)
    
    # Simple location match logic
    if any(loc in (user_location or []) for loc in (job_location or [])) or "Remote" in (job_location or []):
        base_score += 10
        
    return min(100.0, round(base_score, 1))

print("--- AI Semantic Matching Engine Initializing ---")

conn = get_db_connection()
if not conn:
    exit(1)

cur = conn.cursor()
try:
    # 1. Fetch Users
    cur.execute('SELECT "id", "name", "skills", "preferredLocation" FROM "User"')
    users = cur.fetchall()
    
    # 2. Fetch Jobs
    cur.execute('SELECT "id", "jobTitle", "skillsRequired", "location" FROM "Job"')
    jobs = cur.fetchall()
    
    print(f"Analyzing {len(jobs)} jobs against {len(users)} users...")
    
    match_data = []
    
    for u_id, u_name, u_skills, u_loc in users:
        user_text = " ".join(u_skills or [])
        
        for j_id, j_title, j_skills, j_loc in jobs:
            job_text = f"{j_title} {' '.join(j_skills or [])}"
            score = calculate_match_score(user_text, job_text, u_loc, j_loc)
            
            # Simple Skill Gap
            skill_gap = list(set(j_skills or []) - set(u_skills or []))
            
            # Prepare for insertion
            match_data.append((
                str(uuid.uuid4()), u_id, j_id, score, 'New', skill_gap, False, datetime.now()
            ))

    # 3. Batch Insert Matches
    if match_data:
        print(f"Upserting {len(match_data)} job matches into PostgreSQL...")
        execute_values(cur, """
            INSERT INTO "JobMatch" ("id", "userId", "jobId", "relevanceScore", "matchStatus", "skillGap", "notified", "createdAt")
            VALUES %s
            ON CONFLICT DO NOTHING
        """, match_data)
        conn.commit()
        print("Matching cycle complete.")

except Exception as e:
    print(f"Error during matching: {e}")
    conn.rollback()
finally:
    cur.close()
    conn.close()
