import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExchangeRequest } from '../types';
import { soundFX } from '../utils/soundFx';
import {
  Repeat,
  Inbox,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Phone,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ExchangesHub: React.FC = () => {
  const {
    currentUser,
    exchangeRequests,
    acceptExchangeRequest,
    declineExchangeRequest,
    cancelExchangeRequest,
    completeExchangeRequest,
    sendChatMessage,
    activeExchangeTab,
    setActiveExchangeTab,
    setCurrentPage,
    setIsSafetyModalOpen,
  } = useApp();

  const [selectedChatRequest, setSelectedChatRequest] = useState<ExchangeRequest | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('Super smooth campus exchange! Exactly as described.');
  const [completingRequestId, setCompletingRequestId] = useState<string | null>(null);

  // Categorize requests
  const incomingRequests = exchangeRequests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  );

  const sentRequests = exchangeRequests.filter(
    (r) => r.senderId === currentUser.id && r.status === 'pending'
  );

  const activeExchanges = exchangeRequests.filter(
    (r) => (r.senderId === currentUser.id || r.receiverId === currentUser.id) && r.status === 'accepted'
  );

  const completedExchanges = exchangeRequests.filter(
    (r) => (r.senderId === currentUser.id || r.receiverId === currentUser.id) && r.status === 'completed'
  );

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatRequest || !chatInput.trim()) return;
    soundFX.playWhoosh();
    sendChatMessage(selectedChatRequest.id, chatInput.trim());
    setChatInput('');
  };

  const handleFinalizeComplete = (requestId: string) => {
    soundFX.playSuccess();
    completeExchangeRequest(requestId, reviewRating, reviewText);
    setCompletingRequestId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Repeat className="w-4 h-4" />
            <span>Exchange Hub & Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 font-['Outfit',sans-serif]">
            Manage Your Student Exchanges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Coordinate meetups, accept trade counter-offers, and track resources in circulation.
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.playPop(650, 0.05);
            setIsSafetyModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-900/60 transition-all self-start md:self-auto cursor-pointer interactive-btn shadow-md"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Campus Safe Meetup Zones</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 border-b border-white/[0.08] scrollbar-none">
        <button
          onClick={() => {
            soundFX.playPop(480, 0.04);
            setActiveExchangeTab('incoming');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeExchangeTab === 'incoming'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
              : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests</span>
          {incomingRequests.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-emerald-400 rounded-full font-extrabold font-['Space_Grotesk']">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundFX.playPop(520, 0.04);
            setActiveExchangeTab('sent');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeExchangeTab === 'sent'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
              : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests</span>
          {sentRequests.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-emerald-400 rounded-full font-extrabold font-['Space_Grotesk']">
              {sentRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundFX.playPop(560, 0.04);
            setActiveExchangeTab('active');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeExchangeTab === 'active'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
              : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Exchanges</span>
          {activeExchanges.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-slate-950 rounded-full font-extrabold font-['Space_Grotesk']">
              {activeExchanges.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundFX.playPop(600, 0.04);
            setActiveExchangeTab('completed');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeExchangeTab === 'completed'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
              : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed ({completedExchanges.length})</span>
        </button>
      </div>

      {/* Main Tab Views Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Request Cards */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* TAB 1: INCOMING REQUESTS */}
          {activeExchangeTab === 'incoming' && (
            <div className="space-y-4">
              {incomingRequests.length === 0 ? (
                <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white font-['Outfit',sans-serif]">No incoming exchange requests right now</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When other students propose trades or cash for your listings, they will appear here for you to accept or decline.
                  </p>
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.senderAvatar}
                          alt={req.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white font-['Outfit',sans-serif]">{req.senderName}</span>
                            {req.senderVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-xs text-slate-400">{req.senderDept}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 font-['Space_Grotesk']">{req.createdAt}</span>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.08] flex items-center gap-3">
                      <img
                        src={req.listingImage}
                        alt={req.listingTitle}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-950"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Requested Item:</span>
                        <h4 className="font-bold text-xs text-white truncate font-['Outfit',sans-serif]">{req.listingTitle}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-semibold font-['Space_Grotesk']">
                          Listed Price: {req.listingPrice > 0 ? `$${req.listingPrice}` : 'Free/Swap'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-950/30 rounded-2xl border border-amber-500/20 text-xs">
                      <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Proposed Counter-Offer:</span>
                      </div>
                      <p className="text-slate-200">{req.offerDescription}</p>
                      {req.cashOffer && (
                        <div className="mt-1 text-emerald-400 font-bold font-['Space_Grotesk']">
                          + Cash Add-on: ${req.cashOffer}
                        </div>
                      )}
                    </div>

                    {req.meetupLocation && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Proposed Handover: <strong className="text-white">{req.meetupLocation}</strong></span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          soundFX.playPop(650, 0.05);
                          setSelectedChatRequest(req);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer interactive-btn"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat ({req.chatMessages.length})</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            soundFX.playPop(400, 0.05);
                            declineExchangeRequest(req.id);
                          }}
                          className="px-4 py-2 rounded-xl border border-white/[0.08] hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            soundFX.playSuccess();
                            acceptExchangeRequest(req.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer interactive-btn"
                        >
                          Accept Exchange
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SENT REQUESTS */}
          {activeExchangeTab === 'sent' && (
            <div className="space-y-4">
              {sentRequests.length === 0 ? (
                <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/70 text-blue-400 border border-blue-500/30 mx-auto flex items-center justify-center">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white font-['Outfit',sans-serif]">You haven't sent any pending exchange requests</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Browse the marketplace to find textbooks, electronics, or skills you want to propose a trade for.
                  </p>
                  <button
                    onClick={() => setCurrentPage('marketplace')}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 cursor-pointer interactive-btn"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Sent to Student:
                        </span>
                        <h4 className="font-bold text-sm text-white font-['Outfit',sans-serif]">{req.receiverName}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-[11px] font-bold border border-amber-500/30 font-['Space_Grotesk']">
                        Awaiting Response
                      </span>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.08] flex items-center gap-3">
                      <img
                        src={req.listingImage}
                        alt={req.listingTitle}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-950"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Item:</span>
                        <h4 className="font-bold text-xs text-white truncate font-['Outfit',sans-serif]">{req.listingTitle}</h4>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/[0.08] text-xs space-y-1">
                      <span className="font-semibold text-slate-400">Your Offer:</span>
                      <p className="text-slate-200">{req.offerDescription}</p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        onClick={() => {
                          soundFX.playPop(650, 0.05);
                          setSelectedChatRequest(req);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer interactive-btn"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat ({req.chatMessages.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          soundFX.playPop(400, 0.05);
                          cancelExchangeRequest(req.id);
                        }}
                        className="px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ACTIVE EXCHANGES */}
          {activeExchangeTab === 'active' && (
            <div className="space-y-4">
              {activeExchanges.length === 0 ? (
                <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/70 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white font-['Outfit',sans-serif]">No active exchanges currently in progress</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When an exchange request is accepted, it moves here so you can schedule the campus meetup and confirm completion.
                  </p>
                </div>
              ) : (
                activeExchanges.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xl space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                          ✓ Handover in Progress
                        </span>
                        <span className="text-xs text-slate-400">
                          Partner: <strong className="text-white">{req.senderId === currentUser.id ? req.receiverName : req.senderName}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.08] flex items-center gap-3">
                      <img
                        src={req.listingImage}
                        alt={req.listingTitle}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white font-['Outfit',sans-serif]">{req.listingTitle}</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Trade: <em className="text-slate-200">{req.offerDescription}</em>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Designated Campus Safe Spot: {req.meetupLocation || 'Library Main Lobby'}</span>
                      </div>
                      <p className="text-emerald-200/80 text-[11px]">
                        Inspect the item or test the electronics together. Once verified, click below to mark completed and record circulation impact!
                      </p>
                    </div>

                    {completingRequestId === req.id ? (
                      <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/[0.08] space-y-3">
                        <h5 className="font-bold text-xs text-white font-['Outfit',sans-serif]">
                          Confirm Handover & Leave a Peer Review
                        </h5>
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`p-1 ${reviewRating >= star ? 'text-amber-400' : 'text-slate-600'} cursor-pointer`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write a brief review..."
                          className="w-full p-2.5 bg-slate-900 text-slate-100 text-xs rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setCompletingRequestId(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleFinalizeComplete(req.id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer interactive-btn shadow-md"
                          >
                            Confirm & Complete Exchange
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            soundFX.playPop(650, 0.05);
                            setSelectedChatRequest(req);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer interactive-btn border border-white/[0.08]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Coordinate Meetup / Chat</span>
                        </button>
                        <button
                          onClick={() => {
                            soundFX.playPop(750, 0.05);
                            setCompletingRequestId(req.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer interactive-btn"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Completed</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: COMPLETED EXCHANGES */}
          {activeExchangeTab === 'completed' && (
            <div className="space-y-4">
              {completedExchanges.length === 0 ? (
                <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white font-['Outfit',sans-serif]">No completed exchanges yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Your exchange history, saved student dollars, and peer feedback will be archived here.
                  </p>
                </div>
              ) : (
                completedExchanges.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                        ✓ Successfully Reused & Exchanged
                      </span>
                      <span className="text-slate-500 font-['Space_Grotesk']">{req.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={req.listingImage}
                        alt={req.listingTitle}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate font-['Outfit',sans-serif]">{req.listingTitle}</h4>
                        <p className="text-[11px] text-slate-400">
                          Exchanged between {req.senderName} and {req.receiverName}
                        </p>
                      </div>
                    </div>

                    {req.reviewText && (
                      <div className="p-3 bg-slate-950/60 rounded-2xl text-xs text-slate-300 flex items-start gap-2.5 border border-white/[0.08]">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-200">Peer Feedback:</div>
                          <p className="text-slate-400 italic mt-0.5">"{req.reviewText}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Chat Messenger */}
        <div className="lg:col-span-5 bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl flex flex-col h-[520px] overflow-hidden">
          {selectedChatRequest ? (
            <div className="flex-1 flex flex-col h-full">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      selectedChatRequest.senderId === currentUser.id
                        ? selectedChatRequest.listingImage
                        : selectedChatRequest.senderAvatar
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif] leading-tight">
                      {selectedChatRequest.senderId === currentUser.id
                        ? selectedChatRequest.receiverName
                        : selectedChatRequest.senderName}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold truncate block max-w-[180px]">
                      Re: {selectedChatRequest.listingTitle}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChatRequest(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                {selectedChatRequest.chatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5 px-1">{msg.senderName}</span>
                      <div
                        className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-800 text-slate-100 border border-white/[0.08] rounded-bl-none shadow-md'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-['Space_Grotesk']">{msg.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/[0.08] bg-slate-950/60 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message or meetup time..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-white/[0.08] focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl active:scale-95 transition-all cursor-pointer interactive-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-500">
              <MessageSquare className="w-10 h-10 stroke-1 text-slate-600" />
              <div className="text-xs font-semibold text-slate-300 font-['Outfit',sans-serif]">Select any exchange to open direct chat</div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Communicate safely with students to arrange pickup locations, test electronics, and verify textbook editions.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
