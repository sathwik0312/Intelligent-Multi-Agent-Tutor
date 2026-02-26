from typing import List, Dict, Any
import os
from dotenv import load_dotenv

# We'll use LangChain for the agent orchestration
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from pydantic import BaseModel, Field

load_dotenv()

# Data models for structured output
class Question(BaseModel):
    question: str = Field(description="The quiz question")
    options: List[str] = Field(description="List of 4 multiple choice options")
    answer: str = Field(description="The correct option")
    explanation: str = Field(description="Brief explanation why it is correct")

class Quiz(BaseModel):
    questions: List[Question]

class Analysis(BaseModel):
    score: int
    weak_topics: List[str]
    improvement_plan: str
    recommended_search_queries: List[str]

class TutorAgents:
    def __init__(self, model_name="meta/llama-3.1-405b-instruct"):
        # NVIDIA NIM endpoint configuration
        # Ensure NVIDIA_API_KEY is set in your environment
        self.llm = ChatNVIDIA(model=model_name)
        self.json_parser = JsonOutputParser()

    async def curriculum_agent(self, content: str) -> List[str]:
        """Analyzes PDF content and extracts core concepts."""
        prompt = ChatPromptTemplate.from_template(
            "You are a Curriculum Expert. Analyze the following study material and extract the top 5-7 core educational concepts. "
            "Return them as a simple bulleted list.\n\nMaterial: {content}"
        )
        chain = prompt | self.llm | StrOutputParser()
        response = await chain.ainvoke({"content": content[:10000]}) # Truncate if too long
        return [c.strip("- ") for c in response.split("\n") if c.strip()]

    async def quiz_agent(self, concepts: List[str], difficulty: str) -> List[Dict]:
        """Generates a quiz based on extracted concepts and current difficulty."""
        parser = JsonOutputParser(pydantic_object=Quiz)
        prompt = ChatPromptTemplate.from_template(
            "You are an Examination Agent. Create a 5-question multiple choice quiz based on these concepts: {concepts}. "
            "Set the difficulty level to: {difficulty}. "
            "Return the response in strictly valid JSON format matching the schema.\n{format_instructions}",
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        chain = prompt | self.llm | parser
        response = await chain.ainvoke({"concepts": ", ".join(concepts), "difficulty": difficulty})
        return response["questions"]

    async def feedback_agent(self, quiz_data: List[Dict], user_answers: List[str]) -> Dict:
        """Analyzes answers and provides feedback + YouTube search queries."""
        parser = JsonOutputParser(pydantic_object=Analysis)
        prompt = ChatPromptTemplate.from_template(
            "You are a Personal Tutor Agent. Compare the quiz questions and correct answers with the student's choices.\n"
            "Quiz: {quiz_data}\nStudent Answers: {user_answers}\n"
            "Identify topics where the student struggled. Recommend specific search queries for YouTube to help them improve.\n"
            "Return strictly valid JSON matching the schema.\n{format_instructions}",
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        chain = prompt | self.llm | parser
        return await chain.ainvoke({"quiz_data": quiz_data, "user_answers": user_answers})

tutor_system = TutorAgents()
