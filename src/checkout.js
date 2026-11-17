export function createCheckoutDraft(cart, details) {
  if (!cart.items.length) throw new Error('Add an item to your cart before checking out.');
  const customer = Object.fromEntries(['name', 'phone', 'address', 'city', 'state', 'pincode', 'notes'].map(key => [key, String(details[key] ?? '').trim()]));
  if (customer.name.length < 2 || customer.name.length > 100) throw new Error('Please enter your full name.');
  if (!/^[6-9]\d{9}$/.test(customer.phone)) throw new Error('Please enter a valid 10-digit Indian mobile number.');
  if (customer.address.length < 8 || customer.address.length > 300) throw new Error('Please enter your complete delivery address.');
  if (customer.city.length < 2 || customer.city.length > 100 || customer.state.length < 2 || customer.state.length > 100) throw new Error('Please enter your city and state.');
  if (!/^[1-9]\d{5}$/.test(customer.pincode)) throw new Error('Please enter a valid 6-digit PIN code.');
  if (customer.notes.length > 500) throw new Error('Please keep delivery notes under 500 characters.');
  return { version: 1, status: 'draft', customer, cart: structuredClone(cart) };
}

export function checkoutMessage(order, showPrices = true) {
  const price = amount => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const { customer, cart } = order;
  return [
    'Hello Mehchana, I would like to place an order:', '',
    ...cart.items.map(item => `${item.name} · ${item.pack} × ${item.quantity}${showPrices ? ` — ${price(item.lineTotal)}` : ''}`),
    ...(showPrices ? ['', `Items subtotal: ${price(cart.subtotal)}`] : []),
    'Please confirm availability, delivery charges, and payment details.', '',
    `Name: ${customer.name}`, `Mobile: ${customer.phone}`,
    `Delivery address: ${customer.address}, ${customer.city}, ${customer.state} — ${customer.pincode}`,
    ...(customer.notes ? [`Delivery notes: ${customer.notes}`] : []),
  ].join('\n');
}
