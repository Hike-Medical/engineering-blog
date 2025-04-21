'use client';

export const Loader = () => {
  return (
    <div role="status" aria-label="Loading" className="flex items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-transparent"
        style={{ borderTopColor: 'var(--foreground)' }}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
};
