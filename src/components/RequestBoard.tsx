import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, RequestUrgency, ItemRequest, RequestOffer } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';
import { soundFX } from '../utils/soundFx';
import {
  Search,
  PlusCircle,
  Sparkles,
  Zap,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  Heart,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  Repeat,
  Share2,
  Trash2,
  Book,
  Laptop,
  GraduationCap,
  Wrench,
  Gift,
  Ticket,
  FileText,
  Compass,
  Send,
  X,
  UserCheck,
  Flame,
} from 'lucide-react';

export const RequestBoard: React.FC = () => {
  const {
    itemRequests,
    addItemRequest,
    addOfferToRequest,
    toggleUpvoteRequest,
    markRequestFulfilled,
    deleteItemRequest,
    openCreateRequestModal,
    currentUser,
    isAuthenticated,
    openAuthModal,
    listings,
    showToast,
    themeMode,
    setCurrentPage,
  } = useApp();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<RequestUrgency | 'all'>('all');
  const [statusTab, setStatusTab] = useState<'all' | 'urgent' | 'my' | 'fulfilled'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'budget'>('newest');
  
  // Active offer modal/drawer
  const [activeOfferRequestId, setActiveOfferRequestId] = useState<string | null>(null);
  const [offerText, setOfferText] = useState('');
  const [offerTerms, setOfferTerms] = useState('');
  const [selectedMyListingId, setSelectedMyListingId] = useState<string>('');
  const [expandedOffersRequestId, setExpandedOffersRequestId] = useState<string | null>(null);

  const categories: { id: ResourceCategory | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'books', label: 'Books & Textbooks', icon: <Book className="w-3.5 h-3.5" /> },
    { id: 'electronics', label: 'Electronics & Calculators', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Notes & Study Materials', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Lab Gear & Tools', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'giveaways', label: 'Dorm Essentials', icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills & Tutoring', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'tickets', label: 'Event Tickets', icon: <Ticket className="w-3.5 h-3.5" /> },
  ];

  // User's own listings for quick linking
  const myListings = useMemo(() => {
    return listings.filter((l) => l.author.id === currentUser.id && l.status === 'active');
  }, [listings, currentUser.id]);

  // Filtered & Sorted Requests
  const filteredRequests = useMemo(() => {
    return itemRequests
      .filter((req) => {
        // Status Tab
        if (statusTab === 'urgent' && req.urgency !== 'urgent' && req.urgency !== 'high') {
          return false;
        }
        if (statusTab === 'my' && req.author.id !== currentUser.id) {
          return false;
        }
        if (statusTab === 'fulfilled' && req.status !== 'fulfilled') {
          return false;
        }
        if (statusTab !== 'fulfilled' && req.status === 'fulfilled') {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = req.title.toLowerCase().includes(q);
          const matchDesc = req.description.toLowerCase().includes(q);
          const matchCourse = req.courseCode?.toLowerCase().includes(q);
          const matchAuthor = req.author.name.toLowerCase().includes(q);
          const matchTags = req.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCourse && !matchAuthor && !matchTags) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'all' && req.category !== selectedCategory) {
          return false;
        }

        // Urgency Filter
        if (selectedUrgency !== 'all' && req.urgency !== selectedUrgency) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upvotes') {
          return b.upvotes - a.upvotes;
        }
        if (sortBy === 'budget') {
          return (b.maxBudget || 0) - (a.maxBudget || 0);
        }
        // newest
        return b.id.localeCompare(a.id);
      });
  }, [itemRequests, searchQuery, selectedCategory, selectedUrgency, statusTab, sortBy, currentUser.id]);

  // Statistics
  const totalOpenRequests = itemRequests.filter((r) => r.status === 'open').length;
  const urgentCount = itemRequests.filter((r) => r.status === 'open' && (r.urgency === 'urgent' || r.urgency === 'high')).length;
  const totalFulfilled = itemRequests.filter((r) => r.status === 'fulfilled').length;
  const myRequestsCount = itemRequests.filter((r) => r.author.id === currentUser.id).length;

  const handleOpenOfferModal = (req: ItemRequest) => {
    if (!isAuthenticated) {
      showToast('Sign In Required', 'Please sign in to offer items to fellow students.', 'info');
      openAuthModal('login');
      return;
    }
    soundFX.playPop(520, 0.05);
    setActiveOfferRequestId(req.id);
    setOfferText('');
    setOfferTerms(req.budgetDisplay || '');
    setSelectedMyListingId('');
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferRequestId) return;

    if (!offerText.trim()) {
      showToast('Missing Details', 'Please describe what you have and how to meet up.', 'warning');
      return;
    }

    const linkedListing = listings.find((l) => l.id === selectedMyListingId);

    addOfferToRequest(activeOfferRequestId, {
      offerText: offerText.trim(),
      priceOrTradeTerms: offerTerms.trim() || 'Open to discuss',
      listingId: linkedListing?.id,
    });

    soundFX.playSuccess();
    setActiveOfferRequestId(null);
    setOfferText('');
    setOfferTerms('');
  };

  const handleShareRequest = (req: ItemRequest) => {
    soundFX.playPop(600, 0.04);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this campus request on UniVerse Exchange: "${req.title}" needed by ${req.author.name} (${req.courseCode || req.category})!`
      );
      showToast('Link Copied!', 'Request details copied to clipboard.', 'success');
    } else {
      showToast('Request Shared', `"${req.title}"`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* ---------------------------------------------------- */}
      {/* HERO BANNER & STATS BAR                             */}
      {/* ---------------------------------------------------- */}
      <div className={`relative rounded-3xl p-6 sm:p-8 md:p-10 border overflow-hidden shadow-2xl transition-all ${
        themeMode === 'light'
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 border-amber-200/80'
          : 'bg-gradient-to-br from-amber-950/30 via-neutral-950 to-neutral-900 border-amber-500/20'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-['Space_Grotesk']">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>Campus Wishlist & Wanted Board</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Can&apos;t find what you need? <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Post a Request & Peers Will Find It.
              </span>
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Looking for a specific calculator, course textbook, lab coat, or presentation adapter?
              Post an item request and let students living in your dorm or department lend, sell, or trade with you.
            </p>

            {/* Quick Stats Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  : 'bg-neutral-900/90 border-white/[0.08] text-slate-200'
              }`}>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{totalOpenRequests} Active Wanted Posts</span>
              </div>

              <div className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-rose-700 shadow-sm'
                  : 'bg-neutral-900/90 border-white/[0.08] text-rose-400'
              }`}>
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>{urgentCount} Urgent Needs (24h)</span>
              </div>

              <div className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-emerald-700 shadow-sm'
                  : 'bg-neutral-900/90 border-white/[0.08] text-emerald-400'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{totalFulfilled} Fulfilled on Campus</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => {
                soundFX.playPop(550, 0.05);
                openCreateRequestModal();
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Post an Item Request</span>
            </button>

            <button
              onClick={() => {
                soundFX.playPop(500, 0.03);
                setCurrentPage('marketplace');
              }}
              className={`px-5 py-3.5 rounded-2xl border font-bold text-xs cursor-pointer transition-all text-center ${
                themeMode === 'light'
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.1] text-slate-300'
              }`}
            >
              Browse Available Items
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SEARCH, STATUS TABS & CATEGORY FILTERS               */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        
        {/* Top Filter Bar: Search + Status Tabs + Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 ${
              themeMode === 'light' ? 'text-slate-500' : 'text-amber-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wanted items by title, course code (e.g. MATH 220), keywords, or student..."
              className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm font-semibold outline-none transition-all ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 text-slate-950 placeholder-slate-500 focus:border-amber-500 shadow-sm'
                  : 'bg-neutral-950/95 border-white/[0.18] text-white placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className={`flex items-center p-1 rounded-2xl border shrink-0 overflow-x-auto ${
            themeMode === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-neutral-950 border-white/[0.08]'
          }`}>
            {[
              { id: 'all', label: 'All Open', count: totalOpenRequests },
              { id: 'urgent', label: '🔥 Urgent', count: urgentCount },
              { id: 'my', label: 'My Requests', count: myRequestsCount },
              { id: 'fulfilled', label: '✅ Fulfilled Archive', count: totalFulfilled },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusTab(tab.id as any);
                  soundFX.playPop(520, 0.03);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : themeMode === 'light'
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                  statusTab === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-500/15 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-bold hidden sm:inline ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  : 'bg-neutral-950 border-white/[0.08] text-slate-200'
              }`}
            >
              <option value="newest" className={themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-neutral-900 text-white'}>
                Recently Requested
              </option>
              <option value="upvotes" className={themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-neutral-900 text-white'}>
                Most Upvoted (+1s)
              </option>
              <option value="budget" className={themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-neutral-900 text-white'}>
                Highest Budget
              </option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundFX.playPop(500, 0.03);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/40 shadow-sm'
                  : themeMode === 'light'
                  ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                  : 'bg-neutral-950 border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* REQUESTS LIST / CARDS GRID                          */}
      {/* ---------------------------------------------------- */}
      {filteredRequests.length === 0 ? (
        /* Empty State */
        <div className={`p-10 sm:p-14 rounded-3xl border text-center max-w-lg mx-auto space-y-4 shadow-xl ${
          themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-neutral-950 border-white/[0.08]'
        }`}>
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold font-['Outfit',sans-serif]">No item requests found</h3>
          <p className={`text-xs leading-relaxed ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            {searchQuery
              ? `No requests match "${searchQuery}". Be the first to post a wanted listing for this item!`
              : 'No items currently in this filter. If you need something for your classes or dorm, post a request now!'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-slate-300 border-white/[0.1]'
                }`}
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => openCreateRequestModal({ title: searchQuery || undefined })}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post This Request</span>
            </button>
          </div>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => {
            const isUpvotedByMe = req.upvotedBy.includes(currentUser.id);
            const isMyRequest = req.author.id === currentUser.id;
            const hasOffers = req.offers && req.offers.length > 0;
            const isOffersExpanded = expandedOffersRequestId === req.id;

            return (
              <div
                key={req.id}
                className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between group ${
                  req.status === 'fulfilled'
                    ? themeMode === 'light'
                      ? 'bg-slate-100/80 border-slate-300 opacity-90'
                      : 'bg-neutral-950/60 border-white/[0.06] opacity-85'
                    : req.urgency === 'urgent'
                    ? themeMode === 'light'
                      ? 'bg-white border-rose-300 ring-1 ring-rose-500/20 hover:border-rose-400'
                      : 'bg-neutral-950 border-rose-500/40 ring-1 ring-rose-500/20 hover:border-rose-500/60'
                    : themeMode === 'light'
                    ? 'bg-white border-slate-200 hover:border-amber-400/80 hover:shadow-amber-500/10'
                    : 'bg-neutral-950 border-white/[0.08] hover:border-amber-500/40 hover:shadow-amber-950/20'
                }`}
              >
                {/* Card Top Section */}
                <div className="space-y-3.5">
                  
                  {/* Badges & Urgency Bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Urgency Badge */}
                      {req.urgency === 'urgent' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 font-['Space_Grotesk'] animate-pulse">
                          <Flame className="w-3 h-3" />
                          <span>Urgent (24h)</span>
                        </span>
                      ) : req.urgency === 'high' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-['Space_Grotesk']">
                          <Zap className="w-3 h-3" />
                          <span>This Week</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-['Space_Grotesk']">
                          <Clock className="w-3 h-3" />
                          <span>{req.urgency}</span>
                        </span>
                      )}

                      {/* Course Code Badge */}
                      {req.courseCode && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-['Space_Grotesk']">
                          {req.courseCode}
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        themeMode === 'light'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-neutral-900 text-slate-300 border-white/[0.08]'
                      }`}>
                        {req.category}
                      </span>
                    </div>

                    {/* Status Badge or Timestamp */}
                    {req.status === 'fulfilled' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Fulfilled</span>
                      </span>
                    ) : (
                      <span className={`text-[11px] ${themeMode === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {req.createdAt}
                      </span>
                    )}
                  </div>

                  {/* Title & Reference Photo */}
                  <div className="flex items-start gap-3 justify-between">
                    <div className="space-y-1">
                      <h3 className={`text-base font-extrabold font-['Outfit',sans-serif] group-hover:text-amber-500 transition-colors leading-snug ${
                        themeMode === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {req.title}
                      </h3>
                      <p className={`text-xs line-clamp-3 leading-relaxed ${
                        themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        {req.description}
                      </p>
                    </div>

                    {/* Reference Thumbnail */}
                    {req.referenceImage && (
                      <img
                        src={req.referenceImage}
                        alt={req.title}
                        className="w-14 h-14 rounded-2xl object-cover bg-neutral-900 shrink-0 border border-white/[0.1] shadow-md"
                      />
                    )}
                  </div>

                  {/* Budget & Timeline Highlights */}
                  <div className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Budget / Terms:</span>
                      </span>
                      <span className={`font-extrabold truncate ${
                        themeMode === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {req.budgetDisplay || 'Open to offers'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-1 ${
                        themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Needed By:</span>
                      </span>
                      <span className={`font-semibold truncate ${
                        themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
                      }`}>
                        {req.neededByDate || 'Flexible'}
                      </span>
                    </div>

                    {req.locationPreference && (
                      <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-200/60 dark:border-white/[0.04]">
                        <span className={`flex items-center gap-1 ${
                          themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Campus Zone:</span>
                        </span>
                        <span className={`font-medium truncate max-w-[170px] ${
                          themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
                        }`}>
                          {req.locationPreference}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Requester Identity & Trust Rating */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={req.author.avatar}
                        alt={req.author.name}
                        className="w-7 h-7 rounded-xl object-cover border border-amber-500/30 bg-neutral-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`font-bold truncate ${
                            themeMode === 'light' ? 'text-slate-900' : 'text-white'
                          }`}>
                            {req.author.name}
                          </span>
                          {req.author.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className={`text-[10px] truncate block ${
                          themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {req.author.department.split('&')[0]} • {req.author.collegeName || 'Campus'}
                        </span>
                      </div>
                    </div>

                    {/* Fulfilled marker if archive */}
                    {req.fulfilledBy && (
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-500 font-bold block">
                          Provided by {req.fulfilledBy.studentName.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Controls */}
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/[0.08] space-y-3">
                  
                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between gap-2">
                    
                    {/* Upvote (+1 I need this too) */}
                    <button
                      onClick={() => {
                        soundFX.playPop(620, 0.04);
                        toggleUpvoteRequest(req.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isUpvotedByMe
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-400'
                          : themeMode === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.08] text-slate-300'
                      }`}
                      title="Click if you are also looking for this item on campus (+1)"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isUpvotedByMe ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{req.upvotes}</span>
                      <span className="text-[10px] font-normal hidden sm:inline">+1 Need</span>
                    </button>

                    {/* Offers Counter / Dropdown Toggle */}
                    {hasOffers && (
                      <button
                        onClick={() => {
                          soundFX.playPop(500, 0.02);
                          setExpandedOffersRequestId(isOffersExpanded ? null : req.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          isOffersExpanded
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                            : themeMode === 'light'
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.08] text-slate-300'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{req.offers.length} {req.offers.length === 1 ? 'Offer' : 'Offers'}</span>
                        {isOffersExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    {/* Share Button */}
                    <button
                      onClick={() => handleShareRequest(req)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                      title="Share request"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Primary Response: "I Have This!" or Owner Controls */}
                    {req.status === 'open' ? (
                      isMyRequest ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              soundFX.playSuccess();
                              markRequestFulfilled(req.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-all shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Found</span>
                          </button>
                          <button
                            onClick={() => deleteItemRequest(req.id)}
                            className="p-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete this request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenOfferModal(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>I Have This!</span>
                        </button>
                      )
                    ) : (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>

                  {/* Expanded Offers List */}
                  {isOffersExpanded && hasOffers && (
                    <div className={`p-3 rounded-2xl border space-y-2.5 animate-fadeIn ${
                      themeMode === 'light' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-neutral-900 border-emerald-500/20'
                    }`}>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <span>Submitted Campus Offers:</span>
                        <span className="text-[10px] text-slate-500">{req.offers.length} student responses</span>
                      </div>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {req.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                              themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-neutral-950 border-white/[0.08]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={offer.author.avatar}
                                  alt={offer.author.name}
                                  className="w-5 h-5 rounded-lg object-cover bg-neutral-900"
                                />
                                <span className="font-bold">{offer.author.name}</span>
                                {offer.author.verified && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                              </div>
                              <span className="text-[10px] text-slate-400">{offer.createdAt}</span>
                            </div>

                            <p className={`text-xs ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                              &ldquo;{offer.offerText}&rdquo;
                            </p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.04]">
                              <span className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">
                                Terms: {offer.priceOrTradeTerms}
                              </span>
                              {isMyRequest && req.status === 'open' && (
                                <button
                                  onClick={() => markRequestFulfilled(req.id, offer.id)}
                                  className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-extrabold cursor-pointer"
                                >
                                  Accept Offer
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* OFFER SUBMISSION DIALOG / MODAL                     */}
      {/* ---------------------------------------------------- */}
      {activeOfferRequestId && (() => {
        const targetReq = itemRequests.find((r) => r.id === activeOfferRequestId);
        if (!targetReq) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div
              className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
                themeMode === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-950 border-white/[0.12] text-white'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base font-['Outfit',sans-serif]">Offer Item to {targetReq.author.name}</h3>
                    <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      For wanted post: <strong className="text-amber-500">&ldquo;{targetReq.title}&rdquo;</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveOfferRequestId(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                
                {/* Offer Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                    What do you have? Describe condition & meetup location <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    placeholder="e.g. Hey! I have this TI-84 Plus in mint condition in Java Hostel Block 3. Can lend it for your exam or sell it for $30."
                    className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs outline-none resize-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                        : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Price / Trade Terms */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                    Your Proposed Price or Trade Terms
                  </label>
                  <input
                    type="text"
                    value={offerTerms}
                    onChange={(e) => setOfferTerms(e.target.value)}
                    placeholder="e.g. $30 cash, Free borrow for 3 days, Trade for Bio notes"
                    className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                        : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Link to existing active listing (optional) */}
                {myListings.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                      Link one of your active marketplace items <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <select
                      value={selectedMyListingId}
                      onChange={(e) => setSelectedMyListingId(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-neutral-900 border-white/[0.1] text-white'
                      }`}
                    >
                      <option value="">-- None (Just a direct text offer) --</option>
                      {myListings.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title} ({item.price > 0 ? `$${item.price}` : 'Free/Swap'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setActiveOfferRequestId(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/[0.1] text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Offer to Requester</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
