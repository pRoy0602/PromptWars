import React from 'react';
import { useApp } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import {
  Repeat,
  ShieldCheck,
  Heart,
  BookOpen,
  GraduationCap,
  Sparkles,
  Leaf,
  Compass,
  MapPin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setIsSafetyModalOpen, setIsVerificationModalOpen, setIsCreateListingOpen, themeMode } = useApp();

  return (
    <footer className={`border-t mt-20 relative z-10 transition-all ${
      themeMode === 'light'
        ? 'bg-white/90 backdrop-blur-2xl text-slate-900 border-slate-200 shadow-xl'
        : 'bg-black/90 backdrop-blur-2xl text-white border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
                <Repeat className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                UniVerse <span className="text-emerald-500">Exchange</span>
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                themeMode === 'light'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                Campus Verified
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              The premier circular exchange network for college students. Swap textbooks, borrow electronics, share notes, offer peer tutoring, and find campus opportunities safely.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>100% Student Powered • Zero Commercial Markup</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] ${
              themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
            }`}>
              Campus Hubs
            </h4>
            <ul className={`space-y-2.5 text-xs ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(500, 0.04);
                    setCurrentPage('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  Resource Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(540, 0.04);
                    setCurrentPage('skills');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  Skills & Peer Tutoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(580, 0.04);
                    setCurrentPage('academic');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  Academic Vault & Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(620, 0.04);
                    setCurrentPage('opportunities');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  Hackathons & Internships
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playWhoosh();
                    setCurrentPage('circulation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  Circulation Impact Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] ${
              themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
            }`}>
              Exchange Types
            </h4>
            <ul className={`space-y-2.5 text-xs ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <li>Textbooks & Study Guides</li>
              <li>Calculators & Hardware Kits</li>
              <li>Event & Fest Tickets</li>
              <li>Free Dorm Giveaways</li>
              <li>Resume & Interview Coaching</li>
              <li>Course Solved Midterms</li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] ${
              themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
            }`}>
              Trust & Campus Safety
            </h4>
            <ul className={`space-y-2.5 text-xs ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(500, 0.04);
                    setIsSafetyModalOpen(true);
                  }}
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Campus Safe Zones</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(550, 0.04);
                    setIsVerificationModalOpen(true);
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  .EDU Student Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFX.playPop(600, 0.04);
                    setIsCreateListingOpen(true);
                  }}
                  className="hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  List Item or Skill
                </button>
              </li>
              <li className={`text-[11px] pt-1 ${
                themeMode === 'light' ? 'text-slate-500' : 'text-slate-500'
              }`}>
                Campus Police Escort: (555) 019-SAFE
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          themeMode === 'light' ? 'border-slate-200 text-slate-500' : 'border-white/[0.08] text-slate-400'
        }`}>
          <p>© {new Date().getFullYear()} UniVerse Exchange. Built for college student communities.</p>
          <div className="flex items-center gap-4 font-medium">
            <span>Affordability</span>
            <span>•</span>
            <span>Sustainability</span>
            <span>•</span>
            <span>Community Reuse</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

