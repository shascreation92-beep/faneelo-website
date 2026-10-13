import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PRODUCTS, formatImageUrl } from '../data/products';

const STORAGE_KEY = 'faneelo_catalog_products_v1';

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
 * Fetch all products from Supabase (or localStorage / bundled data fallback)
 */
export async function getAllProducts() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(normalizeProduct);
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage:', e);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (e) {
    console.error('Local storage read error:', e);
  }

  // Default fallback to bundled BritSofa matching products
  return PRODUCTS.map(normalizeProduct);
}

/**
 * Save (create or update) a product
 */
export async function saveProduct(productData) {
  const normalized = normalizeProduct(productData);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: normalized.id,
          slug: normalized.slug,
          name: normalized.name,
          collection: normalized.collection,
          price: normalized.price,
          original_price: normalized.originalPrice,
          image_url: normalized.imageUrl,
          images: normalized.images,
          variants: normalized.variants,
          color: normalized.color,
          fabric: normalized.fabric,
          description: normalized.description,
          delivery: normalized.delivery,
          rating: normalized.rating,
          sold_count: normalized.soldCount,
          in_stock: normalized.inStock,
          has_corner_variant: normalized.hasCornerVariant,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsert error:', error);
      } else if (data) {
        return normalizeProduct(data);
      }
    } catch (e) {
      console.warn('Supabase save failed, storing locally:', e);
    }
  }

  // Update in localStorage
  try {
    const existing = await getAllProducts();
    const index = existing.findIndex((p) => p.id === normalized.id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = normalized;
    } else {
      updated = [normalized, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return normalized;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return normalized;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) console.error('Supabase delete error:', error);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  try {
    const existing = await getAllProducts();
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to delete from localStorage:', e);
    return false;
  }
}

/**
 * Seed initial catalog with default products
 */
export async function seedDefaultCatalog() {
  const initial = PRODUCTS.map(normalizeProduct);
  
  if (isSupabaseConfigured() && supabase) {
    try {
      for (const item of initial) {
        await supabase.from('products').upsert({
          id: item.id,
          slug: item.slug,
          name: item.name,
          collection: item.collection,
          price: item.price,
          original_price: item.originalPrice,
          image_url: item.imageUrl,
          images: item.images,
          variants: item.variants,
          color: item.color,
          fabric: item.fabric,
          description: item.description,
          delivery: item.delivery,
          rating: item.rating,
          sold_count: item.soldCount,
          in_stock: item.inStock !== false,
          has_corner_variant: item.hasCornerVariant,
          created_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Supabase seed error:', e);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.error('Local storage seed error:', e);
  }

  return initial;
}

/**
 * Upload an image file from the client device
 * - In Supabase mode: uploads to 'product-images' bucket and gets public URL.
 * - In Local mode: converts file to a base64 data URL with browser FileReader.
 */
export async function uploadImageFile(file) {
  if (!file) return null;

  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      } else {
        console.warn('Supabase storage upload error:', error);
      }
    } catch (e) {
      console.warn('Supabase storage upload exception:', e);
    }
  }

  // Fallback: Read file as Data URL (base64) so it works offline and in local demo mode
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
