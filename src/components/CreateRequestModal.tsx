import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, RequestUrgency, RequestPreferredType } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';
import { soundFX } from '../utils/soundFx';
import {
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  DollarSign,
  MapPin,
  Tag,
  Book,
  Laptop,
  GraduationCap,
  Wrench,
  Gift,
  Ticket,
  FileText,
  Compass,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const CreateRequestModal: React.FC = () => {
  const {
    isCreateRequestModalOpen,
    setIsCreateRequestModalOpen,
    initialRequestPrefill,
    addItemRequest,
    themeMode,
    currentUser,
    isAuthenticated,
    openAuthModal,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('books');
  const [urgency, setUrgency] = useState<RequestUrgency>('normal');
  const [preferredType, setPreferredType] = useState<RequestPreferredType>('buy');
  const [budgetDisplay, setBudgetDisplay] = useState('');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);
  const [neededByDate, setNeededByDate] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [locationPreference, setLocationPreference] = useState(currentUser.campusZone || 'Main Campus / Library');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply prefill if modal opened with prefill data
  useEffect(() => {
    if (isCreateRequestModalOpen) {
      if (initialRequestPrefill?.title) {
        setTitle(initialRequestPrefill.title);
      }
      if (initialRequestPrefill?.category) {
        setCategory(initialRequestPrefill.category);
      }
    }
  }, [isCreateRequestModalOpen, initialRequestPrefill]);

  if (!isCreateRequestModalOpen) return null;

  const handleClose = () => {
    soundFX.playPop(450, 0.04);
    setIsCreateRequestModalOpen(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File Too Large', 'Please upload an image smaller than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        setReferenceImage(base64Url);
        showToast('Photo Attached', 'Reference image loaded.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Sign In Required', 'Please sign in or create a student profile to post requests.', 'info');
      openAuthModal('login');
      return;
    }

    if (!title.trim()) {
      showToast('Missing Title', 'Please specify what item you are looking for.', 'warning');
      return;
    }

    if (!description.trim()) {
      showToast('Missing Description', 'Please provide a few details about what condition or edition you need.', 'warning');
      return;
    }

    const defaultTags = tags.length > 0 ? tags : [category, urgency === 'urgent' ? 'Urgent' : 'Wanted', courseCode].filter(Boolean) as string[];

    addItemRequest({
      title: title.trim(),
      description: description.trim(),
      category,
      urgency,
      preferredType,
      budgetDisplay: budgetDisplay.trim() || (preferredType === 'free' ? 'Free / Donated' : 'Open to offers'),
      maxBudget: maxBudget || (budgetDisplay.match(/\d+/) ? parseInt(budgetDisplay.match(/\d+/)![0], 10) : undefined),
      neededByDate: neededByDate.trim() || 'Flexible',
      courseCode: courseCode.trim() || undefined,
      locationPreference,
      tags: defaultTags,
      referenceImage: referenceImage.trim() || undefined,
    });

    soundFX.playSuccess();
    handleClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setBudgetDisplay('');
    setMaxBudget(undefined);
    setNeededByDate('');
    setCourseCode('');
    setTags([]);
    setReferenceImage('');
  };

  const categoryOptions: { id: ResourceCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'books', label: 'Books & Textbooks', icon: <Book className="w-3.5 h-3.5" /> },
    { id: 'electronics', label: 'Electronics & Gadgets', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Notes & Study Guides', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Lab Gear & Supplies', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'giveaways', label: 'Dorm Essentials', icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Tutoring & Skills', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'tickets', label: 'Campus Tickets & Passes', icon: <Ticket className="w-3.5 h-3.5" /> },
    { id: 'opportunities', label: 'Projects & Teams', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-auto max-h-[92vh] flex flex-col ${
          themeMode === 'light'
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-neutral-950 border-white/[0.12] text-slate-100'
        }`}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between shrink-0 ${
          themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-neutral-900/80 border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold font-['Outfit',sans-serif]">Post an Item Request</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Wanted Board
                </span>
              </div>
              <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Can&apos;t find an item on campus? Let peers know what you need so they can lend, sell, or swap.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              themeMode === 'light'
                ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-slate-300 border-white/[0.1]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
              What are you looking for? <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TI-84 Plus CE Calculator, Organic Chemistry Wade 9th Ed, Size M Lab Coat"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                themeMode === 'light'
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                  : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
              }`}
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
              Item Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    soundFX.playPop(500, 0.03);
                  }}
                  className={`p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/40 shadow-sm'
                      : themeMode === 'light'
                      ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      : 'border-white/[0.08] bg-neutral-900/60 hover:bg-neutral-800 text-slate-300'
                  }`}
                >
                  <span className="shrink-0">{cat.icon}</span>
                  <span className="truncate">{cat.label.split('&')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency & Preferred Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'urgent', label: '🔥 Urgent (24h)', color: 'border-rose-500 text-rose-500 bg-rose-500/10' },
                  { id: 'high', label: '⚡ High (This Week)', color: 'border-amber-500 text-amber-500 bg-amber-500/10' },
                  { id: 'normal', label: '📅 Normal', color: 'border-emerald-500 text-emerald-500 bg-emerald-500/10' },
                  { id: 'flexible', label: '🌱 Flexible', color: 'border-blue-500 text-blue-500 bg-blue-500/10' },
                ].map((urg) => (
                  <button
                    key={urg.id}
                    type="button"
                    onClick={() => {
                      setUrgency(urg.id as RequestUrgency);
                      soundFX.playPop(520, 0.03);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center truncate ${
                      urgency === urg.id
                        ? urg.color
                        : themeMode === 'light'
                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                        : 'border-white/[0.08] bg-neutral-900 hover:bg-neutral-800 text-slate-400'
                    }`}
                  >
                    {urg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Preferred Exchange Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'buy', label: '💰 Buy (Have Budget)' },
                  { id: 'borrow', label: '⏱️ Borrow / Lend' },
                  { id: 'trade', label: '🔄 Trade / Swap' },
                  { id: 'free', label: '🎁 Free / Giveaway' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setPreferredType(type.id as RequestPreferredType);
                      soundFX.playPop(550, 0.03);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center truncate ${
                      preferredType === type.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                        : themeMode === 'light'
                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                        : 'border-white/[0.08] bg-neutral-900 hover:bg-neutral-800 text-slate-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget & Needed By Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Budget / Trade Offer
              </label>
              <input
                type="text"
                value={budgetDisplay}
                onChange={(e) => setBudgetDisplay(e.target.value)}
                placeholder="e.g. Up to $40, Will trade Math notes, Borrow for 2 days"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                    : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Needed By When?
              </label>
              <input
                type="text"
                value={neededByDate}
                onChange={(e) => setNeededByDate(e.target.value)}
                placeholder="e.g. This Friday before 2 PM, Exam week, Next Monday"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                    : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                }`}
              />
            </div>
          </div>

          {/* Course Code & Campus Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Course Code / Subject <span className="text-slate-400 lowercase font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. MATH 220, CSE 304, CHEM 101L"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                    : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Pickup Zone / Dorm
              </label>
              <select
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                    : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                }`}
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone} value={zone} className={themeMode === 'light' ? 'bg-white text-slate-900' : 'bg-neutral-900 text-white'}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
              Details & Requirements <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specific models, conditions, editions, or how long you need the item for..."
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all resize-none ${
                themeMode === 'light'
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                  : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
              }`}
            />
          </div>

          {/* Reference Image Option */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900 border-white/[0.08]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
                Reference Photo (Optional)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageInputMode === 'url'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Image Link
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageInputMode === 'upload'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {imageInputMode === 'url' ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={referenceImage}
                  onChange={(e) => setReferenceImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or web image link"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                      : 'bg-neutral-800 border-white/[0.1] text-white focus:border-amber-500'
                  }`}
                />
                {referenceImage && (
                  <button
                    type="button"
                    onClick={() => setReferenceImage('')}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 text-xs font-bold hover:bg-rose-500/10 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all ${
                    themeMode === 'light'
                      ? 'border-slate-300 hover:border-amber-500 bg-white text-slate-700'
                      : 'border-white/[0.15] hover:border-amber-500 bg-neutral-800/50 text-slate-300'
                  }`}
                >
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>Choose Image File (PNG, JPG, Max 5MB)</span>
                </button>
              </div>
            )}

            {referenceImage && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={referenceImage}
                  alt="Reference Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 bg-neutral-900"
                />
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Image attached to request card
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-['Space_Grotesk'] text-slate-700 dark:text-slate-300">
              Keywords & Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag & press Enter (e.g. TI-84, Exam, Textbook)"
                className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    : 'bg-neutral-900 border-white/[0.1] text-white focus:border-amber-500'
                }`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold cursor-pointer transition-all"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 shrink-0 ${
          themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-white/[0.08]'
        }`}>
          <button
            type="button"
            onClick={handleClose}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              themeMode === 'light'
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Wanted Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
