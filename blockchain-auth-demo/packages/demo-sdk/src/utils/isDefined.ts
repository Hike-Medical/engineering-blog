/**
 * Type guard for filtering out `null` and `undefined` values.
 *
 * @example
 * [0, 1, null, 3].filter(isDefined); // [0, 1, 3]
 */
export const isDefined = <T>(value: T | null): value is T => value != null;
