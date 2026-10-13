import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesGrid from './components/CategoriesGrid';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrustBadges from './components/TrustBadges';
import CustomerReviews from './components/CustomerReviews';
import AboutModal from './components/AboutModal';
import FaqModal from './components/FaqModal';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import { PRODUCTS, STORE_INFO } from './data/products';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function App() {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Cart State (stored in memory & localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('faneelo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to local storage whenever cart changes
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
    setSelectedProduct(null);
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

  const handleOrderSuccess = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCol = (p.collection || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCol) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'corner-sofa') {
          const hasCornerVariant = (p.variants || []).some(v => v.type === 'corner-sofa') || p.hasCornerVariant;
          const nameHasCorner = p.name.toLowerCase().includes('corner') || p.name.toLowerCase().includes('l-shape');
          if (!hasCornerVariant && !nameHasCorner) return false;
        } else if (selectedCategory === '3plus2-seater') {
          const has32 = (p.variants || []).some(v => v.type === '3plus2-seater');
          const nameHas32 = p.name.toLowerCase().includes('3+2') || p.name.toLowerCase().includes('3 plus 2');
          if (!has32 && !nameHas32) return false;
        } else if (selectedCategory === 'modular-boucle') {
          const isBoucle = p.name.toLowerCase().includes('bouclé') || p.name.toLowerCase().includes('modular');
          if (!isBoucle) return false;
        } else {
          // Check specific seaters: 2-seater, 3-seater, 4-seater, 5-seater, 6-seater
          const hasVariant = (p.variants || []).some(v => v.type === selectedCategory);
          if (!hasVariant) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOption === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortOption === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.soldCount || 0) - (a.soldCount || 0);
    });
  }, [searchQuery, selectedCategory, sortOption]);

  const scrollToShop = () => {
    const el = document.getElementById('sofas-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCornerQuickClick = () => {
    setSelectedCategory('corner-sofa');
    scrollToShop();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header with announcement, navigation, search and basket */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToShop();
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero
        onExploreClick={scrollToShop}
        onCornerClick={handleCornerQuickClick}
      />

      {/* 3. Style & Size Category Carousel/Grid */}
      <CategoriesGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToShop();
        }}
      />

      {/* 4. Sofa Catalog Section */}
      <section 
        id="sofas-catalog" 
        style={{
          paddingTop: '3rem',
          paddingBottom: '5rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          {/* Catalog Controls Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid #F1EFEA'
          }}>
            <div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#8C6838',
                marginBottom: '0.3rem'
              }}>
                Curated UK Collection
              </div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                lineHeight: 1.2
              }}>
                {selectedCategory === 'all' 
                  ? 'Most Loved Luxury Sofas' 
                  : `Showing ${selectedCategory.replace('-', ' ').toUpperCase()} Suites`}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {filteredProducts.length} handcrafted models available with fast 1–3 day UK delivery &amp; Cash on Delivery.
              </p>
            </div>

            {/* Filter and Sort bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border-dark)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.5rem 0.9rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#121212'
                  }}
                >
                  Clear Filter ✕
                </button>
              )}

              {/* Sort Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.9rem',
                border: '1px solid var(--color-border)'
              }}>
                <ArrowUpDown size={14} color="#8A8A8A" />
                <span style={{ fontSize: '0.8rem', color: '#777' }}>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#121212',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="featured">Best Sellers</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1A1A1A', marginBottom: '0.5rem' }}>
                No sofas match your current filter
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try clearing your search query or choosing "All Sofas" to see our full catalogue.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '2rem'
            }}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. The Faneelo Promise (Trust Badges & Cash on Delivery highlights) */}
      <TrustBadges />

      {/* 6. Verified Customer Testimonials */}
      <CustomerReviews />

      {/* 7. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToShop();
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* Floating Elements */}
      <WhatsAppButton />

      {/* Interactive Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

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
        onOrderSuccess={handleOrderSuccess}
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
