import { supabase, isSupabaseConfigured } from './supabaseClient';

const ORDERS_KEY = 'faneelo_orders_v1';

// Initial sample order if none exists, so admin has a preview of the UI on first load
const SAMPLE_ORDER = {
  orderId: 'FAN-849201',
  date: new Date().toLocaleDateString('en-GB'),
  timestamp: new Date().toISOString(),
  status: 'Pending Confirmation',
  items: [
    {
      name: 'Luxury Lilly Corner Sofa',
      variant: 'Corner Sofa',
      color: 'Charcoal Plush Velvet',
      fabric: 'Plush Velvet',
      facing: 'Left Hand Facing (LHF)',
      price: 650,
      quantity: 1,
      image: '/products/ashton/l-shape/Living_room_with_sofa_and_2K_20261018010528.jpg'
    }
  ],
  totalAmount: 650,
  customer: {
    fullName: 'Oliver Davies',
    phone: '+44 7911 123456',
    email: 'oliver.davies@example.co.uk',
    address: '14 High Street, Apt 3B',
    city: 'Birmingham',
    postcode: 'B1 2AA',
    deliveryNotes: 'Call 30 mins before arrival, please.'
  }
};

export async function getAllOrders() {
  let localOrders = [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      localOrders = JSON.parse(raw);
    } else {
      // Seed initial sample order
      localOrders = [SAMPLE_ORDER];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
    }
  } catch (e) {
    console.error('Failed to parse local orders:', e);
    localOrders = [SAMPLE_ORDER];
  }

  // If Supabase is connected, optionally merge or fetch remote orders
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Return merged or cloud orders
        return data.map(o => ({
          orderId: o.order_id || o.id,
          date: o.date || new Date(o.created_at).toLocaleDateString('en-GB'),
          timestamp: o.created_at || o.timestamp,
          status: o.status || 'Pending Confirmation',
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
          totalAmount: o.total_amount || o.totalAmount,
          customer: typeof o.customer === 'string' ? JSON.parse(o.customer) : o.customer
        }));
      }
    } catch {
      // Supabase table might not exist yet; fall back silently to localStorage
    }
  }

  return localOrders;
}

export async function saveOrder(order) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [order, ...existing.filter(o => o.orderId !== order.orderId)];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // Try saving to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').insert([{
          order_id: order.orderId,
          date: order.date,
          status: order.status || 'Pending Confirmation',
          items: order.items,
          total_amount: order.totalAmount,
          customer: order.customer,
          created_at: order.timestamp || new Date().toISOString()
        }]);
      } catch {
        // Table may not exist yet, local copy is primary
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to save order:', err);
    return false;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = existing.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('order_id', orderId);
      } catch {
        // Ignore
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to update order status:', err);
    return false;
  }
}

export async function deleteOrder(orderId) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = existing.filter(o => o.orderId !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .delete()
          .eq('order_id', orderId);
      } catch {
        // Ignore
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to delete order:', err);
    return false;
  }
}

export function exportOrdersToCSV(orders) {
  if (!orders || orders.length === 0) return;

  const headers = ['Order Ref', 'Date', 'Status', 'Customer Name', 'Phone', 'Postcode', 'Address', 'Total (£)', 'Items Summary'];
  const rows = orders.map(o => {
    const itemsSummary = (o.items || [])
      .map(it => `${it.name} (${it.variant || ''}) x${it.quantity}`)
      .join(' | ');

    return [
      `"${o.orderId || ''}"`,
      `"${o.date || ''}"`,
      `"${o.status || 'Pending'}"`,
      `"${o.customer?.fullName || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.postcode || ''}"`,
      `"${(o.customer?.address || '') + ', ' + (o.customer?.city || '')}"`,
      `"£${o.totalAmount || 0}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `faneelo_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
