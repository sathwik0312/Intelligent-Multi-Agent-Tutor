from google.adk.agents import Agent
from google.genai import types

quiz_master_agent = Agent(
    name="QuizzMaster",
    instructions="""You are an expert examiner. 
    Generate a 5-question multiple choice quiz based on the study material provided.
    Store the generated quiz questions and correct answers in the tool_context/session state so the Evaluator can access them later.
    Output only the questions for the student.""",
    model="meta/llama-3.1-405b-instruct"
)
