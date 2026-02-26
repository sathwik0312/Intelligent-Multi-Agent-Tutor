from google.adk.agents import Agent
from ...config import get_gemini_model

feedback_agent = Agent(
    name="FeedbackAgent",
    description="Provides constructive feedback to the student.",
    instruction="""
    You are a Feedback Agent. Provide constructive and encouraging feedback to the student.
    1. Read the evaluation results (score and weak topics) from the session state.
    2. Provide encouraging feedback and explain the core concepts missed.
    3. Determine the 'next_difficulty' level:
       - If score > 80: 'Hard'
       - If score < 50: 'Easy'
       - Otherwise: 'Medium'
    """,
    model=get_gemini_model()
)
