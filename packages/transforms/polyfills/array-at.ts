/**
 * Polyfill for Array.prototype.at method
 */

export function arrayAt<T>(array: T[], index: number): T | undefined {
  if ('at' in Array.prototype) {
    return array.at(index);
  }

  return polyfillArrayAt(array, index);
}

function polyfillArrayAt<T>(array: T[], index: number): T | undefined {
  // Handle negative indices
  if (index < 0) {
    index = array.length + index;
  }

  // Return undefined for out-of-bounds indices
  if (index < 0 || index >= array.length) {
    return undefined;
  }

  return array[index];
} 