import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getAllProducts, saveProduct } from './productService';

const STORAGE_KEY = 'faneelo_collections_v1';

export const DEFAULT_COLLECTIONS = [
  {
    id: 'lilly',
    name: 'Lilly',
    description: 'Modern Sculptural Bouclé & Luxury Velvet Suites',
    image: 'https://backend.britsofa.co.uk/uploads/1791380170173-3.png',
    createdAt: '2026-05-01T00:00:00.000Z'
  },
  {
    id: 'dino',
    name: 'Dino',
    description: 'Family Velvet & Cord British Living Room Classics',
    image: 'https://backend.britsofa.co.uk/uploads/1779105771945-5.webp',
    createdAt: '2026-05-02T00:00:00.000Z'
  },
  {
    id: 'ashwin',
    name: 'Ashwin',
    description: 'Spacious U-Shape & Extra Deep Family Seating',
    image: 'https://backend.britsofa.co.uk/uploads/1778712929588-5-seater-sofa.webp',
    createdAt: '2026-05-03T00:00:00.000Z'
  },
  {
    id: 'chesterfield',
    name: 'Chesterfield',
    description: 'Iconic Button-Tufted Deep Handcrafted British Luxury',
    image: 'https://backend.britsofa.co.uk/uploads/1779454029869-WhatsApp-Image-2026-05-22-at-5.16.01-PM.jpeg',
    createdAt: '2026-05-04T00:00:00.000Z'
  },
  {
    id: 'dylan',
    name: 'Dylan',
    description: 'Cosy Jumbo Corduroy Scatter-Back Corner Sofas',
    image: 'https://backend.britsofa.co.uk/uploads/1780691529923-BlackRH1.webp',
    createdAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'hannah',
    name: 'Hannah',
    description: 'Jumbo Cord Modular Suites with Matching Footstools',
    image: 'https://backend.britsofa.co.uk/uploads/1780692036388-il_fullxfull.2970396683_7qfq_ee9b74e0-1326-4f5d-9dc8-4cfb07f005f9.webp',
    createdAt: '2026-05-06T00:00:00.000Z'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Bespoke Made-to-Order UK Handcrafted Suites',
    image: 'https://backend.britsofa.co.uk/uploads/1779657512329-704467924_122096410755334020_7016631172697452077_n.jpg',
    createdAt: '2026-05-07T00:00:00.000Z'
  }
];

/**
 * Fetch all collections
 */
export async function getAllCollections() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase collections fetch fallback:', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage collections read error:', e);
  }

  // Save default collections to localStorage if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COLLECTIONS));
  } catch (e) {
    console.error(e);
  }

  return DEFAULT_COLLECTIONS;
}

/**
 * Save or update a collection
 */
export async function saveCollection(collection) {
  const current = await getAllCollections();
  const id = collection.id || collection.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const normalized = {
    ...collection,
    id,
    name: collection.name.trim(),
    description: collection.description || '',
    image: collection.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    updatedAt: new Date().toISOString()
  };

  const index = current.findIndex(c => c.id === id || c.name.toLowerCase() === normalized.name.toLowerCase());
  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = normalized;
  } else {
    updated = [...current, normalized];
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('collections').upsert(normalized);
    } catch (e) {
      console.warn('Supabase collection save error:', e);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return normalized;
}

/**
 * Rename a collection and cascade update to all products in that collection
 */
export async function renameCollection(oldName, newName, newImage = null, newDescription = null) {
  const collections = await getAllCollections();
  const trimmedNewName = newName.trim();
  const trimmedOldName = oldName.trim();

  const targetIdx = collections.findIndex(c => c.name.toLowerCase() === trimmedOldName.toLowerCase());
  if (targetIdx >= 0) {
    collections[targetIdx].name = trimmedNewName;
    if (newImage) collections[targetIdx].image = newImage;
    if (newDescription !== null) collections[targetIdx].description = newDescription;
    collections[targetIdx].updatedAt = new Date().toISOString();
  } else {
    // If it didn't exist in the list, create it
    collections.push({
      id: trimmedNewName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: trimmedNewName,
      description: newDescription || '',
      image: newImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      updatedAt: new Date().toISOString()
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    console.error(e);
  }

  // Cascade rename to all products currently tagged with oldName
  if (trimmedOldName.toLowerCase() !== trimmedNewName.toLowerCase()) {
    try {
      const allProducts = await getAllProducts();
      for (const prod of allProducts) {
        if ((prod.collection || '').toLowerCase() === trimmedOldName.toLowerCase()) {
          prod.collection = trimmedNewName;
          await saveProduct(prod);
        }
      }
    } catch (e) {
      console.error('Failed to cascade rename to products:', e);
    }
  }

  return collections;
}

/**
 * Delete a collection
 */
export async function deleteCollection(collectionIdOrName) {
  const collections = await getAllCollections();
  const updated = collections.filter(c => 
    c.id !== collectionIdOrName && c.name.toLowerCase() !== collectionIdOrName.toLowerCase()
  );

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('collections').delete().or(`id.eq.${collectionIdOrName},name.eq.${collectionIdOrName}`);
    } catch (e) {
      console.warn('Supabase collection delete error:', e);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return updated;
}
