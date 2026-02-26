# Intelligent Multi-Agent Tutor 🤖📚

IntelliLearn Studio is an adaptive, multimodal learning platform powered by **Google ADK** and **Gemini 2.5 Flash**. It utilizes a hierarchical multi-agent architecture to analyze study materials, generate personalized quizzes, and provide targeted feedback to students.

## 🚀 Features

- **Multi-Agent Orchestration:** Managed by a `SessionCoordinator` that delegates tasks to specialized sub-agents.
- **Adaptive Difficulty:** Automatically scales quiz complexity (Easy, Medium, Hard) based on real-time performance.
- **Intelligent Feedback:** Identifies knowledge gaps and provides direct links to educational resources (e.g., YouTube).
- **State Persistence:** Maintains student progress and history across learning sessions using Google ADK state management.
- **Modern UI:** A sleek, high-performance frontend built with React, Tailwind CSS, and shadcn/ui.

## 🏗️ Architecture

The project is organized into a clear frontend/backend split:

### Backend (`/backend`)
- **QuizzMaster:** Generates custom MCQ quizzes from provided study material.
- **Evaluator:** Grades student responses and identifies weak topics.
- **FeedbackAgent:** Provides personalized encouragement and sets the difficulty for the next round.
- **ResourceFinder:** Sources external educational content to help fill knowledge gaps.
- **API:** FastAPI server orchestrating the agent workflows.

### Frontend (`/frontend`)
- **UI/UX:** React-based dashboard with real-time feedback and progress tracking.
- **Tech:** Vite, TypeScript, Tailwind CSS, shadcn/ui.

## 🛠️ Tech Stack

- **Models:** Google Gemini 2.5 Flash
- **Orchestration:** [Google ADK](https://github.com/google/adk) (Agent Development Kit)
- **Frameworks:** React, FastAPI
- **Environment:** `uv` (Python), `npm` (Node)

## 🏁 Getting Started

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.10+ (for backend)
- Google API Key (Gemini 2.5 Flash access)

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sathwik0312/Intelligent-Multi-Agent-Tutor.git
   cd Intelligent-Multi-Agent-Tutor
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   # Create a .env file
   echo "GOOGLE_API_KEY=your_key_here" > .env
   
   # Install dependencies and run
   pip install -r requirements.txt
   python main.py
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---
*Developed by Sathwik Marupaka*
