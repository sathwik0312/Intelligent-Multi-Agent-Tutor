import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateQuiz, submitQuiz, type QuizQuestion } from '@/lib/api';
import type { SkillProfile, ReviewCard as ReviewCardType } from '@/lib/mockApi';

interface QuizEngineProps {
  onComplete: (skills: SkillProfile[], cards: ReviewCardType[]) => void;
  onAgentChange: (agentId: string) => void;
}

const difficultyColors: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: 'bg-emerald-glow/20', text: 'text-emerald-glow', label: 'Low' },
  medium: { bg: 'bg-amber-glow/20', text: 'text-amber-glow', label: 'Medium' },
  hard: { bg: 'bg-red-glow/20', text: 'text-red-glow', label: 'High' },
};

const QuizEngine = ({ onComplete, onAgentChange }: QuizEngineProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    onAgentChange('quizmaster');
    generateQuiz().then(q => { 
      // Adapt API response to component expected format
      const formatted = q.map((item: any, idx: number) => ({
        id: (idx + 1).toString(),
        question: item.question,
        options: item.options,
        correctIndex: item.options.indexOf(item.answer),
        topic: 'Curriculum',
        difficulty: (item.difficulty || 'medium').toLowerCase()
      }));
      setQuestions(formatted); 
      setLoading(false); 
    });
  }, [onAgentChange]);

  const current = questions[currentIdx];
  const difficulty = current ? (difficultyColors[current.difficulty] || difficultyColors.medium) : difficultyColors.easy;
  const progress = questions.length ? ((currentIdx) / questions.length) * 100 : 0;

  const handleNext = async () => {
    if (selectedOption === null || !current) return;
    const newAnswers = { ...answers, [current.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setSubmitting(true);
      onAgentChange('evaluator');
      
      // Convert answers map to list for API
      const answersList = questions.map(q => q.options[newAnswers[q.id]]);
      const result = await submitQuiz(answersList);
      
      onAgentChange('feedback');

      // Map API result back to mock UI types for now to avoid breaking dashboard
      const skillProfile: SkillProfile[] = result.analysis.weak_topics.map(topic => ({
        topic,
        score: 0,
        maxScore: 1
      }));

      const reviewCards: ReviewCardType[] = result.analysis.recommended_search_queries.map((query, i) => ({
        id: `rc_${i}`,
        topic: 'Review',
        reason: result.analysis.improvement_plan,
        videoTitle: query,
        videoChannel: 'YouTube Search',
        thumbnailUrl: ''
      }));

      onComplete(skillProfile, reviewCards);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-12 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-mono">QuizMaster generating questions...</span>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="glass-panel p-12 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-mono">Evaluator analyzing responses...</span>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Adaptive Quiz
        </h2>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${difficulty.bg}`}>
          <div className={`w-2 h-2 rounded-full ${difficulty.text === 'text-emerald-glow' ? 'bg-emerald-glow' : difficulty.text === 'text-amber-glow' ? 'bg-amber-glow' : 'bg-red-glow'}`} />
          <span className={`text-xs font-mono font-medium ${difficulty.text}`}>Cognitive Load: {difficulty.label}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-mono">Question {currentIdx + 1} of {questions.length} · {current.topic}</p>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 space-y-5"
        >
          <p className="text-foreground font-medium leading-relaxed">{current.question}</p>

          <div className="space-y-2">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 text-sm ${
                  selectedOption === i
                    ? 'border-primary bg-primary/10 text-foreground glow-emerald'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="gap-2"
        >
          {currentIdx < questions.length - 1 ? 'Next' : 'Submit'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuizEngine;
