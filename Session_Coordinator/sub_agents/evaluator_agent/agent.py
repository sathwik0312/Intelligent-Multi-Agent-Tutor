from google.adk.agents import Agent
from ...config import get_gemini_model

evaluator_agent = Agent(
    name="Evaluator",
    description="Evaluates student answers and provides a score.",
    instruction="""
    You are an Evaluator. Compare the student's answer to the correct answer.
    """,
    model=get_gemini_model()
)
