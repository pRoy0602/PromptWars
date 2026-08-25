export type ResourceCategory =
  | 'books'
  | 'electronics'
  | 'notes'
  | 'tickets'
  | 'services'
  | 'skills'
  | 'giveaways'
  | 'opportunities';

export type ExchangeType =
  | 'sell'
  | 'exchange'
  | 'borrow'
  | 'lend'
  | 'donate'
  | 'free'
  | 'offer_service'
  | 'offer_skill';

export type ConditionType = 'new' | 'like_new' | 'good' | 'used' | 'na';

export interface StudentUser {
  id: string;
  name: string;
  avatar: string;
  collegeName: string;
  college?: string;
  department: string;
  semester: string;
  verified: boolean;
  verifiedBadgeText?: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  itemsReusedCount: number;
  moneySaved: number;
  itemsDonatedCount: number;
  skillsOfferedCount: number;
  bio: string;
  contactEmail?: string;
  email?: string;
  phoneOrHandle?: string;
  campusZone?: string;
  dormLocation?: string;
  reputationPoints?: number;
  origamiFigure?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  exchangeType: ExchangeType;
  price: number; // 0 if free/donate/exchange
  condition: ConditionType;
  location: string;
  campusZone: string;
  images: string[];
  tags: string[];
  author: StudentUser;
  createdAt: string;
  viewsCount: number;
  savedCount: number;
  status: 'active' | 'exchanged' | 'reserved';
  preferredExchangeItem?: string;
  urgency?: 'normal' | 'urgent' | 'giveaway';
  featured?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ExchangeRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingCategory: ResourceCategory;
  listingExchangeType: ExchangeType;
  listingPrice: number;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderDept: string;
  senderVerified: boolean;
  receiverId: string;
  receiverName: string;
  offerDescription: string;
  cashOffer?: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: string;
  meetupLocation?: string;
  meetupTime?: string;
  chatMessages: ChatMessage[];
  ratingGiven?: number;
  reviewText?: string;
}

export interface SkillService {
  id: string;
  title: string;
  category: string;
  provider: StudentUser;
  rateType: 'free' | 'hourly' | 'exchange_skill' | 'fixed';
  rateDisplay: string;
  experienceLevel: string;
  description: string;
  skillsOffered: string[];
  skillsDesired?: string[];
  availability: string;
  locationPreference: 'In-Person (Campus)' | 'Online / Zoom' | 'Hybrid';
  rating: number;
  reviewsCount: number;
  completedSessions: number;
  tags: string[];
  image: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  department: string;
  courseCode: string;
  subject: string;
  semester: string;
  resourceType: 'notes' | 'study_guide' | 'past_paper' | 'lab_manual' | 'cheatsheet' | 'summary';
  fileFormat: string;
  pageCount: number;
  fileSize: string;
  downloadCount: number;
  upvotes: number;
  author: StudentUser;
  createdAt: string;
  description: string;
  previewSnippets: string[];
  verifiedByProf?: boolean;
  topicsCovered: string[];
}

export interface CampusOpportunity {
  id: string;
  title: string;
  organization: string;
  category: 'hackathon' | 'workshop' | 'internship' | 'campus_event' | 'club' | 'competition';
  deadline: string;
  eventDate: string;
  location: string;
  stipendOrPerk: string;
  description: string;
  applyUrl: string;
  tags: string[];
  eligibility: string;
  spotsAvailable?: number;
  isRegistered?: boolean;
  featured?: boolean;
  image: string;
}

export interface CampusCirculationMetric {
  totalReusedItems: number;
  totalMoneySavedUSD: number;
  totalItemsDonated: number;
  wastePreventedKg: number;
  carbonOffsetKg: number;
  activeExchangersCount: number;
  totalCompletedExchanges: number;
  topMovingCategory: string;
}

export interface ResourceFlowCycle {
  id: string;
  itemName: string;
  category: ResourceCategory;
  originator: string;
  passedTo: string[];
  currentHolder: string;
  totalSaved: number;
  timesReused: number;
  lifespanMonths: number;
}

export type SmartMatchBadge =
  | 'You have something they may want'
  | 'Matches your interests'
  | 'Popular in your department'
  | 'Similar to your saved items';

export interface SmartMatchReason {
  type: SmartMatchBadge;
  detail: string;
  iconType?: 'mutual' | 'interests' | 'dept' | 'saved';
}

export interface SmartMatchResult {
  listing: Listing;
  score: number; // 0 to 100
  primaryReason: SmartMatchBadge;
  reasons: SmartMatchReason[];
  isMutualExchange: boolean;
  mutualExchangeDetails?: {
    userListingTitle: string;
    userListingId: string;
    theirPreference: string;
    matchingKeywords: string[];
    suggestedOfferText: string;
  };
  departmentMatch?: boolean;
  savedItemMatch?: {
    savedListingTitle: string;
    savedListingId: string;
    commonTags: string[];
  };
}

export type RequestUrgency = 'urgent' | 'high' | 'normal' | 'flexible';
export type RequestPreferredType = 'buy' | 'borrow' | 'trade' | 'free' | 'any';

export interface RequestOffer {
  id: string;
  requestId: string;
  author: StudentUser;
  offerText: string;
  priceOrTradeTerms: string;
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
  contactInfo?: string;
}

export interface ItemRequest {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  urgency: RequestUrgency;
  preferredType: RequestPreferredType;
  budgetDisplay?: string;
  maxBudget?: number;
  neededByDate?: string;
  courseCode?: string;
  locationPreference?: string;
  author: StudentUser;
  createdAt: string;
  status: 'open' | 'fulfilled' | 'cancelled';
  upvotes: number;
  upvotedBy: string[];
  responsesCount: number;
  tags: string[];
  referenceImage?: string;
  fulfilledBy?: {
    studentId: string;
    studentName: string;
    studentAvatar: string;
    listingId?: string;
    date: string;
  };
  offers: RequestOffer[];
}
