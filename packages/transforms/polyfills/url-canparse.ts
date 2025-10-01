/**
 * Polyfill for URL.canParse static method
 */

export function canParseURL(url: string, base?: string | URL): boolean {
  if (typeof URL !== 'undefined' && 'canParse' in URL) {
    return (URL as any).canParse(url, base);
  }

  return polyfillCanParseURL(url, base);
}

function polyfillCanParseURL(url: string, base?: string | URL): boolean {
  try {
    new URL(url, base);
    return true;
  } catch {
    return false;
  }
} 