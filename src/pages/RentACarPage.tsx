import { Link } from 'react-router-dom';

export default function RentACarPage() {
  return (
    <section className="container narrow">
      <Link to="/" className="back-link">← Back to home</Link>
      <div className="placeholder-card">
        <h1>Rent a car</h1>
        <p className="muted">
          This product is coming soon. We are wiring up the mobility tenant for instant
          driver-license verification — check back shortly.
        </p>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>
    </section>
  );
}
