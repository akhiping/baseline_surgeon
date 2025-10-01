/**
 * Polyfill for structuredClone API
 * 
 * @warning This is a simplified polyfill that handles common cases.
 * It supports: plain objects, arrays, Date, RegExp, Map, Set (shallow), primitives.
 * It does NOT support: DOM nodes, functions, complex objects with prototypes.
 */

export function structuredClone<T>(value: T): T {
  if (typeof globalThis !== 'undefined' && 'structuredClone' in globalThis) {
    return (globalThis as any).structuredClone(value);
  }

  return polyfillStructuredClone(value);
}

function polyfillStructuredClone<T>(value: T): T {
  // Handle primitives and null/undefined
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => polyfillStructuredClone(item)) as T;
  }

  // Handle Map (shallow clone)
  if (value instanceof Map) {
    const cloned = new Map();
    for (const [key, val] of value) {
      cloned.set(polyfillStructuredClone(key), polyfillStructuredClone(val));
    }
    return cloned as T;
  }

  // Handle Set (shallow clone)
  if (value instanceof Set) {
    const cloned = new Set();
    for (const item of value) {
      cloned.add(polyfillStructuredClone(item));
    }
    return cloned as T;
  }

  // Handle plain objects
  if (value.constructor === Object || value.constructor === undefined) {
    const cloned: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloned[key] = polyfillStructuredClone((value as any)[key]);
      }
    }
    return cloned as T;
  }

  // For other types, warn and return as-is
  console.warn('structuredClone polyfill: Unsupported type, returning as-is:', typeof value);
  return value;
} 