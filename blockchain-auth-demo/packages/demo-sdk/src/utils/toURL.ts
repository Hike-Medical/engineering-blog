/**
 * Returns a URL object if the value is a valid URL, otherwise returns null.
 */
export const toURL = (value: unknown) => {
  if (value instanceof URL) {
    return value;
  }

  if (typeof value !== 'string' || !value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.hostname ? url : null;
  } catch {
    return null;
  }
};
