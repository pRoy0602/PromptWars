import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SmartMatchResult, SmartMatchBadge } from '../types';
import { generateSmartMatches } from '../utils/smartMatchEngine';
import { soundFX } from '../utils/soundFx';
import { Interactive3DCard } from './Interactive3DCard';
import {
  Sparkles,
  Repeat,
  Heart,
  ShieldCheck,
  MapPin,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  Bookmark,
  Search,
  Zap,
  Tag,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartMatchSectionProps {
  onOpenExchangeModal?: (listingId: string, initialOfferText?: string) => void;
  compact?: boolean;
}

export const SmartMatchSection: React.FC<SmartMatchSectionProps> = ({
  onOpenExchangeModal,
  compact = false,
}) => {
  const {
    listings,
    currentUser,
    savedListingIds,
    toggleSaveListing,
    setSelectedListing,
    filters,
    createExchangeRequest,
    setActiveExchangeTab,
    setCurrentPage,
    showToast,
    themeMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [selectedMatchForSwap, setSelectedMatchForSwap] = useState<SmartMatchResult | null>(null);
  const [quickOfferNote, setQuickOfferNote] = useState('');

  // Generate Smart Matches dynamically based on current user state
  const allMatches = useMemo(() => {
    return generateSmartMatches({
      listings,
      currentUser,
      savedListingIds,
      searchQuery: filters.searchQuery,
    });
  }, [listings, currentUser, savedListingIds, filters.searchQuery]);

  // Filtered by selected tab
  const filteredMatches = useMemo(() => {
    if (activeTab === 'all') return allMatches;
    if (activeTab === 'mutual') return allMatches.filter((m) => m.isMutualExchange);
    if (activeTab === 'dept') return allMatches.filter((m) => m.departmentMatch);
    if (activeTab === 'saved') return allMatches.filter((m) => Boolean(m.savedItemMatch));
    if (activeTab === 'interests') return allMatches.filter((m) => m.primaryReason === 'Matches your interests');
    return allMatches;
  }, [allMatches, activeTab]);

  const mutualMatchesCount = allMatches.filter((m) => m.isMutualExchange).length;
  const topMutualMatch = allMatches.find((m) => m.isMutualExchange);

  // Badge styling helper
  const getBadgeStyle = (badge: SmartMatchBadge) => {
    const isLight = themeMode === 'light';
    switch (badge) {
      case 'You have something they may want':
        return {
          bg: isLight
            ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
            : 'bg-purple-950/80 text-purple-200 border-purple-500/40',
          text: isLight ? 'text-purple-700' : 'text-purple-300',
          indicator: 'bg-purple-500',
          icon: <Repeat className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-300'}`} />,
        };
      case 'Similar to your saved items':
        return {
          bg: isLight
            ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
            : 'bg-amber-950/80 text-amber-200 border-amber-500/40',
          text: isLight ? 'text-amber-700' : 'text-amber-300',
          indicator: 'bg-amber-500',
          icon: <Bookmark className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-300'}`} />,
        };
      case 'Popular in your department':
        return {
          bg: isLight
            ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
            : 'bg-blue-950/80 text-blue-200 border-blue-500/40',
          text: isLight ? 'text-blue-700' : 'text-blue-300',
          indicator: 'bg-blue-500',
          icon: <GraduationCap className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-300'}`} />,
        };
      case 'Matches your interests':
      default:
        return {
          bg: isLight
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
            : 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40',
          text: isLight ? 'text-emerald-700' : 'text-emerald-300',
          indicator: 'bg-emerald-500',
          icon: <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-300'}`} />,
        };
    }
  };

  const handleProposeSmartSwap = (match: SmartMatchResult) => {
    soundFX.playSparkle();
    const suggestedText =
      match.mutualExchangeDetails?.suggestedOfferText ||
      `Hi ${match.listing.author.name.split(' ')[0]}! I would love to trade for your "${match.listing.title}". I have academic resources and skills available in exchange!`;

    if (onOpenExchangeModal) {
      onOpenExchangeModal(match.listing.id, suggestedText);
    } else {
      setSelectedMatchForSwap(match);
      setQuickOfferNote(suggestedText);
    }
  };

  const handleConfirmQuickSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForSwap) return;
    soundFX.playSuccess();
    createExchangeRequest(
      selectedMatchForSwap.listing.id,
      quickOfferNote.trim(),
      undefined,
      'Campus Library Safe Exchange Hub'
    );
    setSelectedMatchForSwap(null);
    showToast(
      'Smart Match Swap Proposed!',
      `Sent exchange proposal to ${selectedMatchForSwap.listing.author.name}.`,
      'success'
    );
    setActiveExchangeTab('sent');
    setCurrentPage('exchanges');
  };

  if (allMatches.length === 0) {
    return null;
  }

  return (
    <div className="relative space-y-6">
      
      {/* Smart Match Header Card */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
        themeMode === 'light'
          ? 'bg-gradient-to-br from-amber-500/10 via-slate-50 to-emerald-500/10 border-amber-500/30 shadow-xl shadow-amber-500/5'
          : 'bg-gradient-to-br from-purple-950/40 via-black/80 to-emerald-950/40 border-purple-500/30 shadow-2xl shadow-purple-950/20 backdrop-blur-xl'
      }`}>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/25">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Smart Match™ Engine</span>
              </span>

              {mutualMatchesCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40">
                  <Repeat className="w-3 h-3 text-purple-400" />
                  <span>{mutualMatchesCount} 2-Way Match{mutualMatchesCount > 1 ? 'es' : ''}</span>
                </span>
              )}
            </div>

            <h2 className={`text-xl sm:text-2xl font-extrabold mt-2 font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Best Matches For You
            </h2>

            <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Personalized exchange recommendations analyzed from your listings, saved items, search history, and department circulation.
            </p>
          </div>

          {/* Engine Parameters & Explanations Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playPop(520, 0.05);
                setShowExplanationModal(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm'
                  : 'bg-neutral-950/90 text-slate-300 border-white/[0.1] hover:text-white hover:border-white/20'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>How Smart Match Works</span>
            </button>
          </div>
        </div>

        {/* Filter Sub-Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              soundFX.playPop(500, 0.04);
              setActiveTab('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                : themeMode === 'light'
                ? 'bg-white/80 text-slate-700 border-slate-300 hover:bg-white'
                : 'bg-black/60 text-slate-300 border-white/[0.08] hover:bg-neutral-900'
            }`}
          >
            All Recommendations ({allMatches.length})
          </button>

          {mutualMatchesCount > 0 && (
            <button
              onClick={() => {
                soundFX.playPop(520, 0.05);
                setActiveTab('mutual');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mutual'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                  : themeMode === 'light'
                  ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                  : 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-purple-400" />
              <span>2-Way Mutual Swaps ({mutualMatchesCount})</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFX.playPop(520, 0.05);
              setActiveTab('dept');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dept'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                : themeMode === 'light'
                ? 'bg-white/80 text-slate-700 border-slate-300 hover:bg-white'
                : 'bg-black/60 text-slate-300 border-white/[0.08] hover:bg-neutral-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Popular in {currentUser.department.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPop(520, 0.05);
              setActiveTab('saved');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                : themeMode === 'light'
                ? 'bg-white/80 text-slate-700 border-slate-300 hover:bg-white'
                : 'bg-black/60 text-slate-300 border-white/[0.08] hover:bg-neutral-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Similar to Saved</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPop(520, 0.05);
              setActiveTab('interests');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interests'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                : themeMode === 'light'
                ? 'bg-white/80 text-slate-700 border-slate-300 hover:bg-white'
                : 'bg-black/60 text-slate-300 border-white/[0.08] hover:bg-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Matches Your Interests</span>
          </button>
        </div>
      </div>

      {/* Featured 2-Way Mutual Swap Spotlight Banner (If Available) */}
      {topMutualMatch && activeTab === 'all' && (
        <div className={`p-5 rounded-3xl border transition-all ${
          themeMode === 'light'
            ? 'bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-50 border-purple-300 shadow-lg'
            : 'bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-black/80 border-purple-500/40 shadow-2xl backdrop-blur-xl'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <Repeat className="w-6 h-6 animate-spin" style={{ animationDuration: '14s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500 text-white">
                    High-Potential 2-Way Exchange
                  </span>
                  <span className="text-xs font-bold text-purple-400 font-['Space_Grotesk']">
                    {topMutualMatch.score}% Match Confidence
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-extrabold mt-1 font-['Outfit',sans-serif] ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  Mutual Barter Opportunity with {topMutualMatch.listing.author.name}
                </h3>
                <p className={`text-xs mt-0.5 leading-relaxed ${
                  themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  They are looking for <strong className="text-purple-400 font-semibold">{topMutualMatch.listing.preferredExchangeItem}</strong>, and you offer <strong className="text-emerald-400 font-semibold">{topMutualMatch.mutualExchangeDetails?.userListingTitle}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  soundFX.playPop(600, 0.05);
                  setSelectedListing(topMutualMatch.listing);
                }}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                    : 'bg-black/70 text-slate-200 border-white/[0.1] hover:text-white hover:bg-neutral-900'
                }`}
              >
                Inspect Listing
              </button>
              <button
                onClick={() => handleProposeSmartSwap(topMutualMatch)}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Propose 1-Click Swap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Recommended Matches */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-5`}>
        {filteredMatches.map((match) => {
          const isSaved = savedListingIds.includes(match.listing.id);
          const badgeStyle = getBadgeStyle(match.primaryReason);

          return (
            <Interactive3DCard key={match.listing.id}>
              <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group h-full ${
                themeMode === 'light'
                  ? 'bg-white/90 border-slate-200 hover:border-purple-400/50 hover:shadow-purple-500/10'
                  : 'bg-black/80 border-white/[0.08] hover:border-purple-500/40 hover:shadow-purple-950/30 backdrop-blur-xl'
              }`}>
                
                {/* Image Container */}
                <div
                  onClick={() => {
                    soundFX.playPop(620, 0.06);
                    setSelectedListing(match.listing);
                  }}
                  className="relative h-44 w-full bg-neutral-950 cursor-pointer overflow-hidden"
                >
                  <img
                    src={match.listing.images[0]}
                    alt={match.listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />

                  {/* Match Confidence Score Pill */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[11px] font-extrabold font-['Space_Grotesk'] flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{match.score}% Match</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/85 text-slate-200 backdrop-blur-sm border border-white/[0.1] font-['Space_Grotesk']">
                      {match.listing.category}
                    </span>
                    {match.listing.price === 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 font-['Space_Grotesk']">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  {match.listing.price > 0 ? (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/90 text-white backdrop-blur-md text-xs font-bold font-['Space_Grotesk'] border border-white/[0.1]">
                      ${match.listing.price}
                    </div>
                  ) : (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 backdrop-blur-md text-[11px] font-bold font-['Space_Grotesk'] border border-emerald-500/30">
                      Zero Cost Trade
                    </div>
                  )}

                  {/* Save Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playPop(700, 0.05);
                      toggleSaveListing(match.listing.id);
                    }}
                    title={isSaved ? 'Remove from Saved' : 'Save Item'}
                    className={`absolute bottom-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                        : 'bg-black/60 text-slate-300 hover:text-white border border-white/[0.1]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    
                    {/* Primary Reason Label (Explicit Requirement) */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border mb-2 ${badgeStyle.bg}`}>
                      {badgeStyle.icon}
                      <span className="tracking-tight">{match.primaryReason}</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => {
                        soundFX.playPop(620, 0.06);
                        setSelectedListing(match.listing);
                      }}
                      className={`font-bold text-sm line-clamp-2 cursor-pointer hover:text-purple-400 transition-colors font-['Outfit',sans-serif] leading-snug ${
                        themeMode === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {match.listing.title}
                    </h3>

                    {/* Explanatory Snippet Callout */}
                    <div className={`mt-2 p-2.5 rounded-xl border text-[11px] leading-relaxed space-y-1 ${
                      themeMode === 'light'
                        ? 'bg-purple-50/70 border-purple-200/80 text-slate-700'
                        : 'bg-purple-950/20 border-purple-500/20 text-slate-300'
                    }`}>
                      {match.reasons.slice(0, 2).map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                          <span>{r.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Info & Actions */}
                  <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">{match.listing.campusZone}</span>
                      </span>
                      <span className="truncate max-w-[100px] text-right font-medium">
                        by {match.listing.author.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFX.playPop(600, 0.05);
                          setSelectedListing(match.listing);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          themeMode === 'light'
                            ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            : 'bg-neutral-950 text-slate-300 border-white/[0.1] hover:text-white hover:border-white/20'
                        }`}
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => handleProposeSmartSwap(match)}
                        title="Propose Trade"
                        className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Swap</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Interactive3DCard>
          );
        })}
      </div>

      {/* Quick Swap Proposal Modal */}
      <AnimatePresence>
        {selectedMatchForSwap && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-black/95 border-purple-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold font-['Outfit',sans-serif]">
                      Propose Smart Match Swap
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Sending proposal to {selectedMatchForSwap.listing.author.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMatchForSwap(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Matched Exchange Breakdown */}
              <div className="my-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-purple-300">
                  <span>Target Resource:</span>
                  <span className="text-slate-200">{selectedMatchForSwap.listing.title}</span>
                </div>
                {selectedMatchForSwap.mutualExchangeDetails && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Your Matching Resource:</span>
                    <span className="text-emerald-400 font-semibold">
                      {selectedMatchForSwap.mutualExchangeDetails.userListingTitle}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-purple-500/20 text-[11px] text-slate-400">
                  Author's note: "{selectedMatchForSwap.listing.preferredExchangeItem || 'Open to fair peer trade'}"
                </div>
              </div>

              <form onSubmit={handleConfirmQuickSwap} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Your Exchange Message / Offer Description:
                  </label>
                  <textarea
                    rows={4}
                    value={quickOfferNote}
                    onChange={(e) => setQuickOfferNote(e.target.value)}
                    required
                    className={`w-full p-3 rounded-2xl text-xs sm:text-sm border outline-none focus:ring-2 focus:ring-purple-500/30 ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-neutral-950 border-white/[0.1] text-slate-100 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMatchForSwap(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Send Trade Proposal</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* How Smart Match Works Modal */}
      <AnimatePresence>
        {showExplanationModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-xl rounded-3xl border shadow-2xl p-6 relative ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                  : 'bg-black/95 border-purple-500/40 text-slate-100'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                themeMode === 'light' ? 'border-slate-200' : 'border-white/[0.08]'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${
                    themeMode === 'light'
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-extrabold font-['Outfit',sans-serif] ${
                      themeMode === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      How UniVerse Smart Match Works
                    </h3>
                    <p className={`text-xs ${
                      themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Zero-cloud, privacy-first peer-to-peer recommendation engine
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                    themeMode === 'light'
                      ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="my-5 space-y-4 text-xs leading-relaxed">
                <div className={`p-3.5 rounded-2xl border ${
                  themeMode === 'light'
                    ? 'bg-purple-50 border-purple-200 text-slate-700'
                    : 'bg-purple-950/30 border-purple-500/30 text-slate-300'
                }`}>
                  <div className={`font-extrabold text-sm flex items-center gap-1.5 mb-1 ${
                    themeMode === 'light' ? 'text-purple-800' : 'text-purple-300'
                  }`}>
                    <Repeat className="w-4 h-4" />
                    <span>1. 2-Way Mutual Exchange Detection</span>
                  </div>
                  <p>
                    Identifies bilateral swaps where another student is seeking something you have listed (e.g. your CS341 Web Dev study pack), while offering an item or skill you desire.
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  themeMode === 'light'
                    ? 'bg-blue-50 border-blue-200 text-slate-700'
                    : 'bg-blue-950/30 border-blue-500/30 text-slate-300'
                }`}>
                  <div className={`font-extrabold text-sm flex items-center gap-1.5 mb-1 ${
                    themeMode === 'light' ? 'text-blue-800' : 'text-blue-300'
                  }`}>
                    <GraduationCap className="w-4 h-4" />
                    <span>2. Department & Academic Graph</span>
                  </div>
                  <p>
                    Weights resources popular among <strong className={themeMode === 'light' ? 'text-blue-700' : 'text-blue-300'}>{currentUser.department}</strong> students, matching course codes, lab gear, and mid-term exam seasons.
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  themeMode === 'light'
                    ? 'bg-amber-50 border-amber-200 text-slate-700'
                    : 'bg-amber-950/30 border-amber-500/30 text-slate-300'
                }`}>
                  <div className={`font-extrabold text-sm flex items-center gap-1.5 mb-1 ${
                    themeMode === 'light' ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <Bookmark className="w-4 h-4" />
                    <span>3. Saved Items Similarity & Complements</span>
                  </div>
                  <p>
                    Recommends items that complement what you've bookmarked (e.g., graphing calculators, companion manuals, lab safety gear).
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  themeMode === 'light'
                    ? 'bg-emerald-50 border-emerald-200 text-slate-700'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-slate-300'
                }`}>
                  <div className={`font-extrabold text-sm flex items-center gap-1.5 mb-1 ${
                    themeMode === 'light' ? 'text-emerald-800' : 'text-emerald-300'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>4. Real-time Search Interest Adaptability</span>
                  </div>
                  <p>
                    Adjusts match weights in real-time as you filter, search, and navigate across campus marketplace categories.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
                >
                  Got It, Explore Matches
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
