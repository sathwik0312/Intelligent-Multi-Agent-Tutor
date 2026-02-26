import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, BookCheck, MessageSquare, Cpu } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
}

const agents: Agent[] = [
  { id: 'quizmaster', name: 'QuizMaster', role: 'Question Generation', icon: <Brain className="w-4 h-4" /> },
  { id: 'evaluator', name: 'Evaluator', role: 'Answer Analysis', icon: <BookCheck className="w-4 h-4" /> },
  { id: 'feedback', name: 'FeedbackAgent', role: 'Learning Path', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'document', name: 'DocProcessor', role: 'Content Ingestion', icon: <Cpu className="w-4 h-4" /> },
];

interface AgentSidebarProps {
  activeAgent: string;
  sessionNumber: number;
  collapsed: boolean;
  onToggle: () => void;
}

const AgentSidebar = ({ activeAgent, sessionNumber, collapsed, onToggle }: AgentSidebarProps) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel-strong h-full flex flex-col overflow-hidden relative"
    >
      <button
        onClick={onToggle}
        className="absolute top-4 right-2 z-10 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Agent Team</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="dot-pulse" />
                <span className="text-xs font-mono text-primary">System Active</span>
              </div>
            </div>

            <div className="flex-1 p-3 space-y-1">
              {agents.map((agent) => {
                const isActive = agent.id === activeAgent;
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-primary/10 glow-emerald' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{agent.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{agent.role}</p>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="agent-token"
                        className="w-2 h-2 rounded-full bg-primary"
                        style={{ boxShadow: '0 0 8px hsl(var(--primary))' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border">
              <div className="glass-panel p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">State Persistence</p>
                <p className="text-xs font-mono text-primary mt-1">
                  Session #{sessionNumber}: Long-term memory active
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {collapsed && (
        <div className="flex flex-col items-center gap-3 pt-14">
          {agents.map((agent) => {
            const isActive = agent.id === activeAgent;
            return (
              <div
                key={agent.id}
                className={`p-2 rounded-lg transition-all ${isActive ? 'bg-primary text-primary-foreground glow-emerald' : 'text-muted-foreground hover:text-foreground'}`}
                title={agent.name}
              >
                {agent.icon}
              </div>
            );
          })}
        </div>
      )}
    </motion.aside>
  );
};

export default AgentSidebar;
