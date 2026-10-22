const fs = require('fs');
const path = require('path');

const catalogImages = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/products/catalog_images.json'), 'utf8').replace(/^\uFEFF/, '')
);

const products = [
  // 1. ASHTON
  {
    id: 'ashton-2-seater',
    slug: 'ashton-2-seater-luxury-sofa',
    name: 'Ashton 2 Seater Luxury Sofa',
    collection: 'Ashton',
    category: 'ashton',
    seatingType: '2-seater',
    price: 350,
    originalPrice: 420,
    description: 'Handcrafted in the UK, the Ashton 2 Seater Sofa combines classic Chesterfield button tufting with high-resilience foam cushioning for supreme comfort in compact spaces. Features solid hardwood framing, deep scroll arms, and plush upholstery.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 165cm x Depth 92cm x Height 78cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['ashton/2-seater'] || [],
    color: 'Cream, Beige, Charcoal, Light Grey, Navy Blue, Forest Green',
    fabric: 'Plush Velvet, Textured Chenille, Bouclé',
    rating: 5.0,
    soldCount: 42,
    badge: 'Popular',
    variants: [
      { type: '2-seater', label: '2 Seater Compact Suite', price: 350, imageUrl: catalogImages['ashton/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'ashton-3-seater',
    slug: 'ashton-3-seater-luxury-sofa',
    name: 'Ashton 3 Seater Luxury Sofa',
    collection: 'Ashton',
    category: 'ashton',
    seatingType: '3-seater',
    price: 420,
    originalPrice: 499,
    description: 'Experience timeless elegance with the Ashton 3 Seater Luxury Sofa. Deep-buttoned craftsmanship, scroll arms, and thick foam-filled seating make it a statement piece for any British living room.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 210cm x Depth 92cm x Height 78cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['ashton/3-seater'] || [],
    color: 'Cream, Beige, Charcoal, Light Grey, Navy Blue, Forest Green',
    fabric: 'Plush Velvet, Textured Chenille, Bouclé',
    rating: 5.0,
    soldCount: 68,
    badge: 'Best Seller',
    variants: [
      { type: '3-seater', label: '3 Seater Luxury Suite', price: 420, imageUrl: catalogImages['ashton/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'ashton-2c2',
    slug: 'ashton-2c2-symmetrical-corner-sofa',
    name: 'Ashton 2C2 Symmetrical Corner Sofa',
    collection: 'Ashton',
    category: 'ashton',
    seatingType: 'corner-sofa',
    price: 620,
    originalPrice: 750,
    description: 'The Ashton 2C2 Corner Sofa provides equal symmetrical seating on both sides (240cm x 240cm), making it ideal for spacious family living rooms. Deeply padded seats with classic buttoned backrests and supportive webbed suspension.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: 240cm x 240cm x Height 78cm x Depth 92cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['ashton/2c2'] || [],
    color: 'Cream, Beige, Charcoal, Light Grey, Navy Blue, Forest Green',
    fabric: 'Plush Velvet, Textured Chenille, Bouclé',
    rating: 5.0,
    soldCount: 54,
    badge: 'Grand Luxury',
    variants: [
      { type: 'corner-sofa', label: '2C2 Symmetrical Corner Suite', price: 620, imageUrl: catalogImages['ashton/2c2']?.[0] || '' }
    ]
  },
  {
    id: 'ashton-l-shape',
    slug: 'ashton-l-shape-corner-sofa',
    name: 'Ashton L-Shape Corner Sofa',
    collection: 'Ashton',
    category: 'ashton',
    seatingType: 'corner-sofa',
    price: 590,
    originalPrice: 699,
    description: 'An exquisite blend of classical Chesterfield styling and modern corner relaxation. Available in both Left Hand Facing (LHF) and Right Hand Facing (RHF) configurations to fit your exact room layout.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 250cm x Length 180cm x Height 78cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['ashton/l-shape'] || [],
    color: 'Cream, Beige, Charcoal, Light Grey, Navy Blue, Forest Green',
    fabric: 'Plush Velvet, Textured Chenille, Bouclé',
    rating: 4.9,
    soldCount: 79,
    badge: 'UK Favourite',
    variants: [
      { type: 'corner-sofa', label: 'Left Hand Facing (LHF)', price: 590, imageUrl: catalogImages['ashton/l-shape']?.[0] || '' },
      { type: 'corner-sofa', label: 'Right Hand Facing (RHF)', price: 590, imageUrl: catalogImages['ashton/l-shape']?.[1] || catalogImages['ashton/l-shape']?.[0] || '' }
    ]
  },

  // 2. BORIOS
  {
    id: 'borios-2-seater',
    slug: 'borios-2-seater-sofa',
    name: 'Borios 2 Seater Modern Sofa',
    collection: 'Borios',
    category: 'borios',
    seatingType: '2-seater',
    price: 380,
    originalPrice: 450,
    description: 'The Borios 2 Seater features a contemporary silhouette with low-profile deep seating, thick supportive cushions, and modern textured upholstery designed for modern UK homes.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 170cm x Depth 95cm x Height 75cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['borios/2-seater'] || [],
    color: 'Dark Brown, Mocha, Charcoal, Warm Grey, Cream, Forest Green',
    fabric: 'Textured Chenille, Premium Weave, Plush Velvet',
    rating: 5.0,
    soldCount: 31,
    badge: 'Modern Style',
    variants: [
      { type: '2-seater', label: '2 Seater Suite', price: 380, imageUrl: catalogImages['borios/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'borios-3-seater',
    slug: 'borios-3-seater-sofa',
    name: 'Borios 3 Seater Modern Sofa',
    collection: 'Borios',
    category: 'borios',
    seatingType: '3-seater',
    price: 450,
    originalPrice: 530,
    description: 'Spacious and modern, the Borios 3 Seater Sofa offers generous proportions and exceptional lounging comfort. Its clean lines and deep foam cushions make it a standout centrepiece.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 215cm x Depth 95cm x Height 75cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['borios/3-seater'] || [],
    color: 'Dark Brown, Mocha, Charcoal, Warm Grey, Cream, Forest Green',
    fabric: 'Textured Chenille, Premium Weave, Plush Velvet',
    rating: 5.0,
    soldCount: 47,
    badge: 'Trending',
    variants: [
      { type: '3-seater', label: '3 Seater Suite', price: 450, imageUrl: catalogImages['borios/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'borios-chaise-l-shape',
    slug: 'borios-chaise-l-shape-corner-sofa',
    name: 'Borios Chaise L-Shape Corner Sofa',
    collection: 'Borios',
    category: 'borios',
    seatingType: 'corner-sofa',
    price: 640,
    originalPrice: 760,
    description: 'Designed for relaxed open-plan living, the Borios Chaise L-Shape combines clean architectural lines with an extended chaise lounge section for stretching out in style.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 260cm x Length 175cm x Height 75cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['borios/chaise-l-shape'] || [],
    color: 'Dark Brown, Mocha, Charcoal, Warm Grey, Cream, Forest Green',
    fabric: 'Textured Chenille, Premium Weave, Plush Velvet',
    rating: 5.0,
    soldCount: 63,
    badge: 'Best Value',
    variants: [
      { type: 'corner-sofa', label: 'Left Hand Facing (LHF)', price: 640, imageUrl: catalogImages['borios/chaise-l-shape']?.[0] || '' },
      { type: 'corner-sofa', label: 'Right Hand Facing (RHF)', price: 640, imageUrl: catalogImages['borios/chaise-l-shape']?.[1] || catalogImages['borios/chaise-l-shape']?.[0] || '' }
    ]
  },

  // 3. CHESTERFIELD FABRIC
  {
    id: 'chesterfield-fabric-2-seater',
    slug: 'chesterfield-fabric-2-seater-sofa',
    name: 'Chesterfield Fabric 2 Seater Sofa',
    collection: 'Chesterfield Fabric',
    category: 'chesterfield-fabric',
    seatingType: '2-seater',
    price: 390,
    originalPrice: 470,
    description: 'Classic British Chesterfield styling in sumptuous fabric upholstery. Featuring hand-pleated diamond buttoning, scrolled arms, and durable hardwood feet.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 168cm x Depth 90cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-fabric/2-seater'] || [],
    color: 'Grey, Charcoal, Emerald Green, Navy Blue, Cream, Mustard',
    fabric: 'Plush Velvet, Textured Chenille',
    rating: 4.9,
    soldCount: 58,
    badge: 'Classic Heritage',
    variants: [
      { type: '2-seater', label: '2 Seater Fabric Chesterfield', price: 390, imageUrl: catalogImages['chesterfield-fabric/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-fabric-3-seater',
    slug: 'chesterfield-fabric-3-seater-sofa',
    name: 'Chesterfield Fabric 3 Seater Sofa',
    collection: 'Chesterfield Fabric',
    category: 'chesterfield-fabric',
    seatingType: '3-seater',
    price: 480,
    originalPrice: 580,
    description: 'The iconic Chesterfield 3 Seater in soft luxury fabric. Generous pocket sprung cushions combined with signature deep-buttoned back and arms provide unrivaled comfort.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 215cm x Depth 90cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-fabric/3-seater'] || [],
    color: 'Grey, Charcoal, Emerald Green, Navy Blue, Cream, Mustard',
    fabric: 'Plush Velvet, Textured Chenille',
    rating: 5.0,
    soldCount: 92,
    badge: 'Top Rated',
    variants: [
      { type: '3-seater', label: '3 Seater Fabric Chesterfield', price: 480, imageUrl: catalogImages['chesterfield-fabric/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-fabric-corner',
    slug: 'chesterfield-fabric-corner-sofa',
    name: 'Chesterfield Fabric Corner Sofa',
    collection: 'Chesterfield Fabric',
    category: 'chesterfield-fabric',
    seatingType: 'corner-sofa',
    price: 690,
    originalPrice: 820,
    description: 'A grand statement piece that merges heritage Chesterfield details with family corner seating. Perfectly handcrafted for British homes seeking comfort and traditional grandeur.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: 245cm x 245cm x Depth 90cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-fabric/corner'] || [],
    color: 'Grey, Charcoal, Emerald Green, Navy Blue, Cream, Mustard',
    fabric: 'Plush Velvet, Textured Chenille',
    rating: 5.0,
    soldCount: 114,
    badge: 'Best Seller',
    variants: [
      { type: 'corner-sofa', label: 'Chesterfield Corner Suite', price: 690, imageUrl: catalogImages['chesterfield-fabric/corner']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-fabric-l-shape',
    slug: 'chesterfield-fabric-l-shape-sofa',
    name: 'Chesterfield Fabric L-Shape Sofa',
    collection: 'Chesterfield Fabric',
    category: 'chesterfield-fabric',
    seatingType: 'corner-sofa',
    price: 660,
    originalPrice: 790,
    description: 'L-shaped configuration of our popular Chesterfield fabric collection. Deep buttoning, high armrests, and supportive deep seating with an extended chaise.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 255cm x Length 175cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-fabric/l-shape'] || [],
    color: 'Grey, Charcoal, Emerald Green, Navy Blue, Cream, Mustard',
    fabric: 'Plush Velvet, Textured Chenille',
    rating: 4.9,
    soldCount: 71,
    badge: 'Luxury Comfort',
    variants: [
      { type: 'corner-sofa', label: 'Left Hand Facing (LHF)', price: 660, imageUrl: catalogImages['chesterfield-fabric/l-shape']?.[0] || '' },
      { type: 'corner-sofa', label: 'Right Hand Facing (RHF)', price: 660, imageUrl: catalogImages['chesterfield-fabric/l-shape']?.[1] || catalogImages['chesterfield-fabric/l-shape']?.[0] || '' }
    ]
  },

  // 4. CHESTERFIELD LEATHER
  {
    id: 'chesterfield-leather-2-seater',
    slug: 'chesterfield-leather-2-seater-sofa',
    name: 'Chesterfield Leather 2 Seater Sofa',
    collection: 'Chesterfield Leather',
    category: 'chesterfield-leather',
    seatingType: '2-seater',
    price: 460,
    originalPrice: 550,
    description: 'Handcrafted in rich, supple leather with authentic deep diamond tufting and antique brass stud detailing. Built upon a 5-year guaranteed hardwood frame.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 168cm x Depth 92cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-leather/2-seater'] || [],
    color: 'Tan, Antique Brown, Black, Oxblood Red, Vintage Mocha',
    fabric: 'Genuine Leather, Bonded Leather',
    rating: 5.0,
    soldCount: 52,
    badge: 'Premium Leather',
    variants: [
      { type: '2-seater', label: '2 Seater Leather Chesterfield', price: 460, imageUrl: catalogImages['chesterfield-leather/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-leather-3-seater',
    slug: 'chesterfield-leather-3-seater-sofa',
    name: 'Chesterfield Leather 3 Seater Sofa',
    collection: 'Chesterfield Leather',
    category: 'chesterfield-leather',
    seatingType: '3-seater',
    price: 550,
    originalPrice: 660,
    description: 'The pinnacle of British luxury furniture. Our 3-seater Chesterfield Leather sofa delivers heirloom-grade presence, deep comfortable seats, and rich leather aroma.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 218cm x Depth 92cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-leather/3-seater'] || [],
    color: 'Tan, Antique Brown, Black, Oxblood Red, Vintage Mocha',
    fabric: 'Genuine Leather, Bonded Leather',
    rating: 5.0,
    soldCount: 86,
    badge: 'Flagship Luxury',
    variants: [
      { type: '3-seater', label: '3 Seater Leather Chesterfield', price: 550, imageUrl: catalogImages['chesterfield-leather/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-leather-corner',
    slug: 'chesterfield-leather-corner-sofa',
    name: 'Chesterfield Leather Corner Sofa',
    collection: 'Chesterfield Leather',
    category: 'chesterfield-leather',
    seatingType: 'corner-sofa',
    price: 790,
    originalPrice: 950,
    description: 'Commanding and spacious, the Chesterfield Leather Corner Suite offers magnificent seating for the whole family with timeless Chesterfield refinement and hand-tufted finish.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: 250cm x 250cm x Depth 92cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-leather/corner'] || [],
    color: 'Tan, Antique Brown, Black, Oxblood Red, Vintage Mocha',
    fabric: 'Genuine Leather, Bonded Leather',
    rating: 5.0,
    soldCount: 98,
    badge: 'Exclusive',
    variants: [
      { type: 'corner-sofa', label: 'Chesterfield Leather Corner', price: 790, imageUrl: catalogImages['chesterfield-leather/corner']?.[0] || '' }
    ]
  },
  {
    id: 'chesterfield-leather-l-shape',
    slug: 'chesterfield-leather-l-shape-sofa',
    name: 'Chesterfield Leather L-Shape Sofa',
    collection: 'Chesterfield Leather',
    category: 'chesterfield-leather',
    seatingType: 'corner-sofa',
    price: 750,
    originalPrice: 899,
    description: 'L-shaped luxury leather suite with generous chaise section. Hand-tufted buttons and heavy-gauge sprung seats for decades of durability.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Hardwood Frame Guarantee\n- Dimensions: Width 260cm x Length 180cm x Height 76cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['chesterfield-leather/l-shape'] || [],
    color: 'Tan, Antique Brown, Black, Oxblood Red, Vintage Mocha',
    fabric: 'Genuine Leather, Bonded Leather',
    rating: 4.9,
    soldCount: 65,
    badge: 'Grand Heritage',
    variants: [
      { type: 'corner-sofa', label: 'Left Hand Facing (LHF)', price: 750, imageUrl: catalogImages['chesterfield-leather/l-shape']?.[0] || '' },
      { type: 'corner-sofa', label: 'Right Hand Facing (RHF)', price: 750, imageUrl: catalogImages['chesterfield-leather/l-shape']?.[1] || catalogImages['chesterfield-leather/l-shape']?.[0] || '' }
    ]
  },

  // 5. DYLAN
  {
    id: 'dylan-3-seater',
    slug: 'dylan-3-seater-jumbo-cord-sofa',
    name: 'Dylan 3 Seater Jumbo Cord Sofa',
    collection: 'Dylan',
    category: 'dylan',
    seatingType: '3-seater',
    price: 370,
    originalPrice: 440,
    description: 'The UK\'s most popular family living room sofa. Upholstered in ultra-soft, hard-wearing jumbo corduroy fabric with scatter back cushions and durable faux-leather trim.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 205cm x Depth 90cm x Height 85cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['dylan/3-seater'] || [],
    color: 'Beige, Grey, Coffee Brown, Charcoal, Black, Mink',
    fabric: 'Jumbo Corduroy, Soft Chenille',
    rating: 4.9,
    soldCount: 145,
    badge: 'UK Bestseller',
    variants: [
      { type: '3-seater', label: '3 Seater Jumbo Cord Suite', price: 370, imageUrl: catalogImages['dylan/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'dylan-corner',
    slug: 'dylan-jumbo-cord-corner-sofa',
    name: 'Dylan Jumbo Cord Corner Sofa',
    collection: 'Dylan',
    category: 'dylan',
    seatingType: 'corner-sofa',
    price: 520,
    originalPrice: 620,
    description: 'Designed for everyday family comfort, the Dylan Corner Sofa features deep foam-filled seat cushions, matching scatter back pillows, and spacious corner lounge room.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: 220cm x 220cm x Depth 90cm x Height 85cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['dylan/corner'] || [],
    color: 'Beige, Grey, Coffee Brown, Charcoal, Black, Mink',
    fabric: 'Jumbo Corduroy, Soft Chenille',
    rating: 5.0,
    soldCount: 220,
    badge: 'Most Popular',
    variants: [
      { type: 'corner-sofa', label: 'Dylan Corner Suite', price: 520, imageUrl: catalogImages['dylan/corner']?.[0] || '' }
    ]
  },
  {
    id: 'dylan-l-shape',
    slug: 'dylan-l-shape-corner-sofa',
    name: 'Dylan L-Shape Corner Sofa',
    collection: 'Dylan',
    category: 'dylan',
    seatingType: 'corner-sofa',
    price: 500,
    originalPrice: 599,
    description: 'Compact and space-efficient, this Dylan L-Shape suite fits comfortably through doorways as narrow as 65cm. Soft corduroy fabric with supportive deep seats.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 240cm x Length 165cm x Height 85cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['dylan/l-shape'] || [],
    color: 'Beige, Grey, Coffee Brown, Charcoal, Black, Mink',
    fabric: 'Jumbo Corduroy, Soft Chenille',
    rating: 4.9,
    soldCount: 165,
    badge: 'Great Value',
    variants: [
      { type: 'corner-sofa', label: 'Left Hand Facing (LHF)', price: 500, imageUrl: catalogImages['dylan/l-shape']?.[0] || '' },
      { type: 'corner-sofa', label: 'Right Hand Facing (RHF)', price: 500, imageUrl: catalogImages['dylan/l-shape']?.[1] || catalogImages['dylan/l-shape']?.[0] || '' }
    ]
  },

  // 6. MAYA
  {
    id: 'maya-2-seater',
    slug: 'maya-2-seater-sofa',
    name: 'Maya 2 Seater Modern Sofa',
    collection: 'Maya',
    category: 'maya',
    seatingType: '2-seater',
    price: 340,
    originalPrice: 410,
    description: 'Modern Scandinavian-inspired lines with clean proportions. The Maya 2 Seater features slim arms, high-density foam seating, and contemporary woven fabric.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 160cm x Depth 88cm x Height 80cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['maya/2-seater'] || [],
    color: 'Stone Grey, Cream, Charcoal, Olive Green, Mustard, Dusty Rose',
    fabric: 'Textured Weave, Brushed Linen, Velvet',
    rating: 4.9,
    soldCount: 39,
    badge: 'Scandinavian Chic',
    variants: [
      { type: '2-seater', label: '2 Seater Suite', price: 340, imageUrl: catalogImages['maya/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'maya-3-seater',
    slug: 'maya-3-seater-sofa',
    name: 'Maya 3 Seater Modern Sofa',
    collection: 'Maya',
    category: 'maya',
    seatingType: '3-seater',
    price: 410,
    originalPrice: 490,
    description: 'Sleek and inviting, the Maya 3 Seater brings minimalist elegance to modern flats and family lounges alike with smooth fabric and solid timber legs.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 205cm x Depth 88cm x Height 80cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['maya/3-seater'] || [],
    color: 'Stone Grey, Cream, Charcoal, Olive Green, Mustard, Dusty Rose',
    fabric: 'Textured Weave, Brushed Linen, Velvet',
    rating: 5.0,
    soldCount: 57,
    badge: 'Trending',
    variants: [
      { type: '3-seater', label: '3 Seater Suite', price: 410, imageUrl: catalogImages['maya/3-seater']?.[0] || '' }
    ]
  },
  {
    id: 'maya-corner',
    slug: 'maya-modern-corner-sofa',
    name: 'Maya Modern Corner Sofa',
    collection: 'Maya',
    category: 'maya',
    seatingType: 'corner-sofa',
    price: 580,
    originalPrice: 690,
    description: 'The Maya Modern Corner Suite maximizes living space without visual bulk. Deep seating and premium cushioning for relaxed everyday living.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: 235cm x 235cm x Depth 88cm x Height 80cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['maya/corner'] || [],
    color: 'Stone Grey, Cream, Charcoal, Olive Green, Mustard, Dusty Rose',
    fabric: 'Textured Weave, Brushed Linen, Velvet',
    rating: 5.0,
    soldCount: 88,
    badge: 'Editor\'s Choice',
    variants: [
      { type: 'corner-sofa', label: 'Maya Corner Suite', price: 580, imageUrl: catalogImages['maya/corner']?.[0] || '' }
    ]
  },

  // 7. VERONA
  {
    id: 'verona-2-seater',
    slug: 'verona-2-seater-plush-velvet-sofa',
    name: 'Verona 2 Seater Plush Velvet Sofa',
    collection: 'Verona',
    category: 'verona',
    seatingType: '2-seater',
    price: 330,
    originalPrice: 399,
    description: 'The Verona 2 Seater sofa features tailored piping, bolster cushions, and cloud-soft plush velvet that feels incredible to the touch. Perfect for stylish urban apartments.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 165cm x Depth 90cm x Height 82cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['verona/2-seater'] || [],
    color: 'Silver Grey, Steel, Mink, Royal Blue, Emerald, Champagne',
    fabric: 'Plush Velvet, Crushed Velvet',
    rating: 4.9,
    soldCount: 46,
    badge: 'Velvet Luxury',
    variants: [
      { type: '2-seater', label: '2 Seater Velvet Suite', price: 330, imageUrl: catalogImages['verona/2-seater']?.[0] || '' }
    ]
  },
  {
    id: 'verona-3-seater',
    slug: 'verona-3-seater-plush-velvet-sofa',
    name: 'Verona 3 Seater Plush Velvet Sofa',
    collection: 'Verona',
    category: 'verona',
    seatingType: '3-seater',
    price: 410,
    originalPrice: 490,
    description: 'A glamorous centrepiece for any lounge. The Verona 3 Seater combines deep buttonless tufting with thick pocket-sprung comfort and designer bolster cushions.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 210cm x Depth 90cm x Height 82cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['verona/3-seater'] || [],
    color: 'Silver Grey, Steel, Mink, Royal Blue, Emerald, Champagne',
    fabric: 'Plush Velvet, Crushed Velvet',
    rating: 5.0,
    soldCount: 82,
    badge: 'Popular Velvet',
    variants: [
      { type: '3-seater', label: '3 Seater Velvet Suite', price: 410, imageUrl: catalogImages['verona/3-seater']?.[0] || '' }
    ]
  },

  // 8. U-SHAPE SOFAS
  {
    id: 'mini-u-shape-modular',
    slug: 'mini-u-shape-modular-sofa',
    name: 'Mini U-Shape Modular Sectional Sofa',
    collection: 'U-Shape Sofas',
    category: 'u-shape-sofas',
    seatingType: 'u-shape-sofa',
    price: 680,
    originalPrice: 820,
    description: 'Perfect for UK living rooms that crave the grandeur of a U-Shape without taking over the entire room. Features modular units, double chaises, and deep padded seats.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 280cm x Chaise Length 160cm x Depth 90cm x Height 80cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['u-shape/mini-u-shape'] || [],
    color: 'Cream, White Bouclé, Light Grey, Charcoal, Oatmeal',
    fabric: 'Bouclé, Textured Chenille, Plush Velvet',
    rating: 5.0,
    soldCount: 95,
    badge: 'Modular Luxury',
    variants: [
      { type: 'u-shape', label: 'Mini U-Shape Modular Suite', price: 680, imageUrl: catalogImages['u-shape/mini-u-shape']?.[0] || '' }
    ]
  },
  {
    id: 'grand-u-shape-sectional',
    slug: 'grand-u-shape-sectional-sofa',
    name: 'Grand U-Shape Sectional Family Sofa',
    collection: 'U-Shape Sofas',
    category: 'u-shape-sofas',
    seatingType: 'u-shape-sofa',
    price: 850,
    originalPrice: 1050,
    description: 'The ultimate family luxury lounge suite. Expansive twin chaises, deep 3-tier foam cushions, and supportive backrests for movie nights and entertaining the whole family.\n\n- Free Fast UK Delivery\n- Cash on Delivery Available\n- 5-Year Frame Guarantee\n- Dimensions: Width 330cm x Twin Chaises Length 175cm x Height 85cm',
    delivery: 'Free UK Delivery Within 1–3 Working Days | Cash on Delivery',
    images: catalogImages['u-shape/grand-u-shape'] || [],
    color: 'Mocha Brown, Chocolate, Charcoal Grey, Slate, Warm Taupe',
    fabric: 'Plush Velvet, Chenille, Microfibre',
    rating: 5.0,
    soldCount: 130,
    badge: 'Grand Family Luxury',
    variants: [
      { type: 'u-shape', label: 'Grand U-Shape Sectional Suite', price: 850, imageUrl: catalogImages['u-shape/grand-u-shape']?.[0] || '' }
    ]
  }
];

// Add cardImageUrl and imageUrl shortcuts to each product
const enriched = products.map((p) => {
  const mainImage = (p.images && p.images.length > 0) ? p.images[0] : '';
  return {
    ...p,
    imageUrl: mainImage,
    cardImageUrl: mainImage,
    hasCornerVariant: p.seatingType === 'corner-sofa' || p.seatingType === 'u-shape-sofa',
    createdAt: new Date().toISOString()
  };
});

const output = {
  total: enriched.length,
  items: enriched
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/products.json'),
  JSON.stringify(output, null, 2),
  'utf8'
);

console.log(`Successfully generated products.json with ${enriched.length} products!`);
