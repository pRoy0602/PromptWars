import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import {
  Sparkles,
  Repeat,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveEvent {
  id: string;
  type: 'swap' | 'giveaway' | 'tutor' | 'verified' | 'borrow';
  actor: string;
  actorDept: string;
  item: string;
  location: string;
  timeAgo: string;
  icon: string;
  badgeColor: string;
}

const INITIAL_LIVE_EVENTS: LiveEvent[] = [
  {
    id: 'e1',
    type: 'swap',
    actor: 'Sarah K.',
    actorDept: 'Biomedical Eng',
    item: 'TI-84 Plus CE for Calculus 3 Text',
    location: 'Main Library 2nd Floor',
    timeAgo: '12s ago',
    icon: '⚡',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'e2',
    type: 'giveaway',
    actor: 'Marcus Chen',
    actorDept: 'Computer Science',
    item: 'LED Dorm Desk Lamp & Hangers',
    location: 'North Residential Quad',
    timeAgo: '45s ago',
    icon: '🎁',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'e3',
    type: 'tutor',
    actor: 'Elena Rostova',
    actorDept: 'Data Science',
    item: '1-on-1 Python & LeetCode Mentoring',
    location: 'CS Lab 304',
    timeAgo: '1m ago',
    icon: '🎓',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
  {
    id: 'e4',
    type: 'verified',
    actor: 'David Kim',
    actorDept: 'Mechanical Eng',
    item: 'Verified Student #STU-8821',
    location: 'Campus Security Hub',
    timeAgo: '2m ago',
    icon: '🛡️',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'e5',
    type: 'borrow',
    actor: 'Maya Patel',
    actorDept: 'Architecture',
    item: 'Arduino Sensor Kit (Weekend Borrow)',
    location: 'Maker Space Studio',
    timeAgo: '3m ago',
    icon: '🔄',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
];

export const LiveActivityTicker: React.FC = () => {
  const { setCurrentPage, triggerSearchNav } = useApp();
  const [events, setEvents] = useState<LiveEvent[]>(INITIAL_LIVE_EVENTS);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Rotate featured live event
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [events.length]);

  // Periodic random live event generation to simulate live campus activity
  useEffect(() => {
    const generator = setInterval(() => {
      const names = ['Jordan T.', 'Chloe V.', 'Liam N.', 'Aaliyah M.', 'Noah B.', 'Priya S.', 'Zach W.'];
      const depts = ['Elec. Eng', 'Econ & Finance', 'Neurobiology', 'Design Media', 'Physics', 'Informatics'];
      const items = [
        'Sony WH-1000XM4 for Kindle Paperwhite',
        'Organic Chemistry Wade 9th Ed',
        'Microeconomics Solved Midterm Notes',
        'Spring Music Fest Wristband Pass',
        'Logitech MX Master 3 Mouse',
        'Figma UI/UX 1-Hour Crash Course',
      ];
      const locations = ['Student Union Lobby', 'Campus Starbucks', 'Engineering Quad Benches', 'South Dorms Lounge', 'Library Safe Zone'];
      
      const newEv: LiveEvent = {
        id: `ev_${Date.now()}`,
        type: 'swap',
        actor: names[Math.floor(Math.random() * names.length)],
        actorDept: depts[Math.floor(Math.random() * depts.length)],
        item: items[Math.floor(Math.random() * items.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timeAgo: 'Just now',
        icon: '⚡',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      };

      setEvents((prev) => [newEv, ...prev.slice(0, 7)]);
    }, 14000);

    return () => clearInterval(generator);
  }, []);

  const currentActive = events[activeEventIndex] || events[0];

  return (
    <div className="bg-black/85 backdrop-blur-xl border-y border-white/[0.08] text-white overflow-hidden py-2.5 px-4 select-none relative shadow-2xl z-20">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-48 h-full bg-emerald-500/10 blur-xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-48 h-full bg-teal-500/10 blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Live Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-wider text-[10px] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-['Space_Grotesk']">Live Campus Radar</span>
          </div>
          <span className="hidden sm:inline text-slate-400 text-[11px]">Real-time student transactions:</span>
        </div>

        {/* Center Animated Live Event Billboard */}
        <div className="flex-1 overflow-hidden min-h-[26px] flex items-center justify-center sm:justify-start w-full px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActive.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-300 transition-colors truncate"
              onClick={() => {
                soundFX.playPop(700, 0.05);
                triggerSearchNav(currentActive.item.split(' ')[0]);
              }}
            >
              <span className="text-sm">{currentActive.icon}</span>
              <span className="font-bold text-white font-['Outfit',sans-serif]">{currentActive.actor}</span>
              <span className="text-slate-400 text-[11px]">({currentActive.actorDept})</span>
              <span className="text-slate-300 font-medium truncate">• {currentActive.item}</span>
              <span className="hidden lg:inline-flex items-center gap-1 text-slate-400 text-[11px] bg-neutral-950/90 px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {currentActive.location}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold shrink-0 font-['Space_Grotesk']">
                {currentActive.timeAgo}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFX.playWhoosh();
              setCurrentPage('circulation');
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors group cursor-pointer"
          >
            <span className="font-['Space_Grotesk']">Circulation Map</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
