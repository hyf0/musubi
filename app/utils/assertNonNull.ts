export function assertNonNull<T>(value: T | null | undefined, message?: string): T {
  if (value === null || value === undefined) {
    throw new Error(
      message ||
        'Expected value to be non-null and non-undefined in this context. There might be something wrong with the data source or code.',
    )
  }
  return value
}
