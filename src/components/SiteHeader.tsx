import { Link, NavLink } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="EUDI Verify home">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                d="M5 12l4 4 10-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand__text">
            EUDI<span className="brand__text-accent">Verify</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className="site-nav__link">
            Home
          </NavLink>
          <NavLink to="/bank-loan" className="site-nav__link">
            Bank loan
          </NavLink>
          <NavLink to="/rent-a-car" className="site-nav__link">
            Rent a car
          </NavLink>
        </nav>

        <div className="site-header__cta">
          <a className="badge-eu" href="#" onClick={(e) => e.preventDefault()}>
            <span aria-hidden="true">★</span> EU Digital Identity
          </a>
        </div>
      </div>
    </header>
  );
}
