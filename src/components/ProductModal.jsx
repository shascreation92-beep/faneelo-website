import React, { useState, useEffect } from 'react';
import { X, Check, Star, Truck, Shield, Banknote, MessageCircle, ShoppingBag, ChevronDown } from 'lucide-react';
import { STORE_INFO, FALLBACK_IMAGE } from '../data/products';

export function getCleanVariantName(v) {
  if (!v) return 'Standard Suite';
  
  const typeMap = {
    '1-seater': '1 Seater',
    '2-seater': '2 Seater',
    '3-seater': '3 Seater',
    '4-seater': '4 Seater',
    '5-seater': '5 Seater',
    '6-seater': '6 Seater',
    '3plus2-seater': '3+2 Seater',
    'corner-sofa': 'Corner Sofa'
  };

  if (v.type && typeMap[v.type]) {
    return typeMap[v.type];
  }

  const raw = (v.label || v.type || '').toString();

  if (/3\s*\+\s*2/i.test(raw)) return '3+2 Seater';
  if (/corner/i.test(raw) || /l-shape/i.test(raw)) return 'Corner Sofa';
  if (/1\s*seater/i.test(raw) || /single/i.test(raw) || /armchair/i.test(raw)) return '1 Seater';
  if (/2\s*seater/i.test(raw) || /loveseat/i.test(raw)) return '2 Seater';
  if (/3\s*seater/i.test(raw)) return '3 Seater';
  if (/4\s*seater/i.test(raw)) return '4 Seater';
  if (/5\s*seater/i.test(raw)) return '5 Seater';
  if (/6\s*seater/i.test(raw) || /u-shape/i.test(raw)) return '6 Seater';
  if (/footstool|pouffe/i.test(raw)) return 'Pouffe / Footstool';

  return raw.split(/[–—|]/)[0].trim() || 'Standard Suite';
}

