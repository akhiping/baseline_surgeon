/**
 * Polyfill for Element.toggleAttribute method
 */

export function toggleAttribute(element: Element, name: string, force?: boolean): boolean {
  if ('toggleAttribute' in Element.prototype) {
    return element.toggleAttribute(name, force);
  }

  return polyfillToggleAttribute(element, name, force);
}

function polyfillToggleAttribute(element: Element, name: string, force?: boolean): boolean {
  const hasAttribute = element.hasAttribute(name);

  if (force === undefined) {
    // Toggle based on current state
    if (hasAttribute) {
      element.removeAttribute(name);
      return false;
    } else {
      element.setAttribute(name, '');
      return true;
    }
  } else {
    // Force to specific state
    if (force) {
      element.setAttribute(name, '');
      return true;
    } else {
      element.removeAttribute(name);
      return false;
    }
  }
} 