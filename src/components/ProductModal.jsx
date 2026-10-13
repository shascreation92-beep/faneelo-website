import React, { useState } from 'react';
import { X, Check, Star, Truck, Shield, Banknote, MessageCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  // Selected state
  const variants = product.variants && product.variants.length > 0 ? product.variants : [
    { type: 'standard', label: 'Standard Suite', price: product.price, imageUrl: product.imageUrl }
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImage, setSelectedImage] = useState(selectedVariant.imageUrl || product.imageUrl);
  const [selectedFabric, setSelectedFabric] = useState(product.fabricList?.[0] || 'Plush Velvet');
  const [selectedColor, setSelectedColor] = useState(product.colorList?.[0] || 'Charcoal Grey');
  const [cornerFacing, setCornerFacing] = useState('Left Hand Facing (LHF)');
  const [quantity, setQuantity] = useState(1);

  // If variant changes, update current image if variant has its own image
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
  };

  const isCorner = selectedVariant.type?.includes('corner') || product.name?.toLowerCase().includes('corner');
  const currentPrice = selectedVariant.price || product.price || 550;
  const originalPrice = Math.round(currentPrice * 1.25);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  // Pre-formatted WhatsApp order message
  const waText = encodeURIComponent(
    `Hello Faneelo! I would like to order:\n\n` +
    `• Sofa: ${product.name}\n` +
    `• Size / Variant: ${selectedVariant.label || selectedVariant.type}\n` +
    `• Fabric: ${selectedFabric}\n` +
    `• Colour: ${selectedColor}\n` +
    `${isCorner ? `• Facing: ${cornerFacing}\n` : ''}` +
    `• Price: £${currentPrice}\n` +
    `• Payment: Cash on Delivery\n\n` +
    `Can you confirm delivery availability for my UK postcode?`
  );

  const handleAddToBasket = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      variant: selectedVariant.label || selectedVariant.type,
      price: currentPrice,
      image: selectedImage,
      fabric: selectedFabric,
      color: selectedColor,
      facing: isCorner ? cornerFacing : null,
      quantity: quantity
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 18, 18, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 50,
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
          maxWidth: '1000px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          position: 'relative',
          padding: 0,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Close product options"
        >
          <X size={20} color="#121212" />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          padding: '2rem'
        }}>
          {/* Left Column: Image Showcase & Thumbnails */}
          <div>
            <div style={{
              width: '100%',
              height: '380px',
              backgroundColor: '#F3F2EE',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)'
            }}>
              <img 
                src={selectedImage} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px'
              }}>
                <span className="badge-gold">
                  {selectedVariant.label || 'Selected Model'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {imagesList.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '0.6rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
              }}>
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                      backgroundColor: '#F3F2EE'
                    }}
                  >
                    <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Inspection Guarantee Callout */}
            <div style={{
              marginTop: '1.25rem',
              backgroundColor: '#F7F5F0',
              border: '1px solid #E5DFD5',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.825rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#15803D', fontWeight: 700 }}>
                <Banknote size={16} />
                <span>100% Cash on Delivery Guarantee</span>
              </div>
              <p style={{ color: '#555', lineHeight: 1.5 }}>
                Our 2-man British delivery crew will bring the sofa into your room of choice, unwrap it, and allow you to inspect the fabric and comfort before paying. Zero risk.
              </p>
            </div>
          </div>

          {/* Right Column: Customizer & Order Options */}
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#8C6838',
              marginBottom: '0.3rem'
            }}>
              {product.collection} British Atelier
            </div>

            <h2 style={{
              fontSize: '1.75rem',
              lineHeight: 1.25,
              fontWeight: 700,
              color: '#121212',
              marginBottom: '0.6rem'
            }}>
              {product.name}
            </h2>

            {/* Ratings & Orders */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C5A880" color="#C5A880" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A' }}>
                4.9 / 5.0
              </span>
              <span style={{ fontSize: '0.8rem', color: '#777' }}>
                ({product.soldCount || 100}+ Handcrafted in UK)
              </span>
            </div>

            {/* Price Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <span style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: '#121212',
                fontFamily: 'var(--font-sans)'
              }}>
                £{currentPrice.toLocaleString('en-GB')}
              </span>
              <span style={{
                fontSize: '1.1rem',
                color: '#A09C94',
                textDecoration: 'line-through'
              }}>
                £{originalPrice.toLocaleString('en-GB')}
              </span>
              <span className="badge-gold">
                Save £{originalPrice - currentPrice}
              </span>
            </div>

            {/* 1. Size / Configuration Selector */}
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1A1A1A',
                marginBottom: '0.6rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>1. Select Size / Configuration:</span>
                <span style={{ color: '#8C6838' }}>{selectedVariant.label || selectedVariant.type}</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.5rem'
              }}>
                {variants.map((v, idx) => {
                  const isCur = (selectedVariant.type === v.type && selectedVariant.label === v.label);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVariantChange(v)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: isCur ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isCur ? 'var(--color-bg-alt)' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: isCur ? 700 : 500, color: '#1A1A1A' }}>
                        {v.label || v.type}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8C6838', marginTop: '2px' }}>
                        £{v.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Corner Facing option if Corner Suite */}
            {isCorner && (
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                  2. Corner Facing Orientation:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {['Left Hand Facing (LHF)', 'Right Hand Facing (RHF)'].map((facing) => (
                    <button
                      key={facing}
                      onClick={() => setCornerFacing(facing)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        border: cornerFacing === facing ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: cornerFacing === facing ? 'var(--color-bg-alt)' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '0.825rem',
                        fontWeight: cornerFacing === facing ? 700 : 500
                      }}
                    >
                      {facing}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Fabric Selector */}
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                Fabric Selection: <span style={{ fontWeight: 500, color: '#666' }}>({selectedFabric})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {product.fabricList.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: selectedFabric === fabric ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedFabric === fabric ? 'var(--color-primary)' : '#FFFFFF',
                      color: selectedFabric === fabric ? '#FFFFFF' : '#333',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Color Swatch Selector */}
            <div style={{ marginBottom: '1.8rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                Colour Choice: <span style={{ fontWeight: 600, color: '#8C6838' }}>{selectedColor}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '0.4rem',
                maxHeight: '130px',
                overflowY: 'auto',
                padding: '4px',
                border: '1px solid #F1EFEA',
                borderRadius: 'var(--radius-md)'
              }}>
                {product.colorList.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    style={{
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      border: selectedColor === col ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedColor === col ? '#121212' : '#FAFAF9',
                      color: selectedColor === col ? '#FFFFFF' : '#222',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem' }}>
                {/* Quantity */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.6rem'
                }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem' }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 700, padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem' }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToBasket}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Add To Basket • £{(currentPrice * quantity).toLocaleString('en-GB')}</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', textAlign: 'center' }}
              >
                <MessageCircle size={18} />
                <span>Instant WhatsApp Order (Inspect First, Pay Later)</span>
              </a>
            </div>

            {/* Quick Guarantees Footer */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={15} color="#15803D" />
                <span>1–3 Working Days UK</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={15} color="#8C6838" />
                <span>5-Year Frame Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
