import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, MessageSquare, Menu, X, ShieldCheck, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onSelectCategory, 
  selectedCategory, 
  searchQuery, 
  setSearchQuery,
  onOpenAbout,
  onOpenFaq
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div style={{
        backgroundColor: '#121212',
        color: '#E5DFD5',
        fontSize: '0.8rem',
        padding: '0.55rem 1rem',
        borderBottom: '1px solid #262626'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#25D366' 
            }} />
            <span>🇬🇧 <strong>UK Spring Sale:</strong> Fast 1–3 Day UK Delivery &amp; <strong>Cash on Delivery</strong> Available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.78rem' }}>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20would%20like%20to%20inquire%20about%20ordering%20a%20sofa.`}
              target="_blank" 
              rel="noreferrer"
              style={{ color: '#E5DFD5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <MessageSquare size={13} color="#25D366" />
              <span>WhatsApp: <strong>+44 7988 582983</strong></span>
            </a>
            <span style={{ color: '#555' }}>|</span>
            <span style={{ color: '#C5A880', fontWeight: 600 }}>Rated 4.9/5 on Trustpilot ★</span>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="glass-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          gap: '1rem'
        }}>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              padding: '0.4rem'
            }}
            className="mobile-only-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Luxury Brand Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem' 
            }}
          >
            {/* British Crown & Atelier Monogram */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(145deg, #1A1A1A 0%, #0A0A0A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #C5A880',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17L4 11L7.5 13.5L12 8L16.5 13.5L20 11L20 17H4Z" fill="#C5A880" />
                <circle cx="12" cy="6.5" r="1.5" fill="#E5C396" />
                <circle cx="4" cy="9.5" r="1.2" fill="#E5C396" />
                <circle cx="20" cy="9.5" r="1.2" fill="#E5C396" />
                <rect x="4" y="18" width="16" height="2" rx="1" fill="#C5A880" />
              </svg>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                lineHeight: 1,
                color: '#121212',
                textTransform: 'uppercase'
              }}>
                Faneelo
              </div>
              <div style={{
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#8C6838',
                fontWeight: 600,
                marginTop: '2px'
              }}>
                British Living • UK
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6rem'
          }}>
            <button 
              onClick={() => onSelectCategory('all')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === 'all' ? 700 : 500,
                color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                padding: '0.4rem 0',
                borderBottom: selectedCategory === 'all' ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              All Sofas
            </button>

            <button 
              onClick={() => onSelectCategory('corner-sofa')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === 'corner-sofa' ? 700 : 500,
                color: selectedCategory === 'corner-sofa' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                padding: '0.4rem 0',
                borderBottom: selectedCategory === 'corner-sofa' ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Corner Sofas
            </button>

            <button 
              onClick={() => onSelectCategory('3plus2-seater')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === '3plus2-seater' ? 700 : 500,
                color: selectedCategory === '3plus2-seater' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                padding: '0.4rem 0',
                borderBottom: selectedCategory === '3plus2-seater' ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              3+2 Seater Sets
            </button>

            <button 
              onClick={() => onSelectCategory('modular-boucle')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === 'modular-boucle' ? 700 : 500,
                color: selectedCategory === 'modular-boucle' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                padding: '0.4rem 0',
                borderBottom: selectedCategory === 'modular-boucle' ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Bouclé &amp; Modular
            </button>

            <button 
              onClick={onOpenAbout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                padding: '0.4rem 0',
                transition: 'all 0.2s'
              }}
            >
              Why Faneelo
            </button>

            <button 
              onClick={onOpenFaq}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                padding: '0.4rem 0',
                transition: 'all 0.2s'
              }}
            >
              Cash on Delivery FAQ
            </button>
          </nav>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Search Input on Desktop */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--color-border)',
              maxWidth: '190px'
            }} className="desktop-search">
              <Search size={15} color="#8A8A8A" />
              <input 
                type="text"
                placeholder="Search sofas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  paddingLeft: '0.5rem',
                  fontSize: '0.85rem',
                  width: '100%',
                  outline: 'none',
                  color: 'var(--color-text)'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '0 2px' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button 
              onClick={onOpenCart}
              className="btn-primary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.875rem',
                position: 'relative'
              }}
              aria-label="View shopping basket"
            >
              <ShoppingBag size={17} />
              <span className="cart-btn-text">Basket</span>
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: '#C5A880',
                  color: '#121212',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.2rem'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.9rem',
              border: '1px solid var(--color-border)'
            }}>
              <Search size={16} color="#8A8A8A" />
              <input 
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  paddingLeft: '0.5rem',
                  fontSize: '0.9rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              All Sofas
            </button>
            <button 
              onClick={() => { onSelectCategory('corner-sofa'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              Corner Sofas
            </button>
            <button 
              onClick={() => { onSelectCategory('3plus2-seater'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              3+2 Seater Suites
            </button>
            <button 
              onClick={() => { onSelectCategory('modular-boucle'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              Modular &amp; Bouclé
            </button>
            <button 
              onClick={() => { onOpenAbout(); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', color: '#666' }}
            >
              About Faneelo
            </button>
            <button 
              onClick={() => { onOpenFaq(); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', padding: '0.6rem 0', background: 'none', border: 'none', fontSize: '1rem', color: '#666' }}
            >
              Cash on Delivery Policy
            </button>

            <div style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a 
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20would%20like%20to%20order%20a%20sofa.`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                Order via WhatsApp (+44 7988 582983)
              </a>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-only-btn { display: flex !important; }
          .cart-btn-text { display: none; }
        }
        @media (min-width: 901px) {
          .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
