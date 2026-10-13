import React, { useState } from 'react';
import { X, CheckCircle2, Banknote, ArrowRight, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { saveOrder } from '../services/orderService';

function createNewOrder(formData, items, totalAmount) {
  const orderId = `FAN-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    orderId,
    date: new Date().toLocaleDateString('en-GB'),
    timestamp: new Date().toISOString(),
    status: 'Pending Confirmation',
    items,
    totalAmount,
    customer: formData
  };
}

export default function CheckoutModal({ isOpen, onClose, items, onOrderSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    deliveryNotes: '',
    paymentMethod: 'cash_on_delivery'
  });

  const [submittedOrder, setSubmittedOrder] = useState(null);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.postcode) {
      alert('Please fill in your name, phone number, address, and UK postcode.');
      return;
    }

    const newOrder = createNewOrder(formData, items, totalAmount);

    // Persist order to storage & cloud
    saveOrder(newOrder);

    setSubmittedOrder(newOrder);
    onOrderSuccess();
  };

  const waOrderText = submittedOrder ? encodeURIComponent(
    `Hello Faneelo! I just placed an order on Faneelo.co.uk.\n\n` +
    `• Order Reference: ${submittedOrder.orderId}\n` +
    `• Customer: ${submittedOrder.customer.fullName}\n` +
    `• Phone: ${submittedOrder.customer.phone}\n` +
    `• Delivery Address: ${submittedOrder.customer.address}, ${submittedOrder.customer.city}, ${submittedOrder.customer.postcode}\n` +
    `• Items:\n` +
    submittedOrder.items.map(it => `  - ${it.name} (${it.variant}, ${it.color}, ${it.fabric}) × ${it.quantity} = £${it.price * it.quantity}`).join('\n') +
    `\n• Total: £${submittedOrder.totalAmount}\n` +
    `• Payment: Cash on Delivery\n\n` +
    `Please confirm my delivery dispatch date!`
  ) : '';

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
      zIndex: 70,
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
          maxHeight: '94vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          padding: 0,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAFAF9'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#121212' }}>
              {submittedOrder ? 'Order Confirmed!' : 'UK Checkout & Cash on Delivery'}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#8C6838', fontWeight: 600 }}>
              Faneelo™ Handcrafted British Living
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '0.3rem'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {submittedOrder ? (
          /* Order Confirmation View */
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={40} color="#15803D" />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#121212', marginBottom: '0.4rem' }}>
              Thank You, {submittedOrder.customer.fullName}!
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your order has been booked. Reference ID: <strong style={{ color: '#121212' }}>{submittedOrder.orderId}</strong>
            </p>

            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#777' }}>Delivery Address:</span>
                <span style={{ fontWeight: 600 }}>{submittedOrder.customer.address}, {submittedOrder.customer.postcode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#777' }}>Payment Due at Delivery:</span>
                <span style={{ fontWeight: 800, color: '#15803D' }}>£{submittedOrder.totalAmount.toLocaleString('en-GB')} (Cash on Delivery)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#777' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 600 }}>1–3 Working Days</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
              Our logistics team will ring you 24 hours prior with your 2-hour delivery window. You will inspect the sofa in your room before handing payment to the driver.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waOrderText}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', textDecoration: 'none', padding: '0.9rem' }}
              >
                <MessageCircle size={18} />
                <span>Track &amp; Confirm on WhatsApp ({STORE_INFO.phone})</span>
              </a>

              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.8rem' }}
              >
                Back to Sofa Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
            {/* Order Summary Pill */}
            <div style={{
              backgroundColor: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#777' }}>
                  Total to pay on delivery ({items.length} items):
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#121212' }}>
                  £{totalAmount.toLocaleString('en-GB')}
                </div>
              </div>

              <div style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Banknote size={14} />
                <span>Pay When Satisfied</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Full Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oliver Smith"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    UK Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 07473 954773"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Email Address (for receipt)
                </label>
                <input
                  type="email"
                  placeholder="oliver.smith@example.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Street Address &amp; House Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Kensington High Street, Flat 2B"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* City & Postcode */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London / Manchester"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    UK Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. W8 4SG"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ground floor living room, please call 1 hour before arrival"
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Payment Method
                </label>
                <div style={{
                  padding: '1rem',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '5px solid var(--color-primary)',
                    backgroundColor: '#FFFFFF'
                  }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#121212' }}>
                      Cash on Delivery (Pay Driver upon delivery)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      Inspect the sofa first. Only hand over payment once you are 100% satisfied.
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '0.8rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1C1C1C',
                    color: '#FFFFFF',
                    padding: '0.95rem 1.25rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                    transition: 'all 0.2s ease',
                    lineHeight: 1.35
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1C1C1C';
                  }}
                >
                  <span style={{ textAlign: 'center' }}>
                    Place Order with Cash on Delivery{' '}
                    <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px', verticalAlign: 'middle' }}>
                      (£{totalAmount.toLocaleString('en-GB')})
                      <ArrowRight size={17} style={{ flexShrink: 0 }} />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
