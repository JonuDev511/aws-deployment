import { useEffect, useState } from 'react';
import StoryPage from './pages/StoryPage.jsx';
import ProcessPage from './pages/ProcessPage.jsx';
import { processSteps } from './pages/process-data.js';
import MobileNavigation from './components/MobileNavigation.jsx';
import Cart from './components/Cart.jsx';
import useCart from './useCart.js';
import './pages/pages.css';

const business = {
  email: 'singhjonu511@gmail.com',
  phone: '+91 70828 38565',
  whatsapp: '917082838565',
  location: 'Village Faridpur, Tehsil Farrukhnagar, District Gurugram (Gurgaon), Haryana',
};
const formatPrice = amount => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const gheePacks = [{ label: '250 g', fraction: 0.25 }, { label: '500 g', fraction: 0.5 }, { label: '1 kg', fraction: 1 }];
const oilPacks = [{ label: '1 litre', fraction: 1 }, { label: '5 litres', fraction: 5 }, { label: '10 litres', fraction: 10 }];
const products = [
  { id: 'cow', category: 'ghee', rate: 2700, unit: 'kg', packs: gheePacks, name: 'Cow Ghee', hindi: 'गाय का घी', subtitle: 'THE EVERYDAY FAVOURITE', image: '/images/mehchana-cow-ghee-front-cutout.png', description: 'A golden finishing touch for warm rotis, fragrant tadkas, and the meals you love.', detail: 'Choose from 250 g, 500 g, and 1 kg packs. A familiar companion for dal, khichdi, and everyday cooking.' },
  { id: 'buffalo', category: 'ghee', rate: 2000, unit: 'kg', packs: gheePacks, name: 'Buffalo Desi Ghee', hindi: 'भैंस का देसी घी', subtitle: 'FOR MOMENTS WORTH SHARING', image: '/images/mehchana-buffalo-product.png', description: 'Bring a little richness to homemade sweets, festive recipes, and family favourites.', detail: 'Available in 250 g, 500 g, and 1 kg packs. Try it in halwa, laddoos, or a meal made for a special occasion.' },
  { id: 'loni', category: 'butter', rate: 1900, unit: 'kg', packs: gheePacks, name: 'Loni Ghee', hindi: 'लोणी घी', subtitle: 'GHEE FROM COW BUTTER', image: '/images/mehchana-loni-product.png', description: 'Cow-butter ghee for a spoonful of comfort over hot rice, soft rotis, and much-loved recipes.', detail: 'Loni ghee, made from cow butter, is available in 250 g, 500 g, and 1 kg packs at ₹1,900 per kg.' },
  { id: 'mustard', category: 'oil', rate: 315, unit: 'litre', packs: oilPacks, name: 'Pure Mustard Oil', hindi: 'सरसों का तेल', subtitle: 'BOLD FLAVOUR, FAMILIAR ROOTS', image: '/images/mehchana-mustard-product.png', description: 'The distinctive mustard flavour that brings character to sabzis, pickles, and everyday cooking.', detail: 'Available in 1 litre (₹315), 5 litres (₹1,575), and 10 litres (₹3,150), priced at ₹315 per litre. Contact us for product details and current availability.' },
];
// Add a local MP4 path to videoSrc when each reel is ready to publish.
const reels = [
  { id: 'village', title: 'Village mornings', description: 'Milk collection in the village.', youtubeSrc: 'https://www.youtube-nocookie.com/embed/FhM5m9TsZ9E?playsinline=1&rel=0', sourceUrl: 'https://www.youtube.com/shorts/FhM5m9TsZ9E' },
  { id: 'bilona', title: 'The wooden bilona', description: 'Curd, butter, and a familiar rhythm.', poster: '/images/mehchana-process-churning-v2.jpg', videoSrc: '' },
  { id: 'ghee', title: 'Slowly, into ghee', description: 'A little patience in every batch.', youtubeSrc: 'https://www.youtube-nocookie.com/embed/aw13WUfFbgU?playsinline=1&rel=0', sourceUrl: 'https://www.youtube.com/shorts/aw13WUfFbgU' },
  { id: 'fresh-milk', title: 'Fresh milk', description: 'The first step in a familiar journey.', poster: '/images/mehchana-process-fresh-milk-v2.jpg', videoSrc: '' },
  { id: 'mustard-fields', title: 'Fields of gold', description: 'A glimpse of our Haryana roots.', poster: '/images/mehchana-mustard-fields-ai.png', videoSrc: '' },
  { id: 'filtering', title: 'The final pour', description: 'Warm ghee, carefully filtered.', youtubeSrc: 'https://www.youtube-nocookie.com/embed/lcd3CcNeAZo?playsinline=1&rel=0', sourceUrl: 'https://www.youtube.com/shorts/lcd3CcNeAZo' },
  { id: 'village-life', title: 'At home in Haryana', description: 'Everyday scenes from village life.', poster: '/images/mehchana-village-story-v3.jpg', videoSrc: '' },
  { id: 'cow-ghee', title: 'A golden spoonful', description: 'Cow ghee for everyday favourites.', poster: '/images/mehchana-cow-ghee-front.png', videoSrc: '' },
  { id: 'butter', title: 'The butter story', description: 'A closer look at loni ghee.', poster: '/images/mehchana-loni-product.png', videoSrc: '' },
  { id: 'mustard-oil', title: 'A familiar flavour', description: 'Mustard oil for the family kitchen.', poster: '/images/mehchana-mustard-product.png', videoSrc: '' },
];
const faqs = [
  ['What can I find at Mehchana?', 'Explore cow ghee, buffalo desi ghee, loni ghee made from cow butter, and pure mustard oil. Choose a product and pack size to see its price, then enquire directly with us.'],
  ['How can I enquire about an order?', 'Choose your ghee pack or mustard oil in 1, 5, or 10 litres and contact us by WhatsApp, phone, or the email enquiry form. Please confirm availability, payment, and delivery with Mehchana before placing your order.'],
  ['How should I store ghee?', 'Keep the jar tightly closed in a cool, dry place, away from direct sunlight. Always use a clean, dry spoon and follow the storage and best-before instructions on your product label.'],
];
const Arrow = () => <span aria-hidden="true">↗</span>;
const navigationLinks = [['Home', 'home', '/'], ['Our products', 'products', '/#products'], ['Our story', 'story', '/story'], ['Contact', 'contact', '/#contact']];
const readLocation = () => window.location.pathname + window.location.search + window.location.hash;

