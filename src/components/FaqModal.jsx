import React from 'react';
import { X } from 'lucide-react';
import { FAQS } from '../data/products';

export default function FaqModal({ isOpen, onClose }) {
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
          maxWidth: '720px',
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
            Customer Guidance
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#121212' }}>
            Cash on Delivery &amp; Delivery FAQ
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Everything you need to know about ordering with Faneelo across the UK
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#121212',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: '#8C6838', fontSize: '0.9rem' }}>Q{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#4B5563',
                lineHeight: 1.6
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Got It, Back To Sofas
          </button>
        </div>
      </div>
    </div>
  );
}
