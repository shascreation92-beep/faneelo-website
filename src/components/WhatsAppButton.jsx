import React from 'react';
import { STORE_INFO } from '../data/products';

export default function WhatsAppButton() {
  const defaultText = encodeURIComponent('Hi Faneelo, I would like assistance choosing a sofa or placing an order.');

  return (
    <aside aria-label="WhatsApp customer support" className="floating-wa-container">
      {/* Expanding Ripple Rings */}
      <span className="floating-wa-ring" aria-hidden="true" />
      <span className="floating-wa-ring floating-wa-ring-delayed" aria-hidden="true" />

      {/* Main Floating Circular Icon Button */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsapp}?text=${defaultText}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat and Order on WhatsApp"
        className="floating-wa-btn"
      >
        {/* Sleek Hover Tooltip */}
        <span className="floating-wa-tooltip">
          Order on WhatsApp
        </span>

        {/* WhatsApp Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
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

        {/* Live Online Badge Dot */}
        <span className="floating-wa-online-dot" aria-hidden="true" />
      </a>
    </aside>
  );
}