function App() {
  const [pageLocation, setPageLocation] = useState(readLocation);
  const pathname = new URL(pageLocation, window.location.origin).pathname.replace(/\/+$/, '') || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, addItem, setQuantity, notice: cartNotice, storageError } = useCart(products);
  const [activeSection, setActiveSection] = useState('home');
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const heroProducts = ['cow', 'buffalo', 'mustard', 'loni'].map(id => products.find(product => product.id === id));
  const heroProduct = heroProducts[heroProductIndex];
  const heroCtaLabel = heroProduct.category === 'oil' ? 'Shop mustard oil' : 'Shop desi ghee';

  useEffect(() => {
    const onLocationChange = () => { setPageLocation(readLocation()); setMenuOpen(false); };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => { window.removeEventListener('popstate', onLocationChange); window.removeEventListener('hashchange', onLocationChange); };
  }, []);

  useEffect(() => {
    document.title = pathname === '/story' ? 'Our Story | MEHCHANA' : pathname === '/process' ? 'Our Process | MEHCHANA' : 'MEHCHANA | Desi Ghee & Mustard Oil';
    const frame = requestAnimationFrame(() => {
      const hash = new URL(pageLocation, window.location.origin).hash.slice(1);
      const target = hash ? document.getElementById(hash) : null;
      if (target) { target.scrollIntoView({ behavior: 'instant' }); if (target.id === 'main') target.focus({ preventScroll: true }); }
      else { window.scrollTo({ top: 0, behavior: 'instant' }); document.getElementById('main')?.focus({ preventScroll: true }); }
    });
    return () => cancelAnimationFrame(frame);
  }, [pageLocation, pathname]);

  function handleInternalLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, window.location.origin);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (url.origin !== window.location.origin || !['/', '/story', '/process'].includes(path)) return;
    event.preventDefault();
    const nextLocation = url.pathname + url.search + url.hash;
    if (nextLocation !== readLocation()) window.history.pushState({}, '', nextLocation);
    if (nextLocation === pageLocation) {
      const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setPageLocation(nextLocation);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (pathname !== '/') return;
    const timer = window.setInterval(() => {
      setHeroProductIndex(index => (index + 1) % products.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [pathname]);
  useEffect(() => {
    if (pathname !== '/') { setActiveSection('story'); return; }
    let frame;
    const updateSection = () => {
      const threshold = (document.querySelector('.site-header')?.offsetHeight ?? 80) + 100;
      const current = [...navigationLinks].reverse().find(([, id]) => document.getElementById(id)?.getBoundingClientRect().top <= threshold);
      if (current) setActiveSection(current[1]);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateSection);
    };
    updateSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);
  const [filter, setFilter] = useState('all');
  const [chosenPacks, setChosenPacks] = useState({});
  const [enquirySummary, setEnquirySummary] = useState('');
  const [selected, setSelected] = useState('General enquiry');
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filteredProducts = products.filter(product => filter === 'all' || product.category === filter);
  const productGroups = [
    { id: 'ghee', label: 'Ghee and butter products', products: filteredProducts.filter(product => product.category !== 'oil') },
    { id: 'oil', label: 'Mustard oil', products: filteredProducts.filter(product => product.category === 'oil') },
  ];
  function submitEnquiry(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Mehchana — ${selected}`;
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterested in: ${selected}\n${enquirySummary ? `Selected pack: ${enquirySummary}\n` : ''}\n${data.get('message')}`;
    if (business.email) {
      window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('Your email app will open with your enquiry. Please send it there to contact Mehchana.');
    } else {
      const url = URL.createObjectURL(new Blob([`${subject}\n\n${body}`], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mehchana-enquiry.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Your enquiry has been saved as a text file. It has not been sent. Direct contact details will be available here once confirmed.');
    }
  }

  return (
    <div className="site-shell" onClick={handleInternalLink}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement">A little tradition. A lot of heart. <span>Discover the Mehchana way <a href="/story" aria-label="Discover our story">↗</a></span></div>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Mehchana home"><span className="brand-symbol" aria-hidden="true">✳</span><span>MEHCHANA<small>SHUDDH DESI GHEE</small></span></a>
        <div className="header-mobile-actions">
          <button className="header-bag" type="button" onClick={() => { setMenuOpen(false); setCartOpen(true); }} aria-label={`View cart, ${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'item' : 'items'}`} aria-haspopup="dialog" aria-controls="shopping-cart" aria-expanded={cartOpen}>
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 11h20l-1.5 17h-17L6 11Z" /><path d="M11 12V9a5 5 0 0 1 10 0v3" /></svg>
            {cart.totalQuantity > 0 && <span className="header-bag-count" aria-hidden="true">{cart.totalQuantity}</span>}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-navigation">{menuOpen ? 'Close −' : 'Menu +'}</button>
        </div>
        <nav id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
          {navigationLinks.map(([label, id, href]) => <a key={id} href={href} className={activeSection === id ? 'is-active' : ''} aria-current={activeSection === id ? (pathname === '/story' ? 'page' : 'location') : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-cta" href="/#products">Find your favourite <Arrow /></a>
      </header>
      <main id="main" tabIndex={-1}>
        {pathname === '/story' ? <StoryPage /> : pathname === '/process' ? <ProcessPage /> : <>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="tiny-star">✳</span> FROM OUR ROOTS. FOR YOUR TABLE.</p>
            <h1>From the land of Mehchana<br /><em>to your home.</em></h1>
            <p className="hero-description">A spoonful of ghee on a warm roti. The sizzle of mustard oil in a family-favourite recipe. At Mehchana, we celebrate the flavours that turn everyday cooking into something worth sharing.</p>
            <p className="hero-description hero-description-extra">Discover cow ghee, buffalo desi ghee, loni ghee made from cow butter, and pure mustard oil—familiar kitchen essentials for meals made with care.</p>
            <a className="button button-dark" href="#products">Find your kitchen favourites <Arrow /></a>
            <div className="hero-footnote"><span className="mini-line" /> DESI GHEE &amp; MUSTARD OIL · FROM MEHCHANA, WITH WARMTH</div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <img src={heroProduct.image} alt={`Mehchana ${heroProduct.name} in green and gold packaging`} fetchPriority="high" />
              <a className="mobile-hero-buy" href={`/#product-${heroProduct.id}`} onClick={() => { setFilter('all'); setExpanded(heroProduct.id); }} aria-label={`${heroCtaLabel} — ${heroProduct.name}`}>
                <span className="mobile-hero-buy-label">{heroCtaLabel}</span>
                <span className="mobile-hero-buy-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg></span>
              </a>
            </div>
            <div className="purity-badge" role="img" aria-label="Mehchana guarantee: 100% pure and organic">
              <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
                <defs><path id="purity-ring" d="M80,80 m-61,0 a61,61 0 1,1 122,0 a61,61 0 1,1 -122,0" /></defs>
                <circle cx="80" cy="80" r="77" className="purity-outer" />
                <circle cx="80" cy="80" r="49" className="purity-inner" />
                <text className="purity-ring-text" textLength="380" lengthAdjust="spacing"><textPath href="#purity-ring">MEHCHANA · PURE &amp; ORGANIC · GUARANTEE · </textPath></text>
                <path className="purity-leaf" d="M80 51c-14 0-20-7-21-17 13 0 21 5 21 17Zm0 0c0-15 7-23 20-24 0 14-7 24-20 24Zm0 0v8" />
                <text x="80" y="88" className="purity-percent">100%</text>
                <text x="80" y="108" className="purity-pure">PURE</text>
                <path className="purity-flourish" d="M65 119h30" />
              </svg>
            </div>
          </div>
        </section>
        <div className="values-ribbon" aria-label="Rooted in tradition. Made for everyday meals. Shared with love — the Mehchana way.">
          <div className="values-ribbon-track" aria-hidden="true">
            {[0, 1].map(copy => <div className="values-ribbon-copy" key={copy}>
              <span>ROOTED IN TRADITION</span><i>✳</i><span>MADE FOR EVERYDAY MEALS</span><i>✳</i><span>SHARED WITH LOVE</span><i>✳</i><span>THE MEHCHANA WAY</span><i>✳</i>
            </div>)}
          </div>
        </div>

        <section className="products section-wrap" id="products">
          <div className="section-heading"><div><p className="eyebrow">FOUR FAVOURITES. ONE FAMILIAR FEELING.</p><h2>Good food begins<br /><em>with good essentials.</em></h2></div><p>From the first tadka to the finishing spoonful, find a place for Mehchana in your everyday cooking.</p></div>
          <div className="product-toolbar"><div className="filters" aria-label="Filter products">{[['all', 'All products'], ['ghee', 'Desi ghee'], ['butter', 'Butter'], ['oil', 'Mustard oil']].map(([id, label]) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div><span>{filteredProducts.length} KITCHEN ESSENTIALS</span></div>
          {productGroups[0].products.length > 1 && <p className="product-swipe-hint">Swipe to see more ghee <span aria-hidden="true">→</span></p>}
          <div className="cart-feedback" role="status">{cartNotice && <><span>{cartNotice}</span><button type="button" onClick={() => setCartOpen(true)}>View cart ({cart.totalQuantity})</button></>}</div>
          {storageError && <p className="cart-save-warning" role="alert">{storageError}</p>}
          <div className="product-grid">
            {productGroups.filter(group => group.products.length > 0).map(group => <div className={`product-group product-group--${group.id}`} key={`${group.id}-${filter}`} role="region" aria-label={group.label}>
            {group.products.map(product => {
              const pack = product.packs[chosenPacks[product.id] ?? 0];
              return <article className={`product-card${filteredProducts.indexOf(product) % 2 === 1 ? ' product-card-alternate' : ''}`} id={`product-${product.id}`} key={product.id}>
                <div className="product-image product-photograph"><span className="product-image-label">{{ ghee: 'DESI GHEE', butter: 'BUTTER', oil: 'KITCHEN ESSENTIAL' }[product.category]}</span><img src={product.image} alt={`Mehchana ${product.name} packaging`} loading="lazy" /></div>
                <div className="product-content">
                  <p className="product-category">{product.subtitle}</p>
                  <h3>{product.name}</h3><p className="product-hindi-name" lang="hi">{product.hindi}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="pack-options" role="group" aria-label={`Choose pack size for ${product.name}`}>{product.packs.map((size, i) => <button key={size.label} aria-pressed={size.label === pack.label} className={size.label === pack.label ? 'active' : ''} onClick={() => setChosenPacks(previous => ({ ...previous, [product.id]: i }))}>{size.label}</button>)}</div>
                  <div className="product-price" aria-live="polite" aria-atomic="true"><strong>{formatPrice(product.rate * pack.fraction)}</strong><span>for {pack.label} · {formatPrice(product.rate)} / {product.unit}</span></div>
                  <button className="product-detail" aria-expanded={expanded === product.id} aria-controls={`detail-${product.id}`} onClick={() => setExpanded(expanded === product.id ? null : product.id)}>About this product <span>{expanded === product.id ? '−' : '+'}</span></button>
                  <p id={`detail-${product.id}`} className="expanded-detail" hidden={expanded !== product.id}>{product.detail}</p>
                  <button className="product-add-cart" type="button" aria-label={`Add ${product.name}, ${pack.label} to cart`} onClick={() => { addItem(product, chosenPacks[product.id] ?? 0); setMenuOpen(false); setCartOpen(true); }}>Add to cart <span aria-hidden="true">+</span></button>
                </div>
              </article>;
            })}
            </div>)}
          </div>
          <p className="product-note">Choose your pack to see the price. Delivery fee is free; shipping is ₹49 per order. Please confirm availability with us before ordering.</p>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-heading">
          <div className="process-heading">
            <p className="eyebrow">THE BILONA JOURNEY</p>
            <h2 id="process-heading">The care behind <em>every jar.</em></h2>
            <p className="process-intro">From fresh milk to golden ghee, a little care at every step.</p>
          </div>
          <p className="process-scroll-hint">Scroll to follow all five steps <span aria-hidden="true">→</span></p>
          <div className="process-scroll" role="region" aria-label="The five stages of the bilona journey" tabIndex={0}>
            <div className="process-sequence">
              <img className="process-panorama" src="/images/mehchana-bilona-process-compact.png" width="2172" height="724" alt="One continuous illustration of the five bilona stages: a cow and milk pail, curd churning, slow heating, cloth filtering, and a finished Mehchana ghee jar." loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        <section className="story-details" id="story" aria-labelledby="story-details-heading">
          <div className="story-details-heading"><p className="eyebrow">THE MEHCHANA WAY</p><h2 id="story-details-heading">Simple steps. Thoughtful care.</h2></div>
          <ol className="story-journey" role="list" aria-label="The five steps from village milk to finished ghee">
            {processSteps.map((step, index) => <li key={step.id}>
              <details className="story-journey-step">
                <summary className="story-step-heading"><span className="story-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3 className="story-step-title">{step.title}</h3><span className="story-step-toggle" aria-hidden="true">+</span></summary>
                <p>{step.detail}</p>
              </details>
            </li>)}
          </ol>
          <div className="story-closing">
            <span aria-hidden="true">✳</span>
            <p>From the rhythm of village life<br /><em>to the warmth of your family table.</em></p>
            <div className="story-closing-actions">
              <a href="/story">Read our story <Arrow /></a>
              <a href="/process">Explore our process <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <section className="reels-section" aria-labelledby="reels-heading">
          <div className="reels-inner">
            <div className="reels-heading">
              <div><p className="eyebrow">SHORT VIDEOS &amp; REELS</p><h2 id="reels-heading">See the Mehchana <em>moments.</em></h2></div>
              <p>Little glimpses of village life, the bilona method, and the care behind every jar.</p>
            </div>
            <div className="reels-toolbar">
              <p id="reels-scroll-hint">10 moments · Swipe or scroll to explore</p>
            </div>
            <div className="reels-grid" id="reels-track" tabIndex={0} role="region" aria-label="Short video cards" aria-describedby="reels-scroll-hint">
              {reels.map((reel, index) => <article className="reel-card" key={reel.id}>
                <div className="reel-frame">
                  {reel.youtubeSrc ? <iframe src={reel.youtubeSrc} title={`${reel.title} — YouTube video`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : reel.videoSrc ? <video controls playsInline preload="metadata" autoPlay={reel.autoPlay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches} muted={reel.autoPlay} loop={reel.autoPlay} poster={reel.poster} aria-label={reel.title}><source src={reel.videoSrc} type="video/mp4" /></video> : <><img src={reel.poster} alt="" loading="lazy" decoding="async" /><span className="reel-status">Video coming soon</span></>}
                </div>
                <div className="reel-caption"><span>{String(index + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')}</span><h3>{reel.title}</h3><p>{reel.description}</p>{reel.sourceUrl && <a className="reel-source-link" href={reel.sourceUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a>}</div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="faq section-wrap"><div><p className="eyebrow">A FEW THINGS YOU MIGHT WONDER</p><h2>Good questions.<br /><em>Simple answers.</em></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className="contact" id="contact"><div className="contact-inner"><div className="contact-copy"><p className="eyebrow">THERE’S ALWAYS ROOM AT OUR TABLE</p><h2>Let’s start<br /><em>a conversation.</em></h2><p>A question about our products? An order for your family? A shop you’d love to stock? Tell us what’s on your mind.</p><div className="contact-details">{business.email && <a href={`mailto:${business.email}`}>{business.email} ↗</a>}{business.phone && <a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`}>Call {business.phone} ↗</a>}{business.whatsapp && <a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Mehchana, I would like to enquire about your products.")}`} target="_blank" rel="noopener noreferrer">WhatsApp {business.phone} ↗</a>}{business.location && <p>{business.location}</p>}{!business.email && <p className="contact-availability">Direct contact details are being updated. You can prepare and save your enquiry using this form.</p>}</div><span className="contact-signature">Good food brings us together.</span></div>
          <form className="enquiry-form" onSubmit={submitEnquiry}><h3>A little hello goes a long way.</h3>{enquirySummary && <p className="enquiry-summary" role="status">Your selection: {enquirySummary}</p>}<div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label></div><label>I’m interested in<select value={selected} onChange={e => { setSelected(e.target.value); setEnquirySummary(''); }}><option>General enquiry</option>{products.map(product => <option key={product.id}>{product.name}</option>)}<option>Retail & wholesale</option></select></label><label>Your message<textarea name="message" rows="3" placeholder="Tell us a little about what you’re looking for…" required maxLength={3000} /></label><button className="button button-cream" type="submit">{business.email ? 'Prepare email enquiry' : 'Save my enquiry'} <Arrow /></button><p className="form-note">{business.email ? 'Opens your email app. Send the draft to complete your enquiry.' : 'Downloads a text file. Your details are not sent or stored online.'}</p><p className="form-status" role="status">{status}</p></form>
        </div></section>
        </>}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="wordmark" href="/"><span className="brand-symbol" aria-hidden="true">✳</span><span>MEHCHANA<small>SHUDDH DESI GHEE</small></span></a>
          <p>Familiar flavours.<br />Beautiful everyday moments.</p>
          <div><a href="/">Home</a><a href="/#products">Our products</a><a href="/story">Our story</a><a href="/process">Explore our process</a><a href="/#contact">Contact</a></div>
          <a className="back-top" href={pathname === '/' ? '/#home' : pathname}>Back to top ↑</a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Mehchana. All rights reserved.</span><span>WITH A LITTLE TRADITION &amp; A LOT OF HEART <span aria-hidden="true">✳</span></span></div>
      </footer>
      <MobileNavigation pathname={pathname} activeSection={activeSection} pageLocation={pageLocation} products={products} business={business} formatPrice={formatPrice} onSelectProduct={product => { setFilter('all'); setExpanded(product.id); }} />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setQuantity={setQuantity} formatPrice={formatPrice} storageError={storageError} notice={cartNotice} business={business} />
    </div>
  );
}

export default App;
