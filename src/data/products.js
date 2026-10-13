import rawData from './products.json';

const IMAGE_BASE_URL = 'https://backend.britsofa.co.uk';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80';

export function formatImageUrl(url) {
  if (!url) {
    return FALLBACK_IMAGE;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${IMAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const STORE_INFO = {
  name: 'Faneelo',
  legalName: 'Faneelo Sofas UK Ltd',
  domain: 'faneelo.co.uk',
  url: 'https://faneelo.co.uk',
  tagline: 'Handcrafted Luxury Sofas & Suites UK',
  description: 'Shop luxury British sofas at Faneelo.co.uk: designer corner suites, 2, 3, 4, 5, 6 seaters, modular bouclé and plush velvet sofas with fast UK delivery and Cash on Delivery.',
  phone: '+44 7473 954773',
  whatsapp: '447473954773',
  email: 'support@faneelo.co.uk',
  address: {
    city: 'Wolverhampton',
    region: 'West Midlands',
    country: 'United Kingdom',
    postcode: 'WV1 1AA'
  },
  rating: 4.9,
  reviewsCount: 1420
};

export const CATEGORIES = [
  {
    id: 'corner-sofa',
    name: 'Corner Sofas',
    tagline: 'L-Shaped & Chaise Suites',
    image: 'https://backend.britsofa.co.uk/uploads/1778435615509-Corner-Sofa.jpeg',
    badge: 'Popular',
    startingPrice: 550
  },
  {
    id: '3plus2-seater',
    name: '3+2 Seater Sets',
    tagline: 'Matching Living Room Packages',
    image: 'https://backend.britsofa.co.uk/uploads/1778439610804-3-2-sofa.webp',
    badge: 'Best Value',
    startingPrice: 500
  },
  {
    id: '3-seater',
    name: '3 Seater Sofas',
    tagline: 'Classic Family Seating',
    image: 'https://backend.britsofa.co.uk/uploads/1778435615507-3-seater-Sofa.jpg',
    badge: 'Trending',
    startingPrice: 350
  },
  {
    id: '2-seater',
    name: '2 Seater Sofas',
    tagline: 'Cosy Loveseats & Compact Flats',
    image: 'https://backend.britsofa.co.uk/uploads/1778712204820-2-Seater-Sofa.jfif.jpg',
    badge: null,
    startingPrice: 300
  },
  {
    id: '4-seater',
    name: '4 Seater Sofas',
    tagline: 'Expansive Modern Lounges',
    image: 'https://backend.britsofa.co.uk/uploads/1778710605675-4-seater.jpg',
    badge: null,
    startingPrice: 400
  },
  {
    id: '5-seater',
    name: '5 Seater Sofas',
    tagline: 'Generous Luxury Seating',
    image: 'https://backend.britsofa.co.uk/uploads/1778712929588-5-seater-sofa.webp',
    badge: 'Spacious',
    startingPrice: 550
  },
  {
    id: '6-seater',
    name: '6 Seater & U-Shape',
    tagline: 'Grand Family Suites',
    image: 'https://backend.britsofa.co.uk/uploads/1778712204822-6-Seater-Sofa.jfif.jpg',
    badge: 'Grand Luxury',
    startingPrice: 700
  },
  {
    id: 'modular-boucle',
    name: 'Modular & Bouclé',
    tagline: 'Cloud-Like Textured Comfort',
    image: 'https://backend.britsofa.co.uk/uploads/1791380170173-3.png',
    badge: 'Design Icon',
    startingPrice: 750
  }
];

export const PRODUCTS = (rawData.items || []).map((item) => {
  const images = (item.images && item.images.length > 0 ? item.images : [item.imageUrl]).map(formatImageUrl);
  const mainImage = formatImageUrl(item.imageUrl || item.cardImageUrl || images[0]);
  
  const formattedVariants = (item.variants || []).map((v) => ({
    ...v,
    imageUrl: formatImageUrl(v.imageUrl || item.imageUrl),
    price: Number(v.price) || item.price
  }));

  // Parse color options into a clean array
  const colorList = (item.color || 'Charcoal, Grey, Beige, Navy Blue, Cream, Forest Green, Black')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  // Parse fabrics into a clean array
  const fabricList = (item.fabric || 'Plush Velvet, Chenille, Bouclé, Jumbo Cord, Linen')
    .split(',')
    .map(f => f.trim())
    .filter(Boolean);

  return {
    ...item,
    imageUrl: mainImage,
    cardImageUrl: mainImage,
    images: images,
    variants: formattedVariants,
    colorList: colorList,
    fabricList: fabricList,
    rating: item.rating || 5,
    soldCount: item.soldCount || 85,
    badge: item.isOnSale ? 'Sale 20% Off' : item.price >= 750 ? 'Premium Luxury' : 'UK Best Seller'
  };
});

export const REVIEWS = [
  {
    id: 1,
    name: 'Eleanor H.',
    location: 'Surrey, UK',
    date: 'Verified Buyer • 2 days ago',
    title: 'Exceeded our expectations in every way!',
    review: 'We were nervous ordering a sofa online without sitting on it first, but the Cash on Delivery option gave us complete confidence. The driver brought it in, unwrapped it, and let us inspect the velvet quality before payment. Super comfortable and stunning.',
    product: 'Luxury Lilly 5 Seater Suite',
    rating: 5
  },
  {
    id: 2,
    name: 'David & Sarah M.',
    location: 'Manchester, UK',
    date: 'Verified Buyer • 1 week ago',
    title: 'Outstanding quality and fast delivery',
    review: 'Ordered on Tuesday morning and it was in our living room by Thursday afternoon! The Chesterfield craftsmanship is incredible, deep cushions and heavy solid wood frame. Worth twice what Faneelo charges.',
    product: 'Chesterfield Luxury Sofa Collection',
    rating: 5
  },
  {
    id: 3,
    name: 'Liam T.',
    location: 'Birmingham, UK',
    date: 'Verified Buyer • 2 weeks ago',
    title: 'The Bouclé modular sofa is pure luxury',
    review: 'Cloud-like comfort, looks like it came straight out of Architectural Digest. Customer service via WhatsApp answered all my dimension questions within 5 minutes.',
    product: 'Luxury Lilly Modular Bouclé Sofa',
    rating: 5
  },
  {
    id: 4,
    name: 'Sophie W.',
    location: 'Edinburgh, UK',
    date: 'Verified Buyer • 3 weeks ago',
    title: 'Perfect corner sofa for our open-plan lounge',
    review: 'Delivery team was polite and assembled the feet on arrival. The fabric feels ultra durable against our pets while feeling soft and velvety. 10/10 service!',
    product: 'Ashwin Family Corner Suite',
    rating: 5
  }
];

export const FAQS = [
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'We offer full Cash on Delivery across mainland UK. Our professional two-man delivery team will bring your sofa right to your home. You can inspect the craftsmanship, fabric, and comfort in person before handing over any payment. If for any reason you are not satisfied, you can simply decline it with zero obligation!'
  },
  {
    q: 'How long does delivery take?',
    a: 'Most in-stock sofas are delivered within 1 to 3 working days across the UK. Our logistics dispatch team will contact you 24 hours prior with a dedicated delivery time slot so you do not have to wait at home all day.'
  },
  {
    q: 'Can I order via WhatsApp?',
    a: 'Yes! You can click the WhatsApp button on any sofa page to speak directly with our team. We can confirm fabric swatches, custom dimensions, check stock, and process your order instantly.'
  },
  {
    q: 'Do you offer a frame guarantee?',
    a: 'Every Faneelo sofa comes with a 5-Year Hardwood Frame Guarantee and a 1-year manufacturing defect warranty for complete peace of mind.'
  },
  {
    q: 'Can I choose left or right facing corner configurations?',
    a: 'Yes, all our corner sofa models are available in both Left Hand Facing (LHF) and Right Hand Facing (RHF) configurations to match your room layout.'
  }
];
