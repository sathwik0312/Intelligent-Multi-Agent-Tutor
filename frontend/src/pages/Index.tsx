import { useState, useCallback } from 'react';
import AgentSidebar from '@/components/AgentSidebar';
import KnowledgeIngestion from '@/components/KnowledgeIngestion';
import QuizEngine from '@/components/QuizEngine';
import SkillGapDashboard from '@/components/SkillGapDashboard';
import SmartReviewCards from '@/components/SmartReviewCards';
import type { UploadResponse, SkillProfile, ReviewCard } from '@/lib/mockApi';
import { Brain, Sparkles } from 'lucide-react';

type Phase = 'upload' | 'quiz' | 'results';

const Index = () => {
  const [phase, setPhase] = useState<Phase>('upload');
  const [activeAgent, setActiveAgent] = useState('document');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessionNumber] = useState(4);
  const [skills, setSkills] = useState<SkillProfile[]>([]);
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);

  const handleUploadComplete = useCallback((_response: UploadResponse) => {
    setPhase('quiz');
  }, []);

  const handleQuizComplete = useCallback((skillProfile: SkillProfile[], cards: ReviewCard[]) => {
    setSkills(skillProfile);
    setReviewCards(cards);
    setPhase('results');
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Background subtle grid effect */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(220, 14%, 14%) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />

      <AgentSidebar
        activeAgent={activeAgent}
        sessionNumber={sessionNumber}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
          {/* Header */}
          <header className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 glow-emerald">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  Intelligent Multi-Agent Tutor
                  <Sparkles className="w-5 h-5 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  Powered by ADK · Session #{sessionNumber} · Long-term memory active
                </p>
              </div>
            </div>
          </header>

          {/* Phase: Upload */}
          {phase === 'upload' && (
            <KnowledgeIngestion
              onUploadComplete={handleUploadComplete}
              onAgentChange={setActiveAgent}
            />
          )}

          {/* Phase: Quiz */}
          {phase === 'quiz' && (
            <QuizEngine
              onComplete={handleQuizComplete}
              onAgentChange={setActiveAgent}
            />
          )}

          {/* Phase: Results */}
          {phase === 'results' && (
            <div className="space-y-8">
              <SkillGapDashboard skills={skills} />
              <SmartReviewCards cards={reviewCards} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
