import { useEffect, useRef, useState } from 'react';
import './mobile-navigation.css';

function Icon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z" /></>,
    shop: <><path d="M4 10v11h16V10M3 10l2-7h14l2 7M9 21v-7h6v7" /><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
    search: <><circle cx="10.5" cy="10.5" r="7.5" /><path d="m16 16 5 5" /></>,
    contact: <><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2Z" /></>,
    whatsapp: <><path d="M20.5 11.5a8.8 8.8 0 0 1-13 7.8L3 21l1.5-4.4A8.8 8.8 0 1 1 20.5 11.5Z" /><path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 1c0 2-1 3-3 2-4-1-7-4-8-7 0-2 1-3 2-3Z" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function MobileNavigation({ pathname, activeSection, pageLocation, products, business, formatPrice, onSelectProduct }) {
  const dialog = useRef(null);
  const searchInput = useRef(null);
  const firstResult = useRef(null);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const terms = query.toLocaleLowerCase('en-IN').trim().split(/\s+/).filter(Boolean);
  const matches = products.filter(product => {
    const text = `${product.name} ${product.hindi} ${product.subtitle} ${product.description}`.toLocaleLowerCase('en-IN');
    return terms.every(term => text.includes(term));
  });
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Hello Mehchana, I would like to enquire about your products.')}`;

  useEffect(() => { dialog.current?.close(); }, [pageLocation]);
  useEffect(() => {
    if (!searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [searchOpen]);

  function openSearch() {
    dialog.current.showModal();
    setSearchOpen(true);
    searchInput.current.focus();
  }
  const isActive = id => !searchOpen && pathname === '/' && activeSection === id;
  const itemClass = active => `mobile-nav-item${active ? ' is-active' : ''}`;

  return <>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <a className={itemClass(isActive('home'))} href="/" aria-current={isActive('home') ? 'page' : undefined}><Icon name="home" /><span>Home</span></a>
      <a className={itemClass(isActive('products'))} href="/#products" aria-current={isActive('products') ? 'location' : undefined}><Icon name="shop" /><span>Shop</span></a>
      <button className={itemClass(searchOpen)} type="button" onClick={openSearch} aria-haspopup="dialog" aria-controls="mobile-product-search" aria-expanded={searchOpen}><Icon name="search" /><span>Search</span></button>
      <a className={itemClass(isActive('contact'))} href="/#contact" aria-current={isActive('contact') ? 'location' : undefined}><Icon name="contact" /><span>Contact</span></a>
      <a className="mobile-nav-item mobile-nav-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Enquire with Mehchana on WhatsApp"><Icon name="whatsapp" /><span>WhatsApp</span></a>
    </nav>

    <dialog id="mobile-product-search" className="mobile-search-dialog" ref={dialog} aria-labelledby="mobile-search-heading" onClose={() => setSearchOpen(false)} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); dialog.current.close(); } }} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="mobile-search-content">
        <div className="mobile-search-header"><h2 id="mobile-search-heading">Search our products</h2><button className="mobile-search-close" type="button" onClick={() => dialog.current.close()} aria-label="Close product search"><Icon name="close" /></button></div>
        <form className="mobile-search-form" onSubmit={event => { event.preventDefault(); firstResult.current?.click(); }}>
          <label htmlFor="mobile-product-query">Product name or ingredient</label>
          <input className="mobile-search-input" id="mobile-product-query" type="search" ref={searchInput} value={query} onChange={event => setQuery(event.target.value)} placeholder="Try cow ghee or mustard oil" maxLength={100} autoComplete="off" enterKeyHint="search" />
        </form>
        <p className="mobile-search-count" role="status">{matches.length} {matches.length === 1 ? 'product' : 'products'} found</p>
        <ul className="mobile-search-results">
          {matches.map((product, index) => <li key={product.id}><a ref={index === 0 ? firstResult : null} href={`/#product-${product.id}`} onClick={() => { onSelectProduct(product); dialog.current.close(); }}>
            <img src={product.image} alt="" width="64" height="72" />
            <span><strong>{product.name}</strong><small>From {formatPrice(product.rate * product.packs[0].fraction)} · {product.packs[0].label}</small></span><span className="mobile-search-arrow" aria-hidden="true">↗</span>
          </a></li>)}
        </ul>
        {matches.length === 0 && <div className="mobile-search-empty"><p>No products match “{query}”. Try “ghee”, “butter”, or “oil”.</p><a href="/#contact" onClick={() => dialog.current.close()}>Ask us about a product <span aria-hidden="true">→</span></a></div>}
      </div>
    </dialog>
  </>;
}
