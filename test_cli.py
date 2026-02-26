import asyncio
import os
from dotenv import load_dotenv
from Session_Coordinator.agent import session_coordinator_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

load_dotenv()

async def test_tutor_loop():
    print("🚀 Starting Intelligent Multi-Agent Tutor Test Loop...\n")
    
    session_service = InMemorySessionService()
    APP_NAME = "TutorTestApp"
    USER_ID = "test-student"
    
    # 1. Initialize Session
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        state={}
    )
    SESSION_ID = session.id
    
    runner = Runner(
        agent=session_coordinator_agent,
        app_name=APP_NAME,
        session_service=session_service
    )

    # STEP 1: Upload Material (Simulated)
    print("--- STEP 1: Uploading Study Material ---")
    study_material = """
    Agentic workflows are a design pattern where LLMs are used as reasoning engines 
    to coordinate multiple specialized agents. Unlike simple chains, agentic systems 
    can use tools, maintain state, and handle complex multi-step tasks.
    """
    
    content = types.Content(role='user', parts=[types.Part(text=f"Process this study material and generate a quiz: {study_material}")])
    
    async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content):
        if event.is_final_response() and event.content:
            print(f"\n[QuizzMaster]:\n{event.content.parts[0].text}\n")

    # STEP 2: Submit Answers (Simulated)
    print("--- STEP 2: Submitting Answers ---")
    # We simulate a student answer
    student_answer = "I think the benefit is specialized task handling."
    answer_content = types.Content(role='user', parts=[types.Part(text=f"Here are my answers: {student_answer}")])
    
    async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=answer_content):
        if event.is_final_response() and event.content:
            print(f"\n[Tutor Feedback & Resources]:\n{event.content.parts[0].text}\n")

    # Final State Check
    final_session = await session_service.get_session(APP_NAME, SESSION_ID, USER_ID)
    print(f"--- FINAL SESSION STATE ---")
    print(f"Next Difficulty: {final_session.state.get('next_difficulty', 'Not Set')}")
    print(f"Last Evaluation: {final_session.state.get('last_evaluation', 'None')}")

if __name__ == "__main__":
    asyncio.run(test_tutor_loop())
