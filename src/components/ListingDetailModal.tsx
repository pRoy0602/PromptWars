import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateSmartMatches } from '../utils/smartMatchEngine';
import { soundFX } from '../utils/soundFx';
import {
  X,
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Repeat,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Share2,
  DollarSign,
  UserCheck,
  BookOpen,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ListingDetailModal: React.FC = () => {
  const {
    selectedListing,
    setSelectedListing,
    currentUser,
    listings,
    savedListingIds,
    toggleSaveListing,
    createExchangeRequest,
    setIsSafetyModalOpen,
    setCurrentPage,
    setActiveExchangeTab,
    showToast,
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [offerText, setOfferText] = useState('');
  const [cashOffer, setCashOffer] = useState<string>('');
  const [meetupLocation, setMeetupLocation] = useState(selectedListing?.location || 'Central Library Study Hub');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Find if this listing has a Smart Match score & explanation for current user
  const smartMatch = useMemo(() => {
    if (!selectedListing || selectedListing.author.id === currentUser.id) return null;
    const matches = generateSmartMatches({
      listings,
      currentUser,
      savedListingIds,
    });
    return matches.find((m) => m.listing.id === selectedListing.id) || null;
  }, [selectedListing, currentUser, listings, savedListingIds]);

  if (!selectedListing) return null;

  const isSaved = savedListingIds.includes(selectedListing.id);
  const isMyListing = selectedListing.author.id === currentUser.id;

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerText.trim()) {
      showToast('Offer Required', 'Please describe what item, skill, or service you can offer in return.', 'warning');
      return;
    }

    createExchangeRequest(
      selectedListing.id,
      offerText.trim(),
      cashOffer ? parseFloat(cashOffer) : undefined,
      meetupLocation
    );

    setIsOfferMode(false);
    setSelectedListing(null);
    setActiveExchangeTab('sent');
    setCurrentPage('exchanges');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    showToast('Report Submitted', 'Campus trust and safety team will review this listing within 2 hours.', 'info');
    setIsReportOpen(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Campus exchange link copied to clipboard!', 'success');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-black/95 w-full max-w-4xl rounded-3xl shadow-2xl border border-white/[0.12] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-neutral-950/90">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-neutral-900 text-slate-200 border border-white/[0.08] font-['Space_Grotesk']">
                {selectedListing.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-['Space_Grotesk']">
                {selectedListing.exchangeType}
              </span>
              {selectedListing.featured && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30 font-['Space_Grotesk']">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                title="Share Listing"
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-neutral-900 rounded-full transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSaveListing(selectedListing.id)}
                title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isSaved ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-rose-400 hover:bg-neutral-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-neutral-900 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-6 space-y-3">
                <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/[0.08] relative">
                  <img
                    src={selectedListing.images[activeImageIdx] || selectedListing.images[0]}
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedListing.price > 0 ? (
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/90 text-white backdrop-blur-sm text-lg font-extrabold font-['Space_Grotesk'] border border-white/[0.1]">
                      ${selectedListing.price}
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-sm font-extrabold uppercase tracking-wider font-['Space_Grotesk']">
                      100% Free / Donation
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedListing.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {selectedListing.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeImageIdx === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/[0.08] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Smart Match Breakdown Card */}
                {smartMatch && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/70 via-black/80 to-purple-950/40 border border-purple-500/40 text-xs shadow-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-extrabold text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>Smart Match Analysis</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                        {smartMatch.score}% Fit
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-purple-900/60 text-purple-200 border border-purple-500/30">
                      <Repeat className="w-3 h-3 text-purple-300" />
                      <span>{smartMatch.primaryReason}</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed">
                      {smartMatch.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                          <span>{r.detail}</span>
                        </div>
                      ))}
                    </div>

                    {smartMatch.mutualExchangeDetails && (
                      <button
                        onClick={() => {
                          soundFX.playSparkle();
                          setOfferText(smartMatch.mutualExchangeDetails?.suggestedOfferText || '');
                          setIsOfferMode(true);
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Apply Suggested 2-Way Trade Offer</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Preferred Exchange Note */}
                {selectedListing.preferredExchangeItem && (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Seller's Trade Preference:</span>
                    </div>
                    <p className="leading-relaxed text-slate-300">{selectedListing.preferredExchangeItem}</p>
                  </div>
                )}

                {/* Safe Campus Exchange Guarantee */}
                <div className="p-4 rounded-2xl bg-neutral-950/90 border border-white/[0.08] text-slate-300 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Campus Safety Protocols
                    </span>
                    <button
                      onClick={() => setIsSafetyModalOpen(true)}
                      className="text-[11px] text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                    >
                      Safe Zones
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Always meet in well-lit public campus locations (Library, Student Union, Department Lounges). Never share passwords or off-campus payment links.
                  </p>
                </div>
              </div>

              {/* Right Column: Listing Details & Seller Profile */}
              <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
                <div>
                  
                  {/* Condition & Date */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400 uppercase tracking-wide">
                      Condition: {selectedListing.condition !== 'na' ? selectedListing.condition.replace('_', ' ') : 'Skill / Peer Service'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {selectedListing.createdAt}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2 font-['Outfit',sans-serif] leading-tight">
                    {selectedListing.title}
                  </h1>

                  {/* Location Chip */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-950 border border-white/[0.08] text-slate-300 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedListing.location}</span>
                    </div>
                    <span className="text-xs text-slate-500">({selectedListing.campusZone})</span>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-['Space_Grotesk']">
                      About this Resource
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedListing.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedListing.tags && selectedListing.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {selectedListing.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-neutral-950 text-slate-300 text-[11px] font-medium border border-white/[0.08]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Seller / Student Card */}
                  <div className="mt-6 p-4 rounded-2xl bg-neutral-950/90 border border-white/[0.08] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedListing.author.avatar}
                        alt={selectedListing.author.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-white font-['Outfit',sans-serif]">{selectedListing.author.name}</h4>
                          {selectedListing.author.verified && (
                            <span
                              title={selectedListing.author.verifiedBadgeText || 'Verified Student'}
                              className="bg-emerald-500 text-slate-950 rounded-full p-0.5"
                            >
                              <ShieldCheck className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{selectedListing.author.department}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="text-amber-400 font-semibold">⭐ {selectedListing.author.rating} ({selectedListing.author.reviewCount} reviews)</span>
                          <span>•</span>
                          <span>{selectedListing.author.itemsReusedCount} reused</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exchange Proposal Form / Action Buttons */}
                <div className="pt-4 border-t border-white/[0.08]">
                  {isMyListing ? (
                    <div className="p-3 bg-neutral-950 rounded-xl text-center text-xs text-slate-300 font-medium border border-white/[0.08]">
                      This is your listing. Manage requests for this item in the <strong>Exchanges Hub</strong>.
                    </div>
                  ) : isOfferMode ? (
                    <form onSubmit={handleSubmitOffer} className="space-y-3 bg-neutral-950/95 p-4 rounded-2xl border border-white/[0.1]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-['Space_Grotesk']">
                          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Propose Resource Exchange</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsOfferMode(false)}
                          className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          What can you offer in exchange? *
                        </label>
                        <textarea
                          rows={2}
                          value={offerText}
                          onChange={(e) => setOfferText(e.target.value)}
                          placeholder="e.g. I have a Data Structures textbook, or I can offer 2 hrs of Python tutoring / design help!"
                          className="w-full p-2.5 text-xs bg-black text-slate-100 rounded-xl border border-white/[0.1] focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Optional Cash Add-on ($)
                          </label>
                          <input
                            type="number"
                            value={cashOffer}
                            onChange={(e) => setCashOffer(e.target.value)}
                            placeholder="0"
                            className="w-full p-2 text-xs bg-black text-slate-100 rounded-xl border border-white/[0.1] focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Preferred Meetup Spot
                          </label>
                          <input
                            type="text"
                            value={meetupLocation}
                            onChange={(e) => setMeetupLocation(e.target.value)}
                            placeholder="Library 2nd Floor"
                            className="w-full p-2 text-xs bg-black text-slate-100 rounded-xl border border-white/[0.1] focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer interactive-btn"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Exchange Proposal</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setIsOfferMode(true)}
                          className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer interactive-btn"
                        >
                          <Repeat className="w-4 h-4" />
                          <span>Request Exchange</span>
                        </button>
                        <button
                          onClick={() => {
                            createExchangeRequest(
                              selectedListing.id,
                              `Direct inquiry regarding "${selectedListing.title}"`
                            );
                            setSelectedListing(null);
                            setActiveExchangeTab('sent');
                            setCurrentPage('exchanges');
                          }}
                          className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-white/[0.1] cursor-pointer interactive-btn"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Message Student</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setIsReportOpen(!isReportOpen)}
                          className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Report Listing</span>
                        </button>
                        <span className="text-[11px] text-slate-500">
                          {selectedListing.viewsCount} campus views • {selectedListing.savedCount} saved
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Report Form Dropdown */}
                  {isReportOpen && (
                    <form onSubmit={handleReportSubmit} className="mt-3 p-3 bg-rose-950/40 rounded-xl border border-rose-500/30 text-xs space-y-2">
                      <label className="block font-semibold text-rose-200">
                        Why are you reporting this item?
                      </label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full p-2 bg-black border border-rose-500/40 text-slate-100 rounded-lg text-xs focus:outline-none"
                        required
                      >
                        <option value="">Select a reason</option>
                        <option value="spam">Spam or commercial seller</option>
                        <option value="inappropriate">Prohibited or inappropriate item</option>
                        <option value="fake">Fake verification or student ID</option>
                        <option value="unresponsive">Unresponsive seller</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsReportOpen(false)}
                          className="px-2.5 py-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-rose-500 text-slate-950 font-bold rounded-lg hover:bg-rose-400 cursor-pointer"
                        >
                          Submit Report
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
