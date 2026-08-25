import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusOpportunity } from '../types';
import { soundFX } from '../utils/soundFx';
import { Interactive3DCard } from './Interactive3DCard';
import {
  Compass,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Award,
  BookOpen,
  Filter,
} from 'lucide-react';

export const OpportunitiesHub: React.FC = () => {
  const { opportunities, toggleRegisterOpportunity, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortByDeadline, setSortByDeadline] = useState(false);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'internship', label: 'Lab & Research Internships' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'competition', label: 'Competitions & Grants' },
    { id: 'club', label: 'Club Leadership' },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organization.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchTags = opp.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchDesc && !matchTags) return false;
    }

    if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-cyan-950/80 via-slate-900/90 to-slate-950 rounded-3xl text-white p-6 sm:p-10 shadow-2xl border border-cyan-500/20 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-4 border border-cyan-500/30 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Opportunities & Competitions Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white">
            Hackathons, Paid Research, Grants & Workshops
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            Discover vetted high-impact opportunities on campus: seed grants, research lab assistantships, and student competitions.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities: Hackathons, Robotics Research, UI/UX Workshops, Seed Grants..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 backdrop-blur-xl text-sm text-slate-100 placeholder-slate-400 rounded-2xl border border-white/[0.08] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xl outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-lg shadow-cyan-500/20 font-extrabold'
                    : 'bg-slate-900/70 text-slate-300 border-white/[0.08] hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => (
          <Interactive3DCard key={opp.id} className="h-full">
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-lg hover:border-cyan-500/30 transition-all overflow-hidden flex flex-col justify-between h-full group">
              <div>
                {/* Image & Category Tag */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={opp.image}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 text-white backdrop-blur-md border border-white/10 font-['Space_Grotesk']">
                      {opp.category}
                    </span>
                    {opp.featured && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-between text-xs font-semibold border border-white/[0.08]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Deadline: {opp.deadline}
                    </span>
                    {opp.spotsAvailable !== undefined && (
                      <span className="text-[11px] text-cyan-300 font-['Space_Grotesk'] font-bold">
                        {opp.spotsAvailable} spots left
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3.5">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{opp.organization}</span>
                    <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] mt-1 leading-snug">
                      {opp.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {opp.description}
                  </p>

                  {/* Stipend / Perks Badge */}
                  <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-xs font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{opp.stipendOrPerk}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{opp.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-950/60 text-slate-300 text-[10px] font-medium border border-white/[0.08]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    soundFX.playPop(750, 0.08);
                    toggleRegisterOpportunity(opp.id);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer interactive-btn ${
                    opp.isRegistered
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 font-extrabold'
                  }`}
                >
                  {opp.isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Registered / Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Register & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Interactive3DCard>
        ))}
      </div>

    </div>
  );
};

