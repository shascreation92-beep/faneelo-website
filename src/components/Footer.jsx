import React from 'react';
import { STORE_INFO } from '../data/products';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onSelectCategory, onOpenAbout, onOpenFaq }) {
  return (
    <footer style={{
      backgroundColor: '#0F0F0F',
      color: '#A09C94',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid #222222'
    }}>
      <div className="container">
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Column 1: Brand & Atelier Story */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(145deg, #1A1A1A 0%, #0A0A0A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #C5A880'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 17L4 11L7.5 13.5L12 8L16.5 13.5L20 11L20 17H4Z" fill="#C5A880" />
                  <circle cx="12" cy="6.5" r="1.5" fill="#E5C396" />
                  <rect x="4" y="18" width="16" height="2" rx="1" fill="#C5A880" />
                </svg>
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  Faneelo
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  color: '#8C6838',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  British Living
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#8E8B85',
              marginBottom: '1.25rem'
            }}>
              Handcrafted British luxury sofas, bespoke corner suites, and cloud modular comfort delivered straight to your home with full Cash on Delivery security.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#1C1C1C',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              fontSize: '0.75rem',
              color: '#E5C396'
            }}>
              <ShieldCheck size={14} color="#C5A880" />
              <span>5-Year Hardwood Frame Guarantee</span>
            </div>
          </div>

          {/* Column 2: Popular Collections */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem'
            }}>
              Shop Collections
            </h4>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button 
                  onClick={() => onSelectCategory('corner-sofa')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  Corner Sofas (L-Shaped)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('3plus2-seater')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  3+2 Seater Packages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('modular-boucle')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  Modular Bouclé Sofas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('3-seater')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  3 Seater Sofas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('5-seater')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  5 Seater Family Suites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('6-seater')}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  U-Shaped &amp; 6 Seaters
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Reassurance */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem'
            }}>
              Customer Support
            </h4>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button 
                  onClick={onOpenFaq}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  Cash on Delivery Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFaq}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  UK Delivery &amp; Room of Choice
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  Hardwood Frame Guarantee
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout}
                  style={{ background: 'none', border: 'none', color: '#BDB9B2', cursor: 'pointer', padding: 0 }}
                >
                  About Our British Workshops
                </button>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20Faneelo%2C%20can%20you%20help%20me%20with%20dimensions%3F`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
                >
                  Chat with a Sofa Specialist ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: UK Headquarters & Contact */}
          <div>
            <h4 style={{
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem'
            }}>
              UK Atelier &amp; Contact
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#C5A880" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Wolverhampton, West Midlands, United Kingdom</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#C5A880" style={{ flexShrink: 0 }} />
                <a href={`tel:${STORE_INFO.phone}`} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
                  {STORE_INFO.phone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#C5A880" style={{ flexShrink: 0 }} />
                <a href={`mailto:${STORE_INFO.email}`} style={{ color: '#BDB9B2', textDecoration: 'none' }}>
                  {STORE_INFO.email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#C5A880" style={{ flexShrink: 0 }} />
                <span>Mon – Sun: 9:00am – 9:00pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #1E1E1E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: '0.78rem'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>{STORE_INFO.legalName}</strong> ({STORE_INFO.domain}). All rights reserved. Registered in the UK.
          </div>

          {/* Payment Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#777', marginRight: '0.2rem' }}>Accepted:</span>
            <span style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid #333',
              fontWeight: 700
            }}>
              💷 Cash on Delivery
            </span>
            <span style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}>
              Visa
            </span>
            <span style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}>
              Mastercard
            </span>
            <span style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}>
              Apple Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
