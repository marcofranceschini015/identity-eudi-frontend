import { Link } from 'react-router-dom';

const products = [
  {
    id: 'bank-loan',
    eyebrow: 'Banking',
    title: 'Bank loan',
    description:
      'Get a personal loan offer in minutes. Verify your identity with your EU Digital Identity Wallet — no documents, no branch visits.',
    bullets: ['Decision in 2 minutes', 'From 3.9% APR', 'No paperwork'],
    cta: 'Start application',
    to: '/bank-loan',
    accent: 'accent-blue',
    illustration: (
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <defs>
          <linearGradient id="card-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a4d8c" />
            <stop offset="100%" stopColor="#1e88e5" />
          </linearGradient>
        </defs>
        <rect x="20" y="30" width="160" height="90" rx="14" fill="url(#card-grad)" />
        <rect x="32" y="48" width="46" height="14" rx="3" fill="#ffd54f" />
        <rect x="32" y="86" width="120" height="6" rx="3" fill="rgba(255,255,255,0.55)" />
        <rect x="32" y="98" width="80" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
        <circle cx="152" cy="58" r="10" fill="rgba(255,255,255,0.85)" />
        <circle cx="166" cy="58" r="10" fill="rgba(255,255,255,0.55)" />
      </svg>
    ),
  },
  {
    id: 'rent-a-car',
    eyebrow: 'Mobility',
    title: 'Rent a car',
    description:
      'Pick up the keys without queueing. Your driver license is verified instantly through your wallet — across 25,000+ stations in Europe.',
    bullets: ['Skip the counter', '25,000+ stations', 'Free cancellation'],
    cta: 'Find a car',
    to: '/rent-a-car',
    accent: 'accent-amber',
    illustration: (
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <defs>
          <linearGradient id="car-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x="14" y="92" width="172" height="10" rx="5" fill="#cbd5e1" />
        <path
          d="M30 92 L52 60 H148 L170 92 Z"
          fill="url(#car-grad)"
        />
        <rect x="30" y="92" width="140" height="22" rx="10" fill="url(#car-grad)" />
        <path d="M62 62 L78 78 H122 L138 62 Z" fill="rgba(255,255,255,0.85)" />
        <circle cx="62" cy="116" r="12" fill="#0f172a" />
        <circle cx="138" cy="116" r="12" fill="#0f172a" />
        <circle cx="62" cy="116" r="5" fill="#cbd5e1" />
        <circle cx="138" cy="116" r="5" fill="#cbd5e1" />
      </svg>
    ),
  },
];

const trustItems = [
  { value: '1.2M+', label: 'Verifications completed' },
  { value: '< 2 min', label: 'Average issuance time' },
  { value: '27', label: 'EU countries supported' },
  { value: '4.8 / 5', label: 'Customer rating' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">EU Digital Identity Wallet</span>
            <h1>
              One identity. <span className="hero__accent">Every product.</span>
            </h1>
            <p className="hero__lead">
              Compare and apply for everyday financial and mobility products in minutes —
              securely verified with your EUDI wallet. No scans, no waiting rooms, no paper.
            </p>
            <div className="hero__cta-row">
              <a className="btn btn--primary btn--lg" href="#products">
                Browse products
              </a>
              <a className="btn btn--ghost btn--lg" href="#trust">
                How it works
              </a>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__phone">
              <div className="hero__phone-screen">
                <div className="hero__phone-check">
                  <svg viewBox="0 0 24 24" width="44" height="44">
                    <path
                      d="M5 12l4 4 10-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="hero__phone-line" />
                <div className="hero__phone-line hero__phone-line--short" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="products">
        <div className="container">
          <div className="section-head">
            <h2>Choose a product to verify</h2>
            <p className="muted">
              Pick what you need — we will guide you through a fast, wallet-based verification.
            </p>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <article key={p.id} className={`product-card ${p.accent}`}>
                <div className="product-card__art">{p.illustration}</div>
                <div className="product-card__body">
                  <span className="eyebrow">{p.eyebrow}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="product-card__bullets">
                    {p.bullets.map((b) => (
                      <li key={b}>
                        <span aria-hidden="true">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                  <Link to={p.to} className="btn btn--primary btn--block">
                    {p.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="trust">
        <div className="container">
          <div className="trust__grid">
            {trustItems.map((t) => (
              <div className="trust__item" key={t.label}>
                <div className="trust__value">{t.value}</div>
                <div className="trust__label">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
