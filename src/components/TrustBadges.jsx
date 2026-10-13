import React from 'react';

const REVIEWS = [
  {
    name: "Emma Thompson",
    quote: "Outstanding quality and service. My corner sofa arrived perfectly and the delivery team was professional.",
    rating: 5
  },
  {
    name: "Michael Chen",
    quote: "Cash on delivery made the purchase so easy. The U-shape sofa is exactly what I wanted.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    quote: "Best sofa shopping experience in the UK. Fast delivery and excellent customer support.",
    rating: 5
  },
  {
    name: "David Rodriguez",
    quote: "Premium quality at affordable prices. The fabric and comfort exceeded my expectations.",
    rating: 5
  },
  {
    name: "Lisa Johnson",
    quote: "From browsing to delivery, everything was seamless. Highly recommend Faneelo!",
    rating: 5
  },
  {
    name: "James Wilson",
    quote: "The 4-seater sofa is perfect for our family. Great value and superb quality.",
    rating: 5
  }
];

const FEATURES = [
  {
    title: "Fast UK Delivery",
    text: "Delivery windows you can plan around."
  },
  {
    title: "Cash on Delivery",
    text: "Order with confidence and convenience."
  },
  {
    title: "Premium Fabrics",
    text: "Curated textures and finishes for modern homes."
  },
  {
    title: "Dedicated Support",
    text: "Friendly help before and after purchase."
  }
];

const CUSTOMER_VOICES = [
  "Delivery was smooth, and the sofa quality exceeded expectations.",
  "The showroom-level look at a fair price. Highly recommended.",
  "Support team helped us pick the right size and finish quickly."
];

export default function TrustBadges({ onShopClick }) {
  return (
    <div>
      {/* 1. Trustpilot Strip matching BritSofa */}
      <section className="bg-gradient-to-b from-white to-[#FAFAF9] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-2xl bg-gradient-to-br from-[#F5F5F4] to-[#FAFAF9] p-8 md:p-12 border border-[#E6E6E6] shadow-sm">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#1C1C1C] text-white px-4 py-2 rounded-lg font-bold text-sm mb-4">
                Trustpilot Excellent
              </div>
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-2 font-display">
                Why Trust Faneelo
              </h2>
              <p className="text-[#6B6B6B] text-sm sm:text-base">
                Join our community of satisfied customers across the UK
              </p>
              <p className="text-[#6B6B6B] text-sm sm:text-base">
                We've earned the trust of families with premium quality and exceptional service
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex gap-1 text-[#E5A83B] text-sm">
                  ★★★★★
                </div>
                <span className="font-bold text-lg text-[#2B2B2B]">4.9/5</span>
                <span className="text-[#8A8A8A] text-sm">(2,847 reviews)</span>
              </div>
            </div>

            {/* 6 Review Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((rev, idx) => (
                <article
                  key={idx}
                  className="rounded-xl bg-white p-6 shadow-sm border border-[#E6E6E6] transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-1 mb-3 text-[#E5A83B] text-sm">
                    ★★★★★
                  </div>
                  <p className="text-[#6B6B6B] mb-4 italic text-sm leading-relaxed">
                    "{rev.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] flex items-center justify-center text-white font-bold text-sm">
                      {rev.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#2B2B2B]">
                        {rev.name}
                      </div>
                      <div className="text-xs text-[#8A8A8A] flex items-center gap-1">
                        <span className="text-[#1C1C1C]">✓</span>
                        Verified Buyer
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10">
              <p className="text-[#6B6B6B] text-sm mb-4">
                Ready to join our happy customers?
              </p>
              <button
                type="button"
                onClick={onShopClick}
                className="btn-primary inline-flex items-center gap-2 rounded-full bg-[#1C1C1C] text-white px-7 py-3 text-sm font-semibold hover:bg-[#0A0A0A] transition-all border-0 cursor-pointer shadow-md"
              >
                Shop Premium Sofas Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 Features Bar matching BritSofa */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {FEATURES.map((feat) => (
            <article
              key={feat.title}
              className="surface-card rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="text-base font-semibold text-[#2B2B2B]">
                {feat.title}
              </h3>
              <p className="mt-2 text-sm text-[#6B6B6B]">
                {feat.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Customer Voices matching BritSofa */}
      <section className="bg-[#F8F6F0] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1C1C1C]">
              Customer Voices
            </p>
            <h2 className="text-heading text-2xl md:text-3xl font-normal text-[#2B2B2B] mt-1 font-display">
              What UK homeowners are saying
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {CUSTOMER_VOICES.map((quote, idx) => (
              <blockquote
                key={idx}
                className="surface-card rounded-2xl border border-[#E6E6E6] bg-white p-6 text-sm text-[#4B5563] shadow-sm leading-relaxed"
              >
                “{quote}”
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
