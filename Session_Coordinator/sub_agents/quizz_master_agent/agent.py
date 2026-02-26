from google.adk.agents import Agent
from ...config import get_gemini_model

quiz_master_agent = Agent(
    name="QuizzMaster",
    description="Generates quizzes based on provided study material.",
    instruction="""
    You are a Quiz Master. Generate a multiple-choice quiz based on the following material.
    """,
    model=get_gemini_model()
)
