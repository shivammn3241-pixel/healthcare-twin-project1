import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert, Heart, Fingerprint } from 'lucide-react';
import { authService } from './authService';

interface RegisterScreenProps {
  onSuccess: (username: string) => void;
  onSignIn: () => void;
  onBackToHome: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onSuccess,
  onSignIn,
  onBackToHome
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength states
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Too Weak');

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setStrength(score);

    switch (score) {
      case 0: setStrengthLabel('Too Weak'); break;
      case 1: setStrengthLabel('Weak'); break;
      case 2: setStrengthLabel('Fair'); break;
      case 3: setStrengthLabel('Good'); break;
      case 4: setStrengthLabel('Excellent (HIPAA Ready)'); break;
    }
  }, [password]);

  const validate = () => {
    if (!name || name.trim().length < 3) {
      return 'Please enter a valid full name (at least 3 characters).';
    }
    if (!username || !/^[A-Za-z0-9_-]{3,16}$/.test(username)) {
      return 'Please enter a valid username (3-16 characters, alphanumeric, _ or - only).';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.register({
        name,
        username,
        email,
        password
      });

      if (res.success) {
        onSuccess(username);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Connection to security gateway lost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthBarColor = (index: number) => {
    if (index >= strength) return 'bg-slate-200 dark:bg-slate-800';
    switch (strength) {
      case 1: return 'bg-rose-500';
      case 2: return 'bg-amber-500';
      case 3: return 'bg-sky-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-slate-200 dark:bg-slate-800';
    }
  };

  const getStrengthLabelColor = () => {
    switch (strength) {
      case 1: return 'text-rose-500';
      case 2: return 'text-amber-500';
      case 3: return 'text-sky-400';
      case 4: return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col text-left">
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          Register Telemetry Client
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
          Establish clinician identity mapping keys.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Sarah Connor"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Username</label>
          <div className="relative">
            <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="sconnor_md"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 font-mono"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="name@healthcare.ai"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Minimum 8 characters"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-11 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-655"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Strength:</span>
                <span className={`font-semibold ${getStrengthLabelColor()}`}>{strengthLabel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-colors ${getStrengthBarColor(idx + 1)}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-11 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              disabled={loading}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-655"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 dark:text-slate-950 font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
              <span>Registering Client...</span>
            </div>
          ) : (
            <>
              <Heart className="w-4.5 h-4.5 text-slate-950" />
              <span>Create Access Account</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-900/60 flex flex-col gap-2 text-center">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Already registered credentials?{' '}
          <button
            disabled={loading}
            onClick={onSignIn}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline font-mono"
          >
            Sign in
          </button>
        </div>
        <button
          disabled={loading}
          onClick={onBackToHome}
          className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 transition-colors"
        >
          Cancel and return to homepage
        </button>
      </div>
    </div>
  );
};
export default RegisterScreen;
