import { useEffect, useRef, useState } from 'react';
import { MAX_CART_QUANTITY } from '../cart.js';
import { checkoutMessage, createCheckoutDraft } from '../checkout.js';

function CartIcon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'bag' ? <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></> : name === 'remove' ? <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></> : name === 'close' ? <path d="m6 6 12 12M18 6 6 18" /> : name === 'check' ? <path d="m5 12 4 4L19 6" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>;
}

function downloadJson(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const emptyDetails = { name: '', phone: '', address: '', city: '', state: '', pincode: '', notes: '' };

export default function Cart({ open, onClose, cart, setQuantity, formatPrice, storageError, notice, business, showPrices = true }) {
  const dialog = useRef(null);
  const heading = useRef(null);
  const scrollArea = useRef(null);
  const [step, setStep] = useState('cart');
  const [details, setDetails] = useState(emptyDetails);
  const [checkoutError, setCheckoutError] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!open) { dialog.current.close(); return; }
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
    scrollArea.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, open]);

  function closeCart() {
    setStep('cart');
    setOrder(null);
    setCheckoutError('');
    onClose();
  }

  function reviewOrder(event) {
    event.preventDefault();
    try {
      setOrder(createCheckoutDraft(cart, details));
      setCheckoutError('');
      setStep('review');
    } catch (error) { setCheckoutError(error.message); }
  }

  const updateDetails = event => setDetails(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const isCart = step === 'cart';
  const isReview = step === 'review';
  const hasItems = cart.items.length > 0;
  const whatsappUrl = order ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(checkoutMessage(order, showPrices))}` : '';

  return <dialog id="shopping-cart" className="cart-dialog" ref={dialog} aria-labelledby="cart-heading" onClose={closeCart} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
    <div className="cart-content">
      <header className="cart-heading">
        <div className="cart-brand-mark"><CartIcon name="bag" /></div>
        <div className="cart-heading-copy"><p className="eyebrow">MEHCHANA · FROM OUR ROOTS</p><h2 id="cart-heading" ref={heading} tabIndex={-1}>{isCart ? 'Your kitchen favourites.' : isReview ? 'One last look.' : 'Where shall we deliver?'}</h2><p>{isCart ? `${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'pack' : 'packs'} selected for your table` : isReview ? 'Review your details before sending your order.' : 'A few details to bring your favourites home.'}</p></div>
        <button className="cart-close" type="button" onClick={() => dialog.current.close()} aria-label="Close cart"><CartIcon name="close" /></button>
      </header>

      {hasItems && <ol className="cart-steps" aria-label="Checkout progress">{[['cart', 'Your bag'], ['delivery', 'Delivery'], ['review', 'Review']].map(([id, label], index) => <li className={step === id ? 'is-current' : ''} aria-current={step === id ? 'step' : undefined} key={id}><span>{String(index + 1).padStart(2, '0')}</span>{label}</li>)}</ol>}

      <div className="cart-scroll" ref={scrollArea}>
        {isCart && <p className="cart-notice" role="status">{notice}</p>}
        {storageError && <p className="cart-storage-error" role="alert">{storageError}</p>}
        {!hasItems ? <div className="cart-empty"><span className="cart-empty-icon"><CartIcon name="bag" /></span><h3>A little room for something good.</h3><p>Your bag is empty. Explore our ghee and mustard oil, and choose a pack for your kitchen.</p><a className="cart-primary" href="/#products" onClick={() => dialog.current.close()}>Explore our products <CartIcon name="arrow" /></a></div> : isCart ? <>
          <ul className="cart-items">
            {cart.items.map(item => <li className="cart-item" key={`${item.productId}-${item.packIndex}`}>
              <div className="cart-item-image"><img src={item.image} alt="" width="88" height="104" /></div>
              <div className="cart-item-detail"><span className="cart-pack-label">{item.pack}</span><h3>{item.name}</h3>{showPrices && <p className="cart-unit-price">{formatPrice(item.unitPrice)} per pack</p>}</div>
              <button className="cart-remove" type="button" aria-label={`Remove ${item.name}, ${item.pack} from cart`} onClick={() => setQuantity(item, 0)}><CartIcon name="remove" /><span>Remove</span></button>
              <div className="cart-item-bottom"><div className="cart-quantity" role="group" aria-label={`Quantity for ${item.name}, ${item.pack}`}>
                <button type="button" disabled={item.quantity <= 1} aria-label={`Decrease ${item.name}, ${item.pack} quantity`} onClick={() => setQuantity(item, item.quantity - 1)}>−</button>
                <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                <button type="button" disabled={item.quantity >= MAX_CART_QUANTITY} aria-label={`Increase ${item.name}, ${item.pack} quantity`} onClick={() => setQuantity(item, item.quantity + 1)}>+</button>
              </div>{showPrices && <strong className="cart-line-total">{formatPrice(item.lineTotal)}</strong>}</div>
            </li>)}
          </ul>
          <div className="cart-bottom-links"><button type="button" onClick={() => dialog.current.close()}>← Continue shopping</button><button type="button" onClick={() => downloadJson(cart, 'mehchana-cart.json')}>Download cart ↓</button></div>
        </> : isReview && order ? <>
          <div className="checkout-review-intro"><span><CartIcon name="check" /></span><div><h3>Ready when you are.</h3><p>Send your order to Mehchana on WhatsApp to confirm availability, delivery, and payment.</p></div></div>
          <section className="checkout-review-card" aria-labelledby="delivery-review-heading"><div className="checkout-section-title"><h3 id="delivery-review-heading">Deliver to</h3><button type="button" onClick={() => setStep('delivery')}>Edit details</button></div><p><strong>{order.customer.name}</strong><br />{order.customer.phone}</p><address>{order.customer.address}<br />{order.customer.city}, {order.customer.state} · {order.customer.pincode}</address>{order.customer.notes && <p className="checkout-notes">Note: {order.customer.notes}</p>}</section>
          <section className="checkout-review-card" aria-labelledby="items-review-heading"><div className="checkout-section-title"><h3 id="items-review-heading">Your selection</h3><button type="button" onClick={() => setStep('cart')}>Edit bag</button></div><ul className="checkout-order-items">{order.cart.items.map(item => <li key={`${item.productId}-${item.packIndex}`}><span>{item.name}<small>{item.pack} · Quantity {item.quantity}</small></span>{showPrices && <strong>{formatPrice(item.lineTotal)}</strong>}</li>)}</ul></section>
          <button className="checkout-download" type="button" onClick={() => downloadJson(order, 'mehchana-order.json')}>Download order details ↓</button>
        </> : <>
          <button className="checkout-back" type="button" onClick={() => setStep('cart')}>← Back to your bag</button>
          <form id="cart-checkout-form" className="checkout-form" onSubmit={reviewOrder}>
            <p className="checkout-form-intro">Delivery details</p>
            <label>Full name<input name="name" autoComplete="name" required minLength={2} maxLength={100} value={details.name} onChange={updateDetails} placeholder="Your full name" /></label>
            <label>Mobile number<div className="checkout-phone"><span>+91</span><input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required pattern="[6-9][0-9]{9}" maxLength={10} title="Enter a 10-digit Indian mobile number" value={details.phone} onChange={updateDetails} placeholder="10-digit mobile number" /></div></label>
            <label>Delivery address<textarea name="address" autoComplete="street-address" required minLength={8} maxLength={300} rows={3} value={details.address} onChange={updateDetails} placeholder="House number, street, area and landmark" /></label>
            <div className="checkout-field-row"><label>City / town<input name="city" autoComplete="address-level2" required minLength={2} maxLength={100} value={details.city} onChange={updateDetails} placeholder="City or town" /></label><label>PIN code<input name="pincode" inputMode="numeric" autoComplete="postal-code" required pattern="[1-9][0-9]{5}" maxLength={6} title="Enter a valid 6-digit PIN code" value={details.pincode} onChange={updateDetails} placeholder="6-digit PIN" /></label></div>
            <label>State<input name="state" autoComplete="address-level1" required minLength={2} maxLength={100} value={details.state} onChange={updateDetails} placeholder="State" /></label>
            <label>Delivery notes <span className="checkout-optional">(optional)</span><textarea name="notes" rows={2} maxLength={500} value={details.notes} onChange={updateDetails} placeholder="Anything that will help us deliver?" /></label>
            {checkoutError && <p className="cart-storage-error" role="alert">{checkoutError}</p>}
          </form>
        </>}
      </div>

      {hasItems && <footer className="cart-footer">
        <div className="cart-summary">{showPrices && <p className="cart-subtotal"><span>Items subtotal</span><strong>{formatPrice(cart.subtotal)}</strong></p>}<p className="cart-delivery"><span>Delivery</span><span>Confirmed with your order</span></p></div>
        {isCart ? <button className="cart-primary" type="button" onClick={() => setStep('delivery')}>Continue to checkout <CartIcon name="arrow" /></button> : isReview ? <a className="cart-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Send order on WhatsApp <CartIcon name="arrow" /></a> : <button className="cart-primary" type="submit" form="cart-checkout-form">Review your order <CartIcon name="arrow" /></button>}
        <p className="cart-footer-note">{isReview ? 'Send the message in WhatsApp to request your order. Payment is confirmed directly with Mehchana.' : 'Made with care. Packed for your everyday.'}</p>
      </footer>}
    </div>
  </dialog>;
}
