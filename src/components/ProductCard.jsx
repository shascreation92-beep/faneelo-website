import React from 'react';

export default function ProductCard({ product, onSelectProduct }) {
  const displayPrice = product.price || 250;
  const rating = product.rating || 5;
  const soldCount = product.soldCount || 100;
  const collectionName = product.collection || product.type || 'Sofa';

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="surface-card group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-[#E6E6E6] transition-all hover:shadow-md cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F5F4]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Top Left matching BritSofa */}
        <div className="absolute top-4 left-4 z-10">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#1C1C1C] shadow-sm backdrop-blur-sm">
            {product.badge || 'Best Seller'}
          </span>
        </div>

        {/* Quick eye/wishlist overlay on hover */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-white/90 p-2 text-[#2B2B2B] shadow-sm backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Content matching BritSofa exact typography */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="mb-2 text-xl font-bold leading-snug tracking-tight text-[#2B2B2B] line-clamp-2 group-hover:text-[#1C1C1C] transition-colors font-display">
          {product.name}
        </h3>

        {/* Collection Category */}
        <div className="mb-3">
          <span className="text-xs font-medium text-[#6B6B6B]">
            {collectionName}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < rating ? 'text-[#1C1C1C]' : 'text-[#E6E6E6]'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-[#8A8A8A]">
            ({soldCount}+)
          </span>
        </div>

        {/* Bottom Pricing & Action Row */}
        <div className="flex items-end justify-between gap-3 pt-3 border-t border-[#E6E6E6] mt-auto">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Starting price
            </p>
            <p className="text-2xl font-bold text-[#2B2B2B] tabular-nums">
              £{displayPrice.toLocaleString('en-GB')}
            </p>
            <p className="text-xs text-[#1C1C1C] font-medium mt-1">
              Free delivery
            </p>
          </div>

          <button
            type="button"
            className="btn-primary shrink-0 text-sm px-4 py-2 text-center font-semibold rounded-full bg-[#1C1C1C] text-white hover:bg-[#0A0A0A] transition-all border-0 cursor-pointer"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Border overlay */}
      <div className="absolute inset-0 rounded-2xl border-2 border-[#1C1C1C] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  );
}
