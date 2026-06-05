import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { createSession, ApiError } from '../api/sessionClient';
import { TENANTS } from '../config';

interface FormState {
  firstName: string;
  lastName: string;
  iban: string;
}

const EMPTY: FormState = { firstName: '', lastName: '', iban: '' };

function isValidIban(iban: string): boolean {
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(cleaned);
}

export default function BankLoanFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    firstName: false,
    lastName: false,
    iban: false,
  });

  const errors = {
    firstName: form.firstName.trim().length === 0 ? 'Required' : null,
    lastName: form.lastName.trim().length === 0 ? 'Required' : null,
    iban:
      form.iban.trim().length === 0
        ? 'Required'
        : !isValidIban(form.iban)
        ? 'Enter a valid IBAN (e.g. DE89 3704 0044 0532 0130 00)'
        : null,
  };
  const isValid = !errors.firstName && !errors.lastName && !errors.iban;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, iban: true });
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await createSession({
        tenant: TENANTS.bank,
        userData: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          iban: form.iban.replace(/\s+/g, '').toUpperCase(),
        },
      });
      navigate('/bank-loan/verify', {
        state: {
          sessionId: res.sessionId,
          redirectUrl: res.redirectUrl,
          oneTimePassword: res.oneTimePassword,
          tenant: TENANTS.bank,
        },
        replace: true,
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unexpected error while starting the verification. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof FormState) {
    const showError = touched[name] && errors[name];
    return {
      'aria-invalid': showError ? true : undefined,
      'aria-describedby': showError ? `${name}-err` : undefined,
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    } as const;
  }

  return (
    <section className="container narrow">
      <Link to="/" className="back-link">← Back to home</Link>

      <div className="form-card">
        <header className="form-card__head">
          <span className="eyebrow">Step 1 of 2 · Identity</span>
          <h1>Apply for a bank loan</h1>
          <p className="muted">
            Enter your details to begin. We will issue a verification request to your EUDI wallet
            on the next step.
          </p>
        </header>

        {error && (
          <div className="form-card__alert">
            <ErrorBox message={error} onRetry={() => setError(null)} />
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-row form-row--two">
            <label className="field">
              <span className="field__label">First name</span>
              <input
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="John"
                {...field('firstName')}
              />
              {touched.firstName && errors.firstName && (
                <span id="firstName-err" className="field__error">
                  {errors.firstName}
                </span>
              )}
            </label>

            <label className="field">
              <span className="field__label">Last name</span>
              <input
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Doe"
                {...field('lastName')}
              />
              {touched.lastName && errors.lastName && (
                <span id="lastName-err" className="field__error">
                  {errors.lastName}
                </span>
              )}
            </label>
          </div>

          <label className="field">
            <span className="field__label">IBAN</span>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              value={form.iban}
              onChange={(e) => setForm({ ...form, iban: e.target.value })}
              placeholder="DE89 3704 0044 0532 0130 00"
              {...field('iban')}
            />
            {touched.iban && errors.iban && (
              <span id="iban-err" className="field__error">
                {errors.iban}
              </span>
            )}
          </label>

          <div className="form-card__actions">
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={submitting || !isValid}
            >
              {submitting ? <Spinner label="Starting verification…" /> : 'Verify with EUDI wallet'}
            </button>
            <p className="legal-fineprint">
              By continuing you authorise EUDI Verify to request a credential issuance from your
              wallet. No data leaves your device without your explicit consent.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
