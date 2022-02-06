/**
 * Promisify setTimeout JavaScript function
 * @param ms
 * @returns {Promise<unknown>}
 */
export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}