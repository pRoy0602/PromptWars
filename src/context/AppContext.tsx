import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  StudentUser,
  ExchangeRequest,
  SkillService,
  AcademicResource,
  CampusOpportunity,
  ResourceCategory,
  ExchangeType,
  ConditionType,
  CampusCirculationMetric,
  ResourceFlowCycle,
  ItemRequest,
  RequestOffer,
  RequestUrgency,
  RequestPreferredType,
} from '../types';
import {
  CURRENT_USER,
  OTHER_STUDENTS,
  INITIAL_LISTINGS,
  INITIAL_EXCHANGES,
  INITIAL_SKILLS,
  INITIAL_ACADEMIC_RESOURCES,
  INITIAL_OPPORTUNITIES,
  INITIAL_CIRCULATION_METRIC,
  INITIAL_RESOURCE_FLOWS,
  INITIAL_ITEM_REQUESTS,
} from '../data/mockData';
import { ORIGAMI_AVATARS, getRandomOrigamiAvatar } from '../utils/origamiAvatars';
import confetti from 'canvas-confetti';

export type NavPage =
  | 'home'
  | 'marketplace'
  | 'requests'
  | 'academic'
  | 'skills'
  | 'opportunities'
  | 'exchanges'
  | 'circulation'
  | 'profile'
  | 'auth';

export type ThemeMode = 'dark' | 'light';
export type PlanetTheme = 'emerald' | 'cyan' | 'violet' | 'amber';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface FilterState {
  searchQuery: string;
  category: ResourceCategory | 'all';
  exchangeType: ExchangeType | 'all';
  condition: ConditionType | 'all';
  campusZone: string;
  priceRange: 'all' | 'free' | 'under25' | 'under50' | 'above50';
  sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
}

interface AppContextType {
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  currentUser: StudentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<StudentUser>>;
  
  // Auth & Profile
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  login: (email: string, password?: string) => boolean;
  loginAsStudent: (student: StudentUser) => void;
  signup: (formData: {
    name: string;
    email: string;
    collegeName: string;
    department: string;
    semester: string;
    dormLocation?: string;
    bio?: string;
    origamiAvatar?: string;
    origamiFigure?: string;
  }) => boolean;
  logout: () => void;
  updateCurrentUser: (updatedFields: Partial<StudentUser>) => void;
  rollRandomOrigamiAvatar: () => string;

  // Theme Mode (Cosmic Night / Solar Day)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  
  // Planet Theme (for Dark Mode canvas)
  activePlanetTheme: PlanetTheme;
  setActivePlanetTheme: (theme: PlanetTheme) => void;
  
  // Listings
  listings: Listing[];
  addListing: (newListing: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'savedCount' | 'status' | 'author'>) => void;
  updateListingStatus: (id: string, status: 'active' | 'exchanged' | 'reserved') => void;
  markListingExchanged: (id: string) => void;
  deleteListing: (id: string) => void;
  savedListingIds: string[];
  toggleSaveListing: (id: string) => void;
  
  // Selected detail modal
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  
  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setCategoryFilter: (cat: ResourceCategory | 'all') => void;
  
  // Modals
  isCreateListingOpen: boolean;
  setIsCreateListingOpen: (open: boolean) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;
  isOfferExchangeModalOpen: boolean;
  setIsOfferExchangeModalOpen: (open: boolean) => void;
  
  // Exchange Requests
  exchangeRequests: ExchangeRequest[];
  createExchangeRequest: (listingId: string, offerDesc: string, cashAmount?: number, meetupPref?: string) => void;
  acceptExchangeRequest: (requestId: string) => void;
  declineExchangeRequest: (requestId: string) => void;
  cancelExchangeRequest: (requestId: string) => void;
  completeExchangeRequest: (requestId: string, rating?: number, reviewText?: string) => void;
  sendChatMessage: (requestId: string, text: string) => void;
  activeExchangeTab: 'incoming' | 'sent' | 'active' | 'completed';
  setActiveExchangeTab: (tab: 'incoming' | 'sent' | 'active' | 'completed') => void;
  
