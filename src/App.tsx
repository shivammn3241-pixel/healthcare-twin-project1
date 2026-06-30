import React from 'react';
import { useHealthTwin } from './context/HealthTwinContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './components/landing/LandingPage';
import AuthPages from './components/auth/AuthPages';
import InteractiveBody from './components/twin/InteractiveBody';
import TelemetryPanel from './components/twin/TelemetryPanel';
import InsightsPanel from './components/twin/InsightsPanel';
import OrganDetailModal from './components/twin/OrganDetailModal';
import ClinicalDashboard from './components/dashboard/ClinicalDashboard';
import AIPredictions from './components/predictions/AIPredictions';
import Recommendations from './components/recommendations/Recommendations';
import ClinicalReports from './components/reports/ClinicalReports';
import UserProfile from './components/profile/UserProfile';
import SystemSettings from './components/settings/SystemSettings';

export const App: React.FC = () => {
  const { 
    isAuthenticated, 
    activeView, 
    setActiveView, 
    alarmSoundActive, 
    alarmMuted 
  } = useHealthTwin();

  // If not authenticated, route between public landing and security portal
  if (!isAuthenticated) {
    if (activeView === 'landing') {
      return <LandingPage onGetStarted={() => setActiveView('twin')} />; // route to portal sign-in
    }
    return <AuthPages onBackToHome={() => setActiveView('landing')} />;
  }

  // Authorized clinical layout workspace
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-display relative select-none">
      
      {/* Visual Critical Alert Flash Overlay */}
      {alarmSoundActive && !alarmMuted && (
        <div className="emergency-critical-overlay" />
      )}

      {/* Header bar */}
      <Navbar />

      {/* Main body wrapper */}
      <div className="flex flex-1 items-stretch h-[calc(100vh-73px)]">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic viewport panel scroll wrapper */}
        <main className="flex-1 overflow-y-auto bg-slate-950/20">
          {activeView === 'twin' && (
            <div className="grid lg:grid-cols-12 gap-6 p-6 h-full items-stretch relative">
              {/* Left-hand vitals telemetry deck */}
              <div className="lg:col-span-3 h-full">
                <TelemetryPanel />
              </div>
              
              {/* Center digital twin SVG anatomist */}
              <div className="lg:col-span-6 h-full flex flex-col justify-center border border-slate-900 bg-slate-950/60 rounded-2xl relative shadow-inner overflow-hidden">
                <InteractiveBody />
                {/* Overlay Organ Slider Details */}
                <OrganDetailModal />
              </div>
              
              {/* Right-hand AI predictive summaries */}
              <div className="lg:col-span-3 h-full">
                <InsightsPanel />
              </div>
            </div>
          )}

          {activeView === 'dashboard' && <ClinicalDashboard />}
          {activeView === 'predictions' && <AIPredictions />}
          {activeView === 'recommendations' && <Recommendations />}
          {activeView === 'reports' && <ClinicalReports />}
          {activeView === 'profile' && <UserProfile />}
          {activeView === 'settings' && <SystemSettings />}
        </main>
      </div>
    </div>
  );
};
export default App;
