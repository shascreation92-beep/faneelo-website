import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onSelectCategory, 
  onNavigateHome,
  onOpenAbout,
  onOpenFaq,
  onOpenContact
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onSelectCategory) {
      onSelectCategory('all');
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <nav className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-[#E7E5E4] bg-white px-4 py-2.5 text-[#0A0A0A] shadow-[0_12px_40px_rgba(10,10,10,0.14)] backdrop-blur-md transition-all duration-300 sm:px-6 sm:py-3">
        {/* Brand Logo in exact Cormorant Garamond font-display */}
        <a 
          href="/" 
          onClick={handleHomeClick}
          className="font-display shrink-0 text-[1.65rem] font-semibold leading-none tracking-tight text-[#0A0A0A] sm:text-[1.85rem] no-underline cursor-pointer"
        >
          Faneelo
        </a>

        {/* Desktop Nav Links matching BritSofa */}
        <div className="hidden items-center gap-8 md:flex">
          <button 
            type="button"
            onClick={handleHomeClick}
            className="text-sm font-semibold text-[#1C1C1C] transition-colors hover:text-[#0A0A0A] bg-transparent border-0 cursor-pointer"
          >
            Home
          </button>

          <button 
            type="button"
            onClick={() => onSelectCategory('corner-sofa')}
            className="text-sm font-semibold text-[#57534E] transition-colors hover:text-[#0A0A0A] bg-transparent border-0 cursor-pointer"
          >
            Collections
          </button>

          <button 
            type="button"
            onClick={onOpenAbout}
            className="text-sm font-semibold text-[#57534E] transition-colors hover:text-[#0A0A0A] bg-transparent border-0 cursor-pointer"
          >
            About Us
          </button>

          <button 
            type="button"
            onClick={onOpenFaq}
            className="text-sm font-semibold text-[#57534E] transition-colors hover:text-[#0A0A0A] bg-transparent border-0 cursor-pointer"
          >
            Cash on Delivery FAQ
          </button>
        </div>

        {/* Right Action Icons: Cart & Contact Us Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1C1C1C] transition hover:bg-[#F5F5F4] bg-transparent border-0 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1C1C1C] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Contact Us Black Pill Button */}
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20would%20like%20to%20get%20in%20touch.`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#1C1C1C] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0A0A0A] sm:px-5 sm:text-sm no-underline inline-flex items-center"
          >
            Contact Us
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1C1C1C] md:hidden bg-transparent border-0 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto mt-2 mx-auto max-w-6xl rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-xl md:hidden flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { handleHomeClick(); setMobileOpen(false); }}
            className="text-left text-sm font-semibold text-[#1C1C1C] py-2 border-0 bg-transparent cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => { onSelectCategory('corner-sofa'); setMobileOpen(false); }}
            className="text-left text-sm font-semibold text-[#57534E] py-2 border-0 bg-transparent cursor-pointer"
          >
            Collections (Corner &amp; Suites)
          </button>
          <button
            type="button"
            onClick={() => { onOpenAbout(); setMobileOpen(false); }}
            className="text-left text-sm font-semibold text-[#57534E] py-2 border-0 bg-transparent cursor-pointer"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => { onOpenFaq(); setMobileOpen(false); }}
            className="text-left text-sm font-semibold text-[#57534E] py-2 border-0 bg-transparent cursor-pointer"
          >
            Cash on Delivery FAQ
          </button>
        </div>
      )}
    </header>
  );
}
