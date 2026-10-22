import { CATEGORIES, formatImageUrl, FALLBACK_IMAGE } from '../data/products';

export default function CategoriesGrid({ selectedCategory, onSelectCategory }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Heading matching BritSofa */}
        <div className="text-center mb-16">
          <h2 className="text-heading text-3xl md:text-4xl font-semibold text-[#2B2B2B] mb-3 font-display">
            Shop by Category
          </h2>
          <p className="text-lg text-[#6B6B6B]">
            Discover the perfect sofa for your lifestyle
          </p>
        </div>

        {/* 8 Categories Grid in 4 columns */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm"
              >
                {/* Background Image with Hover Zoom */}
                <div className="absolute inset-0">
                  <img
                    src={formatImageUrl(cat.image)}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Exact dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-[#2B2B2B]/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />
                </div>

                {/* Content at Bottom-Left */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  <span className="inline-block self-start mb-2 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                    {cat.badge || 'Collection'}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1 font-display">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/90 mb-3">
                    {cat.tagline || cat.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-white font-semibold text-sm transition-transform duration-300 group-hover:translate-x-1">
                    <span>{isSelected ? 'Active Filter ✓' : 'Explore'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Outline Border */}
                <div className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-colors ${
                  isSelected ? 'border-white' : 'border-white/25 group-hover:border-white/50'
                }`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
