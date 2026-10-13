import React from 'react';
import { STORE_INFO } from '../data/products';

export default function WhatsAppButton() {
  const defaultText = encodeURIComponent('Hi Faneelo, I would like assistance choosing a sofa or placing an order.');

  return (
    <a
      href={`https://wa.me/${STORE_INFO.whatsapp}?text=${defaultText}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Order now on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 45,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: '#1C1C1C',
        padding: '0.65rem 1.15rem 0.65rem 0.75rem',
        color: '#FFFFFF',
        textDecoration: 'none',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(197, 168, 128, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
      }}
      className="animate-pulse-subtle"
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.backgroundColor = '#0A0A0A';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = '#1C1C1C';
      }}
    >
      {/* WhatsApp Circular Icon */}
      <span style={{
        display: 'flex',
        width: '36px',
        height: '36px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)'
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="20"
          height="20"
          fill="none"
          aria-hidden="true"
        >
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 3C9.372 3 4 8.373 4 15c0 2.13.557 4.126 1.53 5.85L4 29l8.355-1.497A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Z"
          />
          <path
            fill="#25D366"
            d="M22.01 18.42c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.86c.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.57.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
          />
        </svg>
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.02em', color: '#FFFFFF' }}>
          Order on WhatsApp
        </span>
        <span style={{ fontSize: '0.68rem', color: '#25D366', fontWeight: 600 }}>
          Online Now • Live UK Help
        </span>
      </div>
    </a>
  );
}
