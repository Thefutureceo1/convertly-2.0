import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { Layout } from './components/Layout';
import { ConversionTool } from './components/ConversionTool';
import { CreditsDisplay } from './components/CreditsDisplay';
import { PricingModal } from './components/PricingModal';
import { useCredits } from './hooks/useCredits';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function App() {
  const { credits, spendCredit, addCredits, isLoading } = useCredits();
  const { isLoaded, isSignedIn } = useUser();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Detect if a real Clerk key is provided (not the placeholder)
  const hasClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                     import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder" &&
                     !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes("...");

  const showTool = isSignedIn || isDemoMode;

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout 
      headerRight={
        (showTool) && (
          <CreditsDisplay 
            credits={credits} 
            onBuyCredits={() => setIsPricingOpen(true)} 
          />
        )
      }
    >
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onBuy={(amount) => {
          addCredits(amount);
          setIsPricingOpen(false);
        }}
      />

      <div className="flex flex-col items-center text-center space-y-12">
        {/* Only show warning if key is missing AND we aren't in demo mode */}
        {!hasClerkKey && !isDemoMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 shrink-0 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200">Authentication is not configured</p>
              <p className="text-xs text-amber-500/80 mt-0.5">
                Add <code className="bg-black/30 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> to your Secrets to enable real login. 
                Use Demo Mode below to test the tool now.
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>New: Image to PDF conversion is now live</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
          >
            Convert files with <br />
            <span className="text-zinc-500">unmatched precision.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            The professional-grade tool for developers and designers. 
            Fast, secure, and entirely browser-based.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          {showTool ? (
            <div className="space-y-6">
              {isDemoMode && !isSignedIn && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Demo Mode Active
                </div>
              )}
              <ConversionTool credits={credits} onConvert={spendCredit} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-12 bg-zinc-900/50 border border-zinc-800 rounded-[32px] backdrop-blur-sm space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Ready to start converting?</h2>
                <p className="text-zinc-500">Sign in to get 10 free credits and start using our professional tools today.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 transition-all">
                    Sign In to Start
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
                
                {/* Only show Demo Mode if real auth isn't available */}
                {!hasClerkKey && (
                  <button 
                    onClick={() => setIsDemoMode(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-800 text-zinc-300 font-semibold rounded-2xl hover:bg-zinc-700 transition-all"
                  >
                    Try Demo Mode
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">100%</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Private</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">Instant</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Processing</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">0</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Server Logs</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-20">
          {[
            { title: "Browser-based", desc: "Files never leave your machine. Privacy by design." },
            { title: "High Fidelity", desc: "Lossless conversion for images and perfectly formatted data." },
            { title: "Credit System", desc: "Pay only for what you use. No expensive subscriptions." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl text-left hover:border-zinc-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
