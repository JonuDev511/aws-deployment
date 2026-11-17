import test from 'node:test';
import assert from 'node:assert/strict';
import { CART_STORAGE_KEY, MAX_CART_QUANTITY, changeCartQuantity, createCartData, readSavedCart } from './cart.js';

const products = [
  { id: 'cow', name: 'Cow Ghee', rate: 2700, image: '/cow.png', packs: [{ label: '250 g', fraction: 0.25 }, { label: '1 kg', fraction: 1 }] },
  { id: 'mustard', name: 'Pure Mustard Oil', rate: 315, image: '/mustard.png', packs: [{ label: '1 litre', fraction: 1 }, { label: '5 litres', fraction: 5 }] },
];
const storageWith = value => ({ getItem(key) { assert.equal(key, CART_STORAGE_KEY); return value; } });

test('repeated additions merge the same pack while different packs stay separate', () => {
  let items = changeCartQuantity([], 'cow', 0, 1);
  const original = items;
  items = changeCartQuantity(items, 'cow', 0, 2);
  items = changeCartQuantity(items, 'cow', 1, 1);
  assert.equal(items.length, 2);
  assert.equal(items[0].quantity, 2);
  assert.equal(original[0].quantity, 1);
});

test('cart JSON contains selected pack prices, quantities and accurate totals', () => {
  const items = [{ productId: 'cow', packIndex: 0, quantity: 2 }, { productId: 'mustard', packIndex: 1, quantity: 1 }];
  const cart = createCartData(items, products);
  assert.equal(cart.items[0].pack, '250 g');
  assert.equal(cart.items[0].unitPrice, 675);
  assert.equal(cart.items[0].lineTotal, 1350);
  assert.equal(cart.items[1].unitPrice, 1575);
  assert.equal(cart.totalQuantity, 3);
  assert.equal(cart.subtotal, 2925);
  assert.equal(cart.deliveryFee, 0);
  assert.equal(cart.shippingCharge, 49);
  assert.equal(cart.total, 2974);
  assert.equal(cart.currency, 'INR');
  assert.deepEqual(readSavedCart(products, storageWith(JSON.stringify(cart))).items, items);
});

test('removing the last item persists an empty cart', () => {
  const items = changeCartQuantity([{ productId: 'cow', packIndex: 0, quantity: 1 }], 'cow', 0, 0);
  const cart = createCartData(items, products);
  assert.equal(cart.subtotal, 0);
  assert.equal(cart.shippingCharge, 0);
  assert.equal(cart.total, 0);
  assert.equal(cart.totalQuantity, 0);
  assert.deepEqual(readSavedCart(products, storageWith(JSON.stringify(cart))).items, []);
});

test('saved prices and names are refreshed from the current catalogue', () => {
  const saved = { version: 1, items: [{ productId: 'cow', packIndex: 0, quantity: 1, unitPrice: 1, name: 'Old name' }] };
  const { items } = readSavedCart(products, storageWith(JSON.stringify(saved)));
  const cart = createCartData(items, products);
  assert.equal(cart.items[0].name, 'Cow Ghee');
  assert.equal(cart.items[0].unitPrice, 675);
  assert.equal(cart.shippingCharge, 49);
  assert.equal(cart.total, 724);
});

test('invalid saved lines are discarded and duplicate packs merge within the limit', () => {
  const saved = { version: 1, items: [null, { productId: 'missing', packIndex: 0, quantity: 1 },
    { productId: 'cow', packIndex: -1, quantity: 1 }, { productId: 'cow', packIndex: 9, quantity: 1 },
    { productId: 'cow', packIndex: 0, quantity: -1 }, { productId: 'cow', packIndex: 0, quantity: '2' },
    { productId: 'cow', packIndex: 0, quantity: 1.5 }, { productId: 'cow', packIndex: 0, quantity: 100 },
    { productId: 'cow', packIndex: 0, quantity: 50 }, { productId: 'cow', packIndex: 0, quantity: 60 }] };
  assert.deepEqual(readSavedCart(products, storageWith(JSON.stringify(saved))).items,
    [{ productId: 'cow', packIndex: 0, quantity: MAX_CART_QUANTITY }]);
});

test('missing storage starts empty; corrupt or unavailable storage recovers with a message', () => {
  assert.deepEqual(readSavedCart(products, storageWith(null)), { items: [], error: '' });
  for (const value of ['{broken', 'null', '[]', '{"version":2,"items":[]}']) {
    const result = readSavedCart(products, storageWith(value));
    assert.deepEqual(result.items, []);
    assert.ok(result.error);
  }
  const result = readSavedCart(products, { getItem() { throw new Error('Storage denied'); } });
  assert.deepEqual(result.items, []);
  assert.ok(result.error);
});

test('quantity updates reject invalid values without changing the cart', () => {
  const items = [{ productId: 'cow', packIndex: 0, quantity: 1 }];
  for (const quantity of [-1, 100, 1.5, NaN, Infinity, '2']) {
    assert.equal(changeCartQuantity(items, 'cow', 0, quantity), items);
  }
});
