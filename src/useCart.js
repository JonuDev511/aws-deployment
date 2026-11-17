import { useEffect, useState } from 'react';
import { CART_STORAGE_KEY, MAX_CART_QUANTITY, changeCartQuantity, createCartData, readSavedCart } from './cart.js';

export default function useCart(products) {
  const [initial] = useState(() => {
    try { return readSavedCart(products, window.localStorage); }
    catch { return { items: [], error: 'Browser storage is unavailable. Your cart will only be kept while this page is open.' }; }
  });
  const [items, setItems] = useState(initial.items);
  const [storageError, setStorageError] = useState('');
  const [notice, setNotice] = useState(initial.error);
  const cart = createCartData(items, products);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(createCartData(items, products)));
      setStorageError('');
    } catch {
      setStorageError('Your cart could not be saved in this browser. Keep this page open or download your cart to keep a copy.');
    }
  }, [items, products]);

  function addItem(product, packIndex) {
    const existing = items.find(item => item.productId === product.id && item.packIndex === packIndex);
    if (existing?.quantity >= MAX_CART_QUANTITY) {
      setNotice(`You can add up to ${MAX_CART_QUANTITY} of each pack.`);
      return;
    }
    setItems(previous => {
      const line = previous.find(item => item.productId === product.id && item.packIndex === packIndex);
      return changeCartQuantity(previous, product.id, packIndex, Math.min(MAX_CART_QUANTITY, (line?.quantity ?? 0) + 1));
    });
    setNotice(`${product.name} · ${product.packs[packIndex].label} added to your cart.`);
  }

  function setQuantity(item, quantity) {
    setItems(previous => changeCartQuantity(previous, item.productId, item.packIndex, quantity));
    setNotice(quantity === 0 ? `${item.name} · ${item.pack} removed from your cart.` : 'Cart quantity updated.');
  }

  return { cart, addItem, setQuantity, notice, storageError };
}
