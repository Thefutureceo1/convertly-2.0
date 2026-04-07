import React from 'react';
import { X, Check, Zap, Infinity, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PricingTier {
  name: string;
  price: string;
  credits: string;
  description: string;
  features: string[];
  paypalUrl: string;
  popular?: boolean;
  highlight?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$5",
    credits: "50 Credits",
    description: "Perfect for quick one-off tasks.",
    features: ["50 Conversion Credits", "All file types", "No expiration", "Email support"],
    paypalUrl: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_EMAIL&item_name=Convertly+50+Credits&amount=5.00&currency_code=USD"
  },
  {
    name: "Pro",
    price: "$10",
    credits: "120 Credits",
    description: "Best for regular power users.",
    features: ["120 Conversion Credits", "Priority processing", "No expiration", "Priority support"],
    popular: true,
    paypalUrl: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_EMAIL&item_name=Convertly+120+Credits&amount=10.00&currency_code=USD"
  },
  {
    name: "Business",
    price: "$20",
    credits: "300 Credits",
    description: "For teams and heavy workloads.",
    features: ["300 Conversion Credits", "Priority processing", "Bulk conversion", "24/7 Support"],
    paypalUrl: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_EMAIL&item_name=Convertly+300+Credits&amount=20.00&currency_code=USD"
  },
  {
    name: "Lifetime",
    price: "$60",
    credits: "Unlimited",
    description: "One-time payment, forever access.",
    features: ["Unlimited Conversions", "Lifetime updates", "All future tools", "VIP Support"],
    highlight: true,
    paypalUrl: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_EMAIL&item_name=Convertly+Lifetime+Access&amount=60.00&currency_code=USD"
  }
];

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onBuy }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 sm:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Boost your productivity</h2>
                <p className="text-zinc-500 max-w-xl mx-auto">
                  Choose the plan that's right for you. All credits are permanent and never expire.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiers.map((tier, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "relative flex flex-col p-8 rounded-3xl border transition-all duration-300",
                      tier.popular ? "bg-zinc-900 border-zinc-700 scale-105 z-10 shadow-xl shadow-black/50" : "bg-zinc-900/30 border-zinc-800",
                      tier.highlight ? "border-amber-500/50 bg-amber-500/[0.02]" : ""
                    )}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h3 className="text-zinc-400 font-medium mb-2">{tier.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">{tier.price}</span>
                        <span className="text-zinc-500 text-sm">one-time</span>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-semibold">
                        {tier.credits === "Unlimited" ? <Infinity className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                        {tier.credits}
                      </div>
                    </div>

                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                      {tier.description}
                    </p>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-zinc-400">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        const amount = tier.credits === "Unlimited" ? 999999 : parseInt(tier.credits);
                        onBuy(amount);
                        window.open(tier.paypalUrl, '_blank');
                      }}
                      className={cn(
                        "w-full py-3 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2",
                        tier.popular 
                          ? "bg-white text-black hover:bg-zinc-200" 
                          : tier.highlight
                            ? "bg-amber-400 text-black hover:bg-amber-300"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                      )}
                    >
                      <CreditCard className="w-4 h-4" />
                      Buy with PayPal
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-zinc-600 mt-12">
                Secure payment via PayPal. Credits are added to your account instantly after payment.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
