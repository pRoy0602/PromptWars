import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillService } from '../types';
import { soundFX } from '../utils/soundFx';
import { Interactive3DCard } from './Interactive3DCard';
import {
  GraduationCap,
  Search,
  Plus,
  Star,
  ShieldCheck,
  Repeat,
  Sparkles,
  Code,
  Palette,
  Briefcase,
  Music,
  Video,
  Calculator,
  X,
  MapPin,
} from 'lucide-react';

export const SkillsServices: React.FC = () => {
  const {
    skills,
    addSkillService,
    setCurrentPage,
    setActiveExchangeTab,
    createExchangeRequest,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOfferSkillModalOpen, setIsOfferSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillService | null>(null);

  // New Skill Form State
  const [skillTitle, setSkillTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState('Computer Science & Tech');
  const [rateType, setRateType] = useState<'free' | 'hourly' | 'exchange_skill' | 'fixed'>('exchange_skill');
  const [rateDisplay, setRateDisplay] = useState('Free / Skill Swap');
  const [description, setDescription] = useState('');
  const [skillsOfferedInput, setSkillsOfferedInput] = useState('');
  const [skillsDesiredInput, setSkillsDesiredInput] = useState('');

  // Skill Swap Request State
  const [swapOfferText, setSwapOfferText] = useState('');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Disciplines', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'cs', label: 'Coding & AI', match: 'Computer Science & Tech', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'design', label: 'Design & UI/UX', match: 'Design & Creative', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'career', label: 'Resume & Career', match: 'Career & Professional', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'music', label: 'Music & Arts', match: 'Music & Arts', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'math', label: 'Math & STEM', match: 'Academics & STEM', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'media', label: 'Video & Photo', match: 'Media & Production', icon: <Video className="w-3.5 h-3.5" /> },
  ];

  const filteredSkills = skills.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchSkills = item.skillsOffered.some((s) => s.toLowerCase().includes(q));
      const matchProvider = item.provider.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchSkills && !matchProvider) return false;
    }

    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.id === selectedCategory);
      if (catObj?.match && item.category !== catObj.match) return false;
    }

    return true;
  });

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim() || !description.trim()) {
      showToast('Validation Error', 'Please complete title and description.', 'warning');
      return;
    }

    const offeredList = skillsOfferedInput.split(',').map((s) => s.trim()).filter(Boolean);
    const desiredList = skillsDesiredInput.split(',').map((s) => s.trim()).filter(Boolean);

    addSkillService({
      title: skillTitle.trim(),
      category: skillCategory,
      rateType,
      rateDisplay: rateDisplay.trim() || 'Skill Swap',
      experienceLevel: 'Intermediate / 2+ Years',
      description: description.trim(),
      skillsOffered: offeredList.length > 0 ? offeredList : ['Peer Tutoring'],
      skillsDesired: desiredList.length > 0 ? desiredList : ['Figma', 'Math'],
      availability: 'Weekday Evenings & Weekends',
      locationPreference: 'Hybrid',
      tags: ['Tutoring', 'Skills', 'Peer Learn'],
    });

    soundFX.playPop(800, 0.1);
    showToast('Skill Published!', 'Your skill offering is now live for all students.', 'success');
    setIsOfferSkillModalOpen(false);
    setSkillTitle('');
    setDescription('');
    setSkillsOfferedInput('');
    setSkillsDesiredInput('');
  };

  const handleSendSkillSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    if (!swapOfferText.trim()) {
      showToast('Proposal Required', 'Please specify what skill or help you can offer in return.', 'warning');
      return;
    }

    createExchangeRequest({
      listingId: selectedSkill.id,
      listingTitle: `[Skill Swap] ${selectedSkill.title}`,
      listingImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      ownerId: selectedSkill.provider.id,
      ownerName: selectedSkill.provider.name,
      proposedType: 'skill_swap',
      counterOfferText: swapOfferText.trim(),
      message: `Hi ${selectedSkill.provider.name}, I would love to learn from your skill "${selectedSkill.title}". In return: ${swapOfferText.trim()}`,
      suggestedLocation: 'Main Campus Library Safe Meeting Hub',
    });

    soundFX.playWhoosh();
    showToast('Proposal Sent!', `Your skill exchange proposal was delivered to ${selectedSkill.provider.name}.`, 'success');
    setIsSwapModalOpen(false);
    setSelectedSkill(null);
    setActiveExchangeTab('sent');
    setCurrentPage('exchanges');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-teal-950/80 via-slate-900/90 to-slate-950 rounded-3xl text-white p-6 sm:p-10 shadow-2xl border border-teal-500/20 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-4 backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <span>Peer Tutoring & Skill Exchange Guild</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white">
            Learn from Peers. Teach What You Know.
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            Need help debugging Python? Want someone to review your resume or teach guitar? 
            Exchange skills directly or get peer tutoring without expensive commercial services.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                soundFX.playPop(650, 0.08);
                setIsOfferSkillModalOpen(true);
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer interactive-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Offer Your Skill</span>
            </button>
          </div>
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
            placeholder="Search skills: Python, LeetCode, Figma, Guitar, Linear Algebra, Resume..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 backdrop-blur-xl text-sm rounded-2xl border border-white/[0.08] text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-2xl outline-none transition-all"
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
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-lg shadow-teal-500/20 font-extrabold'
                    : 'bg-slate-900/70 text-slate-300 border-white/[0.08] hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((item) => (
          <Interactive3DCard key={item.id} className="h-full">
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-lg hover:border-teal-500/30 transition-all p-6 flex flex-col justify-between h-full group">
              <div>
                {/* Header: Provider Info & Rating */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.provider.avatar}
                      alt={item.provider.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs text-white font-['Outfit',sans-serif]">{item.provider.name}</h4>
                        {item.provider.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[11px] text-slate-400">{item.provider.department}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-['Space_Grotesk']">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({item.reviewsCount})</span>
                  </div>
                </div>

                {/* Title & Category */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  {item.category}
                </span>
                <h3 className="font-bold text-base text-white mt-1 group-hover:text-teal-300 transition-colors leading-snug font-['Outfit',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills Offered Tags */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Teaches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.skillsOffered.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 rounded-lg bg-teal-950/80 text-teal-300 text-[10px] font-semibold border border-teal-500/30"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desired Trade */}
                {item.skillsDesired && item.skillsDesired.length > 0 && (
                  <div className="mt-3 p-2.5 bg-amber-950/30 rounded-xl border border-amber-500/20 text-[11px] text-amber-300">
                    <span className="font-bold flex items-center gap-1 mb-0.5">
                      <Repeat className="w-3 h-3" />
                      Looking to Learn:
                    </span>
                    <span className="text-slate-300">{item.skillsDesired.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Footer Rate & Action */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Rate / Terms:</span>
                  <span className="font-extrabold text-xs text-white font-['Space_Grotesk',sans-serif]">
                    {item.rateDisplay}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundFX.playPop(600, 0.05);
                    setSelectedSkill(item);
                    setIsSwapModalOpen(true);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/[0.08] shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer interactive-btn"
                >
                  <Repeat className="w-3.5 h-3.5 text-teal-400" />
                  <span>Request Swap</span>
                </button>
              </div>
            </div>
          </Interactive3DCard>
        ))}
      </div>

      {/* MODAL: Offer Your Skill Form */}
      {isOfferSkillModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2 font-['Outfit',sans-serif]">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <span>Offer a Campus Skill or Tutoring</span>
              </h3>
              <button
                onClick={() => setIsOfferSkillModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skill Title *</label>
                <input
                  type="text"
                  value={skillTitle}
                  onChange={(e) => setSkillTitle(e.target.value)}
                  placeholder="e.g. Python & Data Structures Tutoring or Beginner Guitar Lessons"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option>Computer Science & Tech</option>
                    <option>Design & Creative</option>
                    <option>Career & Professional</option>
                    <option>Music & Arts</option>
                    <option>Academics & STEM</option>
                    <option>Media & Production</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Rate Type</label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="exchange_skill">Skill Swap (1-for-1 trade)</option>
                    <option value="free">Free Peer Mentoring</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="fixed">Fixed Project Fee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Rate Display Text</label>
                <input
                  type="text"
                  value={rateDisplay}
                  onChange={(e) => setRateDisplay(e.target.value)}
                  placeholder="e.g. Free for student clubs or $12/hr"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description & What You Teach *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your approach, course topics you can help with, or homework debugging support..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills You Offer (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsOfferedInput}
                  onChange={(e) => setSkillsOfferedInput(e.target.value)}
                  placeholder="e.g. Python 3, LeetCode, Graph Algorithms, Git"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills You'd Like to Learn in Return (Optional)</label>
                <input
                  type="text"
                  value={skillsDesiredInput}
                  onChange={(e) => setSkillsDesiredInput(e.target.value)}
                  placeholder="e.g. UI/UX in Figma, Spanish Conversation, Video Editing"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfferSkillModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Publish Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Request Skill Swap */}
      {isSwapModalOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5 font-['Outfit',sans-serif]">
                <Repeat className="w-4 h-4 text-teal-400" />
                <span>Propose Skill Swap with {selectedSkill.provider.name}</span>
              </h3>
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-teal-950/40 rounded-xl border border-teal-500/30 text-xs">
              <span className="font-bold text-teal-300 block">{selectedSkill.title}</span>
              <p className="text-slate-400 text-[11px] mt-0.5">Provider: {selectedSkill.provider.name} ({selectedSkill.provider.department})</p>
            </div>

            <form onSubmit={handleSendSkillSwap} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  What skill, subject, or service can you offer in exchange? *
                </label>
                <textarea
                  rows={3}
                  value={swapOfferText}
                  onChange={(e) => setSwapOfferText(e.target.value)}
                  placeholder="e.g. I can help you with your Calculus homework for 2 hours, or teach you Figma basics!"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Send Skill Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

