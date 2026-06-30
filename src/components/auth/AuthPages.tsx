import React, { useState, useEffect } from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { SuccessScreen } from './SuccessScreen';
import { BackgroundParticles } from './BackgroundParticles';
import { AuthSession } from './authService';
import { PatientProfile } from '../../types';

interface AuthPagesProps {
  onBackToHome: () => void;
}

type ScreenView =
  | 'welcome'
  | 'login'
  | 'register'
  | 'forgot'
  | 'success';

export const AuthPages: React.FC<AuthPagesProps> = ({ onBackToHome }) => {
  const { login, registerUserProfile } = useHealthTwin() as any;
  
  const [view, setView] = useState<ScreenView>('welcome');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from HTML class & Restore sessions
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Session restore check
    const session = localStorage.getItem('healthtwin_simple_active_session');
    if (session) {
      const parsed = JSON.parse(session);
      setIdentifier(parsed.username);
      setName(parsed.name || '');
      setView('success');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Callback when registration is successful (redirects user to Login screen)
  const handleRegisterSuccess = (registeredUsername: string) => {
    setIdentifier(registeredUsername);
    setView('login');
  };

  // Callback when login is successful (redirects to the dashboard success screen)
  const handleLoginSuccess = (session: AuthSession) => {
    setIdentifier(session.username);
    setName(session.name);
    
    // Automatically configure the Twin Profile parameters
    const customProfile: PatientProfile = {
      key: 'user',
      name: session.name || 'Clinical Clinician',
      id: `TWIN-${Math.floor(1000 + Math.random() * 9000)}`,
      age: 38,
      gender: 'Male',
      profileName: 'Patient Twin (Self)',
      cyp2d6Status: 'CYP2D6 *1/*1 (Normal Metabolizer)',
      baseHR: 72,
      hrvBias: 1.0,
      bpSysBias: 0,
      bpDiaBias: 0,
      rrBias: 0,
      cgmRiseRate: 1.8,
      insulinResistance: 1.0,
      baseEF: 62,
      baseSPO2: 98.6,
      tempBias: 0.0,
      metoprololClFactor: 0.11,
      height: '175 cm',
      weight: '74 kg',
      bloodGroup: 'O+',
      emergencyContact: 'Medical Desk (+1-555-0199)',
      diagnoses: 'No active clinical conditions. Biomarker baselines hold within normal range limits.',
      labs: [
        { name: 'HbA1c', value: '5.4%', status: 'Normal' },
        { name: 'Total Cholesterol', value: '180 mg/dL', status: 'Normal' },
        { name: 'Serum Creatinine', value: '0.9 mg/dL', status: 'Normal' }
      ],
      prescriptions: 'None',
      history: `Social History: Smoking: No, Alcohol: Socially, Exercise: 3+ times/week. User Registry: ${session.username} (${session.email})`
    };

    if (registerUserProfile) {
      registerUserProfile(customProfile);
    }

    setView('success');
  };

  const handleLaunchPortal = () => {
    login(); // Sets isAuthenticated = true, loading the Twin dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Background Particles Grid */}
      <BackgroundParticles />

      {/* Floating decorative ambient light nodes */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      {/* Floating Theme Mode Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-slate-600 dark:text-slate-355 shadow-sm"
          title="Toggle Clinical Theme Mode"
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300 z-10"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500"></div>

        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <WelcomeScreen
                onSignIn={() => setView('login')}
                onRegister={() => setView('register')}
                onBackToHome={onBackToHome}
              />
            </motion.div>
          )}

          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <LoginScreen
                onSuccess={handleLoginSuccess}
                onForgotPassword={(inputVal) => {
                  setIdentifier(inputVal);
                  setView('forgot');
                }}
                onRegister={() => setView('register')}
                onBackToHome={onBackToHome}
              />
            </motion.div>
          )}

          {view === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterScreen
                onSuccess={handleRegisterSuccess}
                onSignIn={() => setView('login')}
                onBackToHome={onBackToHome}
              />
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ForgotPasswordScreen
                initialIdentifier={identifier}
                onSuccess={() => setView('login')}
                onCancel={() => setView('login')}
              />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <SuccessScreen name={name} onEnterPortal={handleLaunchPortal} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default AuthPages;
