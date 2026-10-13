import React from 'react';
import { Truck, Banknote, ShieldCheck, Headphones, Award, Sparkles } from 'lucide-react';

export default function TrustBadges() {
  const pillars = [
    {
      icon: <Truck size={26} color="#C5A880" />,
      title: 'Fast 1–3 Day UK Delivery',
      desc: 'White-glove 2-man room of choice delivery. We deliver across mainland UK with scheduled time slots.'
    },
    {
      icon: <Banknote size={26} color="#15803D" />,
      title: 'Cash on Delivery (Zero Risk)',
      desc: 'Inspect the sofa first at the time of delivery. If satisfied, pay the driver; if not, return without paying a single penny.'
    },
    {
      icon: <ShieldCheck size={26} color="#C5A880" />,
      title: '5-Year Frame Guarantee',
      desc: 'Built using seasoned hardwood timber and high-density foam cushioning engineered to maintain shape for years.'
    },
    {
      icon: <Headphones size={26} color="#C5A880" />,
      title: 'Dedicated WhatsApp Concierge',
      desc: 'Need advice on sizing, door clearance, or fabrics? Our British support team responds in minutes, 7 days a week.'
    }
  ];

  return (
    <section style={{
      padding: '4rem 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 3rem auto'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#8C6838',
            marginBottom: '0.4rem'
          }}>
            The Faneelo Promise
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
            lineHeight: 1.25
          }}>
            Crafted for Comfort, Delivered with Confidence
          </h2>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
            marginTop: '0.5rem'
          }}>
            We believe buying a luxury sofa online should be as effortless and safe as visiting a Mayfair showroom.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {pillars.map((p, idx) => (
            <div 
              key={idx}
              className="surface-card"
              style={{
                padding: '1.75rem 1.5rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {p.icon}
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#121212'
              }}>
                {p.title}
              </h3>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.55
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
