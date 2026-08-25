import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundFX } from '../utils/soundFx';
import { Interactive3DCard } from './Interactive3DCard';
import { ORIGAMI_AVATARS } from '../utils/origamiAvatars';
import { OTHER_STUDENTS, CURRENT_USER } from '../data/mockData';
import { StudentUser } from '../types';
import { UniversitySelector } from './UniversitySelector';
import {
  ShieldCheck,
  Star,
  DollarSign,
  Repeat,
  Gift,
  Heart,
  Edit,
  Trash2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Mail,
  Calendar,
  Dice5,
  LogOut,
  UserCheck,
  Users,
  Settings,
  PlusCircle,
  Eye,
  ArrowRight,
  Shield,
  Volume2,
  VolumeX,
  Sparkle,
  X,
  ExternalLink,
  GraduationCap,
  Building,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Link as LinkIcon,
  UploadCloud,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Preset realistic campus student photos for 1-click select
const STUDENT_PHOTO_PRESETS = [
  {
    id: 'preset-1',
    name: 'Campus Student (Alex)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    tag: 'Engineering',
  },
  {
    id: 'preset-2',
    name: 'Campus Student (Rahul)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    tag: 'Computer Science',
  },
  {
    id: 'preset-3',
    name: 'Campus Student (Maya)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    tag: 'BioTech',
  },
  {
    id: 'preset-4',
    name: 'Campus Student (David)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    tag: 'Business',
  },
  {
    id: 'preset-5',
    name: 'Campus Student (Ananya)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    tag: 'Design & UI/UX',
  },
  {
    id: 'preset-6',
    name: 'Campus Student (Karan)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    tag: 'Data Science',
  },
  {
    id: 'preset-7',
    name: 'Campus Student (Zoe)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    tag: 'Economics',
  },
  {
    id: 'preset-8',
    name: 'Campus Student (Dev)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    tag: 'Robotics',
  },
];

export const StudentProfile: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    listings,
    deleteListing,
    markListingExchanged,
    savedListingIds,
    toggleSaveListing,
    setSelectedListing,
    exchangeRequests,
    itemRequests,
    openCreateRequestModal,
    deleteItemRequest,
    markRequestFulfilled,
    setIsVerificationModalOpen,
    setIsCreateListingOpen,
    openAuthModal,
    loginAsStudent,
    logout,
    isAuthenticated,
    themeMode,
    showToast,
    setCurrentPage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'saved' | 'reviews' | 'history' | 'settings'>('listings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Avatar / Photo Management in Edit Profile
  const [avatarTab, setAvatarTab] = useState<'upload' | 'presets' | 'origami'>('upload');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editCollege, setEditCollege] = useState(currentUser.collegeName || currentUser.college || 'SRM Institute of Science and Technology (SRM University)');
  const [editDept, setEditDept] = useState(currentUser.department);
  const [editSemester, setEditSemester] = useState(currentUser.semester || '6th Semester (Junior)');
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editDorm, setEditDorm] = useState(currentUser.dormLocation || currentUser.campusZone || 'Java Hostel / Block 3');
  const [editEmail, setEditEmail] = useState(currentUser.contactEmail || currentUser.email || 'alex.rivera@srmist.edu.in');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editAvatarName, setEditAvatarName] = useState(currentUser.origamiFigure || 'Emerald Crane');

  // Open Edit Modal & synchronize values
  const openEditModal = (defaultTab: 'upload' | 'presets' | 'origami' = 'upload') => {
    setEditName(currentUser.name);
    setEditCollege(currentUser.collegeName || currentUser.college || 'SRM Institute of Science and Technology (SRM University)');
    setEditDept(currentUser.department);
    setEditSemester(currentUser.semester || '6th Semester (Junior)');
    setEditBio(currentUser.bio || '');
    setEditDorm(currentUser.dormLocation || currentUser.campusZone || 'Java Hostel / Block 3');
    setEditEmail(currentUser.contactEmail || currentUser.email || 'alex.rivera@srmist.edu.in');
    setEditAvatar(currentUser.avatar);
    setEditAvatarName(currentUser.origamiFigure || 'Student Photo');
    setAvatarTab(defaultTab);
    setPhotoUrlInput('');
    setIsEditingProfile(true);
    soundFX.playPop(520, 0.04);
  };

  // Process Photo File Upload
  const handlePhotoFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP, GIF).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload a photo smaller than 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      if (dataUri) {
        setEditAvatar(dataUri);
        setEditAvatarName('Custom Uploaded Photo');
        soundFX.playSuccess();
        showToast('Photo Loaded', 'Your custom profile photo has been selected.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo URL Input
  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) {
      showToast('Empty URL', 'Please enter a valid image web URL.', 'info');
      return;
    }
    const cleanUrl = photoUrlInput.trim();
    setEditAvatar(cleanUrl);
    setEditAvatarName('Web Linked Photo');
    setPhotoUrlInput('');
    soundFX.playSuccess();
    showToast('Photo Set', 'Profile photo updated from link.', 'success');
  };

  // Reset to Origami Mascot
  const handleResetToMascot = () => {
    const randomItem = ORIGAMI_AVATARS[0];
    setEditAvatar(randomItem.dataUri);
    setEditAvatarName(randomItem.name);
    setAvatarTab('origami');
    soundFX.playPop(480, 0.05);
    showToast('Reset to Mascot', 'Switched to Origami mascot.', 'info');
  };

  // Quick Shuffle Avatar
  const handleShuffleAvatar = () => {
    soundFX.playPop(700, 0.08);
    setIsRolling(true);
    setTimeout(() => {
      const randomItem = ORIGAMI_AVATARS[Math.floor(Math.random() * ORIGAMI_AVATARS.length)];
      updateCurrentUser({
        avatar: randomItem.dataUri,
        origamiFigure: randomItem.name,
      });
      setEditAvatar(randomItem.dataUri);
      setEditAvatarName(randomItem.name);
      setIsRolling(false);
      soundFX.playSuccess();
      showToast('Avatar Updated!', `Profile mascot updated to ${randomItem.name}.`, 'success');
    }, 220);
  };

  // Select Avatar from Gallery
  const handleSelectAvatar = (dataUri: string, name: string) => {
    soundFX.playPop(520, 0.05);
    setEditAvatar(dataUri);
    setEditAvatarName(name);
    showToast('Avatar Selected', `Selected ${name}.`, 'success');
  };

  // Save Profile Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();
    updateCurrentUser({
      name: editName.trim(),
      collegeName: editCollege.trim(),
      college: editCollege.trim(),
      department: editDept.trim(),
      semester: editSemester.trim(),
      bio: editBio.trim(),
      dormLocation: editDorm.trim(),
      campusZone: editDorm.trim(),
      contactEmail: editEmail.trim(),
      email: editEmail.trim(),
      avatar: editAvatar,
      origamiFigure: editAvatarName,
    });
    setIsEditingProfile(false);
    showToast('Profile Updated', 'Your student profile information and photo have been saved.', 'success');
  };

  // Handle Logout
  const handleSignOut = () => {
    soundFX.playPop(440, 0.05);
    logout();
    showToast('Signed Out', 'You have signed out of your campus profile.', 'info');
  };

  // Filter listings & history for current user
  const myListings = listings.filter((l) => l.author.id === currentUser.id);
  const myRequests = itemRequests.filter((r) => r.requesterId === currentUser.id);
  const mySavedListings = listings.filter((l) => savedListingIds.includes(l.id));
  const myCompletedExchanges = exchangeRequests.filter(
    (r) => (r.senderId === currentUser.id || r.receiverId === currentUser.id) && r.status === 'completed'
  );

  // Demo accounts list for quick switcher
  const demoAccounts: StudentUser[] = [
    CURRENT_USER,
    ...Object.values(OTHER_STUDENTS),
  ];

  // ----------------------------------------------------
  // 1. SIGNED OUT VIEW (User is logged out)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Signed Out Banner */}
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl text-center space-y-6 transition-all ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/60'
              : 'bg-neutral-900/90 backdrop-blur-xl border-white/[0.08] text-slate-100'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              UniVerse Student Profile
            </h1>
            <p className={`text-sm ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              You are currently signed out. Sign in with your campus .edu account or try a student demo profile to view active listings, exchange history, and campus karma.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                soundFX.playPop(520, 0.05);
                openAuthModal('login');
              }}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Sign In to Student Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playPop(520, 0.05);
                openAuthModal('signup');
              }}
              className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-200'
              }`}
            >
              Create New Account
            </button>
          </div>
        </div>

        {/* 1-Click Demo Profiles Selection */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-lg space-y-5 ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              : 'bg-neutral-900/80 border-white/[0.08] text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                Try Demo Student Personas
              </h3>
              <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                1-click sign in to test different student roles and view their dashboard
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoAccounts.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                    : 'bg-neutral-950 border-white/[0.06] hover:border-emerald-500/40 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 bg-slate-950"
                  />
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${
                      themeMode === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      {student.name}
                    </h4>
                    <p className={`text-xs truncate ${
                      themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {student.department}
                    </p>
                    <span className="text-[10px] text-emerald-500 font-semibold">
                      ★ {student.rating} ({student.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFX.playSuccess();
                    loginAsStudent(student);
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm text-center"
                >
                  Sign In as {student.name.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. SIGNED IN VIEW (Active Student Profile)
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Banner & Header Card */}
      <div
        className={`rounded-3xl border shadow-xl overflow-hidden transition-all ${
          themeMode === 'light'
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/70'
            : 'bg-neutral-900/90 backdrop-blur-xl border-white/[0.08] text-slate-100'
        }`}
      >
        {/* Banner Gradient */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
          <div className="absolute right-4 sm:right-6 top-4 sm:top-6 flex items-center gap-2">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold font-['Space_Grotesk'] border border-white/20 shadow-md">
              UniVerse Verified Pass
            </span>
          </div>
        </div>

        {/* Profile Info & Actions Bar */}
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between -mt-14 sm:-mt-16 gap-6 mb-6">
            
            {/* Avatar & Core Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              {/* Avatar Container with Add/Change Photo overlay */}
              <div className="relative shrink-0 self-start sm:self-auto group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-950 overflow-hidden relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Camera / Edit Photo Hover Overlay */}
                  <button
                    type="button"
                    onClick={() => openEditModal('upload')}
                    title="Add or Change Profile Photo"
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition-opacity cursor-pointer gap-1 p-2 text-center"
                  >
                    <Camera className="w-5 h-5 text-emerald-400" />
                    <span>Change Photo</span>
                  </button>
                </div>

                {/* Quick Add Photo mini badge */}
                <button
                  type="button"
                  onClick={() => openEditModal('upload')}
                  title="Add or Upload Profile Photo"
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors shadow-md cursor-pointer sm:hidden"
                >
                  <Camera className="w-3 h-3" />
                </button>

                {currentUser.verified && (
                  <span
                    title={currentUser.verifiedBadgeText || 'Verified Student'}
                    className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-950 shadow-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Identity Details */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] tracking-tight ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {currentUser.name}
                  </h1>

                  {currentUser.verified ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Student</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        soundFX.playPop(650, 0.05);
                        setIsVerificationModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-bold hover:bg-amber-500/25 transition-colors border border-amber-500/40 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Verify .EDU ID</span>
                    </button>
                  )}

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 shrink-0 ${
                    themeMode === 'light'
                      ? 'bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-neutral-800 border-white/[0.1] text-slate-300'
                  }`}>
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{currentUser.reputationPoints || 480} Karma</span>
                  </span>
                </div>

                <p className={`text-xs sm:text-sm font-medium ${
                  themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {currentUser.department} • <span className="font-semibold text-emerald-500">{currentUser.collegeName || currentUser.college || 'SRM University'}</span>
                  {currentUser.semester && ` (${currentUser.semester})`}
                </p>

                <div className={`flex flex-wrap items-center gap-2 text-xs pt-0.5 ${
                  themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {currentUser.rating} ({currentUser.reviewCount} peer reviews)
                  </span>
                  <span>•</span>
                  <span>Trust Score: <strong className="text-emerald-500">98%</strong></span>
                  <span>•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-emerald-500" />
                    {currentUser.origamiFigure || 'Student Photo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar (Cleanly Aligned & Uniform Heights) */}
            <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-center shrink-0">
              
              {/* 1. Edit Profile & Photo */}
              <button
                onClick={() => openEditModal('upload')}
                className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Edit Profile & Photo</span>
              </button>

              {/* 2. Shuffle Mascot */}
              <button
                onClick={handleShuffleAvatar}
                disabled={isRolling}
                className={`h-10 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-200'
                }`}
                title="Shuffle Student Avatar Mascot"
              >
                <Dice5 className={`w-3.5 h-3.5 text-emerald-500 ${isRolling ? 'animate-spin' : ''}`} />
                <span>Shuffle Mascot</span>
              </button>

              {/* 3. Switch Account */}
              <button
                onClick={() => {
                  soundFX.playPop(480, 0.04);
                  setIsSwitchModalOpen(true);
                }}
                className={`h-10 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
                }`}
                title="Switch Student Persona"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Switch Account</span>
              </button>

              {/* 4. Sign Out Button (Prominent & Clear) */}
              <button
                onClick={handleSignOut}
                className={`h-10 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  themeMode === 'light'
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700 hover:border-rose-300'
                    : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/30 text-rose-300'
                }`}
                title="Sign Out of Campus Session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Student Bio */}
          <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed mt-2 ${
            themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {currentUser.bio || 'Active campus student exchanging textbooks, lab kits, and peer tutoring on UniVerse Exchange.'}
          </p>

          {/* Meta Details Badges */}
          <div className={`mt-5 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs pt-4 border-t ${
            themeMode === 'light' ? 'border-slate-200 text-slate-600' : 'border-white/[0.08] text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{currentUser.contactEmail || currentUser.email || 'student@university.edu'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Dorm / Campus: {currentUser.dormLocation || currentUser.campusZone || 'Main Campus Dorms'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Member since {currentUser.joinedDate || 'August 2026'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Impact Stats Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Interactive3DCard>
          <div className={`p-5 rounded-3xl border shadow-lg flex items-center gap-4 h-full transition-all ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              : 'bg-neutral-900/70 backdrop-blur-xl border-white/[0.08] text-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
              themeMode === 'light'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
            }`}>
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {currentUser.itemsReusedCount}
              </div>
              <div className={`text-xs font-medium ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Items Reused
              </div>
            </div>
          </div>
        </Interactive3DCard>

        <Interactive3DCard>
          <div className={`p-5 rounded-3xl border shadow-lg flex items-center gap-4 h-full transition-all ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              : 'bg-neutral-900/70 backdrop-blur-xl border-white/[0.08] text-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
              themeMode === 'light'
                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                : 'bg-teal-950/80 text-teal-400 border border-teal-500/30'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                ${currentUser.moneySaved}
              </div>
              <div className={`text-xs font-medium ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Money Saved
              </div>
            </div>
          </div>
        </Interactive3DCard>

        <Interactive3DCard>
          <div className={`p-5 rounded-3xl border shadow-lg flex items-center gap-4 h-full transition-all ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              : 'bg-neutral-900/70 backdrop-blur-xl border-white/[0.08] text-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
              themeMode === 'light'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
            }`}>
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {currentUser.itemsDonatedCount}
              </div>
              <div className={`text-xs font-medium ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Items Donated
              </div>
            </div>
          </div>
        </Interactive3DCard>

        <Interactive3DCard>
          <div className={`p-5 rounded-3xl border shadow-lg flex items-center gap-4 h-full transition-all ${
            themeMode === 'light'
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              : 'bg-neutral-900/70 backdrop-blur-xl border-white/[0.08] text-slate-100'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
              themeMode === 'light'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-purple-950/80 text-purple-400 border border-purple-500/30'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-extrabold font-['Outfit',sans-serif] ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {currentUser.reputationPoints || 480}
              </div>
              <div className={`text-xs font-medium ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Campus Karma
              </div>
            </div>
          </div>
        </Interactive3DCard>
      </div>

      {/* Profile Content Tabs */}
      <div className="space-y-6">
        <div className={`flex items-center gap-2 border-b pb-2 overflow-x-auto scrollbar-none ${
          themeMode === 'light' ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
          <button
            onClick={() => {
              soundFX.playPop(480, 0.04);
              setActiveTab('listings');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            My Active Listings ({myListings.length})
          </button>

          <button
            onClick={() => {
              soundFX.playPop(500, 0.04);
              setActiveTab('requests');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>My Item Requests ({myRequests.length})</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPop(520, 0.04);
              setActiveTab('saved');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            Saved Items ({mySavedListings.length})
          </button>

          <button
            onClick={() => {
              soundFX.playPop(560, 0.04);
              setActiveTab('reviews');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            Reviews & Trust ({currentUser.reviewCount})
          </button>

          <button
            onClick={() => {
              soundFX.playPop(600, 0.04);
              setActiveTab('history');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            Exchange History ({myCompletedExchanges.length})
          </button>

          <button
            onClick={() => {
              soundFX.playPop(640, 0.04);
              setActiveTab('settings');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                : themeMode === 'light'
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                : 'bg-neutral-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: MY ACTIVE LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-4 ${
                themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-neutral-900/40 border-white/[0.08] text-slate-400'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Repeat className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold text-base ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    No active listings yet
                  </h3>
                  <p className="text-xs max-w-sm mx-auto">
                    List unwanted textbooks, lab equipment, or electronics to save money and prevent landfill waste on campus.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundFX.playPop(520, 0.05);
                    setIsCreateListingOpen(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Listing</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`rounded-3xl border overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
                      themeMode === 'light'
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
                    }`}
                  >
                    <div>
                      <div className="h-44 relative bg-slate-950">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          listing.status === 'active'
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-neutral-800 text-slate-300'
                        }`}>
                          {listing.status}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                          {listing.exchangeType === 'donate'
                            ? 'Free Donation'
                            : listing.exchangeType === 'barter'
                            ? 'Trade / Barter'
                            : `$${listing.price}`}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className={`font-bold text-sm line-clamp-1 ${
                          themeMode === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {listing.title}
                        </h4>
                        <p className={`text-xs line-clamp-2 ${
                          themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {listing.description}
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 border-t flex items-center justify-between gap-2 ${
                      themeMode === 'light' ? 'border-slate-100 bg-slate-50/60' : 'border-white/[0.06] bg-neutral-950/40'
                    }`}>
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className={`text-xs font-bold hover:underline cursor-pointer ${
                          themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        View Card
                      </button>

                      <div className="flex items-center gap-2">
                        {listing.status === 'active' && (
                          <button
                            onClick={() => {
                              soundFX.playSuccess();
                              markListingExchanged(listing.id);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            Mark Traded
                          </button>
                        )}
                        <button
                          onClick={() => {
                            soundFX.playPop(420, 0.05);
                            deleteListing(listing.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            themeMode === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-rose-950/40 hover:bg-rose-900 text-rose-300 border-rose-500/20'
                          }`}
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: MY ITEM REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            {myRequests.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-4 ${
                themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-neutral-900/40 border-white/[0.08] text-slate-400'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold text-base ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    No item requests posted yet
                  </h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Looking for a textbook, lab apron, scientific calculator, or dorm item? Post a request and students with the item will respond with offers!
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      soundFX.playPop(520, 0.05);
                      openCreateRequestModal();
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post an Item Request</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playPop(500, 0.05);
                      setCurrentPage('requests');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                      themeMode === 'light' ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100' : 'border-white/10 text-slate-200 bg-neutral-900 hover:bg-neutral-800'
                    }`}
                  >
                    Browse Request Board
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    You have posted <strong>{myRequests.length}</strong> request{myRequests.length !== 1 ? 's' : ''} on the campus board
                  </span>
                  <button
                    onClick={() => openCreateRequestModal()}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post New Request</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-5 rounded-3xl border shadow-lg flex flex-col justify-between gap-4 transition-all ${
                        themeMode === 'light'
                          ? 'bg-white border-slate-200 text-slate-900'
                          : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                              {req.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'fulfilled'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-amber-400">
                            {req.budget ? `$${req.budget}` : 'Trade / Free'}
                          </span>
                        </div>

                        <h4 className={`text-base font-bold line-clamp-1 ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                          {req.title}
                        </h4>

                        <p className={`text-xs line-clamp-2 ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                          {req.description}
                        </p>

                        {/* Offers Count & Urgency */}
                        <div className="flex items-center gap-3 text-xs pt-1">
                          <span className="text-amber-400 font-semibold">
                            💬 {req.offers.length} Student Offer{req.offers.length !== 1 ? 's' : ''} Received
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 capitalize">
                            Urgency: {req.urgency}
                          </span>
                        </div>

                        {/* Offers Preview if available */}
                        {req.offers.length > 0 && (
                          <div className={`p-3 rounded-2xl border text-xs space-y-2 mt-2 ${
                            themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.06]'
                          }`}>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                              Latest Offer:
                            </span>
                            <div className="flex items-start gap-2.5">
                              <img
                                src={req.offers[req.offers.length - 1].offererAvatar}
                                alt={req.offers[req.offers.length - 1].offererName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-slate-200">
                                  {req.offers[req.offers.length - 1].offererName}
                                </span>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                                  {req.offers[req.offers.length - 1].message}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                        themeMode === 'light' ? 'border-slate-100' : 'border-white/[0.06]'
                      }`}>
                        <button
                          onClick={() => {
                            soundFX.playPop(520, 0.05);
                            setCurrentPage('requests');
                          }}
                          className={`text-xs font-bold hover:underline cursor-pointer ${
                            themeMode === 'light' ? 'text-amber-700' : 'text-amber-400'
                          }`}
                        >
                          Open on Board
                        </button>

                        <div className="flex items-center gap-2">
                          {req.status === 'open' && (
                            <button
                              onClick={() => {
                                soundFX.playSuccess();
                                markRequestFulfilled(req.id);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                themeMode === 'light'
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              Mark Fulfilled
                            </button>
                          )}
                          <button
                            onClick={() => {
                              soundFX.playPop(420, 0.05);
                              deleteItemRequest(req.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              themeMode === 'light'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-rose-950/40 hover:bg-rose-900 text-rose-300 border-rose-500/20'
                            }`}
                            title="Delete Request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ITEMS */}
        {activeTab === 'saved' && (
          <div>
            {mySavedListings.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 ${
                themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-neutral-900/40 border-white/[0.08] text-slate-400'
              }`}>
                <Heart className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className={`font-bold text-base ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  No saved items yet
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  Click the heart icon on any textbook or gear listing to keep track of items you wish to trade or buy later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySavedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`rounded-3xl border overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
                      themeMode === 'light'
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
                    }`}
                  >
                    <div>
                      <div className="h-44 relative bg-slate-950">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                          {listing.exchangeType === 'donate' ? 'Free' : `$${listing.price || 0}`}
                        </span>
                      </div>
                      <div className="p-5 space-y-1.5">
                        <h4 className={`font-bold text-sm line-clamp-1 ${
                          themeMode === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {listing.title}
                        </h4>
                        <p className={`text-xs line-clamp-2 ${
                          themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {listing.description}
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 border-t flex items-center justify-between ${
                      themeMode === 'light' ? 'border-slate-100 bg-slate-50/60' : 'border-white/[0.06] bg-neutral-950/40'
                    }`}>
                      <span className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        By {listing.author.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSaveListing(listing.id)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                            themeMode === 'light'
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-300'
                              : 'bg-neutral-800 text-slate-300 hover:bg-neutral-700 border-white/[0.1]'
                          }`}
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          View & Trade
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS & TRUST */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
              themeMode === 'light'
                ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
                : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className={`font-extrabold text-base font-['Outfit',sans-serif] ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    Student Trust Index: 98%
                  </h4>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Based on verified library meetups, safe trade handoffs, and honest condition descriptions
                  </p>
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span>{currentUser.rating}</span>
                  <span className={`text-xs font-normal ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    ({currentUser.reviewCount} total)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-500">Priya S. (EE Junior)</span>
                    <span className="text-slate-400">3 days ago</span>
                  </div>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    "Awesome peer swap! Alex traded his Circuit Analysis book and arrived right on time at North Library. Book was in pristine shape."
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-500">Marcus C. (MechE)</span>
                    <span className="text-slate-400">1 week ago</span>
                  </div>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    "Smooth exchange for the Arduino UNO kit. Everything tested working in the lab. Highly recommend trading with him!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXCHANGE HISTORY */}
        {activeTab === 'history' && (
          <div>
            {myCompletedExchanges.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 ${
                themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-neutral-900/40 border-white/[0.08] text-slate-400'
              }`}>
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className={`font-bold text-base ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  No completed exchanges yet
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  When you complete a trade or donation, your campus circulation impact and savings will appear here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myCompletedExchanges.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      themeMode === 'light'
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.listingImage}
                        alt={req.listingTitle}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs">{req.listingTitle}</h4>
                        <p className="text-[11px] text-slate-400">
                          Completed with {req.senderId === currentUser.id ? req.receiverName : req.senderName}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                      ✓ Handed Off
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACCOUNT SETTINGS & SIGN OUT */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
              themeMode === 'light'
                ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
                : 'bg-neutral-900/70 border-white/[0.08] text-slate-100'
            }`}>
              <div>
                <h3 className={`font-extrabold text-base font-['Outfit',sans-serif] ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  Account & Security Preferences
                </h3>
                <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Manage your student credentials, verification, and session options
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Status Card */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Campus ID Verification</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                      {currentUser.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentUser.verifiedBadgeText || 'Verified College ID #STU-9402'}
                  </p>
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="text-xs font-bold text-emerald-500 hover:underline pt-1 block cursor-pointer"
                  >
                    View ID Badge Details →
                  </button>
                </div>

                {/* Meetup Safety Card */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>Primary Campus Zone</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                      Safe Zone
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentUser.dormLocation || currentUser.campusZone || 'Main Campus Dorms'}
                  </p>
                  <button
                    onClick={openEditModal}
                    className="text-xs font-bold text-indigo-400 hover:underline pt-1 block cursor-pointer"
                  >
                    Change Meetup Hub →
                  </button>
                </div>
              </div>

              {/* Sign Out Section (Clean & Prominent) */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                themeMode === 'light'
                  ? 'bg-rose-50/70 border-rose-200 text-slate-900'
                  : 'bg-rose-950/20 border-rose-500/20 text-slate-200'
              }`}>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <LogOut className="w-4 h-4" />
                    <span>Campus Session Management</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign out of this browser session or switch to another student profile.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSwitchModalOpen(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                        : 'bg-neutral-900 hover:bg-neutral-800 border-white/[0.1] text-slate-200'
                    }`}
                  >
                    Switch Account
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. EDIT PROFILE MODAL (User Friendly & Aligned)      */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 my-8 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
                  : 'bg-neutral-900 border-white/[0.1] text-slate-100'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between border-b pb-4 ${
                themeMode === 'light' ? 'border-slate-200' : 'border-white/[0.08]'
              }`}>
                <div>
                  <h3 className={`font-extrabold text-lg font-['Outfit',sans-serif] ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    Edit Student Profile
                  </h3>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Update your campus details, major, and student mascot avatar
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    themeMode === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* -------------------------------------------------- */}
                {/* Avatar & Photo Selection Multi-Tab Interface       */}
                {/* -------------------------------------------------- */}
                <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-white/[0.08]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 border-slate-200 dark:border-white/[0.08]">
                    <div>
                      <h4 className={`text-xs font-extrabold font-['Space_Grotesk'] uppercase tracking-wider ${
                        themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                      }`}>
                        Profile Photo & Student Avatar
                      </h4>
                      <p className={`text-xs ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        Upload your real photo, pick a campus preset, or select an Origami mascot
                      </p>
                    </div>

                    {/* 3 Tab Switcher */}
                    <div className={`flex items-center p-1 rounded-2xl border ${
                      themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-neutral-900 border-white/[0.08]'
                    }`}>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarTab('upload');
                          soundFX.playPop(500, 0.03);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          avatarTab === 'upload'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : themeMode === 'light'
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAvatarTab('presets');
                          soundFX.playPop(550, 0.03);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          avatarTab === 'presets'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : themeMode === 'light'
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Student Presets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAvatarTab('origami');
                          soundFX.playPop(600, 0.03);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          avatarTab === 'origami'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : themeMode === 'light'
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Origami Mascots</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Avatar Overview Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={editAvatar}
                          alt={editAvatarName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 bg-slate-950 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950">
                          <Check className="w-3 h-3" />
                        </span>
                      </div>
                      <div>
                        <div className={`text-sm font-extrabold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                          {editAvatarName}
                        </div>
                        <div className={`text-xs ${themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                          Selected for your campus profile
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={handleResetToMascot}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          themeMode === 'light'
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                            : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
                        }`}
                        title="Reset to default origami avatar"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset to Mascot</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: UPLOAD CUSTOM PHOTO */}
                  {avatarTab === 'upload' && (
                    <div className="space-y-4 pt-1">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoFileUpload(file);
                        }}
                      />

                      {/* Drag and Drop Zone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingPhoto(true);
                        }}
                        onDragLeave={() => setIsDraggingPhoto(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingPhoto(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handlePhotoFileUpload(file);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                          isDraggingPhoto
                            ? 'border-emerald-500 bg-emerald-500/15 scale-[1.01]'
                            : themeMode === 'light'
                            ? 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-white'
                            : 'border-white/[0.12] hover:border-emerald-500/60 hover:bg-neutral-900 bg-neutral-900/60'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-inner">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`text-sm font-extrabold ${
                            themeMode === 'light' ? 'text-slate-900' : 'text-white'
                          }`}>
                            Click to upload photo or drag and drop
                          </p>
                          <p className={`text-xs mt-0.5 ${
                            themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            PNG, JPG, WEBP or GIF (Max file size 8MB)
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Browse Device Photo</span>
                        </button>
                      </div>

                      {/* Photo URL Link Option */}
                      <div className={`p-3.5 rounded-2xl border space-y-2 ${
                        themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-neutral-900 border-white/[0.08]'
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <LinkIcon className="w-3.5 h-3.5 text-emerald-500" />
                          <span className={themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'}>
                            Or paste web image link
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={photoUrlInput}
                            onChange={(e) => setPhotoUrlInput(e.target.value)}
                            placeholder="https://example.com/my-profile-photo.jpg"
                            className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                              themeMode === 'light'
                                ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                                : 'bg-neutral-800 border-white/[0.1] text-slate-100 focus:border-emerald-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={handleApplyPhotoUrl}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            Set Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: STUDENT PHOTO PRESETS */}
                  {avatarTab === 'presets' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Choose from realistic student portrait presets:
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                        {STUDENT_PHOTO_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setEditAvatar(preset.url);
                              setEditAvatarName(preset.name);
                              soundFX.playPop(520, 0.04);
                              showToast('Preset Selected', `Selected ${preset.name}.`, 'success');
                            }}
                            className={`p-2.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer text-center relative ${
                              editAvatar === preset.url
                                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/50 shadow-md'
                                : themeMode === 'light'
                                ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                : 'border-white/[0.08] bg-neutral-900 hover:border-white/20'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-950/20 shadow-sm"
                            />
                            <div className="min-w-0 w-full">
                              <span className={`text-xs font-bold truncate block ${
                                themeMode === 'light' ? 'text-slate-900' : 'text-white'
                              }`}>
                                {preset.name.split(' ')[2] || preset.name}
                              </span>
                              <span className="text-[10px] text-emerald-500 font-semibold truncate block">
                                {preset.tag}
                              </span>
                            </div>
                            {editAvatar === preset.url && (
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-slate-950">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ORIGAMI MASCOTS */}
                  {avatarTab === 'origami' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${themeMode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Select an Origami campus animal mascot:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const random = ORIGAMI_AVATARS[Math.floor(Math.random() * ORIGAMI_AVATARS.length)];
                            setEditAvatar(random.dataUri);
                            setEditAvatarName(random.name);
                            soundFX.playPop(650, 0.05);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/40 rounded-xl text-xs font-bold cursor-pointer transition-all"
                        >
                          <Dice5 className="w-3.5 h-3.5" />
                          <span>Shuffle Random</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
                        {ORIGAMI_AVATARS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              handleSelectAvatar(item.dataUri, item.name);
                            }}
                            className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer relative ${
                              editAvatar === item.dataUri
                                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 shadow-sm'
                                : themeMode === 'light'
                                ? 'border-slate-200 bg-white hover:border-slate-300'
                                : 'border-white/[0.08] bg-neutral-800/80 hover:border-white/20'
                            }`}
                          >
                            <img
                              src={item.dataUri}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover bg-slate-950"
                            />
                            <span className={`text-[10px] font-bold truncate max-w-full text-center ${
                              themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
                            }`}>
                              {item.animal}
                            </span>
                            {editAvatar === item.dataUri && (
                              <div className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950">
                                <Check className="w-2 h-2" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Input Fields */}
                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full p-3 rounded-xl border outline-none ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                          : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <UniversitySelector
                      value={editCollege}
                      onChange={(newCollege) => setEditCollege(newCollege)}
                      themeMode={themeMode}
                      label="College / University"
                      placeholder="Select or search Indian university (e.g. SRM University)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Department / Major *
                    </label>
                    <input
                      type="text"
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className={`w-full p-3 rounded-xl border outline-none ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                          : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Semester / Standing
                    </label>
                    <input
                      type="text"
                      value={editSemester}
                      onChange={(e) => setEditSemester(e.target.value)}
                      className={`w-full p-3 rounded-xl border outline-none ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                          : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Dorm Location / Safe Meetup Hub
                    </label>
                    <input
                      type="text"
                      value={editDorm}
                      onChange={(e) => setEditDorm(e.target.value)}
                      className={`w-full p-3 rounded-xl border outline-none ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                          : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Student .EDU Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className={`w-full p-3 rounded-xl border outline-none ${
                        themeMode === 'light'
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                          : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className={`block font-bold mb-1.5 ${
                    themeMode === 'light' ? 'text-slate-800' : 'text-slate-300'
                  }`}>
                    Bio & Academic Focus
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className={`w-full p-3 rounded-xl border outline-none ${
                      themeMode === 'light'
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500'
                        : 'bg-neutral-800 border-white/[0.08] text-slate-100 focus:bg-black focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      themeMode === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.08] text-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* 4. SWITCH ACCOUNT MODAL                              */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isSwitchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
                  : 'bg-neutral-900 border-white/[0.1] text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3.5">
                <div>
                  <h3 className={`font-extrabold text-base font-['Outfit',sans-serif] ${
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    Switch Student Account
                  </h3>
                  <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Select another campus student profile or sign into your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwitchModalOpen(false)}
                  className={`p-1.5 rounded-xl border cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map((student) => {
                  const isCurrent = student.id === currentUser.id;
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => {
                        soundFX.playSuccess();
                        loginAsStudent(student);
                        setIsSwitchModalOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all text-left cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                          : themeMode === 'light'
                          ? 'bg-slate-50 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300'
                          : 'bg-neutral-950/80 hover:bg-neutral-800 border-white/[0.08] hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 bg-slate-950"
                        />
                        <div>
                          <div className={`text-xs font-bold ${
                            themeMode === 'light' ? 'text-slate-900' : 'text-white'
                          }`}>
                            {student.name} {isCurrent && <span className="text-emerald-500 text-[11px]">(Current)</span>}
                          </div>
                          <div className={`text-[11px] ${
                            themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {student.department} • {student.collegeName || 'Verified Campus'}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-emerald-500 font-bold">
                        {isCurrent ? 'Active' : 'Switch →'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitchModalOpen(false);
                    openAuthModal('login');
                  }}
                  className="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
                >
                  + Sign In With Other Email
                </button>
                <button
                  type="button"
                  onClick={() => setIsSwitchModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-neutral-800 hover:bg-neutral-700 border-white/[0.1] text-slate-300'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
