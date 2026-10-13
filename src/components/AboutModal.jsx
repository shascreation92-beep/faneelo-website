import React from 'react';
import { X, Award, ShieldCheck, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 18, 18, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 65,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div 
        className="surface-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>
            British Living Atelier
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#121212' }}>
            About Faneelo
          </h2>
          <p style={{ color: '#8C6838', fontSize: '0.9rem', fontWeight: 600 }}>
            Handcrafted Luxury Sofas • Direct from British Master Upholsterers
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.7 }}>
          <p>
            Welcome to <strong>Faneelo ({STORE_INFO.domain})</strong>. Founded on the principle that world-class sofa design, generous proportions, and luxurious fabrics shouldn't come with exorbitant showroom markups or months of waiting.
          </p>

          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <Award size={22} color="#C5A880" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#121212', display: 'block', marginBottom: '2px' }}>Solid Hardwood Construction</strong>
                Every frame is crafted using sustainably sourced seasoned birch and beech hardwoods, backed by our 5-Year Guarantee.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <Heart size={22} color="#C5A880" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#121212', display: 'block', marginBottom: '2px' }}>Bespoke Velvet, Cord &amp; Bouclé</strong>
                We curate high-rub count fabrics tested for heavy family use, pet resistance, and easy spill maintenance.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={22} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#121212', display: 'block', marginBottom: '2px' }}>Cash on Delivery Promise</strong>
                We respect your trust. Inspect the sofa in your own home before paying a single pound.
              </div>
            </div>
          </div>

          <p>
            Whether you are outfitting a contemporary London flat with an L-shaped corner suite or looking for a grand Chesterfield suite for a country home, our team is always ready to guide you.
          </p>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Close &amp; Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
