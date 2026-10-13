import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesGrid from './components/CategoriesGrid';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrustBadges from './components/TrustBadges';
import AboutModal from './components/AboutModal';
import FaqModal from './components/FaqModal';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import { PRODUCTS, STORE_INFO } from './data/products';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // Page routing state (1:1 dedicated product page matching BritSofa)
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/products/') || path.startsWith('/product/')) {
        const slug = path.replace(/^\/products?\//, '').replace(/\/$/, '');
        const found = PRODUCTS.find((p) => p.slug === slug || p.id === slug);
        if (found) return { name: 'product', product: found };
      }
    } catch (e) {
      console.error(e);
    }
    return { name: 'home', product: null };
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
      setCurrentPage({ name: 'home', product: null });
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
  const handleOpenProduct = (product) => {
    setCurrentPage({ name: 'product', product: product });
    try {
      window.history.pushState({ slug: product.slug }, '', `/products/${product.slug}`);
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentPage({ name: 'home', product: null });
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (currentPage.name !== 'home') {
      setCurrentPage({ name: 'home', product: null });
      try {
        window.history.pushState(null, '', '/');
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => {
      scrollToShop();
    }, 100);
  };

  // Filtered Products for Homepage
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCol = (p.collection || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCol) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'corner-sofa') {
          const hasCornerVariant = (p.variants || []).some(v => v.type === 'corner-sofa') || p.hasCornerVariant;
          const nameHasCorner = p.name.toLowerCase().includes('corner') || p.name.toLowerCase().includes('l-shape');
          if (!hasCornerVariant && !nameHasCorner) return false;
        } else if (selectedCategory === '3plus2-seater') {
          const has32 = (p.variants || []).some(v => v.type === '3plus2-seater');
          const nameHas32 = p.name.toLowerCase().includes('3+2') || p.name.toLowerCase().includes('3 plus 2');
          if (!has32 && !nameHas32) return false;
        } else {
          const hasVariant = (p.variants || []).some(v => v.type === selectedCategory);
          if (!hasVariant) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOption === 'price-desc') return (b.price || 0) - (a.price || 0);
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [searchQuery, selectedCategory, sortOption]);

  return (
    <div className="min-h-full bg-[#F5F5F4] text-[#0A0A0A] font-sans">
      {/* 1. Global Floating Pill Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 2. Main Page Content (Product Page or Homepage) */}
      {currentPage.name === 'product' && currentPage.product ? (
        /* Dedicated Product Page (Exact BritSofa Layout with Suggested Products) */
        <ProductPage
          product={currentPage.product}
          allProducts={PRODUCTS}
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
      ) : (
        /* Homepage */
        <>
          {/* Hero Section */}
          <Hero
            onExploreClick={scrollToShop}
            onCornerClick={() => handleSelectCategory('corner-sofa')}
          />

          {/* Shop by Category Grid */}
          <CategoriesGrid
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
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

                {/* Quick Filter pill reset */}
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1A1A1A]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F5F5F4] transition-all cursor-pointer self-start md:self-auto"
                  >
                    Showing {selectedCategory.replace('-', ' ')} ✕ Clear
                  </button>
                )}
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
          <TrustBadges onShopClick={scrollToShop} />
        </>
      )}

      {/* 3. Global Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
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
