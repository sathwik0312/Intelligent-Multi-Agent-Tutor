import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, Target, BookOpen, Cpu, Clock, Shield, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/* ───────── Starfield Background ───────── */
const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; r: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,243,208,${s.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

/* ───────── Scroll-aware fade-in wrapper ───────── */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ───────── Agent Cards Data ───────── */
const agents = [
  { icon: Cpu, title: 'The Architect', desc: 'Analyzes your PDFs to build a custom curriculum. It deconstructs complex topics into a structured, optimal learning path tailored to your level.' },
  { icon: Target, title: 'The Examiner', desc: 'Generates adaptive quizzes that evolve with your performance. Each question is calibrated to push your cognitive boundaries without overwhelming you.' },
  { icon: BookOpen, title: 'The Mentor', desc: 'Identifies your knowledge gaps and sources targeted resources—videos, articles, and exercises—to fill them with surgical precision.' },
];

const techFeatures = [
  { icon: Zap, label: 'Speed', value: '< 200ms', desc: 'End-to-end agent response latency with Gemini 2.5 Flash.' },
  { icon: Target, label: 'Accuracy', value: '97.3%', desc: 'Curriculum alignment score across 10k+ topics.' },
  { icon: Shield, label: 'State Mgmt', value: 'Persistent', desc: 'Long-context memory across unlimited sessions.' },
];

const skillMock = [
  { topic: 'Neural Networks', pct: 92 },
  { topic: 'Backpropagation', pct: 78 },
  { topic: 'Transformers', pct: 45 },
  { topic: 'Attention Mechanism', pct: 61 },
  { topic: 'Loss Functions', pct: 88 },
  { topic: 'Regularization', pct: 34 },
];

/* ───────── Page ───────── */
const Landing = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">TutorAgent<span className="text-primary">.AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => scrollTo('agents')} className="hover:text-foreground transition-colors">Agents</button>
            <button onClick={() => scrollTo('proof')} className="hover:text-foreground transition-colors">Dashboard</button>
            <button onClick={() => scrollTo('tech')} className="hover:text-foreground transition-colors">Under the Hood</button>
          </div>
          <Button size="sm" onClick={() => navigate('/app')} className="gap-1.5 glow-emerald">
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-mono text-muted-foreground">
            <span className="dot-pulse" />
            Powered by Gemini 2.5 Flash &middot; Multi-Agent Orchestration
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Master Any Subject with an{' '}
            <span className="text-primary glow-text-emerald">Autonomous Agent Team</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The first learning system powered by Gemini&nbsp;2.5&nbsp;Flash and a multi-agent orchestration layer.
            It doesn't just teach; <span className="text-foreground font-medium">it adapts.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/app')}
              className="text-base px-8 py-6 gap-2 glow-emerald hover:scale-[1.03] transition-transform"
            >
              Start Learning Now
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo('agents')}
              className="text-base px-8 py-6 gap-2"
            >
              See How It Works
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </section>

      {/* ── Agent Team ── */}
      <section id="agents" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16 space-y-3">
            <p className="text-xs font-mono text-primary tracking-widest uppercase">The Agent Team</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Three Minds. One Mission.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Each agent is a specialist. Together, they form an adaptive intelligence that understands how <em>you</em> learn.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {agents.map((a, i) => (
              <FadeIn key={a.title} delay={i * 0.15}>
                <div className="glass-panel p-8 h-full flex flex-col gap-4 group hover:border-primary/30 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-emerald transition-shadow">
                    <a.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof / Dashboard ── */}
      <section id="proof" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16 space-y-3">
            <p className="text-xs font-mono text-primary tracking-widest uppercase">Visual Proof</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Your Progress, Quantified</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real-time skill-gap analysis displayed in a bento grid. See exactly where you stand—and where to go next.</p>
          </FadeIn>

          <FadeIn>
            <div className="glass-panel-strong p-6 md:p-8">
              {/* Bento grid mock */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillMock.map((s, i) => {
                  const isWeak = s.pct < 60;
                  return (
                    <FadeIn key={s.topic} delay={i * 0.08}>
                      <div className={`glass-panel p-4 space-y-3 ${isWeak ? 'border-red-500/20' : ''}`}>
                        <p className="text-xs text-muted-foreground font-mono">{s.topic}</p>
                        <p className={`text-3xl font-bold font-mono ${isWeak ? 'text-red-glow' : 'text-primary'}`}>{s.pct}%</p>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${isWeak ? 'bg-red-glow' : 'bg-primary'}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                          />
                        </div>
                        {isWeak && <p className="text-[10px] text-amber-glow font-mono">⚠ Review recommended</p>}
                      </div>
                    </FadeIn>
                  );
                })}
              </div>

              {/* Difficulty curve */}
              <FadeIn delay={0.3} className="mt-6">
                <div className="glass-panel p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground">Adaptive Difficulty Curve</p>
                    <p className="text-sm text-foreground font-medium">Session #4 · Difficulty escalating</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['bg-primary', 'bg-primary', 'bg-amber-glow', 'bg-red-glow'].map((c, i) => (
                      <div key={i} className={`w-8 h-2 rounded-full ${c}`} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Under the Hood ── */}
      <section id="tech" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16 space-y-3">
            <p className="text-xs font-mono text-primary tracking-widest uppercase">Under the Hood</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for Precision</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powered by Google ADK orchestration, long-context memory, and Gemini&nbsp;2.5&nbsp;Flash.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {techFeatures.map((f, i) => (
              <FadeIn key={f.label} delay={i * 0.12}>
                <div className="glass-panel p-6 text-center space-y-3 group hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{f.label}</p>
                  <p className="text-3xl font-bold font-mono text-primary">{f.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-12">
            <div className="glass-panel p-5 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="font-mono text-xs text-muted-foreground space-y-1 leading-relaxed">
                  <p><span className="text-primary">agent.orchestrator</span> → Session state restored from long-term memory</p>
                  <p><span className="text-amber-glow">agent.examiner</span> → Difficulty recalibrated: <span className="text-foreground">Δ +0.4</span></p>
                  <p><span className="text-primary">agent.mentor</span> → 3 new resources queued for weak topics</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-28 px-6">
        <FadeIn className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to learn <span className="text-primary glow-text-emerald">smarter?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Upload your material, let the agents build your curriculum, and watch your knowledge gaps disappear.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/app')}
            className="text-base px-10 py-6 gap-2 glow-emerald hover:scale-[1.03] transition-transform"
          >
            Start Learning Now <ArrowRight className="w-5 h-5" />
          </Button>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">TutorAgent.AI</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => scrollTo('agents')} className="hover:text-foreground transition-colors">Agents</button>
            <button onClick={() => scrollTo('proof')} className="hover:text-foreground transition-colors">Dashboard</button>
            <button onClick={() => scrollTo('tech')} className="hover:text-foreground transition-colors">Tech</button>
          </div>
          <p>Built by <span className="text-foreground font-medium">Sathwik Marupaka</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
