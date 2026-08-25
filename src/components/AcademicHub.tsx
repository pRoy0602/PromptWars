import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AcademicResource } from '../types';
import {
  GraduationCap,
  Search,
  Download,
  ThumbsUp,
  FileText,
  ShieldCheck,
  Plus,
  Eye,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/soundFx';

export const AcademicHub: React.FC = () => {
  const {
    academicResources,
    selectedAcademicDoc,
    setSelectedAcademicDoc,
    incrementDocDownload,
    upvoteAcademicDoc,
    addAcademicResource,
    currentUser,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Note State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newCourseCode, setNewCourseCode] = useState('CS 341');
  const [newSubject, setNewSubject] = useState('Web Applications');
  const [newSemester, setNewSemester] = useState('5th Semester');
  const [newType, setNewType] = useState<'notes' | 'study_guide' | 'past_paper' | 'lab_manual' | 'cheatsheet' | 'summary'>('notes');
  const [newDescription, setNewDescription] = useState('');
  const [newTopics, setNewTopics] = useState('');

  const departments = [
    'All Departments',
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business & Management',
    'Biomedical Engineering',
  ];

  const semesters = [
    'All Semesters',
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
  ];

  const resourceTypes = [
    { id: 'all', label: 'All Resource Types' },
    { id: 'notes', label: 'Class Notes' },
    { id: 'cheatsheet', label: 'Formula Cheatsheets' },
    { id: 'study_guide', label: 'Finals Study Guides' },
    { id: 'lab_manual', label: 'Lab Manuals' },
    { id: 'summary', label: 'Subject Roadmaps' },
  ];

  const filteredDocs = academicResources.filter((doc) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const mTitle = doc.title.toLowerCase().includes(q);
      const mSubject = doc.subject.toLowerCase().includes(q);
      const mCourse = doc.courseCode.toLowerCase().includes(q);
      const mDept = doc.department.toLowerCase().includes(q);
      const mTopics = doc.topicsCovered.some((t) => t.toLowerCase().includes(q));
      if (!mTitle && !mSubject && !mCourse && !mDept && !mTopics) return false;
    }

    if (selectedDept !== 'all' && selectedDept !== 'All Departments' && doc.department !== selectedDept) {
      return false;
    }

    if (selectedSemester !== 'all' && selectedSemester !== 'All Semesters' && doc.semester !== selectedSemester) {
      return false;
    }

    if (selectedType !== 'all' && doc.resourceType !== selectedType) {
      return false;
    }

    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const topicsArray = newTopics.split(',').map((t) => t.trim()).filter(Boolean);

    addAcademicResource({
      title: newTitle.trim(),
      department: newDept,
      courseCode: newCourseCode.trim(),
      subject: newSubject.trim(),
      semester: newSemester,
      resourceType: newType,
      fileFormat: 'PDF',
      pageCount: 35,
      fileSize: '4.8 MB',
      description: newDescription.trim(),
      previewSnippets: [
        `Summary notes for ${newCourseCode} finals review`,
        'Includes diagrams, formulas, and solved exercise questions',
      ],
      topicsCovered: topicsArray.length > 0 ? topicsArray : [newSubject, newCourseCode],
      verifiedByProf: true,
    });

    soundFX.playPop(800, 0.1);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewTopics('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 rounded-3xl border border-indigo-500/20 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Academic Vault & Study Notes Bank</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white">
            Class Notes, Solved Midterms & Formula Sheets
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            High-yield study companions shared by top students and teaching assistants across all departments. Search by course code, semester, or subject.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                soundFX.playPop(600, 0.05);
                setIsUploadModalOpen(true);
              }}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer interactive-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Share Study Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section: Search, Department, Semester, Resource Type */}
      <div className="bg-slate-900/70 backdrop-blur-xl p-5 rounded-3xl border border-white/[0.08] shadow-2xl space-y-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Course (e.g. CS 301, EE 210), Subject, or Topic..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-950/90 text-sm font-semibold text-white placeholder-slate-400 rounded-2xl border border-white/[0.18] focus:bg-black focus:border-indigo-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <select
            value={selectedDept}
            onChange={(e) => {
              soundFX.playPop(480, 0.03);
              setSelectedDept(e.target.value);
            }}
            className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.08] font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d} value={d === 'All Departments' ? 'all' : d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => {
              soundFX.playPop(520, 0.03);
              setSelectedSemester(e.target.value);
            }}
            className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.08] font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {semesters.map((s) => (
              <option key={s} value={s === 'All Semesters' ? 'all' : s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              soundFX.playPop(560, 0.03);
              setSelectedType(e.target.value);
            }}
            className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.08] font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {resourceTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-lg hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 font-bold text-xs border border-indigo-500/30 font-['Space_Grotesk']">
                    {doc.courseCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{doc.semester}</span>
                </div>
                {doc.verifiedByProf && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Top Peer Verified
                  </span>
                )}
              </div>

              <h3
                onClick={() => {
                  soundFX.playPop(650, 0.05);
                  setSelectedAcademicDoc(doc);
                }}
                className="font-bold text-base text-white group-hover:text-indigo-400 cursor-pointer transition-colors leading-snug font-['Outfit',sans-serif]"
              >
                {doc.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {doc.description}
              </p>

              {/* Topics Covered */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {doc.topicsCovered.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-950/60 text-slate-300 text-[10px] font-medium border border-white/[0.08]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <img
                  src={doc.author.avatar}
                  alt={doc.author.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
                <span className="truncate text-slate-300 font-medium">{doc.author.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFX.playPop(750, 0.05);
                    upvoteAcademicDoc(doc.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold flex items-center gap-1.5 text-xs transition-colors border border-white/[0.08] cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-['Space_Grotesk']">{doc.upvotes}</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playPop(850, 0.05);
                    incrementDocDownload(doc.id);
                    setSelectedAcademicDoc(doc);
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-xs cursor-pointer interactive-btn"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get ({doc.downloadCount})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Document Preview Reader */}
      {selectedAcademicDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                  {selectedAcademicDoc.courseCode} • {selectedAcademicDoc.semester}
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1.5 font-['Outfit',sans-serif]">
                  {selectedAcademicDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAcademicDoc(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl space-y-2 text-xs border border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subject: <strong className="text-white">{selectedAcademicDoc.subject}</strong></span>
                <span>Department: <strong className="text-white">{selectedAcademicDoc.department}</strong></span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>File Format: <strong className="text-white">{selectedAcademicDoc.fileFormat}</strong> ({selectedAcademicDoc.fileSize})</span>
                <span>Pages: <strong className="text-white">{selectedAcademicDoc.pageCount} Pages</strong></span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">
                Document Preview & Chapter Outline
              </h4>
              <div className="space-y-2">
                {selectedAcademicDoc.previewSnippets.map((snippet, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/50 border border-white/[0.08] text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{snippet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFX.playPop(700, 0.05);
                    upvoteAcademicDoc(selectedAcademicDoc.id);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upvote ({selectedAcademicDoc.upvotes})</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundFX.playPop(900, 0.1);
                  incrementDocDownload(selectedAcademicDoc.id);
                  showToast('Downloaded Companion', `Saved ${selectedAcademicDoc.title} (${selectedAcademicDoc.fileFormat})`, 'success');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 active:scale-95 transition-all cursor-pointer interactive-btn"
              >
                <Download className="w-4 h-4" />
                <span>Download Study Companion ({selectedAcademicDoc.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload Study Notes */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2 font-['Outfit',sans-serif]">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Upload Class Notes or Exam Study Guide</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Final Review Guide + Solved Midterm"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none"
                  >
                    <option>Computer Science</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Business & Management</option>
                    <option>Biomedical Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none"
                  >
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>3rd Semester</option>
                    <option>4th Semester</option>
                    <option>5th Semester</option>
                    <option>6th Semester</option>
                    <option>7th Semester</option>
                    <option>8th Semester</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. CS 301"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline what chapters or exam questions are covered..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Key Topics (Comma-separated)</label>
                <input
                  type="text"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder="e.g. Virtual Memory, Deadlocks, Paging, CPU Scheduling"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
