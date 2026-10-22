import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesGrid from './components/CategoriesGrid';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import CategoryPage from './components/CategoryPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrustBadges from './components/TrustBadges';
import AboutModal from './components/AboutModal';
import FaqModal from './components/FaqModal';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import { PRODUCTS } from './data/products';

export default function App() {
  const productsList = PRODUCTS;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchQuery = '';
  const sortOption = 'featured';

  // Page routing state (1:1 dedicated product page, category page, or homepage)
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/products/') || path.startsWith('/product/')) {
        const slug = path.replace(/^\/products?\//, '').replace(/\/$/, '');
        const found = PRODUCTS.find((p) => p.slug === slug || p.id === slug);
        if (found) return { name: 'product', product: found };
      }
      if (path.startsWith('/collections') || path.startsWith('/category') || path.startsWith('/shop')) {
        const params = new URLSearchParams(window.location.search);
        const size = params.get('type') || params.get('size') || params.get('category') || 'all';
        return { name: 'category', categoryId: size };
      }
    } catch (e) {
      console.error(e);
    }
    return { name: 'home', product: null, categoryId: 'all' };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Sync with browser Back and Forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/products/') || path.startsWith('/product/')) {
        const slug = path.replace(/^\/products?\//, '').replace(/\/$/, '');
        const found = PRODUCTS.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setCurrentPage({ name: 'product', product: found });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (path.startsWith('/collections') || path.startsWith('/category') || path.startsWith('/shop')) {
        const params = new URLSearchParams(window.location.search);
        const size = params.get('type') || params.get('size') || params.get('category') || 'all';
        setCurrentPage({ name: 'category', categoryId: size });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setCurrentPage({ name: 'home', product: null, categoryId: 'all' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cart storage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('faneelo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('faneelo_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (item) => {
    const existingIndex = cart.findIndex(
      (c) => c.productId === item.productId && 
             c.variant === item.variant && 
             c.color === item.color && 
             c.fabric === item.fabric &&
             c.facing === item.facing
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += item.quantity;
    } else {
      updatedCart = [...cart, item];
    }

    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = newQty;
    saveCart(updated);
  };

  const handleRemoveItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation handlers
  const handleOpenProduct = (product, variant = null) => {
    setCurrentPage({ name: 'product', product: product, initialVariant: variant });
    try {
      window.history.pushState({ slug: product.slug, variant: variant?.type }, '', `/products/${product.slug}`);
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (catId = 'all') => {
    setSelectedCategory(catId);
    setCurrentPage({ name: 'category', categoryId: catId });
    try {
      const url = catId && catId !== 'all' ? `/collections/sofa-search?type=${catId}` : '/collections';
      window.history.pushState({ categoryId: catId }, '', url);
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedCategory('all');
    setCurrentPage({ name: 'home', product: null, categoryId: 'all', initialVariant: null });
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Products for Homepage
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCol = (p.collection || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCol) return false;
      }

      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const matchesCategory = (p.category && p.category.toLowerCase() === cat) ||
                                (p.collection && p.collection.toLowerCase().replace(/\s+/g, '-') === cat) ||
                                (p.collection && p.collection.toLowerCase() === cat);
        if (matchesCategory) return true;

        if (cat === 'corner-sofa' || cat === 'corner') {
          const hasCornerVariant = (p.variants || []).some(v => v.type === 'corner-sofa') || p.hasCornerVariant || p.seatingType === 'corner-sofa';
          const nameHasCorner = p.name.toLowerCase().includes('corner') || p.name.toLowerCase().includes('l-shape') || p.name.toLowerCase().includes('2c2');
          if (!hasCornerVariant && !nameHasCorner) return false;
        } else if (cat === '2-seater') {
          if (p.seatingType !== '2-seater' && !(p.variants || []).some(v => v.type === '2-seater')) return false;
        } else if (cat === '3-seater') {
          if (p.seatingType !== '3-seater' && !(p.variants || []).some(v => v.type === '3-seater')) return false;
        } else if (cat === 'u-shape-sofa' || cat === 'u-shape' || cat === 'u-shape-sofas') {
          const isU = p.category === 'u-shape-sofas' || p.seatingType === 'u-shape-sofa' || p.name.toLowerCase().includes('u-shape');
          if (!isU) return false;
        } else if (cat === 'leather-sofa' || cat === 'chesterfield-leather') {
          const text = (p.name + ' ' + (p.description || '') + ' ' + (p.fabric || '') + ' ' + (p.collection || '')).toLowerCase();
          if (!text.includes('leather')) return false;
        } else {
          const hasVariant = (p.variants || []).some(v => v.type === selectedCategory);
          if (!hasVariant && p.seatingType !== selectedCategory) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOption === 'price-desc') return (b.price || 0) - (a.price || 0);
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [productsList, searchQuery, selectedCategory, sortOption]);

  return (
    <div className="min-h-full bg-[#F5F5F4] text-[#0A0A0A] font-sans">
      {/* 1. Global Floating Pill Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleOpenCategory}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 2. Main Page Content (Product Page, Category Page, or Homepage) */}
      {currentPage.name === 'product' && currentPage.product ? (
        /* Dedicated Product Page (Exact BritSofa Layout with Suggested Products) */
        <ProductPage
          key={`${currentPage.product.id}-${currentPage.initialVariant?.type || 'default'}`}
          product={currentPage.product}
          initialVariant={currentPage.initialVariant}
          allProducts={productsList}
          onBack={handleNavigateHome}
          onSelectProduct={handleOpenProduct}
          onAddToCart={handleAddToCart}
          onCheckout={(item) => {
            handleAddToCart(item);
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenFaq={() => setIsFaqOpen(true)}
        />
      ) : currentPage.name === 'category' ? (
        /* Dedicated Category / Collections Page (Exact BritSofa Layout with Filters) */
        <CategoryPage
          key={currentPage.categoryId || 'all'}
          initialCategory={currentPage.categoryId}
          products={productsList}
          onBack={handleNavigateHome}
          onSelectProduct={handleOpenProduct}
          onAddToCart={handleAddToCart}
          onNavigateCategory={handleOpenCategory}
        />
      ) : (
        /* Homepage */
        <>
          {/* Hero Section */}
          <Hero
            onExploreClick={() => handleOpenCategory('all')}
            onCornerClick={() => handleOpenCategory('corner-sofa')}
          />

          {/* Shop by Category Grid */}
          <CategoriesGrid
            selectedCategory={selectedCategory}
            onSelectCategory={handleOpenCategory}
          />

          {/* Bestsellers Section matching BritSofa #shop */}
          <section id="shop" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              {/* Header */}
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1C1C1C]">
                    Our Bestsellers
                  </p>
                  <h2 className="text-heading text-3xl md:text-4xl font-semibold text-[#2B2B2B] font-display">
                    Most loved by our customers
                  </h2>
                  <p className="mt-2 text-lg text-[#6B6B6B]">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available — filter from the shop page for more precision.
                  </p>
                </div>

                {/* View All Collections Button */}
                <button
                  type="button"
                  onClick={() => handleOpenCategory('all')}
                  style={{ backgroundColor: '#1C1C1C', color: '#ffffff', borderColor: '#1C1C1C' }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1C1C] bg-[#1C1C1C] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black transition-all cursor-pointer self-start md:self-auto"
                >
                  View All Collections →
                </button>
              </div>

              {/* 4-Column Product Grid matching BritSofa */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleOpenProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Trustpilot, 4 Features & Customer Voices */}
          <TrustBadges onShopClick={() => handleOpenCategory('all')} />
        </>
      )}

      {/* 3. Global Footer */}
      <Footer
        onSelectCategory={handleOpenCategory}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 4. Floating WhatsApp Button matching BritSofa */}
      <WhatsAppButton />

      {/* 5. Drawers & Modals (Cart, Checkout, About, FAQ) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={() => saveCart([])}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </div>
  );
}
