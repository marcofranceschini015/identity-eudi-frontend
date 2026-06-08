import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { pollPresentation } from '../api/presentationClient';
import { ApiError } from '../api/http';
import { POLL_INTERVAL_MS } from '../config';
import type { PresentationState } from '../api/types';

interface LocationState {
  presentationSessionId: string;
  presentationRequestUri: string;
}

function isLocationState(v: unknown): v is LocationState {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.presentationSessionId === 'string' &&
    typeof o.presentationRequestUri === 'string'
  );
}

const STATUS_LABEL: Record<PresentationState, string> = {
  CREATED: 'Waiting for your wallet to scan…',
  PENDING: 'Wallet connected — confirm the request to continue…',
  COMPLETE: 'Authentication complete.',
  FAILED: 'Authentication failed.',
  EXPIRED: 'The request has expired.',
};

export default function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = isLocationState(location.state) ? location.state : null;

  const [currentState, setCurrentState] = useState<PresentationState>('CREATED');
  const [pollError, setPollError] = useState<string | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    stoppedRef.current = false;
    let timeoutId: number | undefined;

    const tick = async () => {
      if (stoppedRef.current) return;
      try {
        const res = await pollPresentation(state.presentationSessionId);
        if (stoppedRef.current) return;
        setCurrentState(res.state);
        setPollError(null);

        if (res.state === 'COMPLETE') {
          stoppedRef.current = true;
          navigate('/bank-loan/success', { replace: true });
          return;
        }
        if (res.state === 'FAILED' || res.state === 'EXPIRED') {
          stoppedRef.current = true;
          return;
        }
      } catch (err) {
        if (stoppedRef.current) return;
        const message =
          err instanceof ApiError ? err.message : 'Could not reach the authentication service.';
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

  const terminalError = currentState === 'FAILED' || currentState === 'EXPIRED';

  return (
    <section className="container narrow">
      <Link to="/bank-loan" className="back-link">← Cancel</Link>

      <div className="verify-card">
        <header className="verify-card__head">
          <span className="eyebrow">Step 2 of 2 · Wallet authentication</span>
          <h1>Scan with your EUDI wallet</h1>
          <p className="muted">
            Open your wallet app and scan the QR code. Approve the request when prompted —
            we will detect the result automatically.
          </p>
        </header>

        {terminalError ? (
          <ErrorBox
            title={
              currentState === 'FAILED'
                ? 'Authentication failed'
                : 'Authentication request expired'
            }
            message={
              currentState === 'FAILED'
                ? 'The wallet reported a failed authentication. Please go back and try again.'
                : 'The authentication request has expired. Please go back and start a new one.'
            }
            onRetry={() => navigate('/bank-loan', { replace: true })}
          />
        ) : (
          <div className="verify-grid verify-grid--centered">
            <div className="verify-qr">
              <div className="verify-qr__frame">
                <QRCodeCanvas
                  value={state.presentationRequestUri}
                  size={248}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
              <a
                className="verify-qr__link"
                href={state.presentationRequestUri}
                target="_blank"
                rel="noreferrer noopener"
              >
                Or open the wallet directly →
              </a>
            </div>

            <div className="verify-side">
              <div className="status-card">
                <div className="status-card__row">
                  <Spinner />
                  <div>
                    <strong>{STATUS_LABEL[currentState]}</strong>
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
                <li>Review what is being requested.</li>
                <li>Approve the request to share your verified identity.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
