import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Eye, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { SITE_CONFIG } from '../config/siteSettings';

export default function MaintenancePage({ onBypass }) {
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminError, setAdminError] = useState(false);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Allow easy bypass with "admin" or "preview" or empty if owner clicks
    if (adminKey.toLowerCase().trim() === 'admin' || adminKey.toLowerCase().trim() === 'preview' || adminKey.trim() === '1234') {
      if (onBypass) onBypass();
    } else {
      setAdminError(true);
    }
  };

  const notice = SITE_CONFIG.notice || {};
  const whatsappUrl = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(notice.whatsAppPrompt || 'Hi Faneelo, I would like to inquire about sofas.')}`;

  return (
    <div className="relative min-h-screen w-full bg-[#141414] text-[#F5F5F4] flex flex-col justify-between overflow-x-hidden selection:bg-[#C5A880] selection:text-black">
      {/* Background Ambience with Luxury Warm Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, #8C6D3B 50%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full opacity-10 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #E5C396 0%, transparent 70%)' }}
        />
        {/* Subtle grid texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }}
        />
      </div>

      {/* Top Bar / Brand Header */}
      <header className="relative z-10 w-full border-b border-white/10 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {STORE_INFO.name}
            </span>
            <span className="hidden sm:inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase text-white/70">
              Official Showroom
            </span>
          </div>

          {/* Live Updating Indicator Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1 text-xs font-medium text-[#E5C396]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5C396] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]"></span>
            </span>
            <span>Working On Site</span>
          </div>
        </div>
      </header>

      {/* Central Announcement Card */}
      <main className="relative z-10 mx-auto my-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center sm:py-16">
        {/* Status Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white/85 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#E5C396]" />
          <span>{notice.badge || 'Scheduled Site Maintenance'}</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
          {notice.title || 'We’re Currently Working On Our Website'}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#A8A29E]">
          {notice.subtitle || 'Our digital showroom is undergoing scheduled updates and enhancements to bring you a smoother luxury sofa ordering experience. We’ll be back online shortly.'}
        </p>

        {/* Estimated Status Box */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs sm:text-sm text-stone-300 backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-[#E5C396] font-medium">
            <Clock className="h-4 w-4" />
            {notice.expectedReturn || 'Estimated return: Coming back online soon'}
          </span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="text-stone-400">All customer support and WhatsApp orders remain active</span>
        </div>

        {/* Contact & Inquiries Action Section (Customer can still order!) */}
        <div className="mt-10 w-full max-w-xl rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E5C396]">
                Need Help or Looking for a Sofa?
              </p>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                Our sales team is ready on WhatsApp
              </h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 mt-4 leading-relaxed">
            Even while our site is being updated, you can message us directly to view our latest sofa catalog, check fabric colors, or place an order with <strong>Cash on Delivery</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#22c35e] shadow-lg cursor-pointer no-underline"
            >
              <MessageCircle className="h-4 w-4 fill-black" />
              <span>Chat on WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15 cursor-pointer no-underline"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>Email inquiries:</span>
            <a 
              href={`mailto:${STORE_INFO.email}`} 
              className="text-[#E5C396] hover:underline flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" />
              {STORE_INFO.email}
            </a>
          </div>
        </div>

        {/* 3 Pillar Guarantees */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <ShieldCheck className="h-5 w-5 text-[#E5C396] mb-2" />
            <h3 className="text-sm font-semibold text-white">Cash on Delivery</h3>
            <p className="text-xs text-stone-400 mt-1">Inspect your sofa in person before making any payment.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <Truck className="h-5 w-5 text-[#E5C396] mb-2" />
            <h3 className="text-sm font-semibold text-white">Fast UK Delivery</h3>
            <p className="text-xs text-stone-400 mt-1">Delivered directly into your room of choice across the UK.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <CheckCircle2 className="h-5 w-5 text-[#E5C396] mb-2" />
            <h3 className="text-sm font-semibold text-white">Handcrafted Quality</h3>
            <p className="text-xs text-stone-400 mt-1">Solid wood frames, premium bouclé & velvet upholstery.</p>
          </div>
        </div>
      </main>

      {/* Footer with discreet Admin Preview Bypass */}
      <footer className="relative z-10 w-full border-t border-white/10 px-6 py-6 text-center text-xs text-stone-500">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {STORE_INFO.legalName}. Handcrafted in the UK.</p>

          {/* Admin Preview Bypass Toggle */}
          <div className="flex items-center gap-3">
            {!showAdminPrompt ? (
              <button
                type="button"
                onClick={() => setShowAdminPrompt(true)}
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-300 transition text-[11px] underline bg-transparent border-0 cursor-pointer"
                title="Preview site as admin/developer"
              >
                <Eye className="h-3 w-3" />
                <span>Admin Site Preview</span>
              </button>
            ) : (
              <form onSubmit={handleAdminSubmit} className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Password (or 'preview')"
                  value={adminKey}
                  onChange={(e) => {
                    setAdminKey(e.target.value);
                    setAdminError(false);
                  }}
                  className="rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E5C396]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-2.5 py-1 text-xs font-semibold text-black hover:bg-[#c5a332] cursor-pointer"
                >
                  Enter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminPrompt(false)}
                  className="text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
                {adminError && (
                  <span className="text-[10px] text-red-400">Invalid</span>
                )}
              </form>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
