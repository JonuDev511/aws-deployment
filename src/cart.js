export const CART_STORAGE_KEY = 'mehchana-cart';
export const MAX_CART_QUANTITY = 99;
export const SHIPPING_CHARGE = 49;

export function changeCartQuantity(items, productId, packIndex, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > MAX_CART_QUANTITY) return items;
  const existing = items.find(item => item.productId === productId && item.packIndex === packIndex);
  if (quantity === 0) return items.filter(item => item !== existing);
  if (!existing) return [...items, { productId, packIndex, quantity }];
  return items.map(item => item === existing ? { ...item, quantity } : item);
}

export function createCartData(items, products) {
  const lines = items.map(item => {
    const product = products.find(product => product.id === item.productId);
    const pack = product.packs[item.packIndex];
    const unitPrice = Math.round(product.rate * pack.fraction * 100) / 100;
    return { ...item, name: product.name, pack: pack.label, image: product.image, unitPrice, lineTotal: Math.round(unitPrice * item.quantity * 100) / 100 };
  });
  const subtotal = Math.round(lines.reduce((total, item) => total + item.lineTotal, 0) * 100) / 100;
  const shippingCharge = lines.length > 0 ? SHIPPING_CHARGE : 0;
  return {
    version: 1,
    currency: 'INR',
    items: lines,
    totalQuantity: lines.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    deliveryFee: 0,
    shippingCharge,
    total: Math.round((subtotal + shippingCharge) * 100) / 100,
  };
}

export function readSavedCart(products, storage) {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [], error: '' };
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !Array.isArray(saved.items)) throw new Error('Invalid cart');
    let items = [];
    for (const item of saved.items) {
      if (!item || typeof item !== 'object') continue;
      const product = products.find(product => product.id === item.productId);
      if (!product || !Number.isInteger(item.packIndex) || !product.packs[item.packIndex]
        || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY) continue;
      const existing = items.find(line => line.productId === item.productId && line.packIndex === item.packIndex);
      items = changeCartQuantity(items, item.productId, item.packIndex, Math.min(MAX_CART_QUANTITY, (existing?.quantity ?? 0) + item.quantity));
    }
    return { items, error: '' };
  } catch {
    return { items: [], error: 'Your saved cart could not be loaded. You can start a new cart.' };
  }
}
