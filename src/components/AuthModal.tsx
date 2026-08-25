import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import { ORIGAMI_AVATARS, getRandomOrigamiAvatar } from '../utils/origamiAvatars';
import { OTHER_STUDENTS, CURRENT_USER } from '../data/mockData';
import { StudentUser } from '../types';
import { UniversitySelector } from './UniversitySelector';
import {
  Sparkles,
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  MapPin,
  Dice5,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isPageMode?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isPageMode = false }) => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    loginAsStudent,
    signup,
    themeMode,
    setCurrentPage,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('SRM Institute of Science and Technology (SRM University)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('4th Semester (Sophomore)');
  const [dormLocation, setDormLocation] = useState('Java Hostel / Block 3');
  const [bio, setBio] = useState('Campus student excited to trade textbooks and collaborate!');
  
  // Selected Origami Avatar
  const [selectedOrigami, setSelectedOrigami] = useState<string>(ORIGAMI_AVATARS[0].dataUri);
  const [selectedOrigamiName, setSelectedOrigamiName] = useState<string>(ORIGAMI_AVATARS[0].name);
  const [showOrigamiPicker, setShowOrigamiPicker] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const handleRollOrigami = () => {
    soundFX.playPop(650, 0.08);
    setIsRolling(true);
    setTimeout(() => {
      const randomItem = ORIGAMI_AVATARS[Math.floor(Math.random() * ORIGAMI_AVATARS.length)];
      setSelectedOrigami(randomItem.dataUri);
      setSelectedOrigamiName(randomItem.name);
      setIsRolling(false);
      soundFX.playSuccess();
    }, 280);
  };

  const handleSelectOrigami = (dataUri: string, name: string) => {
    soundFX.playPop(520, 0.05);
    setSelectedOrigami(dataUri);
    setSelectedOrigamiName(name);
    setShowOrigamiPicker(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Missing Email', 'Please enter your student email address.', 'warning');
      return;
    }
    const success = login(email, password);
    if (success) {
      soundFX.playSuccess();
      setIsAuthModalOpen(false);
      if (isPageMode) {
        setCurrentPage('marketplace');
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Required Fields', 'Please enter your name and student email.', 'warning');
      return;
    }

    const success = signup({
      name: name.trim(),
      email: email.trim(),
      collegeName: collegeName.trim(),
      department: department.trim(),
      semester,
      dormLocation: dormLocation.trim(),
      bio: bio.trim(),
      origamiAvatar: selectedOrigami,
      origamiFigure: selectedOrigamiName,
    });

    if (success) {
      soundFX.playSuccess();
      setIsAuthModalOpen(false);
      if (isPageMode) {
        setCurrentPage('marketplace');
      }
    }
  };

  // Demo accounts for quick switching / testing
  const demoAccounts: StudentUser[] = [
    CURRENT_USER,
    OTHER_STUDENTS.usr_002,
    OTHER_STUDENTS.usr_003,
    OTHER_STUDENTS.usr_004,
  ].filter(Boolean);

  const handleQuickLogin = (user: StudentUser) => {
    soundFX.playSuccess();
    loginAsStudent(user);
    setIsAuthModalOpen(false);
    showToast('Signed In', `Welcome back, ${user.name}!`, 'success');
    if (isPageMode) {
      setCurrentPage('marketplace');
    }
  };

  const content = (
    <div
      className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col relative transition-all ${
        themeMode === 'light'
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
          : 'bg-neutral-950/95 border-white/[0.1] text-slate-100 backdrop-blur-2xl shadow-black'
      }`}
    >
      {/* Top Atmospheric Glow */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      {/* Header */}
      <div
        className={`px-6 py-5 border-b flex items-center justify-between ${
          themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-neutral-900/80 border-white/[0.08]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              themeMode === 'light'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-extrabold text-lg font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {authMode === 'login' ? 'Campus Sign In' : 'Join UniVerse Student Network'}
            </h2>
            <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Zero-waste campus trading & academic peer sharing
            </p>
          </div>
        </div>

        {!isPageMode && (
          <button
            onClick={() => {
              soundFX.playPop(480, 0.04);
              setIsAuthModalOpen(false);
            }}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              themeMode === 'light'
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-neutral-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Auth Mode Tabs */}
      <div className={`flex border-b px-6 pt-3 ${
        themeMode === 'light' ? 'border-slate-200 bg-slate-100/50' : 'border-white/[0.08] bg-neutral-900/40'
      }`}>
        <button
          onClick={() => {
            soundFX.playPop(520, 0.04);
            setAuthMode('login');
          }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            authMode === 'login'
              ? 'border-emerald-500 text-emerald-500'
              : themeMode === 'light'
              ? 'border-transparent text-slate-500 hover:text-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            soundFX.playPop(520, 0.04);
            setAuthMode('signup');
          }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            authMode === 'signup'
              ? 'border-emerald-500 text-emerald-500'
              : themeMode === 'light'
              ? 'border-transparent text-slate-500 hover:text-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Create Student Account
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
        
        {/* Quick Demo Personas Bar */}
        <div className={`p-4 rounded-2xl border space-y-2.5 ${
          themeMode === 'light'
            ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
            : 'bg-emerald-950/30 border-emerald-500/20 text-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${
              themeMode === 'light' ? 'text-emerald-800' : 'text-emerald-300'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Instant Demo Personas (1-Click Sign In)</span>
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              themeMode === 'light' ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-900/60 text-emerald-300'
            }`}>
              Quick Test
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {demoAccounts.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => handleQuickLogin(student)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer group ${
                  themeMode === 'light'
                    ? 'bg-white hover:bg-emerald-100/60 border-slate-200 hover:border-emerald-300 shadow-sm'
                    : 'bg-neutral-900/80 hover:bg-emerald-950/60 border-white/[0.08] hover:border-emerald-500/40'
                }`}
              >
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate group-hover:text-emerald-500 ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {student.name.split(' ')[0]}
                  </div>
                  <div className={`text-[10px] truncate ${
                    themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {student.department.split(' ')[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SIGN IN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${
                themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Campus .EDU or Student Email
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                  themeMode === 'light' ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.rivera@srmist.edu.in or student@university.edu"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs outline-none transition-all border ${
                    themeMode === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                      : 'bg-neutral-900 border-white/[0.08] text-slate-100 placeholder-slate-500 focus:bg-black focus:border-emerald-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-bold ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Campus Pass / Password
                </label>
                <span className={`text-[11px] ${
                  themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  Any demo password works
                </span>
              </div>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                  themeMode === 'light' ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-xs outline-none transition-all border ${
                    themeMode === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                      : 'bg-neutral-900 border-white/[0.08] text-slate-100 placeholder-slate-500 focus:bg-black focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-3.5 cursor-pointer ${
                    themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Sign In to UniVerse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* SIGN UP FORM WITH ORIGAMI AVATAR PICKER */
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            
            {/* Avatar Selector Showcase */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              themeMode === 'light'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-neutral-900/80 border-white/[0.08]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider font-['Space_Grotesk'] ${
                    themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                  }`}>
                    Student Mascot Avatar
                  </h4>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Choose or shuffle your campus avatar style
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRollOrigami}
                    disabled={isRolling}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Dice5 className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                    <span>Shuffle Avatar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrigamiPicker(!showOrigamiPicker)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'bg-neutral-800 border-white/[0.1] text-slate-200 hover:bg-neutral-700'
                    }`}
                  >
                    {showOrigamiPicker ? 'Hide Gallery' : 'Choose Mascot'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="relative">
                  <img
                    src={selectedOrigami}
                    alt={selectedOrigamiName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-950"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full text-[10px] font-bold">
                    ✓
                  </span>
                </div>
                <div>
                  <div className={`text-sm font-extrabold font-['Outfit',sans-serif] ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {selectedOrigamiName}
                  </div>
                  <div className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Campus Mascot Avatar
                  </div>
                </div>
              </div>

              {/* Origami Gallery Grid */}
              <AnimatePresence>
                {showOrigamiPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-white/[0.08] overflow-hidden"
                  >
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                      {ORIGAMI_AVATARS.map((origami) => (
                        <button
                          key={origami.id}
                          type="button"
                          onClick={() => handleSelectOrigami(origami.dataUri, origami.name)}
                          className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            selectedOrigami === origami.dataUri
                              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                              : themeMode === 'light'
                              ? 'border-slate-200 hover:border-slate-300 bg-white'
                              : 'border-white/[0.08] hover:border-white/20 bg-neutral-800/80'
                          }`}
                        >
                          <img
                            src={origami.dataUri}
                            alt={origami.name}
                            className="w-10 h-10 rounded-xl object-cover shadow-sm bg-slate-950"
                          />
                          <span className={`text-[10px] font-bold truncate max-w-full text-center ${
                            themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
                          }`}>
                            {origami.animal}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`block font-bold mb-1 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                        : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Campus .EDU Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan.lee@university.edu"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                        : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <UniversitySelector
                value={collegeName}
                onChange={(name) => setCollegeName(name)}
                themeMode={themeMode}
                label="College / University"
                placeholder="Select or search Indian university (e.g. SRM University)"
                required
              />

              <div>
                <label className={`block font-bold mb-1 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Department / Major
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                        : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`block font-bold mb-1 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Academic Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    themeMode === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                      : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                  }`}
                >
                  <option value="1st Semester (Freshman)">1st Semester (Freshman)</option>
                  <option value="2nd Semester (Freshman)">2nd Semester (Freshman)</option>
                  <option value="3rd Semester (Sophomore)">3rd Semester (Sophomore)</option>
                  <option value="4th Semester (Sophomore)">4th Semester (Sophomore)</option>
                  <option value="5th Semester (Junior)">5th Semester (Junior)</option>
                  <option value="6th Semester (Junior)">6th Semester (Junior)</option>
                  <option value="7th Semester (Senior)">7th Semester (Senior)</option>
                  <option value="8th Semester (Senior)">8th Semester (Senior)</option>
                  <option value="Graduate / Master">Graduate / Master</option>
                  <option value="PhD Scholar">PhD Scholar</option>
                </select>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${
                  themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  Dorm / Campus Zone
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={dormLocation}
                    onChange={(e) => setDormLocation(e.target.value)}
                    placeholder="e.g. Oak Hall 202"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                        : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className={`block font-bold mb-1 ${
                themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Bio & Study Interests
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What courses are you taking? What items or skills do you offer?"
                className={`w-full p-3 rounded-xl border outline-none ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                    : 'bg-neutral-900 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Create Account & Join Campus</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );

  if (isPageMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        {content}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl flex justify-center"
          >
            {content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
