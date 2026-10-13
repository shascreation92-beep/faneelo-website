import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote, Sparkles, Star } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Hero({ onExploreClick, onCornerClick }) {
  return (
    <section style={{
      position: 'relative',
      backgroundColor: '#121212',
      color: '#FFFFFF',
      overflow: 'hidden',
      paddingTop: '3.5rem',
      paddingBottom: '4.5rem'
    }}>
      {/* Subtle luxury background radial gradient */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-100px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, rgba(18, 18, 18, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Headlines & CTAs */}
          <div style={{ maxWidth: '620px' }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(197, 168, 128, 0.15)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={14} color="#C5A880" />
              <span style={{
                color: '#E5C396',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Direct From Master Craftsmen • UK Wide
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              lineHeight: 1.1,
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}>
              Luxury Sofas Crafted For <span style={{ color: '#E5C396', fontStyle: 'italic' }}>Modern Living</span>.
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#BDB9B2',
              marginBottom: '2rem',
              fontWeight: 400
            }}>
              Upgrade your living space with bespoke velvet and chenille corner suites, 3+2 packages, and modular bouclé sofas. Hand-delivered across the UK in <strong>1–3 working days</strong> with complete peace of mind through <strong>Cash on Delivery</strong>.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <button 
                onClick={onExploreClick}
                className="btn-gold"
                style={{ fontSize: '1rem', padding: '0.95rem 1.8rem' }}
              >
                <span>Shop Sofas Collection</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={onCornerClick}
                className="btn-secondary"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '1rem',
                  padding: '0.95rem 1.8rem'
                }}
              >
                <span>Corner Sofas</span>
              </button>

              <a 
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20am%20interested%20in%20ordering%20a%20sofa.`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: '0.95rem', padding: '0.95rem 1.5rem' }}
              >
                <span>Order via WhatsApp</span>
              </a>
            </div>

            {/* Trustpilot Score Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#00B67A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2px'
                  }}>
                    <Star size={14} fill="#FFFFFF" color="#FFFFFF" />
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Rated 4.9 / 5 on Trustpilot
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8E8B85' }}>
                  Based on 1,420+ verified UK homeowner deliveries
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Showcase Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(197, 168, 128, 0.25)',
              position: 'relative'
            }}>
              <img 
                src="https://backend.britsofa.co.uk/uploads/1778435615509-Corner-Sofa.jpeg"
                alt="Faneelo Luxury British Corner Sofa in Plush Fabric"
                style={{
                  width: '100%',
                  height: '440px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Gradient overlay at bottom of image */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0) 65%)',
                padding: '2rem 1.5rem 1.25rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <div>
                    <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      Flagship Suite
                    </span>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 600 }}>
                      Luxury Lilly Corner Sofa
                    </h3>
                    <p style={{ color: '#C5A880', fontSize: '0.85rem' }}>
                      Available in 20+ UK Velvet &amp; Chenille Shades
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9C9892', textTransform: 'uppercase' }}>
                      From Only
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                      £550
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Trust Card Top-Left */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '-15px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid #E8E5DF'
            }} className="desktop-hero-pill">
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Banknote size={18} color="#15803D" />
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1A1A1A' }}>
                  Cash on Delivery
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666' }}>
                  Inspect before you pay
                </div>
              </div>
            </div>

            {/* Floating Trust Card Bottom-Right */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '-15px',
              backgroundColor: '#1C1C1C',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              padding: '0.75rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }} className="desktop-hero-pill">
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 168, 128, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Truck size={18} color="#C5A880" />
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#FFFFFF' }}>
                  1–3 Day UK Delivery
                </div>
                <div style={{ fontSize: '0.7rem', color: '#BDB9B2' }}>
                  White glove 2-man room delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-hero-pill { display: none !important; }
        }
      `}</style>
    </section>
  );
}
