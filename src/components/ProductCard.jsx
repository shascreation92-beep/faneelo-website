import React from 'react';

export default function ProductCard({ 
  product, 
  activeVariant = null, 
  onSelectProduct, 
  onAddToCart 
}) {
  // If activeVariant is provided, use that specific variant's image, title, price, and soldCount
  const image = activeVariant?.imageUrl || product.imageUrl;
  const title = activeVariant?.label || product.name;
  const price = Number(activeVariant?.price) || Number(product.price) || 250;
  const rating = product.rating || 5;
  const soldCount = activeVariant?.soldCount || product.soldCount || 35;
  const collectionName = product.collection || 'Collection';

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product, activeVariant);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        productId: product.id,
        name: product.name,
        variant: activeVariant ? (activeVariant.label || activeVariant.type) : (product.variants?.[0]?.label || 'Standard Suite'),
        price: price,
        image: image,
        fabric: 'Same as Image',
        color: 'Same as Image',
        facing: activeVariant?.type?.includes('corner') ? 'Left Hand Facing (LHF)' : null,
        quantity: 1
      });
    } else if (onSelectProduct) {
      onSelectProduct(product, activeVariant);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="britsofa-product-card group relative"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F5F4]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* BEST SELLER badge matching BritSofa (Orange pill top left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="card-bestseller-badge">
            BEST SELLER
          </span>
        </div>
      </div>

      {/* Card Body matching BritSofa exact layout */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Top Row: Delivery date on left, Stars on right */}
        <div className="flex items-center justify-between text-xs text-[#555555] mb-1.5 font-sans">
          <span>Delivery from Wed 14 Oct</span>
          <div className="flex items-center gap-1">
            <span className="card-star-gold">★★★★★</span>
            <span className="text-xs text-[#777777]">({soldCount}+)</span>
          </div>
        </div>

        {/* Title in Cormorant Garamond Serif */}
        <h3 className="font-display font-medium text-base sm:text-lg text-[#111111] line-clamp-2 leading-snug group-hover:text-black transition-colors mb-1">
          {title}
        </h3>

        {/* Collection Name */}
        <p className="text-xs text-[#777777] mb-1 font-sans">
          {collectionName}
        </p>

        {/* Colour availability label */}
        <p className="text-[11px] text-[#777777] uppercase tracking-wide mb-3">
          <span className="font-bold text-[#555555]">COLOUR:</span> Multiple color available
        </p>

        {/* Bottom Pricing & Action Button */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#F0ECE5]">
          <div>
            <span className="card-price-text">
              £{price.toLocaleString('en-GB')}
            </span>
            <p className="text-xs text-[#777777] font-normal mt-0.5">
              Free delivery
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className="collection-add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
