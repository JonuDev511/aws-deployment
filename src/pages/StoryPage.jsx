export default function StoryPage() {
  return (
    <div className="story-page">
      <div className="story-showcase">
        <section className="story-mural story-page-hero" aria-labelledby="story-page-heading">
          <picture>
            <source media="(max-width: 680px)" srcSet="/images/mehchana-village-milk-ai.png" />
            <img src="/images/mehchana-village-story-v3.jpg" width="2172" height="724" alt="AI-created village dairy scene with farmers, a cow and calf, and milk" fetchPriority="high" />
          </picture>
          <div className="story-mural-copy">
            <h1 id="story-page-heading">From our village<br /><em>to your kitchen.</em></h1>
          </div>
        </section>
      </div>

      <section className="editorial-section story-origin-section" aria-labelledby="story-origin-heading">
        <div className="editorial-copy">
          <p className="section-kicker">WHERE IT BEGAN</p>
          <h2 id="story-origin-heading">Made the way it’s<br /><em>made at home.</em></h2>
          <p>Our roots are in Faridpur, Haryana. Village mornings, dairy courtyards, and golden mustard fields are part of the landscape that inspires Mehchana.</p>
          <p>For us, the story of ghee follows a familiar rhythm: milk is set as curd, curd is churned with a wooden bilona, and the butter is slowly heated into ghee. Simple ingredients, with care at every step.</p>
          <p>We bring that connection to everyday kitchens through desi ghee and mustard oil—familiar companions for the food you love to make and share.</p>
          <a className="outline-link" href="/process">Explore our process <span aria-hidden="true">→</span></a>
        </div>
        <figure className="keepsake-photo">
          <img src="/images/mehchana-process-churning-v2.jpg" width="1254" height="1254" alt="A woman churning curd with a wooden bilona in an earthen pot" loading="lazy" decoding="async" />
          <figcaption>Curd, a wooden bilona, and a little patience.</figcaption>
        </figure>
      </section>

      <section className="story-roots-note" aria-label="Our village roots">
        <span aria-hidden="true">✳</span>
        <div><p className="eyebrow">FARIDPUR · FARRUKHNAGAR · HARYANA</p><h2>Good food has roots.<br /><em>Ours are in the village.</em></h2></div>
        <a className="outline-link" href="/#products">Find your kitchen favourites <span aria-hidden="true">↗</span></a>
      </section>
    </div>
  );
}
