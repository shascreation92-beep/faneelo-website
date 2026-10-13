import React, { useState, useEffect } from 'react';
import { 
  Star, Truck, Shield, Banknote, ShoppingBag, 
  MessageCircle, ChevronRight, Check, ChevronDown, 
  ArrowLeft, RotateCcw, Ruler, Sparkles, Heart, Eye
} from 'lucide-react';
import { STORE_INFO, REVIEWS } from '../data/products';
import ProductCard from './ProductCard';

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

export default function ProductPage({
  product,
  allProducts = [],
  onBack,
  onSelectProduct,
  onAddToCart,
  onCheckout,
  onOpenAbout,
  onOpenFaq
}) {
  if (!product) return null;

  const variants = product.variants && product.variants.length > 0 ? product.variants : [
    { type: 'standard', label: 'Standard Suite', price: product.price, imageUrl: product.imageUrl }
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImage, setSelectedImage] = useState(selectedVariant.imageUrl || product.imageUrl);
  const [selectedFabric, setSelectedFabric] = useState('Same as Image');
  const [selectedColor, setSelectedColor] = useState('Same as Image');
  const [cornerFacing, setCornerFacing] = useState('Left Hand Facing (LHF)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specifications' | 'reviews'

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedVariant(variants[0]);
    setSelectedImage(variants[0]?.imageUrl || product.imageUrl);
    setSelectedFabric('Same as Image');
    setSelectedColor('Same as Image');
    setQuantity(1);
    setActiveTab('description');
  }, [product.id]);

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

  // Suggested products (exclude current product)
  const suggestedProducts = (allProducts || [])
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1C1C] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs Trail matching BritSofa */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#78716C] flex-wrap">
          <button 
            type="button" 
            onClick={onBack}
            className="hover:text-[#1C1C1C] transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            Home
          </button>
          <ChevronRight size={14} className="text-[#A8A29E]" />
          <button 
            type="button" 
            onClick={onBack}
            className="hover:text-[#1C1C1C] transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            Sofas
          </button>
          <ChevronRight size={14} className="text-[#A8A29E]" />
          <span className="hover:text-[#1C1C1C] font-medium text-[#78716C]">
            {product.collection || 'Luxury Suites'}
          </span>
          <ChevronRight size={14} className="text-[#A8A29E]" />
          <span className="font-semibold text-[#1C1C1C] truncate max-w-[280px] sm:max-w-md">
            {product.name} – {selectedCleanName}
          </span>
        </nav>

        {/* 2. Main Product Showcase Grid (Left: Images | Right: Customizer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E5E4] shadow-sm mb-12">
          
          {/* LEFT COLUMN: Main Hero Image + 4x2 Thumbnail Grid + COD Guarantee */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Main Image Frame with hover zoom */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F5F5F4] border border-[#E7E5E4] shadow-sm group">
                <img 
                  src={selectedImage} 
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />

                {/* Badge top-left */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#1C1C1C] shadow-sm border border-[#E7E5E4] backdrop-blur-sm">
                    {selectedCleanName}
                  </span>
                  <span className="rounded-full bg-[#1C1C1C]/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm hidden sm:inline-block">
                    Handcrafted in UK
                  </span>
                </div>
              </div>

              {/* 4-column Thumbnail Gallery matching BritSofa */}
              {imagesList.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 mt-4">
                  {imagesList.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-[4/3] rounded-xl overflow-hidden border p-0 cursor-pointer transition-all bg-[#F5F5F4] ${
                        selectedImage === img 
                          ? 'border-2 border-[#1C1C1C] ring-2 ring-[#1C1C1C]/20 shadow-sm' 
                          : 'border-[#E7E5E4] opacity-75 hover:opacity-100 hover:border-[#1C1C1C]/50'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${i + 1}`} 
                        className="h-full w-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 100% Cash on Delivery Guarantee Reassurance Banner */}
            <div className="mt-6 rounded-2xl bg-[#F8F6F0] p-4 sm:p-5 border border-[#E5DFD5]">
              <div className="flex items-center gap-2.5 text-[#15803D] font-bold text-sm sm:text-base mb-1.5">
                <Banknote size={20} />
                <span>100% Cash on Delivery Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed m-0">
                Our 2-man British delivery crew will bring the sofa directly into your room of choice, unwrap it, and allow you to inspect the fabric, frame, and comfort before paying. Zero risk.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Customizer, Size Pills, Selectors & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Delivery ETA Pill matching BritSofa */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#15803D] bg-[#ECFDF5] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Truck size={14} /> Fast UK Delivery Within 1–3 Days
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#059669]">
                  <Check size={14} strokeWidth={3} /> In Stock
                </span>
              </div>

              {/* Product Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1C] leading-tight mb-3 font-display">
                {product.name}
              </h1>

              {/* Rating Row matching BritSofa */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#1C1C1C" stroke="#1C1C1C" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1C1C1C]">4.9 / 5.0</span>
                <span className="text-xs text-[#78716C]">
                  ({product.soldCount || 100}+ sold across UK)
                </span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-[#E7E5E4]">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tabular-nums">
                  £{currentPrice.toLocaleString('en-GB')}
                </span>
                <span className="text-lg text-[#A8A29E] line-through">
                  £{originalPrice.toLocaleString('en-GB')}
                </span>
                <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#92400E]">
                  Save £{originalPrice - currentPrice}
                </span>
              </div>

              {/* 1. Size / Configuration (Clean BritSofa Pills) */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm font-semibold mb-2.5">
                  <span className="text-[#1C1C1C]">
                    Size : <span className="font-bold text-[#1C1C1C]">{selectedCleanName}</span>
                  </span>
                  <span className="text-[#8C6838] font-bold">
                    £{currentPrice}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {variants.map((v, idx) => {
                    const isCur = (selectedVariant.type === v.type && selectedVariant.label === v.label);
                    const name = getCleanVariantName(v);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleVariantChange(v)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isCur
                            ? 'border-2 border-[#1C1C1C] bg-white text-[#1C1C1C] shadow-sm'
                            : 'border-[#E6E6E6] bg-white text-[#555555] hover:border-[#1C1C1C]/60 hover:text-[#1C1C1C]'
                        }`}
                      >
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Orientation (if Corner Variant) */}
              {isCorner && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[#1C1C1C] mb-2">
                    Orientation : <span className="font-bold text-[#1C1C1C]">{cornerFacing}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['Left Hand Facing (LHF)', 'Right Hand Facing (RHF)'].map((facing) => {
                      const isCur = cornerFacing === facing;
                      return (
                        <button
                          key={facing}
                          type="button"
                          onClick={() => setCornerFacing(facing)}
                          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer text-center ${
                            isCur
                              ? 'border-2 border-[#1C1C1C] bg-white text-[#1C1C1C] shadow-sm'
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
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                    COLOUR
                  </label>
                  <div className="relative">
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#E6E6E6] bg-white px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-xs"
                    >
                      <option value="Same as Image">Same as Image</option>
                      {(product.colorList || []).map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#78716C]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                    FABRIC TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFabric}
                      onChange={(e) => setSelectedFabric(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#E6E6E6] bg-white px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-xs"
                    >
                      <option value="Same as Image">Same as Image</option>
                      {(product.fabricList || []).map((fab) => (
                        <option key={fab} value={fab}>{fab}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#78716C]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs & Actions Bottom */}
            <div>
              {/* Row 1: Quantity + Add to Cart + Checkout (COD) */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-[#E6E6E6] rounded-full px-4 py-2 bg-white shrink-0 sm:w-28">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-0 bg-transparent text-lg font-bold cursor-pointer text-[#78716C] hover:text-[#1C1C1C] px-1"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-[#1C1C1C] tabular-nums">
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-0 bg-transparent text-lg font-bold cursor-pointer text-[#78716C] hover:text-[#1C1C1C] px-1"
                  >
                    +
                  </button>
                </div>

                {/* Add to Basket */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#1C1C1C] text-white text-sm font-bold hover:bg-[#0A0A0A] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-0"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart • £{(currentPrice * quantity).toLocaleString('en-GB')}</span>
                </button>

                {/* Checkout COD */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-full bg-white text-[#1C1C1C] text-sm font-bold border-2 border-[#1C1C1C] hover:bg-[#F5F5F4] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Checkout (COD)</span>
                </button>
              </div>

              {/* Row 2: WhatsApp Instant Order */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all no-underline shadow-xs cursor-pointer mb-5"
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp (Inspect First, Pay Later)</span>
              </a>

              {/* Highlights Specifications Summary Card */}
              <div className="p-4 rounded-2xl bg-[#F5F5F4] border border-[#E7E5E4] text-xs text-[#555555] grid grid-cols-2 gap-3.5">
                <div>
                  <span className="font-bold text-[#1C1C1C] block text-[11px] uppercase tracking-wider mb-0.5">
                    Collection
                  </span>
                  <span>{product.collection || 'British Atelier'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#1C1C1C] block text-[11px] uppercase tracking-wider mb-0.5">
                    Delivery
                  </span>
                  <span>Fast UK delivery in 1–3 days</span>
                </div>
                <div className="col-span-2 pt-2.5 border-t border-[#E7E5E4] flex items-center justify-between text-[11px] text-[#6B6B6B] flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-[#15803D] font-medium">
                    <Truck size={14} /> Free 2-man room of choice delivery
                  </span>
                  <span className="flex items-center gap-1 text-[#8C6838] font-medium">
                    <Shield size={14} /> 5-Year Hardwood Frame Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Product Details Tabs Section matching BritSofa */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E5E4] shadow-sm mb-12">
          <div className="flex items-center gap-2 sm:gap-4 border-b border-[#E7E5E4] pb-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'description'
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-transparent text-[#78716C] hover:text-[#1C1C1C]'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specifications')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'specifications'
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-transparent text-[#78716C] hover:text-[#1C1C1C]'
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'reviews'
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-transparent text-[#78716C] hover:text-[#1C1C1C]'
              }`}
            >
              Customer Reviews ({REVIEWS.length + 75})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="prose max-w-none text-[#555555] text-sm sm:text-base leading-relaxed space-y-4">
              <p className="text-base sm:text-lg font-medium text-[#1C1C1C]">
                Upgrade your home today with the {product.name} – handcrafted with British craftsmanship, deep cushioning, and luxurious upholstery designed for everyday comfort and modern style.
              </p>
              
              <div className="whitespace-pre-line text-xs sm:text-sm text-[#666666] bg-[#FAFAF9] p-5 rounded-2xl border border-[#E7E5E4]">
                {product.description || `Handcrafted in the United Kingdom with seasoned hardwood frames, high-density reflex foam seating, and stain-resistant luxury fabrics.`}
              </div>

              {/* Delivery Reassurance Block matching BritSofa */}
              <div className="mt-6 rounded-2xl bg-[#F8F6F0] p-6 border border-[#E5DFD5]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-2">
                  DELIVERY & ROOM OF CHOICE INSPECTION
                </h4>
                <p className="text-xs sm:text-sm text-[#555555] mb-2">
                  Fast, reliable delivery straight to your door across England, Scotland & Wales.
                </p>
                <p className="text-xs sm:text-sm text-[#555555] m-0">
                  At Faneelo, we know how important it is to inspect furniture before paying. That’s why our 2-man crew brings your sofa inside, unwraps it, and lets you verify fabric quality and seating comfort before you hand over any payment.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Frame Material</span>
                <span className="text-[#666666]">100% Solid Seasoned Hardwood</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Cushion Filling</span>
                <span className="text-[#666666]">High-Density Reflex Foam + Fibre Wrap</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Fabric Options</span>
                <span className="text-[#666666]">Plush Velvet, Chenille, Bouclé, Corduroy</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Warranty</span>
                <span className="text-[#666666]">5-Year Frame & 1-Year Fabric Warranty</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Assembly</span>
                <span className="text-[#666666]">Free Assembly by Delivery Team on Arrival</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex justify-between">
                <span className="font-semibold text-[#1C1C1C]">Payment Method</span>
                <span className="text-[#666666]">100% Cash on Delivery (Inspect First)</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E7E5E4]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#1C1C1C" stroke="#1C1C1C" />
                        ))}
                      </div>
                      <span className="font-bold text-sm text-[#1C1C1C]">{rev.name}</span>
                      <span className="text-xs text-[#78716C]">({rev.location})</span>
                    </div>
                    <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1C1C1C] mb-1">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed m-0">{rev.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Helpful Buying Guides Pills matching BritSofa */}
        <div className="mb-12">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-3">
            HELPFUL BUYING GUIDES
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              'Doorway measurement guide',
              'Sofa size guide',
              'How sofa delivery works',
              `More ${product.collection || 'luxury'} suites`,
              'Cash on Delivery inspection checklist'
            ].map((guide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onOpenFaq}
                className="px-4 py-2 rounded-full border border-[#E7E5E4] bg-white text-xs sm:text-sm font-medium text-[#555555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition cursor-pointer shadow-xs"
              >
                {guide}
              </button>
            ))}
          </div>
        </div>

        {/* 5. SUGGESTED / RECOMMENDED PRODUCTS SECTION (User Explicit Request) */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6838] block mb-1">
                You May Also Like
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] font-display">
                Recommended Handcrafted Sofas
              </h2>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="text-xs sm:text-sm font-bold text-[#1C1C1C] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
            >
              <span>View All Collection</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={() => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
