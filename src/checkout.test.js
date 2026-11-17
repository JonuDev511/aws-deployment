import test from 'node:test';
import assert from 'node:assert/strict';
import { createCheckoutDraft, checkoutMessage } from './checkout.js';
import { changeCartQuantity, createCartData } from './cart.js';

const products = [
  { id: 'cow', name: 'Cow Ghee', rate: 2700, image: '/cow.png', packs: [{ label: '250 g', fraction: 0.25 }] },
  { id: 'mustard', name: 'Pure Mustard Oil', rate: 315, image: '/oil.png', packs: [{ label: '5 litres', fraction: 5 }] },
];
const items = [{ productId: 'cow', packIndex: 0, quantity: 2 }, { productId: 'mustard', packIndex: 0, quantity: 1 }];
const details = { name: 'Test Customer', phone: '9876543210', address: '12 Test Street, Faridpur', city: 'Gurugram', state: 'Haryana', pincode: '122506', notes: '' };

// The review must reflect the current cart after editing or removing packs.
test('removing one product removes its amount from the subtotal and checkout message', () => {
  const updated = changeCartQuantity(items, 'cow', 0, 0);
  const cart = createCartData(updated, products);
  assert.equal(cart.subtotal, 1575);
  assert.equal(cart.totalQuantity, 1);
  const message = checkoutMessage(createCheckoutDraft(cart, details));
  assert.ok(!message.includes('Cow Ghee'));
  assert.ok(message.includes('Pure Mustard Oil · 5 litres × 1'));
  assert.ok(message.includes('₹1,575'));
});

test('changing quantities updates the checkout subtotal', () => {
  const updated = changeCartQuantity(items, 'cow', 0, 3);
  const draft = createCheckoutDraft(createCartData(updated, products), details);
  assert.equal(draft.cart.subtotal, 3600);
  assert.equal(draft.cart.totalQuantity, 4);
});

test('an empty cart has zero total and cannot proceed to checkout', () => {
  const empty = createCartData([], products);
  assert.equal(empty.subtotal, 0);
  assert.throws(() => createCheckoutDraft(empty, details), /Add an item/);
});

test('checkout trims customer details and snapshots the cart without claiming an order was placed', () => {
  const cart = createCartData(items, products);
  const draft = createCheckoutDraft(cart, { ...details, name: '  Test Customer  ' });
  assert.equal(draft.customer.name, 'Test Customer');
  assert.equal(draft.status, 'draft');
  cart.items[0].quantity = 99;
  assert.equal(draft.cart.items[0].quantity, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(draft)), draft);
});

test('checkout rejects missing and invalid delivery details', () => {
  const cart = createCartData(items, products);
  for (const patch of [{ name: '  ' }, { phone: '123' }, { phone: '1234567890' }, { address: '  ' }, { city: '' }, { state: '' }, { pincode: '012345' }, { pincode: '12250x' }, { notes: 'x'.repeat(501) }]) {
    assert.throws(() => createCheckoutDraft(cart, { ...details, ...patch }));
  }
});

test('WhatsApp draft includes the complete selection and delivery details without promising free delivery', () => {
  const draft = createCheckoutDraft(createCartData(items, products), { ...details, notes: 'Call before delivery' });
  const message = checkoutMessage(draft);
  assert.ok(message.includes('Cow Ghee · 250 g × 2 — ₹1,350'));
  assert.ok(message.includes('Items subtotal: ₹2,925'));
  assert.ok(message.includes(details.phone));
  assert.ok(message.includes(details.address));
  assert.ok(message.includes(details.pincode));
  assert.ok(message.includes('Call before delivery'));
  assert.ok(message.includes('Please confirm availability, delivery charges, and payment details.'));
  assert.ok(!message.includes('Free'));
});
