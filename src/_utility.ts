/**
 * Creates a debounced function that delays the execution of the provided function
 * until after a specified wait time has elapsed since the last time it was invoked.
 * Optionally, the function can be triggered immediately on the leading edge instead of the trailing edge.
 *
 * @param callback - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @param immediate - If true, triggers the function on the leading edge instead of the trailing edge. Default is `false`.
 * @returns A debounced version of the provided function.
 *
 * @example
 * ```typescript
 * const debouncedLog = debounce(() => {
 *   console.log('Function executed after 300ms of inactivity')
 * }, 300)
 *
 * window.addEventListener('resize', debouncedLog)
 * ```
 */
function debounce<TParams extends (...args: Array<unknown>) => void>(
  callback: TParams,
  wait: number,
  immediate = false,
): (...args: Parameters<TParams>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null

  return (...args: Parameters<TParams>) => {
    const shouldCallNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      if (!immediate) {
        callback(...args)
      }
    }, wait)

    if (shouldCallNow) {
      callback(...args)
    }
  }
}

/**
 * Processes a template literal string, preserving all escape sequences as raw text.
 *
 * @param strings - The raw template literal strings, which can be a `ReadonlyArray` or `ArrayLike` collection of strings.
 * @param values - The dynamic values to be interpolated within the template literal.
 * @returns The processed string with escape sequences preserved and interpolated values inlined.
 *
 * @example
 * ```typescript
 * const className = 'bg-blue-500';
 * const result = tw`text-white ${className}`;
 * console.log(result); // Output: 'text-white bg-blue-500'
 * ```
 */
function tw(
  strings: ReadonlyArray<string> | ArrayLike<string>,
  ...values: Array<unknown>
): string {
  return String.raw({ raw: strings }, ...values)
}

export { debounce, tw }
