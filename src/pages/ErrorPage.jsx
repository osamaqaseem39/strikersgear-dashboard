import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message =
    'We had trouble loading this page. Please refresh the browser or try again in a moment.';
  let statusText = '';

  if (isRouteErrorResponse(error)) {
    statusText = `${error.status} ${error.statusText || ''}`.trim();
  } else if (error instanceof Error) {
    statusText = error.message;
  } else if (typeof error === 'string') {
    statusText = error;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '24px'
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          padding: '32px 28px'
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 8
          }}
        >
          {title}
        </h1>
        <p
          style={{
            marginBottom: 16,
            color: '#4b5563'
          }}
        >
          {message}
        </p>
        {statusText && (
          <p
            style={{
              marginBottom: 20,
              fontSize: 13,
              color: '#9ca3af'
            }}
          >
            Technical details: {statusText}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background:
                'linear-gradient(135deg, rgb(37, 99, 235), rgb(56, 189, 248))',
              color: '#ffffff',
              fontWeight: 500
            }}
          >
            Reload page
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = '/login')}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              color: '#374151',
              fontWeight: 500
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

