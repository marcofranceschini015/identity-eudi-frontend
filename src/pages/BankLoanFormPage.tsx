import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { createPresentation } from '../api/presentationClient';
import { ApiError } from '../api/http';
import { TENANTS } from '../config';

export default function BankLoanFormPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startAuthentication() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createPresentation({ tenant: TENANTS.bank });
      navigate('/bank-loan/verify', {
        state: {
          presentationSessionId: res.presentationSessionId,
          presentationRequestUri: res.presentationRequestUri,
        },
        replace: true,
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unexpected error while starting the authentication. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container narrow">
      <Link to="/" className="back-link">← Back to home</Link>

      <div className="form-card auth-card">
        <header className="auth-card__head">
          <span className="eyebrow">Step 1 of 2 · Identity</span>
          <h1>Apply for a bank loan</h1>
          <p className="muted">
            We use your EU Digital Identity Wallet to instantly verify who you are — no
            forms, no document scans, no waiting. Approve the request in your wallet and
            you're done.
          </p>
        </header>

        <ul className="auth-card__features">
          <li>
            <span aria-hidden="true">✓</span> Verified in under 30 seconds
          </li>
          <li>
            <span aria-hidden="true">✓</span> You stay in control of your data
          </li>
          <li>
            <span aria-hidden="true">✓</span> Powered by the EUDI Wallet standard
          </li>
        </ul>

        {error && (
          <div className="form-card__alert">
            <ErrorBox message={error} onRetry={() => setError(null)} />
          </div>
        )}

        <div className="auth-card__actions">
          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={startAuthentication}
            disabled={submitting}
          >
            {submitting ? (
              <Spinner label="Preparing your request…" />
            ) : (
              <>
                <span className="btn__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <rect
                      x="6"
                      y="2"
                      width="12"
                      height="20"
                      rx="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="18" r="1.4" fill="currentColor" />
                  </svg>
                </span>
                Authenticate with EUDI Wallet
              </>
            )}
          </button>
          <p className="legal-fineprint">
            By continuing you authorise EUDI Verify to request a verifiable presentation
            from your wallet. No data leaves your device without your explicit consent.
          </p>
        </div>
      </div>
    </section>
  );
}
