import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, ExchangeType, ConditionType } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';
import {
  X,
  Upload,
  Plus,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Repeat,
  DollarSign,
  Tag,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_IMAGES: { category: ResourceCategory; label: string; url: string }[] = [
  {
    category: 'books',
    label: 'Textbook Stack',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'electronics',
    label: 'Scientific Calculator',
    url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'electronics',
    label: 'Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'electronics',
    label: 'Arduino & Sensors',
    url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'notes',
    label: 'Lecture Study Notes',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'tickets',
    label: 'Concert & Event Pass',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'skills',
    label: 'Coding & Mentoring',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    category: 'giveaways',
    label: 'Dorm Essentials & Lamp',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  },
];

export const CreateListingModal: React.FC = () => {
  const { isCreateListingOpen, setIsCreateListingOpen, addListing, showToast, setCurrentPage } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('books');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('exchange');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [condition, setCondition] = useState<ConditionType>('good');
  const [location, setLocation] = useState('Central Library 2nd Floor');
  const [campusZone, setCampusZone] = useState('Engineering Quad');
  const [imageUrl, setImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['textbook', 'campus']);
  const [preferredExchangeItem, setPreferredExchangeItem] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'giveaway'>('normal');

  if (!isCreateListingOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePresetSelect = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Validation Error', 'Please provide a title for your listing.', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Validation Error', 'Please describe the item or service.', 'warning');
      return;
    }

    const finalImage =
      imageUrl.trim() ||
      PRESET_IMAGES.find((p) => p.category === category)?.url ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    addListing({
      title: title.trim(),
      description: description.trim(),
      category,
      exchangeType,
      price: exchangeType === 'donate' || exchangeType === 'free' ? 0 : parseFloat(price) || 0,
      condition: category === 'skills' || category === 'services' ? 'na' : condition,
      location: location.trim(),
      campusZone,
      images: [finalImage],
      tags: tags.length > 0 ? tags : ['campus', category],
      preferredExchangeItem: preferredExchangeItem.trim() || undefined,
      urgency,
    });

    setIsCreateListingOpen(false);
    setCurrentPage('marketplace');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div>
              <h2 className="text-lg font-extrabold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>List a Resource or Offer a Skill</span>
              </h2>
              <p className="text-xs text-slate-400">
                Share, sell, lend, or donate within the verified campus network.
              </p>
            </div>
            <button
              onClick={() => setIsCreateListingOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Engineering Mathematics (Kreyszig 10th Ed) or TI-84 Plus CE"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                required
              />
            </div>

            {/* Category & Exchange Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="books">Books & Textbooks</option>
                  <option value="electronics">Electronics & Hardware</option>
                  <option value="notes">Class Notes & Study Materials</option>
                  <option value="tickets">Event & Fest Tickets</option>
                  <option value="skills">Skills & Tutoring</option>
                  <option value="services">Student Services</option>
                  <option value="giveaways">Free & Giveaways</option>
                  <option value="opportunities">Campus Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Exchange Type *
                </label>
                <select
                  value={exchangeType}
                  onChange={(e) => {
                    const val = e.target.value as ExchangeType;
                    setExchangeType(val);
                    if (val === 'donate' || val === 'free') setPrice('0');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="exchange">Exchange / Swap (Item for Item)</option>
                  <option value="sell">Sell (Cash / Venmo)</option>
                  <option value="borrow">Lend / Borrow (Temporary)</option>
                  <option value="donate">Donate / Free Giveaway</option>
                  <option value="offer_skill">Offer Skill / Mentoring</option>
                  <option value="offer_service">Offer Student Service</option>
                </select>
              </div>
            </div>

            {/* Price & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Price ($ USD) {exchangeType === 'donate' && '(Free)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    disabled={exchangeType === 'donate' || exchangeType === 'free'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0 for Free/Exchange"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ConditionType)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="like_new">Like New (Mint / No markings)</option>
                  <option value="good">Good (Clean, minor wear)</option>
                  <option value="used">Used (Functional with wear)</option>
                  <option value="new">Brand New (Unopened)</option>
                  <option value="na">N/A (Skill / Service / Digital)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Description & Details *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include key details: course code, edition, included accessories, battery health, or what topic you will teach..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                required
              />
            </div>

            {/* Preferred Trade / Counter Offer */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                What would you like in exchange? (Optional)
              </label>
              <input
                type="text"
                value={preferredExchangeItem}
                onChange={(e) => setPreferredExchangeItem(e.target.value)}
                placeholder="e.g. Willing to trade for a Data Structures book, Figma coaching, or $15"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Campus Meetup Location & Campus Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Specific Handover Spot *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Library 2nd Floor Study Room"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Campus Zone
                </label>
                <select
                  value={campusZone}
                  onChange={(e) => setCampusZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {CAMPUS_ZONES.filter((z) => z !== 'All Campus Zones').map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Selection / Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Item Image (Preset or Custom URL)
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste an image URL (or select one of the high-res campus presets below)"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">Presets:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset.url)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        imageUrl === preset.url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag & press enter (e.g. calculus, calc3, finals)"
                  className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer border border-slate-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-medium border border-emerald-500/30"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateListingOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer interactive-btn"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish to Campus</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
