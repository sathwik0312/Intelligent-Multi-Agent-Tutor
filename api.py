from fastapi import FastAPI, UploadFile, File, HTTPException, Body
import uvicorn
import os
import shutil
import asyncio
from typing import Dict

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from Session_Coordinator.agent import session_coordinator_agent

app = FastAPI(title="Intelligent Multi-Agent Tutor API")

# Google ADK Session Service
session_service = InMemorySessionService()
APP_NAME = "TutorApp"

async def get_runner():
    return Runner(
        agent=session_coordinator_agent,
        app_name=APP_NAME,
        session_service=session_service
    )

@app.post("/upload")
async def upload_material(user_id: str, file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        with open(temp_path, "r", errors="ignore") as f:
            content = f.read()
        
        runner = await get_runner()
        session = await session_service.create_session(APP_NAME, user_id)
        
        # We use the runner to process the material
        prompt = f"Process this study material and prepare for a quiz: {content}"
        msg = types.Content(role='user', parts=[types.Part(text=prompt)])
        
        final_response = ""
        async for event in runner.run_async(user_id=user_id, session_id=session.id, new_message=msg):
            if event.is_final_response() and event.content:
                final_response = event.content.parts[0].text
        
        return {
            "status": "success",
            "message": "Material processed",
            "coordinator_response": final_response
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/quiz/generate")
async def generate_quiz(user_id: str, session_id: str):
    runner = await get_runner()
    
    prompt = "Generate a quiz now based on the processed material."
    msg = types.Content(role='user', parts=[types.Part(text=prompt)])
    
    final_response = ""
    async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=msg):
        if event.is_final_response() and event.content:
            final_response = event.content.parts[0].text
            
    return {"quiz": final_response}

@app.post("/quiz/submit")
async def submit_quiz(user_id: str, session_id: str, answers: str = Body(...)):
    runner = await get_runner()
    
    prompt = f"Here are my answers: {answers}. Please evaluate them."
    msg = types.Content(role='user', parts=[types.Part(text=prompt)])
    
    final_response = ""
    async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=msg):
        if event.is_final_response() and event.content:
            final_response = event.content.parts[0].text
            
    return {"evaluation": final_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
