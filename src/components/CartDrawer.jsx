import React from 'react';
import { X, Trash2, ShoppingBag, Truck, Banknote, ArrowRight } from 'lucide-react';
import { STORE_INFO, FALLBACK_IMAGE } from '../data/products';

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
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform"
        style={{ 
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
          animation: 'slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E7E5E4] px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#1C1C1C]" />
            <h2 
              className="text-base sm:text-lg font-bold text-[#1C1C1C] m-0 leading-none"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Your Basket ({items.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#78716C] transition hover:bg-[#F5F5F4] hover:text-[#1C1C1C] border-0 bg-transparent cursor-pointer p-0"
            aria-label="Close basket"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="flex items-center gap-2.5 border-b border-[#DCFCE7] bg-[#F0FDF4] px-6 py-2.5 text-xs font-medium text-[#15803D] shrink-0">
          <Truck className="h-4 w-4 shrink-0 text-[#16A34A]" />
          <span>
            Qualifies for <strong className="font-bold">Free 1–3 Day UK Delivery</strong> &amp; <strong className="font-bold">Cash on Delivery</strong>!
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-[#F5F5F4]">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F4] text-[#A8A29E] mb-4">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-[#1C1C1C] mb-1">
                Your basket is empty
              </h3>
              <p className="max-w-xs text-sm text-[#78716C] mb-6">
                Discover handcrafted corner sofas, 3+2 suites, and modular bouclé designs.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-[#1C1C1C] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0A0A0A] border-0 cursor-pointer"
              >
                Browse Sofas Collection
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex gap-4 py-4 first:pt-2">
                {/* Product Thumbnail */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E7E5E4] bg-[#F5F5F4]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#1C1C1C] leading-snug line-clamp-2 m-0">
                      {item.name}
                    </h4>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="p-1 text-[#A8A29E] hover:text-[#DC2626] transition bg-transparent border-0 cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Variation Details */}
                  <div className="text-xs text-[#78716C] mt-1 space-y-0.5">
                    <p className="font-semibold text-[#1C1C1C] m-0">
                      {item.variant}
                    </p>
                    <p className="m-0 text-[11px] text-[#78716C]">
                      {item.fabric} • {item.color}
                    </p>
                    {item.facing && (
                      <p className="m-0 text-[11px] text-[#78716C]">
                        {item.facing}
                      </p>
                    )}
                  </div>

                  {/* Quantity Stepper & Price Row */}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <div className="inline-flex items-center rounded-full border border-[#E7E5E4] bg-white px-2 py-0.5 shadow-sm">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="flex h-5 w-5 items-center justify-center text-sm font-bold text-[#78716C] hover:text-[#1C1C1C] border-0 bg-transparent cursor-pointer p-0"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1C1C1C]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="flex h-5 w-5 items-center justify-center text-sm font-bold text-[#78716C] hover:text-[#1C1C1C] border-0 bg-transparent cursor-pointer p-0"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-base font-bold text-[#1C1C1C] tabular-nums">
                      £{(item.price * item.quantity).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E7E5E4] bg-white px-6 py-5 space-y-3.5 shadow-[0_-8px_25px_rgba(0,0,0,0.04)] shrink-0">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Delivery (UK Mainland):</span>
              <span className="font-bold text-[#15803D] uppercase tracking-wider">
                FREE
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-[#F5F5F4] pb-2.5">
              <span className="text-sm font-semibold text-[#1C1C1C]">
                Total:
              </span>
              <span className="text-2xl font-bold text-[#1C1C1C] tabular-nums">
                £{totalAmount.toLocaleString('en-GB')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {/* Primary Black Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  borderRadius: '9999px',
                  backgroundColor: '#1C1C1C',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span>Proceed to Cash on Delivery Checkout</span>
                <ArrowRight style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              </button>

              {/* WhatsApp Green Pill Button */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waCartText}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  borderRadius: '9999px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="18"
                  height="18"
                  style={{ width: '18px', height: '18px', minWidth: '18px', flexShrink: 0, fill: '#FFFFFF' }}
                >
                  <path d="M16 3C9.372 3 4 8.373 4 15c0 2.13.557 4.126 1.53 5.85L4 29l8.355-1.497A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Z" />
                  <path
                    fill="#25D366"
                    d="M22.01 18.42c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.86c.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.57.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
                  />
                </svg>
                <span>Order Basket on WhatsApp</span>
              </a>
            </div>

            {/* Cash on delivery reassurance */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78716C] pt-0.5">
              <Banknote className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
              <span>Inspect sofa first upon delivery before paying. 0% Risk.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
