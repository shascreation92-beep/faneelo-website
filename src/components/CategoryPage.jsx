import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function CategoryPage({
  initialCategory = 'all',
  products = PRODUCTS,
  onBack,
  onSelectProduct,
  onAddToCart,
  onNavigateCategory
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState(() => {
    if (initialCategory && initialCategory !== 'all') {
      return initialCategory;
    }
    return 'all';
  });
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('4000');
  const [sortOption, setSortOption] = useState('featured');

  // Update when initialCategory changes
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
      setSelectedSize(initialCategory);
    } else {
      setSelectedCategory('all');
      setSelectedSize('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory]);

  // Extract unique collections from products
  const collectionsList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.collection) set.add(p.collection);
    });
    return Array.from(set);
  }, [products]);

  const targetSize = selectedSize !== 'all' ? selectedSize : selectedCategory !== 'all' ? selectedCategory : 'all';

  // Filter & map products into items with their specific variant for targetSize
  const filteredProducts = useMemo(() => {
    const list = [];

    products.forEach((p) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCol = (p.collection || '').toLowerCase().includes(q);
        const matchesColor = (p.color || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCol && !matchesColor) return;
      }

      // 2. Collection filter
      if (selectedCollection !== 'all') {
        if ((p.collection || '').toLowerCase() !== selectedCollection.toLowerCase()) return;
      }

      // 3. Size / Category Filter & Variant mapping
      let activeVariant = null;

      if (targetSize !== 'all') {
        if (targetSize === 'corner-sofa') {
          activeVariant = (p.variants || []).find(v => v.type === 'corner-sofa');
          const hasCornerVariant = !!activeVariant || p.hasCornerVariant;
          const nameHasCorner = p.name.toLowerCase().includes('corner') || p.name.toLowerCase().includes('l-shape');
          if (!hasCornerVariant && !nameHasCorner) return;
          if (!activeVariant && (p.variants || []).length > 0) {
            activeVariant = p.variants.find(v => v.type === '5-seater') || p.variants[0];
          }
        } else if (targetSize === '3plus2-seater') {
          activeVariant = (p.variants || []).find(v => v.type === '3plus2-seater');
          const has32 = !!activeVariant;
          const nameHas32 = p.name.toLowerCase().includes('3+2') || p.name.toLowerCase().includes('3 plus 2');
          if (!has32 && !nameHas32) return;
        } else {
          activeVariant = (p.variants || []).find(v => v.type === targetSize);
          if (!activeVariant) return;
        }
      }

      // 4. Price range filter (based on activeVariant's price or product starting price)
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || 99999;
      const itemPrice = activeVariant ? Number(activeVariant.price) : Number(p.price);
      if (itemPrice < min || itemPrice > max) return;

      list.push({
        product: p,
        activeVariant: activeVariant,
        price: itemPrice,
        soldCount: activeVariant?.soldCount || p.soldCount || 30
      });
    });

    // 5. Sorting
    return list.sort((a, b) => {
      if (sortOption === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOption === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortOption === 'best-selling') return (b.soldCount || 0) - (a.soldCount || 0);
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [searchQuery, targetSize, selectedCollection, minPrice, maxPrice, sortOption]);

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    setSelectedCategory(newSize);
    if (onNavigateCategory) {
      onNavigateCategory(newSize);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedCollection('all');
    setSearchQuery('');
    setMinPrice('0');
    setMaxPrice('4000');
    setSortOption('featured');
    if (onNavigateCategory) {
      onNavigateCategory('all');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1C1C] pt-24 pb-20 font-sans">
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
          <span className="font-semibold text-[#1C1C1C]">
            Shop Sofas UK
          </span>
        </nav>

        {/* 2. Hero Header Section matching BritSofa exact typography */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6838] mb-2 font-sans">
            COLLECTIONS
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1C1C] font-display mb-3">
            Shop Sofas UK
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-3xl leading-relaxed mb-6 font-sans">
            Browse Faneelo corner sofas, fabric sofas, velvet sofas and sofa beds for every UK home. Filter by size, collection and price — order today, deliver tomorrow with Cash on Delivery.
          </p>

          {/* 4 Reassurance Pills matching BritSofa */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {['Cash on delivery', 'Order today, deliver tomorrow', 'Premium quality', 'Fair pricing'].map((pill, idx) => (
              <span
                key={idx}
                className="px-4 py-1.5 rounded-full border border-[#E6E6E6] bg-[#FAFAF9] text-xs font-medium text-[#4A4A4A] font-sans"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Refine Results Filter Bar matching BritSofa exact filter grid */}
        <div className="bg-[#FAFAF9] rounded-2xl border border-[#E6E6E6] p-5 sm:p-6 mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A] mb-4">
            REFINE RESULTS
          </div>

          <div className="category-filter-grid mb-4">
            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                SEARCH
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, colour..."
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition shadow-2xs font-sans"
              />
            </div>

            {/* Size Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                SIZE
              </label>
              <select
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-2xs font-sans"
              >
                <option value="all">All sizes</option>
                <option value="1-seater">1 Seater</option>
                <option value="2-seater">2 Seater</option>
                <option value="3-seater">3 Seater</option>
                <option value="4-seater">4 Seater</option>
                <option value="5-seater">5 Seater</option>
                <option value="6-seater">6 Seater</option>
                <option value="3plus2-seater">3+2 Seater</option>
                <option value="corner-sofa">Corner Sofa</option>
                <option value="modular-boucle">Modular & Bouclé</option>
              </select>
            </div>

            {/* Collection Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                COLLECTION
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-2xs font-sans"
              >
                <option value="all">All collections</option>
                {collectionsList.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Min Price Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                MIN PRICE
              </label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-2xs font-sans"
              >
                <option value="0">£0</option>
                <option value="200">£200</option>
                <option value="300">£300</option>
                <option value="400">£400</option>
                <option value="500">£500</option>
                <option value="600">£600</option>
                <option value="700">£700</option>
              </select>
            </div>

            {/* Max Price Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                MAX PRICE
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-2xs font-sans"
              >
                <option value="600">£600</option>
                <option value="800">£800</option>
                <option value="1000">£1,000</option>
                <option value="1500">£1,500</option>
                <option value="4000">£4,000</option>
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] mb-1 uppercase font-sans">
                SORT BY
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3 py-2 text-xs font-medium text-[#1C1C1C] focus:border-[#1C1C1C] focus:outline-none transition cursor-pointer shadow-2xs font-sans"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Action Buttons matching BritSofa */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="px-5 py-2 rounded-full bg-[#1C1C1C] text-white text-xs font-bold hover:bg-black transition cursor-pointer border-0 shadow-xs"
            >
              Apply search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2 rounded-full bg-white text-[#1C1C1C] text-xs font-semibold hover:bg-[#F5F5F4] transition cursor-pointer border border-[#D6D3D1]"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* 4. Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#78716C] font-medium m-0">
            Showing {filteredProducts.length} of {filteredProducts.length} results
          </p>
          {(selectedSize !== 'all' || selectedCollection !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#8C6838] font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Reset active filters ✕
            </button>
          )}
        </div>

        {/* 5. Product Grid (4-columns matching BritSofa) */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {filteredProducts.map((item, idx) => (
              <ProductCard
                key={`${item.product.id}-${item.activeVariant?.type || idx}`}
                product={item.product}
                activeVariant={item.activeVariant}
                onSelectProduct={(p, v) => onSelectProduct(p, v || item.activeVariant)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#FAFAF9] rounded-2xl border border-[#E6E6E6] mb-16">
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-2 font-display">
              No matching sofas found
            </h3>
            <p className="text-sm text-[#78716C] mb-6 font-sans">
              Try adjusting your price range or clearing search keywords.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold hover:bg-black transition border-0 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* 6. End of Results Message matching BritSofa */}
        <div className="text-center py-8 text-xs text-[#A8A29E] border-t border-[#E6E6E6] font-sans">
          You've seen all matching sofas.
        </div>

      </div>
    </div>
  );
}
