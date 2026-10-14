import { PRODUCTS, formatImageUrl } from '../data/products';

/**
 * Normalizes a product object ensuring all variant images and lists are valid
 */
export function normalizeProduct(item) {
  const images = (item.images && item.images.length > 0 ? item.images : [item.imageUrl || item.cardImageUrl])
    .map(formatImageUrl);
  const mainImage = formatImageUrl(item.imageUrl || item.cardImageUrl || images[0]);

  const formattedVariants = (item.variants || []).map((v) => ({
    ...v,
    type: v.type || 'standard',
    label: v.label || 'Standard Suite',
    imageUrl: formatImageUrl(v.imageUrl || mainImage),
    price: Number(v.price) || Number(item.price) || 250,
    soldCount: Number(v.soldCount) || 25
  }));

  const colorList = Array.isArray(item.colorList)
    ? item.colorList
    : (item.color || 'Charcoal, Grey, Beige, Navy Blue, Cream, Forest Green, Black')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

  const fabricList = Array.isArray(item.fabricList)
    ? item.fabricList
    : (item.fabric || 'Plush Velvet, Chenille, Bouclé, Jumbo Cord, Linen')
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

  return {
    ...item,
    id: item.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `sofa-${Date.now()}`),
    name: item.name || 'Luxury Sofa',
    collection: item.collection || 'Lilly',
    price: Number(item.price) || 250,
    originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
    rating: Number(item.rating) || 5,
    soldCount: Number(item.soldCount) || 50,
    imageUrl: mainImage,
    cardImageUrl: mainImage,
    images: images,
    variants: formattedVariants,
    colorList: colorList,
    fabricList: fabricList,
    color: colorList.join(', '),
    fabric: fabricList.join(', '),
    delivery: item.delivery || 'Within 1–3 working days | Free UK Delivery | Cash on Delivery',
    description: item.description || 'Handcrafted luxury sofa UK with premium upholstery and solid hardwood frame.',
    inStock: item.inStock !== false,
    hasCornerVariant: Boolean(item.hasCornerVariant || formattedVariants.some(v => v.type?.includes('corner')))
  };
}

/**
 * Fetch all products directly from the static catalog
 */
export async function getAllProducts() {
  return PRODUCTS.map(normalizeProduct);
}
