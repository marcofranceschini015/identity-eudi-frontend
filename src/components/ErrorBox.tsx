interface ErrorBoxProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorBox({ title = 'Something went wrong', message, onRetry }: ErrorBoxProps) {
  return (
    <div className="error-box" role="alert">
      <div className="error-box__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path
            d="M12 3l10 18H2L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 10v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1.2" fill="currentColor" />
        </svg>
      </div>
      <div className="error-box__body">
        <strong>{title}</strong>
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="btn btn--ghost" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
