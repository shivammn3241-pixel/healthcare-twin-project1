import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { AppView } from '../../types';
import { 
  Activity, 
  BrainCircuit, 
  Compass, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  User, 
  UserRoundCheck 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, logout, isAuthenticated } = useHealthTwin();

  if (!isAuthenticated) return null; // Hide sidebar on landing page/auth if not logged in

  const menuItems = [
    { view: 'twin' as AppView, label: 'Digital Twin', icon: UserRoundCheck, color: 'text-cyan-400' },
    { view: 'dashboard' as AppView, label: 'Clinical Vitals', icon: LayoutDashboard, color: 'text-sky-400' },
    { view: 'predictions' as AppView, label: 'AI Predictions', icon: BrainCircuit, color: 'text-violet-400' },
    { view: 'recommendations' as AppView, label: 'Interventions', icon: Compass, color: 'text-emerald-400' },
    { view: 'reports' as AppView, label: 'Clinical Reports', icon: FileText, color: 'text-amber-400' },
    { view: 'profile' as AppView, label: 'Patient EHR', icon: User, color: 'text-slate-400' },
    { view: 'settings' as AppView, label: 'System Settings', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/60 backdrop-blur-md flex flex-col h-[calc(100vh-73px)] justify-between py-6">
      {/* Menu Links */}
      <div className="flex flex-col gap-1.5 px-4">
        <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-2 px-3">
          Clinical Navigation
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-left transition-all duration-200 group ${
                isActive 
                  ? 'bg-slate-900 border border-slate-800/60 text-slate-100 shadow-md shadow-cyan-500/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="px-4 border-t border-slate-900 pt-6">
        <button
          onClick={logout}
          className="flex items-center gap-3.5 w-full px-4 py-3 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
        <div className="mt-6 text-center text-[10px] text-slate-600 font-mono">
          Powered by Gemini AI Engine
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
