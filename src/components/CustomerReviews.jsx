import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function CustomerReviews() {
  return (
    <section style={{
      padding: '4.5rem 0',
      backgroundColor: 'var(--color-bg)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#8C6838',
              marginBottom: '0.4rem'
            }}>
              Customer Voices
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
              lineHeight: 1.2
            }}>
              What UK Homeowners Are Saying
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#FFFFFF',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#121212' }}>4.9 / 5.0</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#00B67A" color="#00B67A" />
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600 }}>Trustpilot Verified</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id}
              className="surface-card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Rating stars & verified badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#C5A880" color="#C5A880" />
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#15803D',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    <CheckCircle size={13} />
                    <span>Verified UK Buyer</span>
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#121212',
                  marginBottom: '0.6rem',
                  lineHeight: 1.3
                }}>
                  “{rev.title}”
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-muted)',
                  marginBottom: '1.25rem'
                }}>
                  {rev.review}
                </p>
              </div>

              {/* Author & Product */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #F1EFEA',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A1A' }}>
                    {rev.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                    {rev.location}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#8C6838',
                  maxWidth: '130px',
                  textAlign: 'right',
                  lineHeight: 1.2
                }}>
                  {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
