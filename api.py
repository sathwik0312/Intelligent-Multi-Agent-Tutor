from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import os
import shutil
from agents import tutor_system

app = FastAPI(title="Intelligent Multi-Agent Tutor API")

# Simple in-memory state management
# In a real app, use a database/session service
session_db = {
    "current_concepts": [],
    "last_quiz": [],
    "history": []
}

@app.post("/upload")
async def upload_material(file: UploadFile = File(...)):
    # Save file locally for processing
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # In a real RAG setup, we'd use a PDF loader here
        # For the demo, we read it as text
        with open(temp_path, "r", errors="ignore") as f:
            content = f.read()
        
        concepts = await tutor_system.curriculum_agent(content)
        session_db["current_concepts"] = concepts
        
        return {
            "status": "success",
            "concepts": concepts
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/quiz/generate")
async def generate_quiz(difficulty: str = "Medium"):
    if not session_db["current_concepts"]:
        raise HTTPException(status_code=400, detail="No study material uploaded yet")
    
    quiz_questions = await tutor_system.quiz_agent(
        session_db["current_concepts"], 
        difficulty
    )
    session_db["last_quiz"] = quiz_questions
    return quiz_questions

@app.post("/quiz/submit")
async def submit_quiz(data: Dict = Body(...)):
    # Expected format: {"answers": ["A", "B", ...]}
    if not session_db["last_quiz"]:
        raise HTTPException(status_code=400, detail="No active quiz found")
    
    analysis = await tutor_system.feedback_agent(
        session_db["last_quiz"], 
        data["answers"]
    )
    
    # Store history for state management
    session_db["history"].append(analysis)
    
    # Logic to determine next difficulty
    next_diff = "Hard" if analysis["score"] > 80 else "Medium"
    if analysis["score"] < 50: next_diff = "Easy"
    
    return {
        "analysis": analysis,
        "next_difficulty": next_diff
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
