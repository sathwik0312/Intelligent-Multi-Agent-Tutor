from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from .sub_agents.quizz_master_agent.agent import quiz_master_agent
from .sub_agents.evaluator_agent.agent import evaluator_agent
from .sub_agents.Feedback_agent.agent import feedback_agent
from .sub_agents.Resource_Finder.agent import resource_finder_agent

# Session Coordinator Agent
session_coordinator_agent = Agent(
    name="SessionCoordinator",
    prompt="""You are the master coordinator for the Intelligent Multi-Agent Tutor.
    Your job is to orchestrate the learning session:
    1. Coordinate with QuizzMaster to generate questions.
    2. Pass student answers to the Evaluator.
    3. Hand off the evaluation to the Feedback agent.
    4. Ensure the Resource Finder provides helpful YouTube links based on weaknesses.
    Use the session state to store and retrieve the current quiz and performance history.""",
)
