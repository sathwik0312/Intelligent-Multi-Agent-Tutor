import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { uploadMaterial, type UploadResponse } from '@/lib/api';

interface KnowledgeIngestionProps {
  onUploadComplete: (response: UploadResponse) => void;
  onAgentChange: (agentId: string) => void;
}

const KnowledgeIngestion = ({ onUploadComplete, onAgentChange }: KnowledgeIngestionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [trailProgress, setTrailProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setLogs([]);
    onAgentChange('document');

    // Animate trail
    const trailInterval = setInterval(() => {
      setTrailProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    const response = await uploadMaterial(file, addLog);

    clearInterval(trailInterval);
    setTrailProgress(100);
    setIsUploading(false);
    setUploadComplete(true);
    onAgentChange('quizmaster');
    onUploadComplete(response);
  }, [addLog, onUploadComplete, onAgentChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Knowledge Ingestion
      </h2>

      {/* Upload area */}
      {!uploadComplete && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-panel p-8 border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-primary glow-emerald scale-[1.01]' : 'border-border hover:border-muted-foreground'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-3">
            <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm text-muted-foreground">
              Drop your curriculum PDF or text file here
            </p>
            <p className="text-xs text-muted-foreground/60">PDF, TXT, MD supported</p>
          </div>
        </div>
      )}

      {uploadComplete && (
        <div className="glass-panel p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">Curriculum loaded — ready for assessment</span>
        </div>
      )}

      {/* Multi-Agent Handoff Animation */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/20 text-primary"><FileText className="w-4 h-4" /></div>
                <span className="text-xs font-mono text-muted-foreground">Document Agent</span>
              </div>
              <div className="flex-1 mx-4 relative h-[2px] bg-secondary rounded overflow-hidden">
                <motion.div
                  className="agent-trail absolute inset-y-0 w-1/3"
                  animate={{ x: ['0%', '300%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Curriculum Analyst</span>
                <div className="p-1.5 rounded-md bg-primary/20 text-primary"><ArrowRight className="w-4 h-4" /></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Log */}
      {logs.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-border" style={{ background: 'hsl(var(--terminal-bg))' }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <div className="w-2.5 h-2.5 rounded-full bg-red-glow/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-glow/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-glow/80" />
            <span className="text-xs font-mono text-muted-foreground ml-2">agent-pipeline.log</span>
          </div>
          <div ref={logContainerRef} className="p-3 max-h-40 overflow-y-auto space-y-1">
            {logs.map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="terminal-line text-xs"
              >
                {log}
              </motion.p>
            ))}
            {isUploading && (
              <span className="terminal-line text-xs inline-block" style={{ animation: 'terminal-blink 1s infinite' }}>▋</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeIngestion;
