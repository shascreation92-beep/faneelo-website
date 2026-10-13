import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { login, getDemoCredentials } from '../../services/authService';

export default function AdminLogin({ onLoginSuccess, onBackToStore }) {
  const defaultCreds = getDemoCredentials();
  const [email, setEmail] = useState(defaultCreds.email);
  const [password, setPassword] = useState(defaultCreds.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        onLoginSuccess(res.session);
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to store link */}
        <button
          type="button"
          onClick={onBackToStore}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#111111] transition-colors cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={14} /> Back to Faneelo Store
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <span className="font-display text-4xl font-normal tracking-tight text-[#111111]">
            Faneelo<span className="text-[#C47C5A]">.</span>
          </span>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[#111111]">
            Store Administration Portal
          </h2>
          <p className="mt-1 text-xs text-[#777777]">
            Manage products, variants, collections, and pricing
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E6E6E6] rounded-3xl sm:px-10">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="admin-login-icon" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-login-input"
                  placeholder="admin@faneelo.co.uk"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="admin-login-icon" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-login-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full admin-btn-black text-sm font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          {/* Quick info for client */}
          <div className="mt-6 pt-5 border-t border-[#F0ECE5] text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#2E7D32] bg-[#EAF4E2] px-3 py-1 rounded-full font-medium">
              <ShieldCheck size={13} />
              Default Login: {defaultCreds.email} / {defaultCreds.password}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
