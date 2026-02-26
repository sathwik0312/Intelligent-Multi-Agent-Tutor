from typing import Any, Dict

def save_quiz_to_context(state: Dict[str, Any], questions: list, answers: list):
    """Saves quiz questions and answers to the session state."""
    state["current_quiz"] = {
        "questions": questions,
        "answers": answers
    }
    return "Quiz saved to context."

def get_quiz_from_context(state: Dict[str, Any]):
    """Retrieves the current quiz from session state."""
    return state.get("current_quiz", {})

def save_evaluation_to_context(state: Dict[str, Any], score: int, weak_topics: list):
    """Saves evaluation results to session state."""
    state["last_evaluation"] = {
        "score": score,
        "weak_topics": weak_topics
    }
    return "Evaluation saved."
