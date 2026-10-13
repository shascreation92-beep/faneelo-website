import React from 'react';
import { Star, Truck, Eye, MessageCircle, ShoppingBag } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductCard({ product, onSelectProduct, onQuickAdd }) {
  const displayPrice = product.price || 550;
  const originalPrice = product.originalPrice && product.originalPrice > displayPrice 
    ? product.originalPrice 
    : Math.round(displayPrice * 1.25);

  const colors = product.colorList ? product.colorList.slice(0, 5) : ['Charcoal', 'Grey', 'Beige', 'Navy'];

  return (
    <div 
      className="surface-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer'
      }}
      onClick={() => onSelectProduct(product)}
    >
      {/* Product Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '68%',
        backgroundColor: '#F3F2EE',
        overflow: 'hidden'
      }}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 2
        }}>
          {product.badge && (
            <span className={product.badge.includes('Sale') ? 'badge-gold' : 'badge-dark'}>
              {product.badge}
            </span>
          )}
          <span className="badge-green" style={{ fontSize: '0.68rem' }}>
            Cash On Delivery
          </span>
        </div>

        {/* Quick View Button */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 2
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Eye size={13} />
            <span>Options</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {/* Collection & Rating */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#8C6838'
          }}>
            {product.collection ? `${product.collection} Suite` : 'Designer Suite'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={13} fill="#C5A880" color="#C5A880" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1A1A' }}>
              {product.rating || 5}.0
            </span>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>
              ({product.soldCount || 80}+)
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          lineHeight: 1.35,
          color: '#1A1A1A',
          marginBottom: '0.6rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>

        {/* Color preview tags */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#777' }}>Colors:</span>
          {colors.map((c, i) => (
            <span 
              key={i}
              style={{
                fontSize: '0.68rem',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                padding: '1px 6px',
                borderRadius: '4px',
                color: '#555'
              }}
            >
              {c}
            </span>
          ))}
          {product.colorList && product.colorList.length > 5 && (
            <span style={{ fontSize: '0.68rem', color: '#8C6838', fontWeight: 600 }}>
              +{product.colorList.length - 5} more
            </span>
          )}
        </div>

        {/* Price & Delivery */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.9rem',
          borderTop: '1px solid #F1EFEA',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>
              Starting Price
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
              <span style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#121212',
                fontFamily: 'var(--font-sans)'
              }}>
                £{displayPrice.toLocaleString('en-GB')}
              </span>
              <span style={{
                fontSize: '0.85rem',
                color: '#A09C94',
                textDecoration: 'line-through'
              }}>
                £{originalPrice.toLocaleString('en-GB')}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#15803D',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <Truck size={14} />
            <span>Free UK Delivery</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="btn-primary"
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              width: '100%'
            }}
          >
            Customise &amp; Order
          </button>

          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hi%20Faneelo%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(product.name)}%20(Starting%20£${displayPrice})`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="Order sofa directly on WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
