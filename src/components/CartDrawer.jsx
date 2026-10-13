import React from 'react';
import { X, Trash2, ShoppingBag, Truck, Banknote, ArrowRight, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout 
}) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Pre-formatted WhatsApp message for all cart items
  const waCartText = encodeURIComponent(
    `Hello Faneelo! I would like to place an order for the following sofa items:\n\n` +
    items.map((it, i) => (
      `${i + 1}. ${it.name}\n` +
      `   • Size: ${it.variant}\n` +
      `   • Fabric: ${it.fabric} | Colour: ${it.color}\n` +
      `${it.facing ? `   • Facing: ${it.facing}\n` : ''}` +
      `   • Qty: ${it.quantity} × £${it.price} = £${it.price * it.quantity}`
    )).join('\n\n') +
    `\n\nTotal: £${totalAmount}\nPayment Method: Cash on Delivery\nDelivery: Free UK Delivery\n\nPlease let me know the next delivery slot!`
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 18, 18, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 60,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAFAF9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="#121212" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Your Basket ({items.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '0.3rem',
              display: 'flex'
            }}
            aria-label="Close basket"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Delivery & COD Progress Bar */}
        <div style={{
          backgroundColor: '#F3FBF5',
          borderBottom: '1px solid #D1E7D7',
          padding: '0.75rem 1.5rem',
          fontSize: '0.8rem',
          color: '#15803D',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600
        }}>
          <Truck size={16} />
          <span>Qualifies for <strong>Free 1–3 Day UK Delivery</strong> &amp; <strong>Cash on Delivery</strong>!</span>
        </div>

        {/* Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--color-text-muted)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <ShoppingBag size={28} color="#9C9892" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#1A1A1A', marginBottom: '0.4rem' }}>
                Your basket is empty
              </h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '240px', marginBottom: '1.5rem' }}>
                Discover handcrafted corner sofas, 3+2 suites, and modular bouclé designs.
              </p>
              <button 
                onClick={onClose}
                className="btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                Browse Sofas Collection
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #F1EFEA',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#F3F2EE',
                  border: '1px solid var(--color-border)',
                  flexShrink: 0
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#121212', marginBottom: '0.2rem' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#8C6838', fontWeight: 600 }}>
                    {item.variant}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#666' }}>
                    {item.fabric} • {item.color}
                  </div>
                  {item.facing && (
                    <div style={{ fontSize: '0.72rem', color: '#666' }}>
                      {item.facing}
                    </div>
                  )}

                  {/* Quantity Stepper & Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 6px',
                      fontSize: '0.8rem'
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#121212' }}>
                      £{(item.price * item.quantity).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9C9892',
                    padding: '0.4rem',
                    display: 'flex'
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FAFAF9'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.4rem',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)'
            }}>
              <span>Delivery (UK Mainland):</span>
              <span style={{ color: '#15803D', fontWeight: 700 }}>FREE</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#121212'
            }}>
              <span>Total:</span>
              <span>£{totalAmount.toLocaleString('en-GB')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.95rem', padding: '0.9rem' }}
              >
                <span>Proceed to Cash on Delivery Checkout</span>
                <ArrowRight size={17} />
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waCartText}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', textAlign: 'center', padding: '0.85rem' }}
              >
                <MessageCircle size={17} />
                <span>Order Basket on WhatsApp</span>
              </a>
            </div>

            <div style={{
              fontSize: '0.725rem',
              color: '#777',
              textAlign: 'center',
              marginTop: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              <Banknote size={13} color="#15803D" />
              <span>Inspect sofa first upon delivery before paying. 0% Risk.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
