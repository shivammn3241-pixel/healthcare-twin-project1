import React, { useState } from 'react';
import { Mail, ShieldCheck, ShieldAlert } from 'lucide-react';
import { authService } from './authService';

interface ForgotPasswordScreenProps {
  initialIdentifier?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  initialIdentifier = '',
  onSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState(initialIdentifier.includes('@') ? initialIdentifier : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid clinical email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(); // Redirect back to sign in
        }, 2200);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Unable to contact authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          Recover Security Access
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
          Enter clinical email to restore twin workspace keys.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              Clinical Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@healthcare.ai"
                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 dark:text-slate-950 font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                <span>Syncing recovery request...</span>
              </div>
            ) : (
              <span>Request Password Reset Link</span>
            )}
          </button>
        </form>
      )}

      {/* Footer Return Links */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-900/60 text-center">
        <button
          onClick={onCancel}
          disabled={loading}
          className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline font-mono"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};
export default ForgotPasswordScreen;
