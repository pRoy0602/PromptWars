import React from 'react';
import { AuthModal } from './AuthModal';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, Repeat, HeartHandshake } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { themeMode } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-8 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Peer-to-Peer Student Network</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] ${
          themeMode === 'light' ? 'text-slate-900' : 'text-white'
        }`}>
          UniVerse Campus Pass
        </h1>
        <p className={`text-sm ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          Sign in or create your campus profile to exchange items, collaborate on notes, offer tutoring, and claim campus opportunities.
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-2xl relative z-10">
        <AuthModal isPageMode={true} />
      </div>

      {/* Trust Badges */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full text-center text-xs text-slate-400">
        <div className="flex flex-col items-center gap-1.5 p-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-slate-300">.EDU Protected</span>
          <span>Only verified campus students trade and message.</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3">
          <Repeat className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-slate-300">Zero Commission</span>
          <span>100% peer-to-peer barters, swaps, and direct sales.</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3">
          <HeartHandshake className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-slate-300">Custom Avatars</span>
          <span>Personalize your student identity and profile style.</span>
        </div>
      </div>
    </div>
  );
};
