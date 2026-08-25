/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { HeroLanding } from './components/HeroLanding';
import { Marketplace } from './components/Marketplace';
import { RequestBoard } from './components/RequestBoard';
import { SkillsServices } from './components/SkillsServices';
import { AcademicHub } from './components/AcademicHub';
import { OpportunitiesHub } from './components/OpportunitiesHub';
import { CampusCirculation } from './components/CampusCirculation';
import { ExchangesHub } from './components/ExchangesHub';
import { StudentProfile } from './components/StudentProfile';
import { AuthPage } from './components/AuthPage';
import { AuthModal } from './components/AuthModal';
import { CreateListingModal } from './components/CreateListingModal';
import { CreateRequestModal } from './components/CreateRequestModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SafetyVerificationModal } from './components/SafetyVerificationModal';
import { InteractiveBackground } from './components/InteractiveBackground';
import { TapEffectOverlay } from './components/TapEffectOverlay';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentPage, themeMode } = useApp();

  return (
    <div
      className={`relative min-h-screen bg-transparent flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        themeMode === 'light'
          ? 'theme-light text-slate-900 selection:bg-amber-400 selection:text-slate-950'
          : 'theme-dark text-slate-100 selection:bg-emerald-400 selection:text-slate-950'
      } antialiased overflow-x-hidden transition-colors duration-500`}
    >
      {/* Dynamic Cursor-Reactive Interactive Background */}
      <InteractiveBackground />

      {/* Dynamic Day/Night Mode Tap & Click Starshine/Sunburst Animation */}
      <TapEffectOverlay />

      {/* Global Notifications */}
      <ToastContainer />

      {/* Global Fixed Navigation - Visible from anywhere on page */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1 relative z-10 pt-16">
        {currentPage === 'home' && <HeroLanding />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'requests' && <RequestBoard />}
        {currentPage === 'skills' && <SkillsServices />}
        {currentPage === 'academic' && <AcademicHub />}
        {currentPage === 'opportunities' && <OpportunitiesHub />}
        {currentPage === 'circulation' && <CampusCirculation />}
        {currentPage === 'exchanges' && <ExchangesHub />}
        {currentPage === 'profile' && <StudentProfile />}
        {currentPage === 'auth' && <AuthPage />}
      </main>

      {/* Global Modals */}
      <CreateListingModal />
      <CreateRequestModal />
      <ListingDetailModal />
      <SafetyVerificationModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
