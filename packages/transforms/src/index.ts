// Import all transforms
import { structuredCloneTransform } from './js/structured-clone.js';
import { urlCanParseTransform } from './js/url-canparse.js';
import { arrayAtTransform } from './js/array-at.js';
import { toggleAttributeTransform } from './js/toggle-attribute.js';
import { clipboardWriteTextTransform } from './js/clipboard-write-text.js';
import { abortSignalTimeoutTransform } from './js/abort-signal-timeout.js';
import { intlSegmenterTransform } from './js/intl-segmenter.js';
import { textWrapBalanceTransform } from './css/text-wrap-balance.js';
import { hasSelectorTransform } from './css/has-selector.js';
import { cssNestingTransform } from './css/nesting.js';
import { focusVisibleTransform } from './css/focus-visible.js';

// Export individual transforms
export { structuredCloneTransform } from './js/structured-clone.js';
export { urlCanParseTransform } from './js/url-canparse.js';
export { arrayAtTransform } from './js/array-at.js';
export { toggleAttributeTransform } from './js/toggle-attribute.js';
export { clipboardWriteTextTransform } from './js/clipboard-write-text.js';
export { abortSignalTimeoutTransform } from './js/abort-signal-timeout.js';
export { intlSegmenterTransform } from './js/intl-segmenter.js';
export { textWrapBalanceTransform } from './css/text-wrap-balance.js';
export { hasSelectorTransform } from './css/has-selector.js';
export { cssNestingTransform } from './css/nesting.js';
export { focusVisibleTransform } from './css/focus-visible.js';

// Transform registry
export const ALL_TRANSFORMS = [
  // JavaScript / DOM transforms
  structuredCloneTransform,
  urlCanParseTransform,
  arrayAtTransform,
  toggleAttributeTransform,
  clipboardWriteTextTransform,
  abortSignalTimeoutTransform,
  intlSegmenterTransform,
  // CSS transforms
  textWrapBalanceTransform,
  hasSelectorTransform,
  cssNestingTransform,
  focusVisibleTransform,
];

// Get transforms by category
export const JS_TRANSFORMS = ALL_TRANSFORMS.filter(t => t.id.startsWith('js.'));
export const CSS_TRANSFORMS = ALL_TRANSFORMS.filter(t => t.id.startsWith('css.'));

// Get transform by ID
export function getTransformById(id: string) {
  return ALL_TRANSFORMS.find(t => t.id === id);
}

// Get transforms by feature ID
export function getTransformsByFeature(featureId: string) {
  return ALL_TRANSFORMS.filter(t => t.featureIds.includes(featureId));
} 