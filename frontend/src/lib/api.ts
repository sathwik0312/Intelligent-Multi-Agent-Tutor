// api.ts - Real API endpoints for the AI Tutor platform
// Swaps mock behavior for actual FastAPI backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  status: string;
  concepts: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string; // The text of the correct answer
  difficulty: string;
}

export interface QuizResult {
  analysis: {
    score: number;
    weak_topics: string[];
    improvement_plan: string;
    recommended_search_queries: string[];
  };
  next_difficulty: string;
}

let currentSessionId: string | null = null;

export const uploadMaterial = async (file: File, onLog: (msg: string) => void): Promise<UploadResponse> => {
  onLog(`📄 Uploading: ${file.name}`);
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  
  const data = await response.json();
  currentSessionId = data.session_id; // Capture the session ID
  onLog(`✅ Analysis complete. Found ${data.concepts.length} concepts.`);
  return data;
};

export const generateQuiz = async (difficulty: string = 'Medium'): Promise<QuizQuestion[]> => {
  if (!currentSessionId) throw new Error('No active session. Please upload material first.');
  const response = await fetch(`${API_BASE_URL}/quiz/generate?session_id=${currentSessionId}&difficulty=${difficulty}`);
  if (!response.ok) throw new Error('Quiz generation failed');
  const data = await response.json();
  // Ensure we return an array
  return Array.isArray(data) ? data : [data];
};

export const submitQuiz = async (answers: string[]): Promise<QuizResult> => {
  if (!currentSessionId) throw new Error('No active session');
  const response = await fetch(`${API_BASE_URL}/quiz/submit?session_id=${currentSessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) throw new Error('Quiz submission failed');
  return await response.json();
};
