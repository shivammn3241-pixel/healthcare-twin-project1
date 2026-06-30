import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, KeyRound, User } from 'lucide-react';
import { authService, AuthSession } from './authService';

interface LoginScreenProps {
  onSuccess: (session: AuthSession) => void;
  onForgotPassword: (identifier: string) => void;
  onRegister: () => void;
  onBackToHome: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onForgotPassword,
  onRegister,
  onBackToHome
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide your Username/Email and Password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.login(identifier, password, rememberMe);
      if (res.success && res.session) {
        onSuccess(res.session);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Connection timeout. Failed to authenticate workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          Clinical Security Sign-In
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
          Enter clinical credentials to authorize twin access.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username or Email Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
            Username or Email Address
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              required
              disabled={loading}
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
              placeholder="doctor or name@healthcare.ai"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Security Password Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              Portal Password
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={() => onForgotPassword(identifier)}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-mono"
            >
              Forgot keys?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
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
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2.5 py-1">
          <input
            type="checkbox"
            id="rememberMe"
            disabled={loading}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-cyan-500 focus:ring-0 outline-none cursor-pointer disabled:opacity-50"
          />
          <label htmlFor="rememberMe" className="text-xs text-slate-500 dark:text-slate-400 select-none cursor-pointer leading-none">
            Keep clinical workspace active on this terminal
          </label>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 dark:text-slate-950 font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
              <span>Decrypting Keys...</span>
            </div>
          ) : (
            <>
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>Authorize Twin Workspace</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-900/60 flex flex-col gap-3 text-center">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          New clinical client twin?{' '}
          <button
            disabled={loading}
            onClick={onRegister}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            Establish telemetry keys
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
export default LoginScreen;
