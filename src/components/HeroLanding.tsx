import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory } from '../types';
import { soundFX } from '../utils/soundFx';
import { LiveActivityTicker } from './LiveActivityTicker';
import { Interactive3DCard } from './Interactive3DCard';
import { SmartMatchSection } from './SmartMatchSection';
import {
  Search,
  PlusCircle,
  ArrowRight,
  Book,
  Laptop,
  FileText,
  Ticket,
  Wrench,
  GraduationCap,
  Gift,
  Compass,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  DollarSign,
  Leaf,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';

export const HeroLanding: React.FC = () => {
  const {
    setCurrentPage,
    setIsCreateListingOpen,
    setIsVerificationModalOpen,
    openCreateRequestModal,
    triggerSearchNav,
    circulationMetric,
    listings,
    setSelectedListing,
    toggleSaveListing,
    savedListingIds,
    themeMode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playWhoosh();
    if (searchQuery.trim()) {
      triggerSearchNav(searchQuery.trim());
    } else {
      setCurrentPage('marketplace');
    }
  };

  const categories: {
    id: ResourceCategory;
    title: string;
    description: string;
    icon: React.ReactNode;
    count: number;
    color: string;
    borderHover: string;
    examples: string;
  }[] = [
    {
      id: 'books',
      title: 'Books & Textbooks',
      description: 'Calculus, Engineering, Biology, Novels & Study Guides',
      icon: <Book className="w-5 h-5 text-indigo-400" />,
      count: listings.filter((l) => l.category === 'books').length + 42,
      color: 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300',
      borderHover: 'hover:border-indigo-500/50 hover:bg-indigo-950/40',
      examples: 'Kreyszig Math, Campbell Bio, CS Algorithms',
    },
    {
      id: 'electronics',
      title: 'Electronics & Gear',
      description: 'Graphing Calculators, Headphones, Arduino, Monitors & Wires',
      icon: <Laptop className="w-5 h-5 text-blue-400" />,
      count: listings.filter((l) => l.category === 'electronics').length + 38,
      color: 'bg-blue-950/20 border-blue-900/40 text-blue-300',
      borderHover: 'hover:border-blue-500/50 hover:bg-blue-950/40',
      examples: 'TI-84 CE, Sony ANC, Raspberry Pi kits',
    },
    {
      id: 'notes',
      title: 'Class Notes & Guides',
      description: 'Verified Handwritten Notes, Solved Midterms & Formula Sheets',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      count: listings.filter((l) => l.category === 'notes').length + 85,
      color: 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300',
      borderHover: 'hover:border-emerald-500/50 hover:bg-emerald-950/40',
      examples: 'Web Dev, Operating Systems, Organic Chem',
    },
    {
      id: 'tickets',
      title: 'Event & Fest Tickets',
      description: 'Spring Music Fest Passes, Hackathon Tickets, Guest Entries',
      icon: <Ticket className="w-5 h-5 text-amber-400" />,
      count: listings.filter((l) => l.category === 'tickets').length + 14,
      color: 'bg-amber-950/20 border-amber-900/40 text-amber-300',
      borderHover: 'hover:border-amber-500/50 hover:bg-amber-950/40',
      examples: 'SpringFest VIP, Theater Passes, Sports Derby',
    },
    {
      id: 'skills',
      title: 'Skills & Tutoring',
      description: 'Python Mentoring, Guitar Coaching, LeetCode, UI/UX in Figma',
      icon: <GraduationCap className="w-5 h-5 text-teal-400" />,
      count: 24,
      color: 'bg-teal-950/20 border-teal-900/40 text-teal-300',
      borderHover: 'hover:border-teal-500/50 hover:bg-teal-950/40',
      examples: 'Python 1-on-1, Linear Algebra, Figma Design',
    },
    {
      id: 'services',
      title: 'Student Services',
      description: 'Resume Review, Pitch Deck Design, Video Editing & Photo Shoots',
      icon: <Wrench className="w-5 h-5 text-violet-400" />,
      count: 19,
      color: 'bg-violet-950/20 border-violet-900/40 text-violet-300',
      borderHover: 'hover:border-violet-500/50 hover:bg-violet-950/40',
      examples: 'ATS Resume Polish, Club Video Reels, Tech Review',
    },
    {
      id: 'giveaways',
      title: 'Free & Giveaways',
      description: 'Move-out Dorm Starter Packs, Desk Lamps, Hangers & Organizers',
      icon: <Gift className="w-5 h-5 text-rose-400" />,
      count: listings.filter((l) => l.category === 'giveaways').length + 31,
      color: 'bg-rose-950/20 border-rose-900/40 text-rose-300',
      borderHover: 'hover:border-rose-500/50 hover:bg-rose-950/40',
      examples: 'Dorm Starter Kits, LED Lamps, Storage Bins',
    },
    {
      id: 'opportunities',
      title: 'Campus Opportunities',
      description: 'Hackathons, Paid Research Labs, Club Leadership & Workshops',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      count: 12,
      color: 'bg-cyan-950/20 border-cyan-900/40 text-cyan-300',
      borderHover: 'hover:border-cyan-500/50 hover:bg-cyan-950/40',
      examples: 'HackCampus 2026, Robotics Lab RA, UI/UX Sprint',
    },
  ];

  const featuredListings = listings.slice(0, 4);

  return (
    <div className={`space-y-12 pb-20 transition-colors ${
      themeMode === 'light' ? 'text-slate-900' : 'text-slate-100'
    }`}>
      
      {/* Real-time Campus Activity Ticker */}
      <LiveActivityTicker />

      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b ${
        themeMode === 'light' ? 'border-slate-200' : 'border-white/[0.08]'
      }`}>
        
        {/* Ambient Cosmic Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 -left-20 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Trust Banner Tag */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md shadow-lg ${
              themeMode === 'light'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-100'
                : 'bg-black/80 border-emerald-500/40 text-emerald-300 shadow-black'
            }`}>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Student Community • 100% Peer-to-Peer Exchange</span>
            </div>
          </div>

          {/* Main Headline & Subtitle with Outfit Heading Font */}
          <div className="text-center max-w-4xl mx-auto mt-6">
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              The Smarter Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">Exchange, Share & Learn</span> on Campus
            </h1>
            <p className={`mt-5 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Every campus has thousands of unused textbooks, electronics, notes, and skills. 
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold"> UniVerse Exchange</strong> connects verified students for frictionless buying, selling, borrowing, tutoring, and swaps.
            </p>
          </div>

          {/* Hero Search Bar & Action Buttons */}
          <div className="mt-9 max-w-2xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className={`backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl shadow-2xl border flex flex-col sm:flex-row items-center gap-2 transition-all ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 shadow-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                  : 'bg-neutral-950/80 border-white/[0.12] shadow-black focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/20'
              }`}
            >
              <div className="flex-1 flex items-center gap-2.5 w-full pl-3 pr-2">
                <Search className={`w-5 h-5 shrink-0 ${
                  themeMode === 'light' ? 'text-slate-500' : 'text-emerald-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search textbooks, calculators, courses, tutors, tickets..."
                  className={`w-full py-2.5 text-sm sm:text-base font-semibold bg-transparent focus:outline-none ${
                    themeMode === 'light'
                      ? 'text-slate-950 placeholder-slate-500'
                      : 'text-white placeholder-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer interactive-btn"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Explore Exchange</span>
                </button>
              </div>
            </form>

            {/* Sub-CTA & Quick Filters */}
            <div className={`mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span className={`font-semibold ${
                themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
              }`}>Quick Searches:</span>
              <button
                onClick={() => {
                  soundFX.playPop(500, 0.05);
                  triggerSearchNav('Engineering Math', 'books');
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-emerald-700'
                    : 'bg-neutral-950/90 border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-300 text-slate-300'
                }`}
              >
                📚 Math Textbooks
              </button>
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  triggerSearchNav('TI-84', 'electronics');
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-emerald-700'
                    : 'bg-neutral-950/90 border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-300 text-slate-300'
                }`}
              >
                ⚡ TI-84 Calculators
              </button>
              <button
                onClick={() => {
                  soundFX.playPop(540, 0.05);
                  triggerSearchNav('Python', 'skills');
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-emerald-700'
                    : 'bg-neutral-950/90 border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-300 text-slate-300'
                }`}
              >
                🐍 Python Tutoring
              </button>
              <button
                onClick={() => {
                  soundFX.playPop(560, 0.05);
                  triggerSearchNav('Dorm Essentials', 'giveaways');
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-emerald-700'
                    : 'bg-neutral-950/90 border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-300 text-slate-300'
                }`}
              >
                🎁 Free Dorm Essentials
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => {
                soundFX.playPop(500, 0.05);
                setCurrentPage('marketplace');
              }}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer interactive-hover border ${
                themeMode === 'light'
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-slate-200/80 hover:border-slate-400'
                  : 'bg-neutral-950/90 hover:bg-neutral-900 border-white/[0.12] text-white shadow-black hover:border-white/20'
              }`}
            >
              <span>Browse Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playPop(520, 0.05);
                setCurrentPage('requests');
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Campus Request Board</span>
            </button>

            <button
              onClick={() => {
                soundFX.playPop(650, 0.08);
                setIsCreateListingOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer interactive-btn"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>List an Item</span>
            </button>
          </div>

          {/* Live Campus Impact Statistics */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto">
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl text-center transition-colors ${
              themeMode === 'light'
                ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-200/50 hover:border-emerald-400'
                : 'bg-black/75 backdrop-blur-xl border-white/[0.08] hover:border-emerald-500/40'
            }`}>
              <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <Leaf className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {circulationMetric.totalReusedItems.toLocaleString()}+
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Items Reused on Campus
              </p>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl text-center transition-colors ${
              themeMode === 'light'
                ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-200/50 hover:border-blue-400'
                : 'bg-black/75 backdrop-blur-xl border-white/[0.08] hover:border-blue-500/40'
            }`}>
              <div className="w-9 h-9 mx-auto rounded-xl bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                ${circulationMetric.totalMoneySavedUSD.toLocaleString()}
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Saved by Students
              </p>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl text-center transition-colors ${
              themeMode === 'light'
                ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-200/50 hover:border-amber-400'
                : 'bg-black/75 backdrop-blur-xl border-white/[0.08] hover:border-amber-500/40'
            }`}>
              <div className="w-9 h-9 mx-auto rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <Gift className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {circulationMetric.totalItemsDonated}+
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Items Donated & Free
              </p>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl text-center transition-colors ${
              themeMode === 'light'
                ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-200/50 hover:border-teal-400'
                : 'bg-black/75 backdrop-blur-xl border-white/[0.08] hover:border-teal-500/40'
            }`}>
              <div className="w-9 h-9 mx-auto rounded-xl bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {circulationMetric.wastePreventedKg.toLocaleString()} kg
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Landfill Waste Prevented
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Campus Categories</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mt-1 font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              What do you want to exchange today?
            </h2>
            <p className={`text-sm mt-1 ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Browse authentic physical items, academic notes, tutoring, and opportunities.
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playPop(520, 0.05);
              setCurrentPage('marketplace');
            }}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFX.playPop(600, 0.05);
                if (cat.id === 'skills') {
                  setCurrentPage('skills');
                } else if (cat.id === 'notes') {
                  setCurrentPage('academic');
                } else if (cat.id === 'opportunities') {
                  setCurrentPage('opportunities');
                } else {
                  triggerSearchNav('', cat.id);
                }
              }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer backdrop-blur-md interactive-card ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                  : `bg-black/70 border-white/[0.08] ${cat.borderHover}`
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border shadow-sm group-hover:scale-110 transition-transform ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-neutral-950/90 border-white/[0.1]'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-['Space_Grotesk'] ${
                  themeMode === 'light'
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-neutral-950 text-slate-300 border-white/[0.08]'
                }`}>
                  {cat.count} listings
                </span>
              </div>
              <h3 className={`font-bold text-base transition-colors font-['Outfit',sans-serif] ${
                themeMode === 'light'
                  ? 'text-slate-900 group-hover:text-emerald-600'
                  : 'text-white group-hover:text-emerald-400'
              }`}>
                {cat.title}
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {cat.description}
              </p>
              <div className={`mt-3 pt-3 border-t text-[11px] italic truncate ${
                themeMode === 'light' ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-slate-500'
              }`}>
                Popular: {cat.examples}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Smart Match Recommendations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartMatchSection />
      </section>

      {/* Featured Campus Highlights with 3D Tilt Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              🔥 Trending on Campus Right Now
            </h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              High-demand textbooks, electronic gear, and peer services posted today.
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playPop(520, 0.05);
              setCurrentPage('marketplace');
            }}
            className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer font-['Space_Grotesk']"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredListings.map((item) => {
            const isSaved = savedListingIds.includes(item.id);
            return (
              <Interactive3DCard key={item.id}>
                <div className={`rounded-2xl border overflow-hidden shadow-xl transition-all flex flex-col group h-full ${
                  themeMode === 'light'
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xl'
                    : 'bg-black/80 backdrop-blur-xl border-white/[0.08] hover:shadow-emerald-950/30 hover:border-white/20'
                }`}>
                  {/* Image Container */}
                  <div
                    onClick={() => {
                      soundFX.playPop(620, 0.06);
                      setSelectedListing(item);
                    }}
                    className="relative h-44 w-full bg-slate-100 dark:bg-neutral-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border font-['Space_Grotesk'] ${
                        themeMode === 'light'
                          ? 'bg-white/90 text-slate-800 border-slate-200'
                          : 'bg-black/85 text-slate-200 border border-white/[0.1]'
                      }`}>
                        {item.category}
                      </span>
                      {item.exchangeType === 'free' || item.exchangeType === 'donate' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 font-['Space_Grotesk']">
                          FREE
                        </span>
                      ) : item.exchangeType === 'exchange' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-slate-950 font-['Space_Grotesk']">
                          SWAP
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-slate-950 font-['Space_Grotesk']">
                          {item.exchangeType}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playPop(700, 0.05);
                        toggleSaveListing(item.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 border border-rose-300 dark:border-rose-500/40 shadow-sm'
                          : themeMode === 'light'
                          ? 'bg-white/90 text-slate-600 hover:text-rose-500 border border-slate-200'
                          : 'bg-black/80 text-slate-300 hover:text-rose-400 hover:bg-neutral-900 border border-white/[0.1]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                          {item.condition !== 'na' ? `${item.condition.replace('_', ' ')} condition` : 'Skill / Service'}
                        </span>
                        <span className={`text-base font-extrabold font-['Outfit',sans-serif] ${
                          themeMode === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {item.price > 0 ? `$${item.price}` : 'Free'}
                        </span>
                      </div>
                      <h3
                        onClick={() => {
                          soundFX.playPop(620, 0.06);
                          setSelectedListing(item);
                        }}
                        className={`font-bold text-sm line-clamp-2 cursor-pointer transition-colors font-['Outfit',sans-serif] ${
                          themeMode === 'light'
                            ? 'text-slate-800 hover:text-emerald-600'
                            : 'text-slate-200 hover:text-emerald-400'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
                      themeMode === 'light' ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-slate-400'
                    }`}>
                      <div className="flex items-center gap-1.5 truncate">
                        <img
                          src={item.author.avatar}
                          alt={item.author.name}
                          className={`w-5 h-5 rounded-full object-cover border ${
                            themeMode === 'light' ? 'border-slate-200' : 'border-white/[0.15]'
                          }`}
                        />
                        <span className={`truncate ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          {item.author.name}
                        </span>
                        {item.author.verified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Interactive3DCard>
            );
          })}
        </div>
      </section>

      {/* Campus Circulation Feature Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4 font-['Space_Grotesk']">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Campus Circulation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white">
              Watch Resources Move Across Student Cohorts
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Did you know an Engineering Mathematics textbook can pass through 5 student cohorts, saving over $400 and preventing 3.2kg of waste?
              Explore our animated resource lifecycle simulator.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  soundFX.playWhoosh();
                  setCurrentPage('circulation');
                }}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer interactive-btn"
              >
                <span>Launch Circulation Simulator</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setIsVerificationModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer interactive-hover"
              >
                Verify Your Student ID
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className={`text-2xl font-extrabold font-['Outfit',sans-serif] ${
            themeMode === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            Built Exclusively for Campus Safety & Trust
          </h2>
          <p className={`text-sm mt-1 ${
            themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Safe peer handoffs, verified college credentials, and zero commercial junk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border shadow-xl flex flex-col items-start transition-all interactive-card ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 hover:border-emerald-400'
              : 'bg-black/70 backdrop-blur-md border-white/[0.08] hover:border-emerald-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-base font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Verified Student Network
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Every student profile is verified through university .edu emails or physical student IDs, ensuring you only transact with authentic peers from your college.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border shadow-xl flex flex-col items-start transition-all interactive-card ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 hover:border-blue-400'
              : 'bg-black/70 backdrop-blur-md border-white/[0.08] hover:border-blue-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-base font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Safe Campus Meetup Zones
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Exchange items securely at designated campus meeting points: the Main Library Lobby, Student Union Cafe, and Quad Study Lounges during monitored hours.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border shadow-xl flex flex-col items-start transition-all interactive-card ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 hover:border-teal-400'
              : 'bg-black/70 backdrop-blur-md border-white/[0.08] hover:border-teal-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-base font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Flexible Exchange Types
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Don’t have cash? Propose direct skill trades, book-for-book swaps, temporary borrowing for exam season, or give away dorm items you no longer use.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
