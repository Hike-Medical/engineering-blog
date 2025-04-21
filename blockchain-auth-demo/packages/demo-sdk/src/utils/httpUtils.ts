/**
 * Represents the headers for an HTTP request.
 * It can be either an instance of the `Headers` class or a record of string key-value pairs.
 */
export type BaseHeaders = Headers | Record<string, string | string[] | undefined>;

/**
 * Represents the a request that is interchangable with native `fetch` and propietary `http`.
 */
export interface BaseRequest {
  headers: BaseHeaders;
}

/**
 * Retrieves the value of a specific header key from the provided headers object.
 * If the headers object is an instance of `Headers`, it uses the `get` method to retrieve the value.
 * Otherwise, it uses the key to access the value directly from the headers object.
 * If the value is not found, it returns null.
 *
 * @param headers - The headers object from which to retrieve the value.
 * @param key - The key of the header to retrieve the value for.
 * @returns The value of the specified header key, or null if not found.
 */
export const getHeaderValue = (headers: BaseHeaders, key: string): string | null => {
  if ('get' in headers && typeof headers.get === 'function') {
    return headers.get(key) || null;
  }

  const normalized = key.toLowerCase();
  const matched = Object.keys(headers).find((h) => h.toLowerCase() === normalized);

  if (matched) {
    const value = headers[matched];
    return (Array.isArray(value) ? value[0] : value) || null;
  }

  return null;
};

/**
 * Checks if the provided host is a local host.
 */
export const isLocalHost = (host: string | null): boolean =>
  (host?.startsWith('localhost') ||
    host?.startsWith('127.0.0.1') ||
    host?.startsWith('192.168.') ||
    host?.startsWith('10.0.') ||
    host?.endsWith('.local')) ??
  false;

/**
 * Retrieves the host URL from the request object.
 */
export const getHost = (headers: BaseHeaders): string | null =>
  getHeaderValue(headers, 'x-forwarded-host')?.split(',')[0] || getHeaderValue(headers, 'host');

/**
 * Returns the protocol (http or https) based on the provided request object.
 * If the protocol cannot be determined from the request headers, it defaults to 'http' for local hosts and 'https' for remote hosts.
 */
export const getProtocol = (headers: BaseHeaders): 'http' | 'https' => {
  const host = getHost(headers);

  const protocol = (
    getHeaderValue(headers, 'x-forwarded-proto')?.split(',')[0] || getHeaderValue(headers, 'protocol')
  )?.toLowerCase();

  if (protocol === 'http' || protocol === 'https') {
    return protocol;
  }

  return isLocalHost(host) ? 'http' : 'https';
};

/**
 * Checks if the request is using HTTPS protocol.
 */
export const isHttps = (headers: BaseHeaders): boolean => getProtocol(headers) === 'https';

/**
 * Returns the host URL based on the provided request object.
 * @param request - The request object containing the headers.
 * @returns The host URL in the format: `${protocol}://${host}` or `null` if the protocol or host is not found.
 */
export const getHostUrl = (headers: BaseHeaders): string | null => {
  const host = getHost(headers);
  const protocol = getProtocol(headers);
  return host ? `${protocol}://${host}` : null;
};
