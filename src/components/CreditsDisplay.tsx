import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { motion } from 'motion/react';

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
      
      {credits === 0 && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onBuyCredits}
          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-black bg-amber-400 rounded-full hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Buy Credits
        </motion.button>
      )}
    </div>
  );
};
