import React, { useState, useEffect, useRef } from 'react';
import { useApp, NavPage, PlanetTheme } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import {
  Sparkles,
  Search,
  PlusCircle,
  Repeat,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  ShieldCheck,
  Menu,
  X,
  Heart,
  TrendingUp,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LogIn,
  Zap,
  Palette,
  Check,
  Compass,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentUser,
    isAuthenticated,
    openAuthModal,
    setIsCreateListingOpen,
    setIsVerificationModalOpen,
    setIsSafetyModalOpen,
    exchangeRequests,
    itemRequests,
    savedListingIds,
    filters,
    setFilters,
    themeMode,
    toggleThemeMode,
    activePlanetTheme,
    setActivePlanetTheme,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNightSettingsOpen, setIsNightSettingsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState(filters.searchQuery);
  const [isAudioEnabled, setIsAudioEnabled] = useState(soundFX.enabled);
  const [telemetry, setTelemetry] = useState({ percent: 0, sector: 1, isWarp: false });
  const settingsModalRef = useRef<HTMLDivElement | null>(null);

  // Synchronize search input with global filter state
  useEffect(() => {
    setNavSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  // Close settings popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsModalRef.current && !settingsModalRef.current.contains(e.target as Node)) {
        setIsNightSettingsOpen(false);
      }
    };
    if (isNightSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNightSettingsOpen]);

  // Real-time altitude & sector scroll telemetry
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const currentY = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percent = Math.min(100, Math.max(0, Math.round((currentY / docHeight) * 100)));
      const sector = Math.min(5, Math.floor(percent / 20) + 1);
      const velocity = Math.abs(currentY - lastY);
      const isWarp = velocity > 35;
      lastY = currentY;

      setTelemetry({ percent, sector, isWarp });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleSound = () => {
    const enabled = soundFX.toggleSound();
    setIsAudioEnabled(enabled);
  };

  const handleThemeToggle = () => {
    if (themeMode === 'dark') {
      soundFX.playSunrise();
    } else {
      soundFX.playSunset();
    }
    toggleThemeMode();
  };

  const pendingIncomingCount = exchangeRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  ).length;

  const urgentRequestsCount = itemRequests.filter(
    (r) => r.status === 'open' && (r.urgency === 'urgent' || r.urgency === 'high')
  ).length;

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playWhoosh();
    setFilters((prev) => ({ ...prev, searchQuery: navSearch }));
    if (currentPage !== 'marketplace') {
      setCurrentPage('marketplace');
    }
  };

  const handleNavClick = (page: NavPage) => {
    soundFX.playPop(520, 0.05);
    setCurrentPage(page);
  };

  const planetThemeOptions: {
    id: PlanetTheme;
    name: string;
    subtitle: string;
    dotClass: string;
    glowColor: string;
    borderClass: string;
    activeRingClass: string;
  }[] = [
    {
      id: 'emerald',
      name: 'Emerald Terra',
      subtitle: 'SRM Campus verdant aura & crystal rings',
      dotClass: 'bg-emerald-400',
      glowColor: '#10b981',
      borderClass: 'border-emerald-500/40 hover:border-emerald-400',
      activeRingClass: 'ring-2 ring-emerald-400 border-emerald-400 shadow-emerald-500/30',
    },
    {
      id: 'cyan',
      name: 'Hyperion Cyan',
      subtitle: 'Azure ringed gas giant & glacial ice',
      dotClass: 'bg-cyan-400',
      glowColor: '#06b6d4',
      borderClass: 'border-cyan-500/40 hover:border-cyan-400',
      activeRingClass: 'ring-2 ring-cyan-400 border-cyan-400 shadow-cyan-500/30',
    },
    {
      id: 'violet',
      name: 'Kepler Violet',
      subtitle: 'Mystic nebula planet & cosmic rays',
      dotClass: 'bg-purple-400',
      glowColor: '#a855f7',
      borderClass: 'border-purple-500/40 hover:border-purple-400',
      activeRingClass: 'ring-2 ring-purple-400 border-purple-400 shadow-purple-500/30',
    },
    {
      id: 'amber',
      name: 'Solaris Amber',
      subtitle: 'Warm golden sun giant & solar motes',
      dotClass: 'bg-amber-400',
      glowColor: '#f59e0b',
      borderClass: 'border-amber-500/40 hover:border-amber-400',
      activeRingClass: 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/30',
    },
  ];

  const currentThemeMeta = planetThemeOptions.find((p) => p.id === activePlanetTheme) || planetThemeOptions[0];

  const navItems: { page: NavPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { page: 'marketplace', label: 'Marketplace', icon: <Layers className="w-4 h-4" /> },
    {
      page: 'requests',
      label: 'Request Board',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      badge: urgentRequestsCount > 0 ? urgentRequestsCount : undefined,
    },
    { page: 'academic', label: 'Academic Vault', icon: <GraduationCap className="w-4 h-4" /> },
    { page: 'skills', label: 'Skills & Tutoring', icon: <BookOpen className="w-4 h-4" /> },
    { page: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    {
      page: 'exchanges',
      label: 'Exchanges',
      icon: <Repeat className="w-4 h-4" />,
      badge: pendingIncomingCount > 0 ? pendingIncomingCount : undefined,
    },
    { page: 'circulation', label: 'Circulation & Impact', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all shadow-xl ${
      themeMode === 'light'
        ? 'bg-white/92 border-slate-200/90 text-slate-900 shadow-slate-200/40'
        : 'bg-black/85 border-white/[0.08] text-slate-100 shadow-black'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Logo + Campus Tag + Integrated Telemetry & Planet Color Palette */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all font-bold">
                <Repeat className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-lg sm:text-xl tracking-tight font-['Outfit',sans-serif] ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    UniVerse <span className="text-emerald-500">Exchange</span>
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full font-['Space_Grotesk'] hidden xs:inline-block ${
                    themeMode === 'light'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    Campus
                  </span>
                </div>
                <p className={`text-[11px] hidden md:flex items-center gap-1.5 truncate max-w-[160px] lg:max-w-[200px] ${
                  themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {isAuthenticated ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="truncate font-semibold text-emerald-500">
                        {currentUser.collegeName || currentUser.college || 'SRM University'}
                      </span>
                    </>
                  ) : (
                    <span>Campus Student Network</span>
                  )}
                </p>
              </div>
            </button>

            {/* TOP BAR SECTOR TELEMETRY HUD CAPSULE */}
            <div className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-mono select-none transition-all ${
              themeMode === 'light'
                ? 'bg-slate-100/90 border-slate-300 text-slate-700 shadow-sm'
                : 'bg-neutral-950/90 border-white/[0.12] text-slate-300 shadow-inner'
            }`}>
              {themeMode === 'light' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="font-bold text-amber-800">SOLAR DAY</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-semibold">{telemetry.percent}% SCROLL</span>
                </>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${telemetry.isWarp ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-pulse'} shrink-0`} />
                  <span className="font-bold text-white">SECTOR 0{telemetry.sector}</span>
                  <span className="text-neutral-700">|</span>
                  <span className="text-emerald-400 font-semibold">{telemetry.percent}% ALT</span>
                  {telemetry.isWarp && (
                    <span className="text-[8px] px-1 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded font-bold">WARP</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop Search Bar - Visible on md+ screens */}
          <form
            onSubmit={handleNavSearchSubmit}
            className="hidden md:flex flex-1 max-w-[200px] lg:max-w-xs xl:max-w-sm relative items-center"
          >
            <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none z-10 ${
              themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => {
                setNavSearch(e.target.value);
                if (currentPage === 'marketplace') {
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                }
              }}
              placeholder="Search items, textbooks, notes..."
              className={`w-full pl-9 pr-8 py-1.5 text-xs font-semibold rounded-full border outline-none transition-all ${
                themeMode === 'light'
                  ? 'bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-950 placeholder-slate-500 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'bg-neutral-950/95 hover:bg-neutral-900 focus:bg-black text-white placeholder-slate-400 border-white/[0.18] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30'
              }`}
            />
            {navSearch && (
              <button
                type="button"
                onClick={() => {
                  setNavSearch('');
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-white dark:hover:text-white cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? themeMode === 'light'
                        ? 'text-emerald-800 bg-emerald-100/90 border border-emerald-300 font-bold shadow-sm'
                        : 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 font-bold shadow-md shadow-emerald-950/40'
                      : themeMode === 'light'
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-slate-950 bg-emerald-400 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
            
            {/* Mode Changer (Cosmic Night / Solar Day with Sun Transition) */}
            <button
              onClick={handleThemeToggle}
              title={themeMode === 'dark' ? 'Switch to Solar Day (Light Mode)' : 'Switch to Cosmic Night (Dark Mode)'}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/25 hover:bg-amber-300 font-bold'
                  : 'bg-neutral-950/90 text-indigo-200 border-indigo-500/30 hover:border-indigo-400/50 hover:bg-indigo-950/40 shadow-sm'
              }`}
            >
              {themeMode === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '12s' }} />
                  <span className="hidden sm:inline text-[11px] font-extrabold tracking-tight">DAY</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-300" />
                  <span className="hidden sm:inline text-[11px] font-extrabold tracking-tight text-indigo-200">NIGHT</span>
                </>
              )}
            </button>

            {/* NIGHT MODE SETTINGS & PLANET PALETTE BUTTON */}
            <div className="relative">
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setIsNightSettingsOpen(!isNightSettingsOpen);
                }}
                title="Night Mode Settings & Planet Palette"
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                  isNightSettingsOpen
                    ? themeMode === 'light'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-md'
                      : 'bg-neutral-900 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-300'
                    : 'bg-neutral-950/90 hover:bg-neutral-900 text-slate-200 border-white/[0.12]'
                }`}
                aria-label="Night Mode Settings"
              >
                <div className="relative flex items-center justify-center">
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-black animate-pulse"
                    style={{ backgroundColor: currentThemeMeta.glowColor }}
                  />
                </div>
                <span className="hidden md:inline text-[11px] font-bold">
                  {themeMode === 'dark' ? currentThemeMeta.name.split(' ')[0] : 'Themes'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isNightSettingsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* NIGHT MODE SETTINGS POPOVER DIALOG */}
              {isNightSettingsOpen && (
                <div
                  ref={settingsModalRef}
                  className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-150 ${
                    themeMode === 'light'
                      ? 'bg-white/98 border-slate-300 text-slate-900 shadow-slate-400/30'
                      : 'bg-neutral-950/98 border-white/[0.15] text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-slate-950">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono">
                          Celestial Environment
                        </h4>
                        <p className="text-[10px] text-slate-400">Night Mode & Campus Aura</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNightSettingsOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/[0.1] text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mode Selector Card */}
                  <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${
                    themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-neutral-900/80 border-white/[0.08]'
                  }`}>
                    <div className="text-xs">
                      <div className="font-bold flex items-center gap-1.5">
                        {themeMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{themeMode === 'dark' ? 'Cosmic Night Mode' : 'Solar Day Mode'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {themeMode === 'dark' ? 'Starfield, planets & dark UI' : 'Day sky & high-contrast UI'}
                      </span>
                    </div>
                    <button
                      onClick={handleThemeToggle}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer"
                    >
                      Switch to {themeMode === 'dark' ? 'Day' : 'Night'}
                    </button>
                  </div>

                  {/* Planet Theme Picker */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className="text-slate-300">CELESTIAL PLANET PALETTE</span>
                      <span className="text-emerald-400">{currentThemeMeta.name}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {planetThemeOptions.map((planet) => {
                        const isSelected = activePlanetTheme === planet.id;
                        return (
                          <button
                            key={planet.id}
                            onClick={() => {
                              soundFX.playPop(520, 0.05);
                              setActivePlanetTheme(planet.id);
                              if (themeMode !== 'dark') {
                                toggleThemeMode();
                              }
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? themeMode === 'light'
                                  ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                                  : 'bg-neutral-900 border-emerald-400 shadow-md shadow-emerald-950'
                                : themeMode === 'light'
                                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                : 'bg-neutral-900/40 hover:bg-neutral-900 border-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-5 h-5 rounded-full ${planet.dotClass} ${
                                  isSelected ? 'ring-2 ring-white/60 scale-110 shadow-lg' : 'opacity-80'
                                } flex items-center justify-center shrink-0`}
                                style={{ boxShadow: isSelected ? `0 0 12px ${planet.glowColor}` : 'none' }}
                              />
                              <div>
                                <div className="text-xs font-bold flex items-center gap-1.5">
                                  <span>{planet.name}</span>
                                  {isSelected && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[200px]">
                                  {planet.subtitle}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Elevation & Sector HUD */}
                  <div className={`p-2 rounded-xl border mb-3 flex items-center justify-between text-[11px] font-mono ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-neutral-900/70 border-white/[0.06] text-slate-300'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{themeMode === 'light' ? 'SURFACE ELEVATION' : `SECTOR 0${telemetry.sector}`}</span>
                    </div>
                    <div className="font-bold text-emerald-400">
                      {telemetry.percent}% {themeMode === 'light' ? 'SCROLL' : 'ALTITUDE'}
                    </div>
                  </div>

                  {/* Cosmic Canvas Click Tip */}
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Tap or click anywhere on the background canvas to generate twinkling starbursts & celestial rays!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Planet Swatches (Visible on sm+ in Dark Mode) */}
            {themeMode === 'dark' && (
              <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-xl bg-neutral-950/80 border border-white/[0.08]" title="Quick Planet Theme Selector">
                {planetThemeOptions.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => {
                      soundFX.playPop(520, 0.05);
                      setActivePlanetTheme(planet.id);
                    }}
                    title={planet.name}
                    className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                      activePlanetTheme === planet.id
                        ? `${planet.dotClass} ring-2 ring-white/80 scale-110 shadow-md`
                        : `${planet.dotClass} opacity-40 hover:opacity-100`
                    }`}
                    aria-label={planet.name}
                  />
                ))}
              </div>
            )}

            {/* Interactive Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioEnabled ? 'Mute Interactive Sound Effects' : 'Enable Interactive Sound Effects'}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center text-xs cursor-pointer ${
                isAudioEnabled
                  ? themeMode === 'light'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950'
                  : themeMode === 'light'
                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                  : 'bg-neutral-950/90 text-slate-400 border-white/[0.08] hover:text-slate-200'
              }`}
            >
              {isAudioEnabled ? (
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  <span className="hidden xl:inline text-[10px] font-bold">FX ON</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xl:inline text-[10px] font-bold">FX OFF</span>
                </div>
              )}
            </button>

            {/* List Something Primary Action */}
            <button
              onClick={() => {
                soundFX.playPop(650, 0.08);
                setIsCreateListingOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap hidden xs:inline">List Something</span>
              <span className="whitespace-nowrap xs:hidden">List</span>
            </button>

            {/* Saved Items Quick Link */}
            <button
              onClick={() => {
                soundFX.playPop(550, 0.05);
                setCurrentPage('profile');
              }}
              title="Saved Items"
              className={`relative p-1.5 sm:p-2 rounded-xl border transition-colors hidden sm:flex items-center justify-center cursor-pointer ${
                themeMode === 'light'
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent hover:border-white/[0.08]'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${
                themeMode === 'light' ? 'text-slate-600 hover:text-rose-500' : 'text-slate-300 hover:text-rose-400'
              }`} />
              {savedListingIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setCurrentPage('profile');
                }}
                className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all text-left group cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-900'
                    : 'bg-neutral-950/80 hover:bg-neutral-900 border-white/[0.08] hover:border-white/20 text-slate-100'
                }`}
                title="View Student Profile"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border ${
                      themeMode === 'light' ? 'border-slate-300' : 'border-white/[0.15]'
                    }`}
                  />
                  {currentUser.verified && (
                    <span
                      title="Verified Student"
                      className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-md"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-bold leading-tight group-hover:text-emerald-500 transition-colors ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-slate-200'
                  }`}>
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span>{currentUser.verified ? 'Verified Student' : 'Verify ID'}</span>
                    <span className="opacity-70">• {currentUser.department ? currentUser.department.split(' ')[0] : 'Campus'}</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  openAuthModal('login');
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`2xl:hidden p-1.5 sm:p-2 rounded-xl cursor-pointer ${
                themeMode === 'light'
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white hover:bg-neutral-900'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`2xl:hidden px-4 pt-3 pb-6 space-y-3 shadow-2xl border-b backdrop-blur-2xl ${
          themeMode === 'light'
            ? 'bg-white/98 border-slate-200 text-slate-900'
            : 'bg-black/98 border-white/[0.08] text-slate-100'
        }`}>
          <form onSubmit={handleNavSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => {
                setNavSearch(e.target.value);
                if (currentPage === 'marketplace') {
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                }
              }}
              placeholder="Search items, notes, tutors, gear..."
              className={`w-full pl-9 pr-9 py-2.5 text-sm font-semibold rounded-xl border focus:outline-none transition-all ${
                themeMode === 'light'
                  ? 'bg-slate-100 text-slate-950 placeholder-slate-500 border-slate-300 focus:border-emerald-500'
                  : 'bg-neutral-950 text-white placeholder-slate-400 border-white/[0.18] focus:border-emerald-400'
              }`}
            />
            {navSearch && (
              <button
                type="button"
                onClick={() => {
                  setNavSearch('');
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Mobile Telemetry & Planet Color Theme Selector */}
          <div className={`p-3 rounded-xl border space-y-2.5 text-xs ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.08]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className={`w-2 h-2 rounded-full ${themeMode === 'light' ? 'bg-amber-500' : 'bg-emerald-400'} animate-pulse`} />
                <span className="font-bold">
                  {themeMode === 'light' ? 'SOLAR DAY' : `SECTOR 0${telemetry.sector}`}
                </span>
                <span className="text-slate-400">|</span>
                <span className={themeMode === 'light' ? 'text-amber-700 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {telemetry.percent}% {themeMode === 'light' ? 'SCROLL' : 'ALT'}
                </span>
              </div>

              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setIsNightSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>All Settings</span>
              </button>
            </div>

            {themeMode === 'dark' && (
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span className="text-[10px] text-slate-400 font-mono">PLANET: <span className="text-emerald-400 font-bold">{currentThemeMeta.name}</span></span>
                <div className="flex items-center gap-2">
                  {planetThemeOptions.map((planet) => (
                    <button
                      key={planet.id}
                      onClick={() => {
                        soundFX.playPop(520, 0.05);
                        setActivePlanetTheme(planet.id);
                      }}
                      title={planet.name}
                      className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                        activePlanetTheme === planet.id
                          ? `${planet.dotClass} ring-2 ring-white/80 scale-110 shadow-md`
                          : `${planet.dotClass} opacity-40 hover:opacity-100`
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isActive
                      ? themeMode === 'light'
                        ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                        : 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : themeMode === 'light'
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-emerald-500 text-slate-950 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className={`pt-2 border-t flex items-center justify-between text-xs ${
            themeMode === 'light' ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}>
            <button
              onClick={handleThemeToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-indigo-950 text-indigo-200 border border-indigo-500/40'
              }`}
            >
              {themeMode === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 animate-spin text-slate-950" style={{ animationDuration: '10s' }} />
                  <span>Solar Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Cosmic Night</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsVerificationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-emerald-500 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify College ID
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
