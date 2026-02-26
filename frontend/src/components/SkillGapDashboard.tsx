import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { SkillProfile } from '@/lib/mockApi';

interface SkillGapDashboardProps {
  skills: SkillProfile[];
}

const SkillGapDashboard = ({ skills }: SkillGapDashboardProps) => {
  const chartData = skills.map(s => ({
    topic: s.topic.length > 12 ? s.topic.slice(0, 12) + '…' : s.topic,
    fullTopic: s.topic,
    score: Math.round((s.score / s.maxScore) * 100),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Skill Gap Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar chart */}
        <div className="glass-panel p-4">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(220, 14%, 18%)" />
              <PolarAngleAxis
                dataKey="topic"
                tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(160, 84%, 39%)"
                fill="hsl(160, 84%, 39%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill, i) => {
            const pct = Math.round((skill.score / skill.maxScore) * 100);
            const isWeak = pct < 60;
            return (
              <motion.div
                key={skill.topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`glass-panel p-3 flex flex-col justify-between ${isWeak ? 'border-red-glow/30' : ''}`}
              >
                <p className="text-xs text-muted-foreground truncate">{skill.topic}</p>
                <div className="mt-2">
                  <p className={`text-2xl font-bold font-mono ${isWeak ? 'text-red-glow' : 'text-primary'}`}>
                    {pct}%
                  </p>
                  <div className="h-1 rounded-full bg-secondary mt-1 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isWeak ? 'bg-red-glow' : 'bg-primary'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillGapDashboard;
