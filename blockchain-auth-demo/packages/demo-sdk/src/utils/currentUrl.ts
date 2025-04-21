import { toURL } from './toURL';

/**
 * Returns the current URL with optional search parameters updated.
 * If `window` is not defined due to server-side execution, this function will return `null`.
 */
export const currentUrl = (params?: Record<string, string | null | undefined>) => {
  const url = typeof window !== 'undefined' ? toURL(window.location?.href) : null;

  if (!url) {
    return null;
  }

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      url.searchParams.delete(key);
      return;
    }

    url.searchParams.set(key, value);
  });

  return url;
};
