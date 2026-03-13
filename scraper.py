import requests
import json
from datetime import datetime
import psycopg2
from psycopg2.extras import execute_values
import uuid
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv('backend/.env')

# DB Configuration from environment variables
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

print("AI Smart Job Tracker - Scraper Engine Initialized")

# Simulated output for now - In production, this would use BeautifulSoup/Playwright
mock_scraped_jobs = [
    {
        "id": str(uuid.uuid4()),
        "sourceUrl": f"https://careers.openai.com/jobs/{uuid.uuid4().hex[:8]}",
        "sourceDomain": "openai.com",
        "companyName": "OpenAI",
        "jobTitle": "Generative AI Engineer",
        "location": ["San Francisco", "Remote"],
        "experienceRequired": "4+ years",
        "skillsRequired": ["Python", "PyTorch", "Transformers", "LLMs", "C++"],
        "rawDescription": "Train and optimize large language models...",
        "postedAt": datetime.now(),
        "discoveredAt": datetime.now()
    }
]

print(f"Scraped {len(mock_scraped_jobs)} new jobs from remote sources.")

conn = get_db_connection()
if conn:
    cur = conn.cursor()
    try:
        for job in mock_scraped_jobs:
            print(f"--> Upserting into PostgreSQL: {job['companyName']} - {job['jobTitle']}")
            cur.execute("""
                INSERT INTO "Job" ("id", "sourceUrl", "sourceDomain", "companyName", "jobTitle", "location", "experienceRequired", "skillsRequired", "rawDescription", "postedAt", "discoveredAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT ("sourceUrl") DO NOTHING
            """, (
                job['id'], job['sourceUrl'], job['sourceDomain'], job['companyName'], 
                job['jobTitle'], job['location'], job['experienceRequired'], 
                job['skillsRequired'], job['rawDescription'], job['postedAt'], job['discoveredAt']
            ))
        conn.commit()
        print("Batch insertion complete.")
    except Exception as e:
        print(f"Database insertion failed: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

print("Scraping cycle completed.")
