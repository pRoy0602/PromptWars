import React, { useState, useEffect, useRef } from 'react';
import {
  INDIAN_STATES,
  INDIAN_UNIVERSITIES_DATA,
  IndianUniversity,
  getUniversitiesForState,
  searchIndianUniversities,
  getPopularIndianUniversities,
} from '../data/indianUniversities';
import { soundFX } from '../utils/soundFx';
import {
  GraduationCap,
  Building,
  Search,
  Check,
  ChevronDown,
  MapPin,
  Sparkles,
  Edit3,
  X,
} from 'lucide-react';

interface UniversitySelectorProps {
  value: string;
  onChange: (universityName: string, state?: string) => void;
  themeMode?: 'light' | 'dark';
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  value,
  onChange,
  themeMode = 'dark',
  label = 'College / University',
  placeholder = 'Select or search Indian university (e.g. SRM University)',
  required = false,
}) => {
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered universities based on selected state & search
  const filteredUniversities = searchIndianUniversities(searchQuery, selectedState);
  const popularUniversities = getPopularIndianUniversities();

  const handleSelectUniversity = (univ: IndianUniversity) => {
    soundFX.playPop(540, 0.05);
    onChange(univ.name, univ.state);
    setSelectedState(univ.state);
    setSearchQuery('');
    setIsOpen(false);
    setIsCustomMode(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      soundFX.playPop(520, 0.05);
      onChange(customInput.trim(), selectedState !== 'All States' ? selectedState : undefined);
      setIsOpen(false);
      setIsCustomMode(false);
    }
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            className={`block text-xs font-bold font-['Space_Grotesk'] ${
              themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {label} {required && <span className="text-emerald-500">*</span>}
          </label>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>State-wise Indian Universities</span>
          </span>
        </div>
      )}

      {/* Selected Value Box / Trigger */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            soundFX.playPop(480, 0.04);
            setIsOpen(!isOpen);
          }}
          className={`w-full px-4 py-3 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-sm focus:border-emerald-500'
              : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.1] text-slate-100 focus:border-emerald-500'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="truncate">
              {value ? (
                <div className="font-bold truncate text-emerald-500">{value}</div>
              ) : (
                <div className="text-slate-400">{placeholder}</div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
              isOpen ? 'rotate-180 text-emerald-500' : ''
            }`}
          />
        </button>

        {/* Quick Popular Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className={`text-[10px] font-semibold ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            Quick Pick:
          </span>
          {popularUniversities.slice(0, 4).map((univ) => (
            <button
              key={univ.id}
              type="button"
              onClick={() => handleSelectUniversity(univ)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                value === univ.name || value === univ.shortName
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                  : themeMode === 'light'
                  ? 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-emerald-400 border-white/[0.08]'
              }`}
            >
              {univ.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-3xl border shadow-2xl overflow-hidden p-4 space-y-3.5 backdrop-blur-2xl transition-all ${
            themeMode === 'light'
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
              : 'bg-neutral-950/95 border-white/[0.12] text-slate-100 shadow-black'
          }`}
        >
          {/* State / UT Selector Filter */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-between ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>1. Filter by State / UT</span>
              <span className="text-emerald-500 font-mono text-[10px]">{INDIAN_STATES.length} States & UTs</span>
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  soundFX.playPop(500, 0.04);
                  setSelectedState(e.target.value);
                }}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border appearance-none outline-none cursor-pointer font-medium transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-emerald-500'
                    : 'bg-neutral-900 border-white/[0.1] text-slate-100 focus:border-emerald-500'
                }`}
              >
                <option value="All States">All States & Union Territories (India)</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Search Box */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider font-['Space_Grotesk'] ${
              themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              2. Search University or Campus Name
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SRM, IIT, NIT, Anna Univ, DU, VIT..."
                className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                    : 'bg-neutral-900 border-white/[0.1] text-slate-100 placeholder-slate-400 focus:border-emerald-500'
                }`}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Universities Results List */}
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Universities ({filteredUniversities.length})</span>
              <span>Click to select</span>
            </div>

            {filteredUniversities.length === 0 ? (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-slate-400">No matching university found in this list.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(true);
                    setCustomInput(searchQuery || '');
                  }}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold rounded-xl border border-emerald-500/30 cursor-pointer"
                >
                  Enter Custom College Name
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUniversities.map((univ) => {
                  const isSelected = value === univ.name;
                  return (
                    <button
                      key={univ.id}
                      type="button"
                      onClick={() => handleSelectUniversity(univ)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : themeMode === 'light'
                          ? 'bg-slate-50 hover:bg-emerald-50/70 text-slate-800 border border-slate-200'
                          : 'bg-neutral-900/80 hover:bg-neutral-800 text-slate-200 border border-white/[0.05]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold truncate">{univ.shortName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                              isSelected
                                ? 'bg-slate-950/20 text-slate-950'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {univ.type}
                          </span>
                        </div>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-slate-950/80' : 'text-slate-400'
                          }`}
                        >
                          {univ.name} • <span className="opacity-90">{univ.city}, {univ.state}</span>
                        </p>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-slate-950 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Entry Option */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            {!isCustomMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  setCustomInput(value || '');
                }}
                className={`text-xs font-bold hover:underline cursor-pointer flex items-center gap-1.5 ${
                  themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Cannot find your college? Type custom name</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="w-full flex items-center gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter full college name..."
                  className={`flex-1 px-3 py-1.5 text-xs rounded-xl border outline-none font-medium ${
                    themeMode === 'light'
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-neutral-900 border-white/[0.1] text-slate-100'
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