  // Skills
  skills: SkillService[];
  addSkillService: (skill: Omit<SkillService, 'id' | 'provider' | 'rating' | 'reviewsCount' | 'completedSessions'>) => void;
  
  // Academic Resources
  academicResources: AcademicResource[];
  selectedAcademicDoc: AcademicResource | null;
  setSelectedAcademicDoc: (doc: AcademicResource | null) => void;
  incrementDocDownload: (id: string) => void;
  upvoteAcademicDoc: (id: string) => void;
  addAcademicResource: (doc: Omit<AcademicResource, 'id' | 'author' | 'createdAt' | 'downloadCount' | 'upvotes'>) => void;
  
  // Item Requests / Wanted Board
  itemRequests: ItemRequest[];
  addItemRequest: (newRequest: Omit<ItemRequest, 'id' | 'createdAt' | 'status' | 'upvotes' | 'upvotedBy' | 'responsesCount' | 'author' | 'offers'>) => void;
  addOfferToRequest: (requestId: string, offer: { offerText: string; priceOrTradeTerms: string; listingId?: string }) => void;
  toggleUpvoteRequest: (requestId: string) => void;
  markRequestFulfilled: (requestId: string, offerId?: string) => void;
  deleteItemRequest: (requestId: string) => void;
  isCreateRequestModalOpen: boolean;
  setIsCreateRequestModalOpen: (open: boolean) => void;
  initialRequestPrefill: { title?: string; category?: ResourceCategory } | null;
  openCreateRequestModal: (prefill?: { title?: string; category?: ResourceCategory }) => void;
  
  // Opportunities
  opportunities: CampusOpportunity[];
  toggleRegisterOpportunity: (id: string) => void;
  
  // Campus Circulation
  circulationMetric: CampusCirculationMetric;
  resourceFlows: ResourceFlowCycle[];
  simulateResourceTransfer: (cycleId: string, newRecipient: string) => void;
  
