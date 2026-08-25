import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, ExchangeType, ConditionType } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';
import { soundFX } from '../utils/soundFx';
import { Interactive3DCard } from './Interactive3DCard';
import { SmartMatchSection } from './SmartMatchSection';
import {
  Search,
  Grid,
  List,
  Heart,
  ShieldCheck,
  Clock,
  MapPin,
  X,
  PlusCircle,
  Sparkles,
  ArrowUpDown,
  Book,
  Laptop,
  FileText,
  Ticket,
  Wrench,
  GraduationCap,
  Gift,
  Compass,
  Zap,
} from 'lucide-react';

export const Marketplace: React.FC = () => {
  const {
    listings,
    filters,
    setFilters,
    resetFilters,
    setSelectedListing,
    toggleSaveListing,
    savedListingIds,
    setIsCreateListingOpen,
    openCreateRequestModal,
    setCurrentPage,
    themeMode,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: ResourceCategory | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'books', label: 'Books', icon: <Book className="w-3.5 h-3.5" /> },
    { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'giveaways', label: 'Giveaways', icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  const exchangeTypes: { id: ExchangeType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'sell', label: 'Sell' },
    { id: 'exchange', label: 'Exchange / Swap' },
    { id: 'borrow', label: 'Borrow / Lend' },
    { id: 'donate', label: 'Donate' },
    { id: 'free', label: 'Free' },
    { id: 'offer_skill', label: 'Offer Skill' },
    { id: 'offer_service', label: 'Offer Service' },
  ];

  const conditions: { id: ConditionType | 'all'; label: string }[] = [
    { id: 'all', label: 'Any Condition' },
    { id: 'new', label: 'New' },
    { id: 'like_new', label: 'Like New' },
    { id: 'good', label: 'Good' },
    { id: 'used', label: 'Used' },
  ];

  // Filtering and sorting logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthor = item.author.name.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesAuthor && !matchesLoc) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // Exchange type filter
      if (filters.exchangeType !== 'all') {
        if (filters.exchangeType === 'borrow' && (item.exchangeType === 'borrow' || item.exchangeType === 'lend')) {
          // match either
        } else if (item.exchangeType !== filters.exchangeType) {
          return false;
        }
      }

      // Condition filter
      if (filters.condition !== 'all' && item.condition !== filters.condition) {
        return false;
      }

      // Campus zone filter
      if (filters.campusZone !== 'All Campus Zones' && item.campusZone !== filters.campusZone) {
        return false;
      }

      // Price range filter
      if (filters.priceRange === 'free' && item.price > 0 && item.exchangeType !== 'free' && item.exchangeType !== 'donate') {
        return false;
      }
      if (filters.priceRange === 'under25' && item.price > 25) {
        return false;
      }
      if (filters.priceRange === 'under50' && item.price > 50) {
        return false;
      }
      if (filters.priceRange === 'above50' && item.price <= 50) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.price - b.price;
      if (filters.sortBy === 'price_high') return b.price - a.price;
      if (filters.sortBy === 'popular') return b.savedCount - a.savedCount;
      return 0; // default newest
    });
  }, [listings, filters]);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.exchangeType !== 'all',
    filters.condition !== 'all',
    filters.campusZone !== 'All Campus Zones',
    filters.priceRange !== 'all',
    Boolean(filters.searchQuery.trim()),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Campus Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit',sans-serif]">
            Discover & Exchange Student Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Browse authentic listings from verified students across all departments and dorms.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundFX.playPop(650, 0.08);
              setIsCreateListingOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer interactive-btn"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post a Listing</span>
          </button>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundFX.playPop(500, 0.05);
                setViewMode('grid');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFX.playPop(500, 0.05);
                setViewMode('list');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Search & Quick Category Strip */}
      <div className="space-y-3">
        
        {/* Request Board Quick Callout Banner */}
        <div className="p-3 sm:p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-neutral-900/60 to-orange-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 block">
                Can&apos;t find an item, textbook, or specific gear?
              </span>
              <span className="text-[11px] text-slate-300">
                Post on the <strong>Campus Request Board</strong> & let other students find or lend it to you.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFX.playPop(520, 0.04);
                setCurrentPage('requests');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Open Request Board</span>
            </button>
            <button
              onClick={() => {
                soundFX.playPop(550, 0.04);
                openCreateRequestModal();
              }}
              className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            >
              + Post Request
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search textbooks, calculators, headphones, notes, tutors, tickets..."
            className="w-full pl-11 pr-10 py-3 bg-neutral-950/90 text-sm sm:text-base text-slate-100 placeholder-slate-400 rounded-2xl border border-white/[0.1] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xl shadow-black outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setFilters((prev) => ({ ...prev, category: cat.id }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-black/75 text-slate-300 border-white/[0.08] hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Match: Best Matches For You Section */}
      <SmartMatchSection />

      {/* Secondary Filter Bar: Exchange Type, Condition, Campus Zone, Price, Sort */}
      <div className="bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        
        {/* Left Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Exchange Type Selector */}
          <select
            value={filters.exchangeType}
            onChange={(e) => setFilters((prev) => ({ ...prev, exchangeType: e.target.value as any }))}
            className="bg-neutral-950/90 px-3 py-1.5 rounded-xl border border-white/[0.1] text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {exchangeTypes.map((t) => (
              <option key={t.id} value={t.id} className="bg-black text-slate-200">
                {t.label}
              </option>
            ))}
          </select>

          {/* Condition Selector */}
          <select
            value={filters.condition}
            onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value as any }))}
            className="bg-neutral-950/90 px-3 py-1.5 rounded-xl border border-white/[0.1] text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {conditions.map((c) => (
              <option key={c.id} value={c.id} className="bg-black text-slate-200">
                {c.label}
              </option>
            ))}
          </select>

          {/* Campus Location Zone */}
          <select
            value={filters.campusZone}
            onChange={(e) => setFilters((prev) => ({ ...prev, campusZone: e.target.value }))}
            className="bg-neutral-950/90 px-3 py-1.5 rounded-xl border border-white/[0.1] text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {CAMPUS_ZONES.map((zone) => (
              <option key={zone} value={zone} className="bg-black text-slate-200">
                {zone}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value as any }))}
            className="bg-neutral-950/90 px-3 py-1.5 rounded-xl border border-white/[0.1] text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all" className="bg-black text-slate-200">Any Price</option>
            <option value="free" className="bg-black text-slate-200">Free / Donation</option>
            <option value="under25" className="bg-black text-slate-200">Under $25</option>
            <option value="under50" className="bg-black text-slate-200">Under $50</option>
            <option value="above50" className="bg-black text-slate-200">$50+</option>
          </select>

          {/* Reset Filters Pill */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                soundFX.playPop(500, 0.05);
                resetFilters();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {/* Right Sort Selector */}
        <div className="flex items-center gap-2 text-xs ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-neutral-950/90 px-3 py-1.5 rounded-xl border border-white/[0.1] text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="newest" className="bg-black text-slate-200">Recently Posted</option>
            <option value="popular" className="bg-black text-slate-200">Most Saved</option>
            <option value="price_low" className="bg-black text-slate-200">Price: Low to High</option>
            <option value="price_high" className="bg-black text-slate-200">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredListings.length}</strong> active student resources
        </span>
        {filters.category !== 'all' && (
          <span className="text-emerald-400 font-semibold capitalize">
            Category: {filters.category}
          </span>
        )}
      </div>

      {/* Listings Grid or List */}
      {filteredListings.length === 0 ? (
        <div className="bg-black/75 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-10 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            {filters.searchQuery ? `No listings match "${filters.searchQuery}"` : 'No resources matched your search'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Can&apos;t find what you need? Post a request on the <strong>Campus Request Board</strong> so other students can lend, sell, or trade it with you!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => {
                soundFX.playPop(550, 0.04);
                openCreateRequestModal({
                  title: filters.searchQuery || undefined,
                  category: filters.category !== 'all' ? filters.category : undefined,
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-all shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Post on Request Board</span>
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/[0.1] text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredListings.map((item) => {
            const isSaved = savedListingIds.includes(item.id);
            return (
              <Interactive3DCard key={item.id}>
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl hover:shadow-emerald-950/30 hover:border-white/20 transition-all flex flex-col group h-full">
                  {/* Image Container */}
                  <div
                    onClick={() => {
                      soundFX.playPop(620, 0.06);
                      setSelectedListing(item);
                    }}
                    className="relative h-48 w-full bg-neutral-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/85 text-slate-200 backdrop-blur-sm border border-white/[0.1] font-['Space_Grotesk']">
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

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playPop(700, 0.05);
                        toggleSaveListing(item.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40 shadow-sm'
                          : 'bg-black/80 text-slate-300 hover:text-rose-400 hover:bg-neutral-900 border border-white/[0.1]'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Listing'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-emerald-400 capitalize">
                          {item.condition !== 'na' ? `${item.condition.replace('_', ' ')} Condition` : 'Skill / Service'}
                        </span>
                        <span className="text-base font-extrabold text-white font-['Outfit',sans-serif]">
                          {item.price > 0 ? `$${item.price}` : 'Free'}
                        </span>
                      </div>

                      <h3
                        onClick={() => {
                          soundFX.playPop(620, 0.06);
                          setSelectedListing(item);
                        }}
                        className="font-bold text-sm text-slate-200 line-clamp-2 hover:text-emerald-400 cursor-pointer transition-colors leading-snug font-['Outfit',sans-serif]"
                      >
                        {item.title}
                      </h3>

                      {/* Location Badge */}
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Footer Author & Time */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <img
                          src={item.author.avatar}
                          alt={item.author.name}
                          className="w-5 h-5 rounded-full object-cover border border-white/[0.15]"
                        />
                        <span className="truncate text-slate-300">{item.author.name}</span>
                        {item.author.verified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 shrink-0">
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
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredListings.map((item) => {
            const isSaved = savedListingIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  soundFX.playPop(620, 0.06);
                  setSelectedListing(item);
                }}
                className="bg-black/75 backdrop-blur-xl p-4 rounded-2xl border border-white/[0.08] shadow-2xl hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover bg-neutral-950 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-950 text-slate-300 border border-white/[0.08] font-['Space_Grotesk']">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400">
                        {item.condition !== 'na' ? item.condition.replace('_', ' ') : 'Service'}
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate font-['Outfit',sans-serif]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <img
                          src={item.author.avatar}
                          alt={item.author.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{item.author.name}</span>
                        {item.author.verified && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end shrink-0 w-full sm:w-auto justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.08]">
                  <div className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
                    {item.price > 0 ? `$${item.price}` : 'Free'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playPop(700, 0.05);
                        toggleSaveListing(item.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSaved ? 'bg-rose-950 text-rose-400 border-rose-500/40' : 'text-slate-400 hover:text-slate-200 border-white/[0.1] bg-neutral-950'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-white/[0.1] transition-all cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
