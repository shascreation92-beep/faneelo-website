import React, { useState, useEffect } from 'react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85'
];

export default function Hero({ onExploreClick, onCornerClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#2B2B2B]">
      {/* Background Image Carousel with smooth fade transition */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={img}
            alt={`Faneelo luxury UK sofa ${idx + 1}`}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}

      {/* Dual Gradient Overlays matching BritSofa */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:justify-center lg:px-12 lg:pb-24 lg:pt-28">
        <div className="max-w-2xl space-y-6 text-white">
          {/* Badge */}
          <p className="inline-flex rounded-full border border-white/55 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 backdrop-blur-sm sm:text-xs">
            Luxury Sofas Collection
          </p>

          {/* Typography Headings in exact Cormorant Garamond font-display */}
          <div className="space-y-3">
            <p className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Faneelo
            </p>
            <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-white/95 sm:text-4xl md:text-5xl">
              Sofas for sale in the UK — order online
            </h1>
          </div>

          {/* Subtext */}
          <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Shop corner sofas, fabric sofas and sofa beds with clear sizes on every listing. Cash on delivery where offered at checkout.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] transition hover:bg-white/90 border-0 cursor-pointer shadow-md"
            >
              Shop Sofas
            </button>

            <button
              type="button"
              onClick={onCornerClick}
              className="inline-flex items-center justify-center rounded-full border border-white/80 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 bg-transparent cursor-pointer"
            >
              Corner Sofas
            </button>
          </div>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="mt-8 flex items-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 border-0 cursor-pointer p-0 ${
                i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
