// Import all transforms
import { structuredCloneTransform } from './js/structured-clone.js';
import { urlCanParseTransform } from './js/url-canparse.js';
import { textWrapBalanceTransform } from './css/text-wrap-balance.js';

// Export individual transforms
export { structuredCloneTransform } from './js/structured-clone.js';
export { urlCanParseTransform } from './js/url-canparse.js';
export { textWrapBalanceTransform } from './css/text-wrap-balance.js';

// Transform registry
export const ALL_TRANSFORMS = [
  structuredCloneTransform,
  urlCanParseTransform,
  textWrapBalanceTransform,
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