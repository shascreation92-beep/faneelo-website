import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Check, ChevronDown, 
  ShoppingBag, Star, Truck, Shield
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
  initialVariant = null,
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

  const getStartingVariant = () => {
    if (initialVariant) {
      const found = variants.find(v => v.type === initialVariant.type || v.label === initialVariant.label);
      if (found) return found;
    }
    return variants[0];
  };

  const startingVariant = getStartingVariant();
  const [selectedVariant, setSelectedVariant] = useState(startingVariant);
  const [selectedImage, setSelectedImage] = useState(startingVariant.imageUrl || product.imageUrl);
  const [selectedFabric, setSelectedFabric] = useState('Same as Image');
  const [selectedColor, setSelectedColor] = useState('Same as Image');
  const [cornerFacing, setCornerFacing] = useState('Left Hand Facing (LHF)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specifications' | 'reviews'

  // Scroll to top and reset state on product switch or initialVariant update
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cur = initialVariant 
      ? (variants.find(v => v.type === initialVariant.type || v.label === initialVariant.label) || variants[0])
      : variants[0];
    setSelectedVariant(cur);
    setSelectedImage(cur?.imageUrl || product.imageUrl);
    setSelectedFabric('Same as Image');
    setSelectedColor('Same as Image');
    setQuantity(1);
    setActiveTab('description');
  }, [product.id, initialVariant]);

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

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

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

  // Suggested products (exclude current)
  const suggestedProducts = (allProducts || [])
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Parse description into clean bullet points
  const descLines = (product.description || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1C1C] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs matching BritSofa */}
        <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#78716C] flex-wrap font-sans">
          <button 
            type="button" 
            onClick={onBack}
            className="hover:text-[#1C1C1C] transition-colors bg-transparent border-0 cursor-pointer p-0 font-normal text-[#78716C]"
          >
            Home
          </button>
          <ChevronRight size={13} className="text-[#A8A29E]" />
          <button 
            type="button" 
            onClick={onBack}
            className="hover:text-[#1C1C1C] transition-colors bg-transparent border-0 cursor-pointer p-0 font-normal text-[#78716C]"
          >
            Sofas
          </button>
          <ChevronRight size={13} className="text-[#A8A29E]" />
          <span className="font-normal text-[#78716C]">
            {selectedCleanName} Sofas
          </span>
          <ChevronRight size={13} className="text-[#A8A29E]" />
          <span className="font-normal text-[#1C1C1C] truncate max-w-xs sm:max-w-md">
            {product.name} – {selectedCleanName}
          </span>
        </nav>

        {/* 2. Main Product Section (2 open columns matching BritSofa) */}
        <div className="product-layout-grid mb-16">
          
          {/* Left Column: Large Hero Image + Thumbnail Grid */}
          <div className="w-full">
            {/* Main Product Image */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F5F5F4] border border-[#E6E6E6] mb-4">
              <img 
                src={selectedImage} 
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery (2-4 thumbnails matching BritSofa) */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[4/3] rounded-xl overflow-hidden border p-0 cursor-pointer transition-all bg-[#F5F5F4] ${
                      selectedImage === img 
                        ? 'border-2 border-[#1C1C1C] shadow-xs' 
                        : 'border-[#E6E6E6] opacity-80 hover:opacity-100 hover:border-[#1C1C1C]/40'
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

          {/* Right Column: Title, Price, Size Pills, Selectors, Add to Cart */}
          <div className="w-full flex flex-col justify-start">
            
            {/* Delivery Tag matching BritSofa */}
            <p className="text-xs sm:text-sm text-[#555555] mb-2 font-sans font-normal">
              Delivery from Wed 14 Oct
            </p>

            {/* Title in BritSofa Cormorant Garamond Serif font */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#111111] leading-tight mb-3 font-display">
              {product.name} – {selectedCleanName}
            </h1>

            {/* Stars & Stock Badge matching BritSofa */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5 text-[#E67E22]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-base text-[#F39C12]">★</span>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[#777777]">
                {product.soldCount || 150}+ sold
              </span>
              <span className="rounded-full bg-[#EAF4E2] px-3 py-0.5 text-xs font-semibold text-[#2E7D32]">
                In stock
              </span>
            </div>

            {/* Big Bold Price matching BritSofa */}
            <div className="mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-[#111111] tabular-nums font-sans">
                £{currentPrice.toLocaleString('en-GB')}
              </span>
            </div>

            {/* Size Selector matching BritSofa */}
            <div className="mb-6">
              <p className="text-xs sm:text-sm font-medium text-[#111111] mb-2.5">
                Size : <span className="text-[#666666]">{selectedCleanName}</span>
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {variants.map((v, idx) => {
                  const isCur = (selectedVariant.type === v.type && selectedVariant.label === v.label);
                  const name = getCleanVariantName(v);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleVariantChange(v)}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                        isCur
                          ? 'border-2 border-[#111111] bg-white text-[#111111] font-semibold'
                          : 'border-[#E6E6E6] bg-white text-[#555555] hover:border-[#111111]/40 hover:text-[#111111]'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Corner Facing Orientation if corner suite */}
            {isCorner && (
              <div className="mb-6">
                <p className="text-xs sm:text-sm font-medium text-[#111111] mb-2">
                  Orientation: <span className="text-[#666666]">{cornerFacing}</span>
                </p>
                <div className="grid grid-cols-2 gap-2.5 max-w-md">
                  {['Left Hand Facing (LHF)', 'Right Hand Facing (RHF)'].map((facing) => {
                    const isCur = cornerFacing === facing;
                    return (
                      <button
                        key={facing}
                        type="button"
                        onClick={() => setCornerFacing(facing)}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer text-center ${
                          isCur
                            ? 'border-2 border-[#111111] bg-white text-[#111111] font-semibold'
                            : 'border-[#E6E6E6] bg-white text-[#555555] hover:border-[#111111]/40'
                        }`}
                      >
                        {facing}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colour & Fabric Type Dropdowns matching BritSofa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-lg">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2 font-sans">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2 font-sans">
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

            {/* Buttons: Add to Cart + Checkout (COD) matching BritSofa */}
            <div className="flex items-center gap-3 mb-6 max-w-lg">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3.5 px-8 rounded-full bg-[#1C1C1C] text-white text-sm font-semibold hover:bg-black transition-all cursor-pointer border-0 text-center shadow-xs"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-8 rounded-full bg-white text-[#1C1C1C] text-sm font-semibold border border-[#1C1C1C] hover:bg-[#F5F5F4] transition-all cursor-pointer text-center"
              >
                Checkout (COD)
              </button>
            </div>

            {/* Specifications Card matching BritSofa */}
            <div className="border border-[#E6E6E6] rounded-2xl p-6 bg-white max-w-lg">
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-[#111111] block mb-0.5">Collection</span>
                  <span className="text-[#555555]">{product.collection || 'Lilly'}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#111111] block mb-0.5">Fabric</span>
                  <span className="text-[#555555]">Chenille, Cotton, Leather, Linen, Microfiber, Plush, Velvet, Wool</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#F0EDE8]">
                  <span className="font-semibold text-[#111111] block mb-0.5">Delivery</span>
                  <span className="text-[#555555]">Order today, deliver tomorrow</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Product Details Card matching BritSofa */}
        <div className="rounded-2xl border border-[#E6E6E6] p-6 sm:p-10 bg-white mb-12">
          <h2 className="text-2xl sm:text-3xl font-normal text-[#111111] font-display mb-6">
            Product details
          </h2>

          {/* Details Tabs matching BritSofa */}
          <div className="flex items-center gap-3 border-b border-[#E6E6E6] pb-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'description'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'bg-[#F5F5F4] text-[#1C1C1C] hover:bg-[#E6E6E6]'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'specifications'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'bg-[#F5F5F4] text-[#1C1C1C] hover:bg-[#E6E6E6]'
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0 ${
                activeTab === 'reviews'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'bg-[#F5F5F4] text-[#1C1C1C] hover:bg-[#E6E6E6]'
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'description' && (
            <div className="space-y-6 text-sm text-[#444444] leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                {descLines.map((line, idx) => (
                  <li key={idx} className="text-[#333333]">{line.replace(/^[-•*]\s*/, '')}</li>
                ))}
              </ul>

              <p className="text-[#555555] pt-2">
                Upgrade your living room with a stylish modern sofa designed for comfort and elegant UK interiors.
              </p>

              {/* Delivery Box inside Product details matching BritSofa */}
              <div className="border border-[#E6E6E6] rounded-xl p-6 bg-[#FAFAF9] mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  DELIVERY
                </h4>
                <p className="text-xs sm:text-sm text-[#555555] mb-2 leading-relaxed">
                  Fast, reliable delivery straight to your door across the United Kingdom.
                </p>
                <p className="text-xs sm:text-sm text-[#555555] m-0 leading-relaxed">
                  At Faneelo, we know how important it is to receive your furniture quickly. That's why we offer a 1–3 day delivery service across the UK with complete Cash on Delivery inspection rights.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E6E6E6] flex justify-between">
                <span className="font-semibold text-[#111111]">Frame</span>
                <span className="text-[#666666]">Hardwood & Seasoned Timber</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E6E6E6] flex justify-between">
                <span className="font-semibold text-[#111111]">Seating Foam</span>
                <span className="text-[#666666]">High-Resilience Reflex Foam</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E6E6E6] flex justify-between">
                <span className="font-semibold text-[#111111]">Cushion Backing</span>
                <span className="text-[#666666]">Deep Supportive Fibre Cushions</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E6E6E6] flex justify-between">
                <span className="font-semibold text-[#111111]">Guarantee</span>
                <span className="text-[#666666]">5-Year Frame Guarantee</span>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="p-5 rounded-xl bg-[#FAFAF9] border border-[#E6E6E6]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 text-[#F39C12]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="font-bold text-sm text-[#111111]">{rev.name}</span>
                      <span className="text-xs text-[#78716C]">({rev.location})</span>
                    </div>
                    <span className="text-xs font-semibold text-[#2E7D32] bg-[#EAF4E2] px-2.5 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#111111] mb-1">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed m-0">{rev.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Helpful Buying Guides Pills matching BritSofa */}
        <div className="mb-14">
          <h3 className="text-xl font-normal text-[#111111] font-display mb-4">
            Helpful buying guides
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              'Doorway measurement guide',
              'Sofa size guide',
              'How sofa delivery works',
              `More ${selectedCleanName} sofas`
            ].map((guide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={onOpenFaq}
                className="px-5 py-2.5 rounded-full border border-[#E6E6E6] bg-white text-xs sm:text-sm font-normal text-[#444444] hover:border-black hover:text-black transition cursor-pointer shadow-2xs"
              >
                {guide}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Trustpilot & Why Trust Faneelo Section matching BritSofa */}
        <div className="rounded-2xl border border-[#E6E6E6] bg-[#FAFAF9] p-8 sm:p-12 text-center mb-16">
          <div className="inline-block mb-3">
            <span className="rounded-full bg-[#1C1C1C] px-5 py-1 text-xs font-semibold text-white">
              Trustpilot Excellent
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-normal text-[#111111] font-display mb-2">
            Why Trust Faneelo
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto mb-3">
            Join our community of satisfied customers across the UK. We've earned the trust of families with premium quality and exceptional service.
          </p>

          <div className="flex items-center justify-center gap-1 text-[#F39C12] mb-8 text-sm">
            <span>★★★★★</span>
            <span className="text-[#111111] font-bold ml-1">4.9/5</span>
            <span className="text-[#888888] font-normal">(2,847 reviews)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              {
                text: "Outstanding quality and service. My corner sofa arrived perfectly and the delivery team was professional.",
                author: "Emma Thompson",
                init: "ET"
              },
              {
                text: "Cash on delivery made the purchase so easy. The U-shape sofa is exactly what I wanted.",
                author: "Michael Chen",
                init: "MC"
              },
              {
                text: "Best sofa shopping experience in the UK. Fast delivery and excellent customer support.",
                author: "Sarah Williams",
                init: "SW"
              }
            ].map((card, i) => (
              <div key={i} className="rounded-xl border border-[#E6E6E6] bg-white p-6 shadow-2xs">
                <div className="flex gap-0.5 text-[#F39C12] mb-3 text-xs">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-[#555555] italic mb-6 leading-relaxed">
                  "{card.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    {card.init}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111111] m-0">{card.author}</p>
                    <p className="text-[11px] text-[#2E7D32] m-0">✓ Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SUGGESTED / RECOMMENDED PRODUCTS SECTION (User Request) */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6838] mb-1">
                You May Also Like
              </p>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#111111] font-display">
                Recommended Handcrafted Sofas
              </h2>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="text-xs sm:text-sm font-semibold text-[#111111] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
            >
              <span>View All Collection</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