  // Notifications / Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Quick Search Jump
  triggerSearchNav: (query: string, category?: ResourceCategory | 'all') => void;
  triggerVerification: (studentIdCard: string, email: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LISTINGS: 'rexchange_listings_v1',
  EXCHANGES: 'rexchange_exchanges_v1',
  SAVED_IDS: 'rexchange_saved_ids_v1',
  CURRENT_USER: 'rexchange_user_v1',
  SKILLS: 'rexchange_skills_v1',
  ACADEMICS: 'rexchange_academics_v1',
  ITEM_REQUESTS: 'rexchange_item_requests_v1',
  OPPORTUNITIES: 'rexchange_opps_v1',
  METRICS: 'rexchange_metrics_v1',
  FLOWS: 'rexchange_flows_v1',
  AUTH: 'rexchange_auth_v1',
};

const initialFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  exchangeType: 'all',
  condition: 'all',
  campusZone: 'All Campus Zones',
  priceRange: 'all',
  sortBy: 'newest',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const login = (email: string, _password?: string): boolean => {
    // Check if email matches one of the mock students
    const normalizedEmail = email.trim().toLowerCase();
    const matchedOther = Object.values(OTHER_STUDENTS).find(
      (s) => (s.contactEmail && s.contactEmail.toLowerCase() === normalizedEmail) ||
             (s.email && s.email.toLowerCase() === normalizedEmail) ||
             s.name.toLowerCase().includes(normalizedEmail.split('@')[0])
    );

    if (matchedOther) {
      setCurrentUser(matchedOther);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchedOther));
      showToast('Signed In', `Welcome back, ${matchedOther.name}!`, 'success');
      return true;
    }

    if (currentUser.contactEmail?.toLowerCase() === normalizedEmail || currentUser.email?.toLowerCase() === normalizedEmail) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
      showToast('Signed In', `Welcome back, ${currentUser.name}!`, 'success');
      return true;
    }

    // Otherwise create or sign in with custom email
    const usernameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = usernameFromEmail.charAt(0).toUpperCase() + usernameFromEmail.slice(1);
    const assignedOrigami = getRandomOrigamiAvatar();

    const newSessionUser: StudentUser = {
      ...currentUser,
      id: `usr_${Date.now()}`,
      name: formattedName || 'Campus Student',
      email,
      contactEmail: email,
      avatar: assignedOrigami,
      verified: email.toLowerCase().includes('.edu'),
      verifiedBadgeText: email.toLowerCase().includes('.edu') ? 'Verified .EDU Student' : undefined,
    };

    setCurrentUser(newSessionUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newSessionUser));
    showToast('Signed In', `Logged in as ${newSessionUser.name}`, 'success');
    return true;
  };

  const loginAsStudent = (student: StudentUser) => {
    setCurrentUser(student);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
  };

  const signup = (formData: {
    name: string;
    email: string;
    collegeName: string;
    department: string;
    semester: string;
    dormLocation?: string;
    bio?: string;
    origamiAvatar?: string;
    origamiFigure?: string;
  }): boolean => {
    // Default to random origami avatar if not selected
    const avatar = formData.origamiAvatar || getRandomOrigamiAvatar();
    const isEdu = formData.email.toLowerCase().includes('.edu');

    const newUser: StudentUser = {
      id: `usr_stu_${Date.now()}`,
      name: formData.name,
      avatar,
      origamiFigure: formData.origamiFigure || 'Origami Mascot',
      collegeName: formData.collegeName || 'SRM Institute of Science and Technology (SRM University)',
      college: formData.collegeName || 'SRM University',
      department: formData.department || 'General Studies',
      semester: formData.semester || '1st Semester (Freshman)',
      verified: isEdu,
      verifiedBadgeText: isEdu ? 'Verified .EDU Student' : undefined,
      rating: 5.0,
      reviewCount: 1,
      reputationPoints: 100,
      joinedDate: 'August 2026',
      itemsReusedCount: 0,
      moneySaved: 0,
      itemsDonatedCount: 0,
      skillsOfferedCount: 0,
      bio: formData.bio || 'New student on campus ready to trade and connect!',
      contactEmail: formData.email,
      email: formData.email,
      phoneOrHandle: `@${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
      campusZone: formData.dormLocation || 'Main Campus Dorms',
      dormLocation: formData.dormLocation || 'Main Campus Dorms',
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    showToast('Welcome to UniVerse!', `Account created for ${newUser.name} from ${newUser.collegeName}.`, 'success');
    
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(false));
    showToast('Signed Out', 'You have been logged out of your student session.', 'info');
  };

  const rollRandomOrigamiAvatar = (): string => {
    const newAvatar = getRandomOrigamiAvatar();
    updateCurrentUser({ avatar: newAvatar });
    return newAvatar;
  };

  const updateCurrentUser = (updatedFields: Partial<StudentUser>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      return updated;
    });

    // Also update authored listings if name or avatar changed
    if (updatedFields.name || updatedFields.avatar || updatedFields.department) {
      setListings((prevListings) =>
        prevListings.map((l) => {
          if (l.author.id === currentUser.id) {
            return {
              ...l,
              author: {
                ...l.author,
                ...updatedFields,
              },
            };
          }
          return l;
        })
      );
    }
  };

  const markListingExchanged = (id: string) => {
    updateListingStatus(id, 'exchanged');
  };

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
      return saved ? JSON.parse(saved) : ['list_001', 'list_004'];
    } catch {
      return ['list_001', 'list_004'];
    }
  });

  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
      return saved ? JSON.parse(saved) : INITIAL_EXCHANGES;
    } catch {
      return INITIAL_EXCHANGES;
    }
  });

  const [skills, setSkills] = useState<SkillService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  const [academicResources, setAcademicResources] = useState<AcademicResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACADEMICS);
      return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_RESOURCES;
    } catch {
      return INITIAL_ACADEMIC_RESOURCES;
    }
  });

  const [itemRequests, setItemRequests] = useState<ItemRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEM_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_ITEM_REQUESTS;
    } catch {
      return INITIAL_ITEM_REQUESTS;
    }
  });

  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [initialRequestPrefill, setInitialRequestPrefill] = useState<{ title?: string; category?: ResourceCategory } | null>(null);

  const openCreateRequestModal = (prefill?: { title?: string; category?: ResourceCategory }) => {
    if (prefill) {
      setInitialRequestPrefill(prefill);
    } else {
      setInitialRequestPrefill(null);
    }
    setIsCreateRequestModalOpen(true);
  };

  const [opportunities, setOpportunities] = useState<CampusOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [circulationMetric, setCirculationMetric] = useState<CampusCirculationMetric>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
      return saved ? JSON.parse(saved) : INITIAL_CIRCULATION_METRIC;
    } catch {
      return INITIAL_CIRCULATION_METRIC;
    }
  });

  const [resourceFlows, setResourceFlows] = useState<ResourceFlowCycle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLOWS);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCE_FLOWS;
    } catch {
      return INITIAL_RESOURCE_FLOWS;
    }
  });

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedAcademicDoc, setSelectedAcademicDoc] = useState<AcademicResource | null>(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isOfferExchangeModalOpen, setIsOfferExchangeModalOpen] = useState(false);
  const [activeExchangeTab, setActiveExchangeTab] = useState<'incoming' | 'sent' | 'active' | 'completed'>('incoming');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme Mode (Cosmic Night = 'dark', Solar Day = 'light')
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('rexchange_theme_mode');
      return saved === 'light' || saved === 'dark' ? (saved as ThemeMode) : 'dark';
    } catch {
      return 'dark';
    }
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('rexchange_theme_mode', mode);
    } catch {
      // ignore
    }
  };

  const toggleThemeMode = () => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('rexchange_theme_mode', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Planet Theme state (Emerald, Cyan, Violet, Amber)
  const [activePlanetTheme, setActivePlanetThemeState] = useState<PlanetTheme>(() => {
    try {
      const saved = localStorage.getItem('rexchange_planet_theme');
      return (saved as PlanetTheme) || 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const setActivePlanetTheme = (theme: PlanetTheme) => {
    setActivePlanetThemeState(theme);
    try {
      localStorage.setItem('rexchange_planet_theme', theme);
    } catch {
      // ignore
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchangeRequests));
  }, [exchangeRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(savedListingIds));
  }, [savedListingIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACADEMICS, JSON.stringify(academicResources));
  }, [academicResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(circulationMetric));
  }, [circulationMetric]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEM_REQUESTS, JSON.stringify(itemRequests));
  }, [itemRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(resourceFlows));
  }, [resourceFlows]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const setCategoryFilter = (cat: ResourceCategory | 'all') => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const triggerSearchNav = (query: string, category: ResourceCategory | 'all' = 'all') => {
    setFilters((prev) => ({ ...prev, searchQuery: query, category }));
    setCurrentPage('marketplace');
  };

  const addListing = (
    newListingData: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'savedCount' | 'status' | 'author'>
  ) => {
    const newListing: Listing = {
      ...newListingData,
      id: `list_${Date.now()}`,
      author: currentUser,
      createdAt: 'Just now',
      viewsCount: 1,
      savedCount: 0,
      status: 'active',
    };

    setListings((prev) => [newListing, ...prev]);

    // Update user stats
    setCurrentUser((prev) => ({
      ...prev,
      itemsReusedCount: prev.itemsReusedCount + 1,
      itemsDonatedCount: newListingData.exchangeType === 'donate' ? prev.itemsDonatedCount + 1 : prev.itemsDonatedCount,
    }));

    // Update campus circulation metrics
    setCirculationMetric((prev) => ({
      ...prev,
      totalReusedItems: prev.totalReusedItems + 1,
      totalMoneySavedUSD: prev.totalMoneySavedUSD + (newListingData.price || 35),
      wastePreventedKg: prev.wastePreventedKg + 2.5,
      totalItemsDonated: newListingData.exchangeType === 'donate' ? prev.totalItemsDonated + 1 : prev.totalItemsDonated,
    }));

    showToast('Listing Published!', `"${newListing.title}" is now visible to all students on campus.`, 'success');
    
    // Confetti celebration
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

  const updateListingStatus = (id: string, status: 'active' | 'exchanged' | 'reserved') => {
    setListings((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    showToast('Status Updated', `Listing marked as ${status}.`, 'info');
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    showToast('Listing Removed', 'The item has been deleted from the marketplace.', 'info');
  };

  const toggleSaveListing = (id: string) => {
    setSavedListingIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((i) => i !== id) : [...prev, id];
      
      // Update saved count on listing
      setListings((listPrev) =>
        listPrev.map((l) => (l.id === id ? { ...l, savedCount: Math.max(0, l.savedCount + (exists ? -1 : 1)) } : l))
      );

      if (!exists) {
        showToast('Saved to Favorites', 'Item added to your saved list.', 'success');
      } else {
        showToast('Removed', 'Item removed from your saved list.', 'info');
      }

      return updated;
    });
  };

  const createExchangeRequest = (listingId: string, offerDesc: string, cashAmount?: number, meetupPref?: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const newRequest: ExchangeRequest = {
      id: `req_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      listingCategory: listing.category,
      listingExchangeType: listing.exchangeType,
      listingPrice: listing.price,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderDept: currentUser.department,
      senderVerified: currentUser.verified,
      receiverId: listing.author.id,
      receiverName: listing.author.name,
      offerDescription: offerDesc,
      cashOffer: cashAmount,
      status: 'pending',
      createdAt: 'Just now',
      meetupLocation: meetupPref || 'Campus Library / Student Union Safe Hub',
      chatMessages: [
        {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: `Hi ${listing.author.name}! I sent an exchange request for "${listing.title}". Offer: ${offerDesc}`,
          timestamp: 'Just now',
        },
      ],
    };

    setExchangeRequests((prev) => [newRequest, ...prev]);
    showToast('Exchange Request Sent!', `Your offer was sent to ${listing.author.name}. Check the Exchanges Hub.`, 'success');
    
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  const acceptExchangeRequest = (requestId: string) => {
    setExchangeRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'accepted' } : req))
    );
    showToast('Request Accepted!', 'You can now coordinate meetup details or chat in the Active Exchanges tab.', 'success');
  };

  const declineExchangeRequest = (requestId: string) => {
    setExchangeRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'declined' } : req))
    );
    showToast('Request Declined', 'The exchange request was declined.', 'info');
  };

  const cancelExchangeRequest = (requestId: string) => {
    setExchangeRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'cancelled' } : req))
    );
    showToast('Request Cancelled', 'Your request has been cancelled.', 'info');
  };

  const completeExchangeRequest = (requestId: string, rating = 5, reviewText = 'Smooth campus handover! Great student.') => {
    setExchangeRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'completed', ratingGiven: rating, reviewText } : req))
    );

    // Update metrics
    setCirculationMetric((prev) => ({
      ...prev,
      totalCompletedExchanges: prev.totalCompletedExchanges + 1,
      totalMoneySavedUSD: prev.totalMoneySavedUSD + 45,
      carbonOffsetKg: prev.carbonOffsetKg + 12,
    }));

    // Update current user
    setCurrentUser((prev) => ({
      ...prev,
      itemsReusedCount: prev.itemsReusedCount + 1,
      moneySaved: prev.moneySaved + 45,
    }));

    showToast('🎉 Exchange Completed!', 'Awesome! You kept resources in circulation and saved carbon footprint.', 'success');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const sendChatMessage = (requestId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: 'Just now',
    };

    setExchangeRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              chatMessages: [...req.chatMessages, newMsg],
            }
          : req
      )
    );
  };

  const addSkillService = (
    skillData: Omit<SkillService, 'id' | 'provider' | 'rating' | 'reviewsCount' | 'completedSessions'>
  ) => {
    const newSkill: SkillService = {
      ...skillData,
      id: `skill_${Date.now()}`,
      provider: currentUser,
      rating: 5.0,
      reviewsCount: 1,
      completedSessions: 0,
    };
    setSkills((prev) => [newSkill, ...prev]);
    setCurrentUser((prev) => ({ ...prev, skillsOfferedCount: prev.skillsOfferedCount + 1 }));
    showToast('Skill Listed!', `"${newSkill.title}" is now available in the Campus Skills directory.`, 'success');
  };

  const incrementDocDownload = (id: string) => {
    setAcademicResources((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc))
    );
    showToast('Downloading Study Companion', 'Your academic resource file is ready.', 'success');
  };

  const upvoteAcademicDoc = (id: string) => {
    setAcademicResources((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, upvotes: doc.upvotes + 1 } : doc))
    );
    showToast('Upvoted Resource', 'Thanks for supporting peer study materials!', 'success');
  };

  const addAcademicResource = (
    docData: Omit<AcademicResource, 'id' | 'author' | 'createdAt' | 'downloadCount' | 'upvotes'>
  ) => {
    const newDoc: AcademicResource = {
      ...docData,
      id: `acad_${Date.now()}`,
      author: currentUser,
      createdAt: 'Just now',
      downloadCount: 1,
      upvotes: 1,
    };
    setAcademicResources((prev) => [newDoc, ...prev]);
    showToast('Notes Uploaded!', `"${newDoc.title}" is now indexed for students in ${newDoc.department}.`, 'success');
  };

  const toggleRegisterOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          const registered = !opp.isRegistered;
          showToast(
            registered ? 'Registered for Opportunity!' : 'Registration Cancelled',
            registered ? `You have applied/saved "${opp.title}".` : 'Removed from your applications.',
            registered ? 'success' : 'info'
          );
          return {
            ...opp,
            isRegistered: registered,
            spotsAvailable: opp.spotsAvailable ? Math.max(0, opp.spotsAvailable + (registered ? -1 : 1)) : undefined,
          };
        }
        return opp;
      })
    );
  };

  const simulateResourceTransfer = (cycleId: string, newRecipient: string) => {
    setResourceFlows((prev) =>
      prev.map((f) => {
        if (f.id === cycleId) {
          const updatedPassed = [...f.passedTo, `${newRecipient} (Current)`];
          return {
            ...f,
            passedTo: updatedPassed,
            currentHolder: newRecipient,
            timesReused: f.timesReused + 1,
            totalSaved: f.totalSaved + 95,
            lifespanMonths: f.lifespanMonths + 6,
          };
        }
        return f;
      })
    );

    setCirculationMetric((prev) => ({
      ...prev,
      totalReusedItems: prev.totalReusedItems + 1,
      totalMoneySavedUSD: prev.totalMoneySavedUSD + 95,
      wastePreventedKg: prev.wastePreventedKg + 1.8,
    }));

    showToast('🔄 Circulation Loop Simulated!', `Item passed forward to ${newRecipient}. Total reuse savings updated!`, 'success');
  };

  const addItemRequest = (
    newRequestData: Omit<ItemRequest, 'id' | 'createdAt' | 'status' | 'upvotes' | 'upvotedBy' | 'responsesCount' | 'author' | 'offers'>
  ) => {
    const newRequest: ItemRequest = {
      ...newRequestData,
      id: `req_${Date.now()}`,
      author: currentUser,
      createdAt: 'Just now',
      status: 'open',
      upvotes: 1,
      upvotedBy: [currentUser.id],
      responsesCount: 0,
      offers: [],
    };

    setItemRequests((prev) => [newRequest, ...prev]);
    showToast('Wanted Request Posted!', `"${newRequest.title}" is live on the Campus Request Board.`, 'success');

    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.65 },
      });
    } catch {
      // ignore
    }
  };

  const addOfferToRequest = (
    requestId: string,
    offerData: { offerText: string; priceOrTradeTerms: string; listingId?: string }
  ) => {
    const targetReq = itemRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const newOffer: RequestOffer = {
      id: `off_${Date.now()}`,
      requestId,
      author: currentUser,
      offerText: offerData.offerText,
      priceOrTradeTerms: offerData.priceOrTradeTerms,
      listingId: offerData.listingId,
      createdAt: 'Just now',
      status: 'pending',
    };

    setItemRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            responsesCount: r.responsesCount + 1,
            offers: [newOffer, ...r.offers],
          };
        }
        return r;
      })
    );

    showToast('Offer Sent to Requester!', `Your offer for "${targetReq.title}" has been submitted.`, 'success');
  };

  const toggleUpvoteRequest = (requestId: string) => {
    setItemRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const isUpvoted = r.upvotedBy.includes(currentUser.id);
          const updatedUpvotedBy = isUpvoted
            ? r.upvotedBy.filter((id) => id !== currentUser.id)
            : [...r.upvotedBy, currentUser.id];
          const updatedCount = Math.max(0, r.upvotes + (isUpvoted ? -1 : 1));

          if (!isUpvoted) {
            showToast('Added your +1 vote', `Marked that you also need "${r.title}".`, 'info');
          }

          return {
            ...r,
            upvotes: updatedCount,
            upvotedBy: updatedUpvotedBy,
          };
        }
        return r;
      })
    );
  };

  const markRequestFulfilled = (requestId: string, offerId?: string) => {
    setItemRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          let fulfiller = {
            studentId: currentUser.id,
            studentName: currentUser.name,
            studentAvatar: currentUser.avatar,
            date: 'Today',
          };

          if (offerId) {
            const offer = r.offers.find((o) => o.id === offerId);
            if (offer) {
              fulfiller = {
                studentId: offer.author.id,
                studentName: offer.author.name,
                studentAvatar: offer.author.avatar,
                date: 'Today',
              };
            }
          }

          return {
            ...r,
            status: 'fulfilled',
            fulfilledBy: fulfiller,
          };
        }
        return r;
      })
    );

    showToast('Request Marked as Fulfilled! 🎉', 'Item has been marked as found and archived on the board.', 'success');
  };

  const deleteItemRequest = (requestId: string) => {
    setItemRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast('Request Removed', 'Your wanted post has been removed from the Request Board.', 'info');
  };

  const triggerVerification = (studentIdCard: string, email: string): boolean => {
    if (!email.toLowerCase().includes('.edu') && !studentIdCard) {
      showToast('Verification Notice', 'Please provide a valid college .edu address or student ID roll number.', 'warning');
      return false;
    }

    setCurrentUser((prev) => ({
      ...prev,
      verified: true,
      verifiedBadgeText: `Verified Student #${studentIdCard || 'STU-9402'}`,
    }));

    showToast('🎉 Campus Identity Verified!', 'You have unlocked the Verified Student badge and full trust rating.', 'success');
    
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        login,
        loginAsStudent,
        signup,
        logout,
        updateCurrentUser,
        rollRandomOrigamiAvatar,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        activePlanetTheme,
        setActivePlanetTheme,
        listings,
        addListing,
        updateListingStatus,
        markListingExchanged,
        deleteListing,
        savedListingIds,
        toggleSaveListing,
        selectedListing,
        setSelectedListing,
        filters,
        setFilters,
        resetFilters,
        setCategoryFilter,
        isCreateListingOpen,
        setIsCreateListingOpen,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        isOfferExchangeModalOpen,
        setIsOfferExchangeModalOpen,
        exchangeRequests,
        createExchangeRequest,
        acceptExchangeRequest,
        declineExchangeRequest,
        cancelExchangeRequest,
        completeExchangeRequest,
        sendChatMessage,
        activeExchangeTab,
        setActiveExchangeTab,
        skills,
        addSkillService,
        academicResources,
        selectedAcademicDoc,
        setSelectedAcademicDoc,
        incrementDocDownload,
        upvoteAcademicDoc,
        addAcademicResource,
        itemRequests,
        addItemRequest,
        addOfferToRequest,
        toggleUpvoteRequest,
        markRequestFulfilled,
        deleteItemRequest,
        isCreateRequestModalOpen,
        setIsCreateRequestModalOpen,
        initialRequestPrefill,
        openCreateRequestModal,
        opportunities,
        toggleRegisterOpportunity,
        circulationMetric,
        resourceFlows,
        simulateResourceTransfer,
        toasts,
        showToast,
        removeToast,
        triggerSearchNav,
        triggerVerification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
