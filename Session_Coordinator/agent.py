from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from .sub_agents.quizz_master_agent.agent import quiz_master_agent
from .sub_agents.evaluator_agent.agent import evaluator_agent
from .sub_agents.Feedback_agent.agent import feedback_agent
from .sub_agents.Resource_Finder.agent import resource_finder_agent
from .config import get_gemini_model

# Session Coordinator Agent
session_coordinator_agent = Agent(
    name="Session_Coordinator",
    description="Manages the tutor session flow and coordinates sub-agents.",
    instruction="""
    You are a Session Coordinator for an AI tutor.
    Your job is to manage the flow of the learning session.
    """,
    model=get_gemini_model()
)
