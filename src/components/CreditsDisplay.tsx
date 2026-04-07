import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CreditsDisplayProps {
  credits: number;
  onBuyCredits: () => void;
}

export const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ credits, onBuyCredits }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-zinc-200">
          {credits} <span className="text-zinc-500">Credits</span>
        </span>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBuyCredits}
        className={cn(
          "flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-all",
          credits === 0 
            ? "text-black bg-amber-400 hover:bg-amber-300" 
            : "text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200"
        )}
      >
        <Plus className="w-3 h-3" />
        Buy Credits
      </motion.button>
    </div>
  );
};
