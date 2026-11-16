import ProcessScene from './ProcessScene.jsx';
import { processSteps } from './process-data.js';

export default function ProcessPage() {
  return (
    <div className="process-page">
      <section className="method-hero" aria-labelledby="method-heading">
        <div className="method-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/story">Our story</a><span aria-hidden="true">›</span><span aria-current="page">Our process</span></nav>
          <div className="method-hero-grid">
            <div className="method-hero-copy">
              <p className="method-label">THE BILONA METHOD</p>
              <h1 id="method-heading">Explore<br /><em>our process.</em></h1>
              <p>A wooden churner. Milk set as curd. Butter, slowly heated into ghee. Follow the familiar steps behind every spoonful.</p>
              <a className="method-jump" href="#making-steps">Follow the five steps <span aria-hidden="true">↓</span></a>
            </div>
            <ProcessScene stage={1} className="method-hero-art" />
          </div>
        </div>
      </section>

      <section className="editorial-section feed-section" aria-labelledby="feed-heading">
        <div className="editorial-copy">
          <p className="section-kicker">BEFORE THE FIRST CHURN</p>
          <h2 id="feed-heading">Care begins<br /><em>in the courtyard.</em></h2>
          <p>Before milk becomes curd, there is the everyday work of caring for cattle. Alongside fodder and water, these are familiar ingredients in village dairy feeding.</p>
          <dl className="feed-ingredients">
            <div><dt>Khal <span lang="hi">खल</span></dt><dd>Oilseed cake—the material left after oil is extracted from seeds. Different oilseed cakes are used as ingredients in cattle feed.</dd></div>
            <div><dt>Binola <span lang="hi">बिनौला</span></dt><dd>Cottonseed, a familiar name in the village dairy. Cottonseed and cottonseed cake are distinct ingredients used in cattle feeding.</dd></div>
            <div><dt>Chana chhilka <span lang="hi">चना छिलका</span></dt><dd>The outer husk of gram, or chickpeas. Gram husk and gram milling by-products are also used as feed ingredients.</dd></div>
          </dl>
          <p className="feed-source">Ingredient references: <a href="https://www.nddb.coop/sites/default/files/Quality-Control-Manual-for-CFP.pdf" target="_blank" rel="noopener noreferrer">NDDB</a> · <a href="https://agritech.tnau.ac.in/expert_system/cattlebuffalo/faqs.html" target="_blank" rel="noopener noreferrer">TNAU</a></p>
        </div>
        <figure className="keepsake-photo feed-photo">
          <img src="/images/mehchana-process-fresh-milk-v2.jpg" width="1254" height="1254" alt="A white dairy cow under a neem tree in a village courtyard" loading="lazy" decoding="async" />
          <figcaption>The story starts with everyday care.</figcaption>
        </figure>
      </section>

      <section className="making-timeline" id="making-steps" aria-labelledby="making-heading">
        <div className="making-intro"><p className="eyebrow">THE BILONA JOURNEY</p><h2 id="making-heading">The care behind <em>every jar.</em></h2><p>From fresh milk to golden ghee, a little care at every step.</p></div>
        <div className="making-steps-wrap">
          <svg className="making-wire" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M60 0 C0 80 120 120 60 200 C0 280 120 320 60 400 C0 480 120 520 60 600 C0 680 120 720 60 800 C0 880 120 920 60 1000" /></svg>
          <ol className="making-steps" role="list">
            {processSteps.map((step, index) => <li className="making-step" key={step.id}>
              <span className="making-node" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="making-step-copy"><p className="eyebrow">STEP {String(index + 1).padStart(2, '0')}</p><h3>{step.title}</h3><p>{step.detail}</p><span className="making-step-note">{step.note}</span></div>
              <ProcessScene stage={index} className="making-step-art" />
            </li>)}
          </ol>
        </div>
        <div className="making-finish"><span aria-hidden="true">✳</span><h2>From our roots.<br /><em>For your table.</em></h2><a className="outline-link" href="/#products">Explore our ghee <span aria-hidden="true">↗</span></a></div>
      </section>
    </div>
  );
}
