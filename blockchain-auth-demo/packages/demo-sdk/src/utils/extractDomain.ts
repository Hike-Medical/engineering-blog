import { toURL } from './toURL';

/**
 * Extracts the root domain from a given URL.
 *
 * This utility function attempts to parse and extract the root domain from
 * a URL. It is designed to handle most common domain structures, including
 * multi-level subdomains and multi-part top-level domains (like `co.uk`).
 *
 * @example
 * extractDomain('https://sub.domain.com'); // Returns 'domain.com'
 * extractDomain('https://sub.domain.co.uk'); // Returns 'domain.co.uk'
 *
 * Note:
 * - The current implementation primarily handles one or two-part TLDs (like `.com` or `.co.uk`).
 *   For more complex TLDs or to ensure future-proofing against evolving domain structures,
 *   consider extending the logic or integrating with a library like `publicsuffix-list`.
 */
export const extractDomain = (value: unknown) => {
  const url = toURL(value);

  if (!url) {
    return null;
  }

  const hostnameParts = url.hostname.split('.');

  // Determine typical hostnames like "domain.com" or "domain.org"
  if (hostnameParts.length <= 2) {
    return url.hostname;
  }

  // Determine two-part TLD if second last part of the hostname matches one of the prefixes
  const prefixes = ['com', 'co', 'org', 'net', 'gov', 'edu'];
  const potentialTwoPartTLD = `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`;

  return prefixes.includes(hostnameParts[hostnameParts.length - 2] ?? '')
    ? `${hostnameParts[hostnameParts.length - 3]}.${potentialTwoPartTLD}`
    : hostnameParts.slice(-2).join('.'); // Fallback to last two parts of hostname
};
