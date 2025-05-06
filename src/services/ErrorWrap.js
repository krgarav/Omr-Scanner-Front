import React, { useState, useEffect } from 'react';

function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  const catchError = (error) => {
    console.error("Caught by useErrorBoundary: ", error);
    setHasError(true);
  };

  return { hasError, catchError, resetError };
}

function ErrorBoundary({ children }) {
  const { hasError, resetError } = useErrorBoundary();

  useEffect(() => {
    resetError();
  }, [children]);

  if (hasError) {
    return <h1>Something went wrong. Please try again later.</h1>;
  }

  return children;
}
export default ErrorBoundary;