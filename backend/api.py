from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import os
import shutil
from Session_Coordinator.agent import session_coordinator_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

app = FastAPI(title="Intelligent Multi-Agent Tutor API")

# Initialize Session Service
session_service = InMemorySessionService()
APP_NAME = "IntelliLearnApp"

@app.get("/")
async def root():
    return {"message": "IntelliLearn API is online"}

@app.post("/upload")
async def upload_material(file: UploadFile = File(...)):
    user_id = "default_user"
    session = await session_service.create_session(app_name=APP_NAME, user_id=user_id, state={})
    
    # Save file locally for processing
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        with open(temp_path, "r", errors="ignore") as f:
            content_text = f.read()
        
        runner = Runner(agent=session_coordinator_agent, app_name=APP_NAME, session_service=session_service)
        msg = types.Content(role='user', parts=[types.Part(text=f"Process this study material and extract concepts: {content_text}")])
        
        concepts = []
        async for event in runner.run_async(user_id=user_id, session_id=session.id, new_message=msg):
            if event.is_final_response() and event.content:
                # Assuming the coordinator returns concepts or confirmation
                concepts.append(event.content.parts[0].text)
        
        return {
            "status": "success",
            "session_id": session.id,
            "concepts": concepts
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/quiz/generate")
async def generate_quiz(session_id: str, difficulty: str = "Medium"):
    user_id = "default_user"
    runner = Runner(agent=session_coordinator_agent, app_name=APP_NAME, session_service=session_service)
    msg = types.Content(role='user', parts=[types.Part(text=f"Generate a {difficulty} quiz for me.")])
    
    quiz_text = ""
    async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=msg):
        if event.is_final_response() and event.content:
            quiz_text = event.content.parts[0].text
            
    return {"quiz": quiz_text}

@app.post("/quiz/submit")
async def submit_quiz(session_id: str, data: Dict = Body(...)):
    user_id = "default_user"
    runner = Runner(agent=session_coordinator_agent, app_name=APP_NAME, session_service=session_service)
    msg = types.Content(role='user', parts=[types.Part(text=f"Here are my answers: {data.get('answers')}")])
    
    feedback = ""
    async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=msg):
        if event.is_final_response() and event.content:
            feedback = event.content.parts[0].text
            
    return {"feedback": feedback}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
