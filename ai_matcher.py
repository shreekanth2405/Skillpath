import json
import psycopg2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Connect to database
# In a real scenario, this connects to the identical `skillpath` DB used by Prisma.
# For demonstration passing, we mock the inputs here.

print("--- AI Semantic Matching Engine Initializing ---")
print("Loading NLP Vectors...")

# Mock User Profile
user_profile = {
    "name": "Jane Doe",
    "role": "Software Developer",
    "experience": "Fresher",
    "location": "Bangalore",
    "skills": ["Python", "React", "Machine Learning", "SQL", "Git"]
}

# Mock New Scraped Jobs
scraped_jobs = [
    {
        "id": "job_001",
        "title": "Machine Learning Engineer",
        "company": "DeepMind",
        "location": "Remote",
        "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Git"]
    },
    {
        "id": "job_002",
        "title": "Frontend React Developer",
        "company": "Vercel",
        "location": "San Francisco",
        "skills": ["React", "JavaScript", "TypeScript", "Next.js", "CSS"]
    },
    {
        "id": "job_003",
        "title": "Full Stack Engineer",
        "company": "Startup Inc",
        "location": "Bangalore",
        "skills": ["Python", "React", "SQL", "AWS", "Git"]
    }
]

# Create a text document for the user comprising of their core competencies
user_text = f"{user_profile['role']} {' '.join(user_profile['skills'])}"

def calculate_match_score(user_text, job):
    # Create a text document for the job
    job_text = f"{job['title']} {' '.join(job['skills'])}"
    
    # Use TF-IDF to create vector embeddings of the texts
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([user_text, job_text])
    
    # Calculate Cosine Similarity between the User Vector and Job Vector
    # cosine_similarity returns a matrix, [0][1] gets the correlation between doc1 and doc2
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Scale to a 0-100 percentage
    base_score = float(similarity * 100)
    
    # Add weighting logic mentioned in architecture
    # e.g., location match bonus
    if job['location'] in [user_profile['location'], 'Remote']:
        base_score += 10
        
    # Cap at 100%
    return min(100.0, round(base_score, 1))

print(f"\nAnalyzing {len(scraped_jobs)} jobs against User: {user_profile['name']}...")
print("-" * 50)

for job in scraped_jobs:
    score = calculate_match_score(user_text, job)
    
    # Calculate missing skills completely separate from the vector math (Skill Gap Analysis)
    missing_skills = list(set(job['skills']) - set(user_profile['skills']))
    
    print(f"Job: {job['title']} @ {job['company']}")
    print(f"Relevance Score: {score}%")
    print(f"Skill Gap: {', '.join(missing_skills) if missing_skills else 'None - Perfect Match!'}")
    
    if score >= 80:
        print("[!] 🚨 TRIGGERING HIGH MATCH NOTIFICATION via Node.js Webhook 🚨")
    print("-" * 50)

print("AI Matching Cycle complete.")
