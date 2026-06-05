import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { pollSession, ApiError } from '../api/sessionClient';
import { POLL_INTERVAL_MS } from '../config';
import type { SessionState } from '../api/types';

interface LocationState {
  sessionId: string;
  redirectUrl: string;
  oneTimePassword: string;
  tenant: string;
}

function isLocationState(v: unknown): v is LocationState {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.sessionId === 'string' &&
    typeof o.redirectUrl === 'string' &&
    typeof o.oneTimePassword === 'string' &&
    typeof o.tenant === 'string'
  );
}

export default function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = isLocationState(location.state) ? location.state : null;

  const [currentState, setCurrentState] = useState<SessionState>('CREATED');
  const [pollError, setPollError] = useState<string | null>(null);
  const [otpCopied, setOtpCopied] = useState(false);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    stoppedRef.current = false;
    let timeoutId: number | undefined;

    const tick = async () => {
      if (stoppedRef.current) return;
      try {
        const res = await pollSession(state.sessionId);
        if (stoppedRef.current) return;
        setCurrentState(res.state);
        setPollError(null);

        if (res.state === 'ISSUED') {
          stoppedRef.current = true;
          navigate('/bank-loan/success', { replace: true });
          return;
        }
        if (res.state === 'FAILED' || res.state === 'REVOKED') {
          stoppedRef.current = true;
          return;
        }
      } catch (err) {
        if (stoppedRef.current) return;
        const message =
          err instanceof ApiError ? err.message : 'Could not reach the verification service.';
        setPollError(message);
      }
      timeoutId = window.setTimeout(tick, POLL_INTERVAL_MS);
    };

    timeoutId = window.setTimeout(tick, POLL_INTERVAL_MS);
    return () => {
      stoppedRef.current = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [state, navigate]);

  if (!state) {
    return <Navigate to="/bank-loan" replace />;
  }

  const terminalError = currentState === 'FAILED' || currentState === 'REVOKED';

  async function copyOtp() {
    if (!state) return;
    try {
      await navigator.clipboard.writeText(state.oneTimePassword);
      setOtpCopied(true);
      window.setTimeout(() => setOtpCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <section className="container narrow">
      <Link to="/bank-loan" className="back-link">← Edit details</Link>

      <div className="verify-card">
        <header className="verify-card__head">
          <span className="eyebrow">Step 2 of 2 · Wallet verification</span>
          <h1>Scan with your EUDI wallet</h1>
          <p className="muted">
            Open your wallet app, scan the QR code, then confirm by entering the one-time code
            shown below. We will detect the result automatically.
          </p>
        </header>

        {terminalError ? (
          <ErrorBox
            title={currentState === 'FAILED' ? 'Verification failed' : 'Credential revoked'}
            message={
              currentState === 'FAILED'
                ? 'The wallet reported a failed issuance. Please go back and try again.'
                : 'The credential associated with this session has been revoked.'
            }
            onRetry={() => navigate('/bank-loan', { replace: true })}
          />
        ) : (
          <div className="verify-grid">
            <div className="verify-qr">
              <div className="verify-qr__frame">
                <QRCodeCanvas
                  value={state.redirectUrl}
                  size={232}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
              <a
                className="verify-qr__link"
                href={state.redirectUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Or open the wallet directly →
              </a>
            </div>

            <div className="verify-side">
              <div className="otp-card">
                <span className="eyebrow">One-time code</span>
                <div className="otp-card__digits" aria-label="One time password">
                  {state.oneTimePassword.split('').map((d, i) => (
                    <span className="otp-card__digit" key={`${d}-${i}`}>
                      {d}
                    </span>
                  ))}
                </div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={copyOtp}>
                  {otpCopied ? 'Copied!' : 'Copy code'}
                </button>
              </div>

              <div className="status-card">
                <div className="status-card__row">
                  <Spinner />
                  <div>
                    <strong>Waiting for your wallet…</strong>
                    <p className="muted">
                      Current status: <code>{currentState}</code>
                    </p>
                  </div>
                </div>
                {pollError && (
                  <p className="status-card__warn">
                    {pollError} — we will keep retrying.
                  </p>
                )}
              </div>

              <ol className="how-list">
                <li>Open your EUDI-compatible wallet on your phone.</li>
                <li>Scan the QR code on the left.</li>
                <li>When prompted, enter the one-time code above.</li>
                <li>Approve the credential issuance in the wallet.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
