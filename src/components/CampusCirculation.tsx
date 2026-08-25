import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Leaf,
  DollarSign,
  Gift,
  Repeat,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Laptop,
  Flame,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundFx';

export const CampusCirculation: React.FC = () => {
  const {
    circulationMetric,
    resourceFlows,
    simulateResourceTransfer,
    currentUser,
    setCurrentPage,
    setIsCreateListingOpen,
  } = useApp();

  const [selectedCycleId, setSelectedCycleId] = useState(resourceFlows[0]?.id || 'cycle_001');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [impactViewMode, setImpactViewMode] = useState<'campus' | 'personal'>('campus');

  const selectedCycle = resourceFlows.find((f) => f.id === selectedCycleId) || resourceFlows[0];

  const handleSimulatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim() || !selectedCycle) return;
    simulateResourceTransfer(selectedCycle.id, newRecipientName.trim());
    setNewRecipientName('');
    soundFX.playPop(880, 0.1);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  const campusZonesStats = [
    { name: 'Engineering Quad', itemsCirculated: 420, moneySaved: '$24,100', carbonAvoided: '980 kg', rate: '+18% vs last term' },
    { name: 'North & East Dorms', itemsCirculated: 380, moneySaved: '$19,450', carbonAvoided: '1,120 kg', rate: '+24% vs last term' },
    { name: 'Central Library Hub', itemsCirculated: 310, moneySaved: '$18,200', carbonAvoided: '620 kg', rate: '+12% vs last term' },
    { name: 'Computer Science Building', itemsCirculated: 240, moneySaved: '$14,800', carbonAvoided: '510 kg', rate: '+31% vs last term' },
    { name: 'Life Sciences Quad', itemsCirculated: 132, moneySaved: '$7,800', carbonAvoided: '390 kg', rate: '+9% vs last term' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-slate-950 border border-emerald-500/20 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/30 backdrop-blur-md">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Campus Circular Economy Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white">
            Campus Circulation & Sustainability Impact
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Every textbook passed down, calculator borrowed, or dorm lamp donated keeps valuable equipment out of landfills and saves thousands of student dollars. Track live metrics and simulate resource lifecycles below.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 inline-flex shadow-inner">
              <button
                onClick={() => {
                  soundFX.playPop(520, 0.05);
                  setImpactViewMode('campus');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  impactViewMode === 'campus'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Campus-Wide Impact
              </button>
              <button
                onClick={() => {
                  soundFX.playPop(620, 0.05);
                  setImpactViewMode('personal');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  impactViewMode === 'personal'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                My Personal Footprint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Impact Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-emerald-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Repeat className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {impactViewMode === 'campus' ? circulationMetric.totalReusedItems.toLocaleString() : currentUser.itemsReusedCount}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Items Reused
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-blue-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight text-emerald-400">
            ${impactViewMode === 'campus' ? circulationMetric.totalMoneySavedUSD.toLocaleString() : currentUser.moneySaved}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Money Saved
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-amber-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Gift className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {impactViewMode === 'campus' ? circulationMetric.totalItemsDonated : currentUser.itemsDonatedCount}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Items Donated
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-teal-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-teal-950/80 text-teal-400 border border-teal-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {impactViewMode === 'campus' ? `${circulationMetric.wastePreventedKg.toLocaleString()} kg` : `${(currentUser.itemsReusedCount * 2.1).toFixed(1)} kg`}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Waste Prevented
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-cyan-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {impactViewMode === 'campus' ? `${circulationMetric.carbonOffsetKg.toLocaleString()} kg` : `${(currentUser.itemsReusedCount * 4.8).toFixed(1)} kg`}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Carbon Offset
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-4.5 rounded-2xl border border-white/[0.08] hover:border-violet-500/30 transition-all text-center shadow-lg group">
          <div className="w-9 h-9 mx-auto rounded-xl bg-violet-950/80 text-violet-400 border border-violet-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {circulationMetric.totalCompletedExchanges}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            Swaps Completed
          </span>
        </div>
      </div>

      {/* Main Interactive Resource Flow Journey Simulator */}
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Lifecycle Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif] mt-1">
              Follow a Resource Through Multiple Student Cohorts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select a resource to watch its journey across graduation classes and simulate the next handoff.
            </p>
          </div>

          {/* Cycle Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {resourceFlows.map((cycle) => (
              <button
                key={cycle.id}
                onClick={() => {
                  soundFX.playPop(500, 0.05);
                  setSelectedCycleId(cycle.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCycleId === cycle.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20 font-extrabold'
                    : 'bg-slate-800/80 text-slate-300 border-white/[0.08] hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cycle.itemName.length > 22 ? `${cycle.itemName.substring(0, 22)}...` : cycle.itemName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Cycle Visual Timeline / Animated Node Flow */}
        {selectedCycle && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Active Stream • {selectedCycle.category}
                </span>
                <h3 className="text-xl font-extrabold text-white font-['Outfit',sans-serif] mt-2">
                  {selectedCycle.itemName}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/[0.08]">
                  <span className="text-slate-400 font-normal block text-[10px]">Times Reused</span>
                  <span className="text-emerald-400 text-sm font-extrabold font-['Space_Grotesk']">{selectedCycle.timesReused} Cohorts</span>
                </div>
                <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/[0.08]">
                  <span className="text-slate-400 font-normal block text-[10px]">Total Saved</span>
                  <span className="text-emerald-400 text-sm font-extrabold font-['Space_Grotesk']">${selectedCycle.totalSaved}</span>
                </div>
                <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/[0.08]">
                  <span className="text-slate-400 font-normal block text-[10px]">Circulation Lifespan</span>
                  <span className="text-slate-200 text-sm font-extrabold font-['Space_Grotesk']">{selectedCycle.lifespanMonths} Months</span>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Stepper */}
            <div className="py-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative">
                
                {/* Originator Node */}
                <div className="flex-1 bg-slate-950/70 p-4.5 rounded-2xl border-2 border-emerald-500/40 shadow-lg text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Originated
                  </span>
                  <div className="font-bold text-sm text-white mt-2 font-['Outfit',sans-serif]">{selectedCycle.originator}</div>
                  <span className="text-[10px] text-slate-400 font-medium">Purchased Brand New</span>
                </div>

                {/* Cohort Flow Nodes */}
                {selectedCycle.passedTo.map((student, idx) => {
                  const isCurrent = idx === selectedCycle.passedTo.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <div className="hidden sm:flex items-center justify-center text-emerald-400 font-bold">
                        <ArrowRight className="w-5 h-5 animate-pulse" />
                      </div>
                      <div
                        className={`flex-1 p-4.5 rounded-2xl border shadow-lg text-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-950/70 border-2 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20'
                            : 'bg-slate-950/70 border-white/[0.08] text-slate-200'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            isCurrent ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isCurrent ? 'Current Holder' : `Reused Cycle #${idx + 1}`}
                        </span>
                        <div className="font-bold text-sm text-white mt-2 font-['Outfit',sans-serif]">{student}</div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Saved ~$95 on Course</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Interactive "Simulate Next Handoff" Form */}
            <form
              onSubmit={handleSimulatePass}
              className="p-5 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-base shadow-md">
                  +
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">Simulate Next Student Handover</h4>
                  <p className="text-[11px] text-slate-400">Pass this resource to another underclassman cohort</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="Enter next student / cohort name..."
                  className="px-3.5 py-2.5 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 rounded-xl border border-white/[0.1] focus:outline-none focus:border-emerald-500 flex-1 sm:w-64"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 whitespace-nowrap active:scale-95 transition-all cursor-pointer interactive-btn"
                >
                  Pass Forward 🔄
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Campus Zones Impact Breakdown Heatmap Table */}
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-4">
        <div>
          <h3 className="text-xl font-extrabold text-white font-['Outfit',sans-serif]">
            📍 Campus Zones & Dorms Circulation Leaderboard
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time breakdown of exchange density across university buildings and quads.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Campus Hub / Building</th>
                <th className="py-3 px-4">Items Circulated</th>
                <th className="py-3 px-4">Total Money Saved</th>
                <th className="py-3 px-4">Carbon Avoided</th>
                <th className="py-3 px-4 text-right">Circulation Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {campusZonesStats.map((zone, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center">
                      <Building className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span>{zone.name}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-300 font-['Space_Grotesk']">{zone.itemsCirculated} items</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400 font-['Space_Grotesk']">{zone.moneySaved}</td>
                  <td className="py-4 px-4 text-slate-400 font-['Space_Grotesk']">{zone.carbonAvoided}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Very High ({zone.rate})
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
