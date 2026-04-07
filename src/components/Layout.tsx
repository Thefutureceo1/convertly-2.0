import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Zap, Github, Twitter } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, headerRight }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] bg-zinc-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-zinc-900/10 blur-[100px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 border-bottom border-zinc-900 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">Convertly</span>
          </div>

          <div className="flex items-center gap-6">
            {headerRight}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border border-zinc-800"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {children}
      </main>

      <footer className="relative z-10 border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">© 2026 Convertly Inc.</span>
          </div>
          
          <div className="flex items-center gap-8 text-zinc-500 text-sm">
            <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">API</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
