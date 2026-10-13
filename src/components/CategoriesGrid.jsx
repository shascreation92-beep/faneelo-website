import React from 'react';
import { CATEGORIES } from '../data/products';
import { ArrowUpRight } from 'lucide-react';

export default function CategoriesGrid({ selectedCategory, onSelectCategory }) {
  return (
    <section style={{
      paddingTop: '4rem',
      paddingBottom: '3.5rem',
      backgroundColor: 'var(--color-bg)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#8C6838',
              marginBottom: '0.4rem'
            }}>
              Bespoke Configurations
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              lineHeight: 1.2
            }}>
              Shop By Sofa Style &amp; Size
            </h2>
          </div>

          <button 
            onClick={() => onSelectCategory('all')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              padding: '0.5rem 0'
            }}
          >
            {selectedCategory !== 'all' ? '← Show All Categories' : 'Browse Complete Collection'}
          </button>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div 
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="surface-card"
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  borderWidth: isSelected ? '2px' : '1px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '170px',
                  backgroundColor: '#F3F2EE',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Badge */}
                  {cat.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      zIndex: 2
                    }}>
                      <span className="badge-gold">
                        {cat.badge}
                      </span>
                    </div>
                  )}

                  {/* Arrow Indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <ArrowUpRight size={16} color="#1A1A1A" />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1rem 1.1rem' }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: '0.2rem',
                    color: isSelected ? '#121212' : '#1A1A1A'
                  }}>
                    {cat.name}
                  </h3>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.6rem'
                  }}>
                    {cat.tagline}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #F1EFEA',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: '#8C6838', fontWeight: 600 }}>
                      From £{cat.startingPrice}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: isSelected ? 'var(--color-primary)' : '#78716C'
                    }}>
                      {isSelected ? 'Active Filter ✓' : 'Filter by size'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
