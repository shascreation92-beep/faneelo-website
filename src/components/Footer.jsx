import React from 'react';
import { STORE_INFO } from '../data/products';

export default function Footer({ onSelectCategory, onOpenAbout, onOpenFaq }) {
  return (
    <footer className="mt-20 border-t border-[#E7E5E4] bg-gradient-to-b from-[#1C1C1C] to-[#171717] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main 4 Columns Grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div>
              <span className="font-display text-3xl font-bold tracking-tight text-white block">
                Faneelo<span className="text-sm font-normal text-white/60">.co.uk</span>
              </span>
              <p className="text-xs uppercase tracking-widest text-white/50 mt-1 font-semibold">
                British Luxury Living
              </p>
            </div>

            <p className="text-sm leading-relaxed text-white/80">
              Faneelo.co.uk is your trusted UK destination for corner sofas, 2 seater sofas, 3 seater sofas, 4 seater sofas, sofa beds, and luxury fabric sofas. Order today, deliver tomorrow.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
              Order Today, Deliver Tomorrow
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  All Sofas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('3plus2-seater')}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  3+2 Seater Sofas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('corner-sofa')}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Corner Sofas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('u-shape-sofa')}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  U Shape Sofas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('leather-sofa')}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Leather Sofas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">
              Customer Service
            </h3>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20need%20help.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/75 transition-colors hover:text-white no-underline"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Delivery (1–3 Days)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Cash on Delivery Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Returns &amp; Exchanges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  5-Year Frame Warranty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="text-white/75 transition-colors hover:text-white bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">
              Get in Touch
            </h3>
            <div className="space-y-2.5 text-sm text-white/75">
              <p>
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white transition-colors text-white no-underline font-semibold">
                  {STORE_INFO.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white transition-colors text-white/75 no-underline">
                  {STORE_INFO.email}
                </a>
              </p>
              <p className="text-white/60">
                Wolverhampton, United Kingdom
              </p>
              <p className="text-xs text-white/50 pt-2">
                Order online with <strong>Cash on Delivery</strong> across UK mainland.
              </p>
            </div>
          </div>
        </div>


        {/* Bottom Copyright Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © 2026 Faneelo.co.uk. All rights reserved. Premium sofas across the UK.
          </p>
          <div className="flex gap-6">
            <button type="button" onClick={onOpenFaq} className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-white/50 p-0 text-xs">
              Privacy Policy
            </button>
            <button type="button" onClick={onOpenFaq} className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-white/50 p-0 text-xs">
              Terms of Service
            </button>
            <button type="button" onClick={onOpenFaq} className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-white/50 p-0 text-xs">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
