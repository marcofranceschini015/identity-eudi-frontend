import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <section className="container narrow">
      <div className="success-card">
        <div className="success-card__check" aria-hidden="true">
          <svg viewBox="0 0 80 80" width="84" height="84">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" />
            <path
              d="M24 41l12 12 22-26"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1>You're verified</h1>
        <p className="muted">
          Your credential has been issued successfully. A loan specialist will reach out shortly
          with your personalised offer.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">
          Back to home
        </Link>
      </div>
    </section>
  );
}