export default function ProductModal({ product, onClose, onAddToCart, onCheckout }) {
  // Body scroll lock & ESC key listener
  useEffect(() => {
    if (!product) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  const variants = product?.variants && product.variants.length > 0 ? product.variants : [
    { type: 'standard', label: 'Standard Suite', price: product?.price || 250, imageUrl: product?.imageUrl || '' }
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImage, setSelectedImage] = useState(selectedVariant?.imageUrl || product?.imageUrl || '');
  const [selectedFabric, setSelectedFabric] = useState('Same as Image');
  const [selectedColor, setSelectedColor] = useState('Same as Image');
  const [cornerFacing, setCornerFacing] = useState('Left Hand Facing (LHF)');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // When variant changes, update preview image if variant provides one
  const handleVariantChange = (v) => {
    setSelectedVariant(v);
    if (v.imageUrl) {
      setSelectedImage(v.imageUrl);
    }
  };

  const selectedCleanName = getCleanVariantName(selectedVariant);
  const isCorner = selectedVariant.type?.includes('corner') || 
                   selectedCleanName.toLowerCase().includes('corner') || 
                   product.name?.toLowerCase().includes('corner');

  const currentPrice = Number(selectedVariant.price) || Number(product.price) || 300;
  const originalPrice = Math.round(currentPrice * 1.25);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  // Pre-formatted WhatsApp order message
  const waText = encodeURIComponent(
    `Hello Faneelo! I would like to order:\n\n` +
    `• Sofa: ${product.name}\n` +
    `• Size / Variant: ${selectedCleanName}\n` +
    `• Fabric: ${selectedFabric}\n` +
    `• Colour: ${selectedColor}\n` +
    `${isCorner ? `• Facing: ${cornerFacing}\n` : ''}` +
    `• Quantity: ${quantity}\n` +
    `• Price: £${currentPrice * quantity}\n` +
    `• Payment: Cash on Delivery\n\n` +
    `Can you confirm delivery availability for my UK postcode?`
  );

  const createCartItem = () => ({
    productId: product.id,
    name: product.name,
    variant: selectedCleanName,
    price: currentPrice,
    image: selectedImage,
    fabric: selectedFabric,
    color: selectedColor,
    facing: isCorner ? cornerFacing : null,
    quantity: quantity
  });

  const handleAdd = () => {
    onAddToCart(createCartItem());
  };

  const handleBuyNow = () => {
    const item = createCartItem();
    if (onCheckout) {
      onCheckout(item);
    } else {
      onAddToCart(item);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col md:flex-row w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E7E5E4] overflow-hidden text-[#1C1C1C]"
        style={{ fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button in Top Right */}
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 30 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1C1C] hover:bg-white shadow-sm transition-all cursor-pointer p-0"
          aria-label="Close product customizer"
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: Image Showcase, Thumbnails & COD Guarantee */}
        <div className="w-full md:w-[45%] bg-[#FAFAF9] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E5E4] overflow-y-auto">
          <div>
            {/* Main Image Frame */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F5F5F4] border border-[#E7E5E4] shadow-xs">
              <img 
                src={selectedImage} 
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full object-cover transition-transform duration-300"
              />

              {/* Clean Size Badge */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1C1C1C] shadow-sm border border-[#E7E5E4] backdrop-blur-sm">
                  {selectedCleanName}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery Strip (Strict 56x56 square thumbnails) */}
            {imagesList.length > 1 && (
              <div 
                className="mt-3.5 pb-1"
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      flexShrink: 0,
                      padding: 0,
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                    className={`border cursor-pointer transition-all bg-[#F5F5F4] ${
                      selectedImage === img 
                        ? 'border-2 border-[#1C1C1C] shadow-xs ring-1 ring-[#1C1C1C]' 
                        : 'border-[#E7E5E4] opacity-75 hover:opacity-100 hover:border-[#1C1C1C]/40'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`View ${i + 1}`} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cash on Delivery Trust Guarantee */}
          <div className="mt-3.5 rounded-xl bg-white p-3.5 border border-[#E7E5E4] shadow-xs">
            <div className="flex items-center gap-2 text-[#15803D] font-bold text-xs sm:text-sm mb-1">
              <Banknote size={16} />
              <span>100% Cash on Delivery Guarantee</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6B6B6B] leading-relaxed m-0">
              Our 2-man British delivery crew will bring the sofa into your room of choice, unwrap it, and allow you to inspect the fabric and comfort before paying. Zero risk.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Customizer, Size Pills, Selectors & Actions */}
        <div className="w-full md:w-[55%] p-5 sm:p-6 sm:pl-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand / Atelier Tag */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6838]">
                {product.collection || 'British Atelier'} Handcrafted Collection
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#059669]">
                <Check size={12} strokeWidth={3} /> In Stock UK
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-bold leading-tight text-[#1C1C1C] mb-1.5 font-display">
              {product.name}
            </h2>

            {/* Star Rating & Sold Count */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#1C1C1C" stroke="#1C1C1C" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1C1C1C]">4.9 / 5.0</span>
              <span className="text-xs text-[#78716C]">
                ({product.soldCount || 85}+ UK Deliveries)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 pb-2.5 mb-3.5 border-b border-[#E7E5E4]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] tabular-nums">
                £{currentPrice.toLocaleString('en-GB')}
              </span>
              <span className="text-sm sm:text-base text-[#A8A29E] line-through">
                £{originalPrice.toLocaleString('en-GB')}
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-bold text-[#92400E]">
                Save £{originalPrice - currentPrice}
              </span>
            </div>

            {/* 1. Size / Configuration (Clean BritSofa Pills) */}
            <div className="mb-3.5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#1C1C1C]">
                  Size : <span className="font-bold text-[#1C1C1C]">{selectedCleanName}</span>
                </span>
                <span className="text-[#8C6838] font-bold">
                  £{currentPrice}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => {
                  const isCur = (selectedVariant.type === v.type && selectedVariant.label === v.label);
                  const name = getCleanVariantName(v);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleVariantChange(v)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isCur
                          ? 'border-2 border-[#1C1C1C] bg-white text-[#1C1C1C] shadow-xs'
                          : 'border-[#E6E6E6] bg-white text-[#555555] hover:border-[#1C1C1C]/60 hover:text-[#1C1C1C]'
                      }`}
                    >
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Corner Facing Orientation (if corner suite) */}
            {isCorner && (
              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-[#1C1C1C] mb-1.5">
                  Orientation: <span className="font-bold text-[#1C1C1C]">{cornerFacing}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Left Hand Facing (LHF)', 'Right Hand Facing (RHF)'].map((facing) => {
                    const isCur = cornerFacing === facing;
                    return (
                      <button
                        key={facing}
                        type="button"
                        onClick={() => setCornerFacing(facing)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          isCur
                            ? 'border-2 border-[#1C1C1C] bg-white text-[#1C1C1C] shadow-xs'
                            : 'border-[#E6E6E6] bg-white text-[#555555] hover:border-[#1C1C1C]/40'
                        }`}
                      >
                        {facing}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Colour & Fabric Dropdowns matching BritSofa */}
            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1 font-sans">
                  COLOUR
                </label>
                <div className="luxury-dropdown-container">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="luxury-dropdown-select font-sans"
                  >
                    <option value="Same as Image">Same as Image</option>
                    {(product.colorList || []).map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <div className="luxury-dropdown-arrow">
                    <ChevronDown size={17} strokeWidth={2.2} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1 font-sans">
                  FABRIC TYPE
                </label>
                <div className="luxury-dropdown-container">
                  <select
                    value={selectedFabric}
                    onChange={(e) => setSelectedFabric(e.target.value)}
                    className="luxury-dropdown-select font-sans"
                  >
                    <option value="Same as Image">Same as Image</option>
                    {(product.fabricList || []).map((fab) => (
                      <option key={fab} value={fab}>{fab}</option>
                    ))}
                  </select>
                  <div className="luxury-dropdown-arrow">
                    <ChevronDown size={17} strokeWidth={2.2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS & GUARANTEES BOTTOM */}
          <div className="pt-1">
            {/* Quantity + Add to Cart & Checkout buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-[#E6E6E6] rounded-full px-3 py-1 bg-white shrink-0 sm:w-26">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-0 bg-transparent text-base font-bold cursor-pointer text-[#78716C] hover:text-[#1C1C1C] px-1"
                >
                  −
                </button>
                <span className="text-xs sm:text-sm font-bold text-[#1C1C1C] tabular-nums">
                  {quantity}
                </span>
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-0 bg-transparent text-base font-bold cursor-pointer text-[#78716C] hover:text-[#1C1C1C] px-1"
                >
                  +
                </button>
              </div>

              {/* Add to Basket */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#1C1C1C] text-white text-xs sm:text-sm font-bold hover:bg-[#0A0A0A] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-0"
              >
                <ShoppingBag size={15} />
                <span>Add to Cart • £{(currentPrice * quantity).toLocaleString('en-GB')}</span>
              </button>

              {/* Checkout COD */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-2.5 px-4 rounded-full bg-white text-[#1C1C1C] text-xs sm:text-sm font-bold border-2 border-[#1C1C1C] hover:bg-[#F5F5F4] transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Checkout (COD)</span>
              </button>
            </div>

            {/* Direct WhatsApp Order */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-4 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all no-underline shadow-xs cursor-pointer mb-2.5"
            >
              <MessageCircle size={15} />
              <span>Order on WhatsApp (Inspect First, Pay Later)</span>
            </a>

            {/* Quick Guarantees Footer Strip */}
            <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-2 border-t border-[#E7E5E4]">
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-[#15803D]" /> Free 1–3 Day UK Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-[#8C6838]" /> 5-Year Frame Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
