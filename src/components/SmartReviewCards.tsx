import { motion } from 'framer-motion';
import { Play, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReviewCard } from '@/lib/mockApi';

interface SmartReviewCardsProps {
  cards: ReviewCard[];
}

const SmartReviewCards = ({ cards }: SmartReviewCardsProps) => {
  if (cards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Smart Review Cards
      </h2>

      <div className="grid gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-4 flex gap-4"
          >
            {/* Video thumbnail placeholder */}
            <div className="w-36 h-20 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
              <Play className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors relative z-10" />
              <span className="absolute bottom-1 right-1 text-[10px] font-mono text-muted-foreground bg-background/80 px-1 rounded">12:34</span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground truncate">{card.videoTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{card.videoChannel}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-amber-glow/90 leading-relaxed line-clamp-2">
                  💡 <span className="font-medium">Why you need this:</span> {card.reason}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-end flex-shrink-0">
              <Button size="sm" className="gap-1.5 text-xs">
                Master this
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartReviewCards;
