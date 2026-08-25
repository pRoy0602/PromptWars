import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import {
  ShieldCheck,
  X,
  Mail,
  CheckCircle2,
  Lock,
  MapPin,
  AlertTriangle,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SafetyVerificationModal: React.FC = () => {
  const {
    isSafetyModalOpen,
    setIsSafetyModalOpen,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    verifyCurrentUser,
    currentUser,
    showToast,
    themeMode,
  } = useApp();

  const [eduEmail, setEduEmail] = useState(currentUser.email || '');
  const [studentId, setStudentId] = useState('STU-99482');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'verified'>('input');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduEmail.includes('.edu') && !eduEmail.includes('college') && !eduEmail.includes('campus')) {
      soundFX.playPop(300, 0.05);
      showToast('Validation Warning', 'Please provide a valid college or university .edu address.', 'warning');
      return;
    }
    soundFX.playSuccess();
    setStep('otp');
    setOtpCode('8429'); // Simulated code
    showToast('Code Sent', 'Simulated verification code: 8429 sent to ' + eduEmail, 'info');
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();
    verifyCurrentUser();
    setStep('verified');
    setTimeout(() => {
      setIsVerificationModalOpen(false);
      setStep('input');
    }, 1800);
  };

  const safeZones = [
    {
      name: 'Central Library Circulation Lobby',
      features: 'High CCTV coverage, 24/7 security desk, power outlets, bright lighting',
      hours: 'Open 24/7',
    },
    {
      name: 'Student Union Food Court / Atrium',
      features: 'High foot traffic, public seating, campus wifi, easy parking',
      hours: '7:00 AM – 11:00 PM',
    },
    {
      name: 'Engineering Building Ground Lounge',
      features: 'Good for testing hardware, lab equipment, calculators, and electronics',
      hours: '8:00 AM – 10:00 PM',
    },
    {
      name: 'Science Quad Breezeway',
      features: 'Open outdoor daylight exchange spot with emergency blue light station',
      hours: 'Daylight hours recommended',
    },
  ];

  if (!isSafetyModalOpen && !isVerificationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-slate-900/95 border-white/[0.1] text-slate-100 backdrop-blur-2xl'
          }`}
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b flex items-center justify-between ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-white/[0.08]'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                themeMode === 'light'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-extrabold text-base font-['Outfit',sans-serif] ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {isVerificationModalOpen ? 'Student ID & .EDU Verification' : 'Campus Safety & Safe Handover Zones'}
                </h3>
                <p className={`text-[11px] mt-0.5 ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  UniVerse Verified Student Network
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playPop(450, 0.04);
                setIsSafetyModalOpen(false);
                setIsVerificationModalOpen(false);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                themeMode === 'light'
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 text-xs">
            
            {/* VERIFICATION FLOW */}
            {isVerificationModalOpen ? (
              <div className="space-y-4">
                {step === 'input' && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className={`leading-relaxed text-sm ${
                      themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      Verification ensures only registered students on campus can list items, request exchanges, and message peers.
                    </p>

                    <div>
                      <label className={`block font-bold mb-1.5 ${
                        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}>
                        Campus .EDU Email Address *
                      </label>
                      <div className="relative">
                        <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                          themeMode === 'light' ? 'text-slate-400' : 'text-slate-400'
                        }`} />
                        <input
                          type="email"
                          value={eduEmail}
                          onChange={(e) => setEduEmail(e.target.value)}
                          placeholder="e.g. yourname@university.edu"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs outline-none transition-all border ${
                            themeMode === 'light'
                              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                              : 'bg-slate-800/80 border-white/[0.08] text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block font-bold mb-1.5 ${
                        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}>
                        Student ID Number *
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. STU-883920"
                        className={`w-full px-4 py-3 rounded-xl text-xs outline-none transition-all border ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                            : 'bg-slate-800/80 border-white/[0.08] text-slate-100 placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500'
                        }`}
                        required
                      />
                    </div>

                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      themeMode === 'light'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                    }`}>
                      🔒 We never share your student ID. Verification grants you the green Verified Badge and increases exchange acceptance by 4x.
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl active:scale-95 transition-all cursor-pointer interactive-btn shadow-lg shadow-emerald-500/20"
                    >
                      Send Verification Code
                    </button>
                  </form>
                )}

                {step === 'otp' && (
                  <form onSubmit={handleConfirmOtp} className="space-y-4">
                    <p className={`leading-relaxed text-sm ${
                      themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      Enter the 4-digit verification code sent to <strong>{eduEmail}</strong>. (Simulated code pre-filled below)
                    </p>

                    <div>
                      <label className={`block font-bold mb-1.5 ${
                        themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}>4-Digit Code</label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className={`w-full text-center text-2xl font-extrabold tracking-widest py-3 rounded-xl outline-none font-['Space_Grotesk'] border ${
                          themeMode === 'light'
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                            : 'bg-slate-800/80 border-white/[0.08] text-slate-100 focus:bg-slate-800 focus:border-emerald-500'
                        }`}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer interactive-btn shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Verify Account</span>
                    </button>
                  </form>
                )}

                {step === 'verified' && (
                  <div className="py-10 text-center space-y-4">
                    <div className={`w-20 h-20 rounded-3xl border mx-auto flex items-center justify-center shadow-xl ${
                      themeMode === 'light'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                        : 'bg-emerald-950 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <ShieldCheck className="w-12 h-12 animate-bounce" />
                    </div>
                    <h3 className={`text-xl font-extrabold font-['Outfit',sans-serif] ${
                      themeMode === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      Account Verified Successfully!
                    </h3>
                    <p className={`text-xs max-w-sm mx-auto ${
                      themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      Your green Verified Student badge is now active across all your listings and proposals.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* CAMPUS SAFE ZONES & PROTOCOLS */
              <div className="space-y-5">
                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-slate-800/60 border-white/[0.08]'
                }`}>
                  <h4 className={`font-bold flex items-center gap-2 font-['Outfit',sans-serif] text-sm ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Designated Campus Safe Handover Hubs</span>
                  </h4>
                  <p className={`text-xs ${
                    themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Campus safety and student government recommend meeting only at these verified public locations for handovers.
                  </p>
                </div>

                <div className="space-y-3">
                  {safeZones.map((zone, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border shadow-sm space-y-1.5 ${
                      themeMode === 'light'
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-800/60 border-white/[0.08]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold font-['Outfit',sans-serif] text-sm ${
                          themeMode === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>{zone.name}</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          themeMode === 'light'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {zone.hours}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        themeMode === 'light' ? 'text-slate-600' : 'text-slate-300'
                      }`}>{zone.features}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'light'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                }`}>
                  <span className={`font-bold flex items-center gap-2 font-['Outfit',sans-serif] text-sm ${
                    themeMode === 'light' ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Campus Handover Checklist</span>
                  </span>
                  <ul className={`list-disc list-inside space-y-1 text-xs leading-relaxed ${
                    themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <li>Inspect physical textbook condition (markings/highlighting) before completing.</li>
                    <li>Power on electronic accessories, laptops, and calculators to test battery health.</li>
                    <li>Never send off-campus wire transfers, gift cards, or cash before seeing the item.</li>
                    <li>Campus Escort Service: (555) 019-SAFE available after dark.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

