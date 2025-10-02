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
export declare const ALL_TRANSFORMS: import("@baseline-surgeon/core").Transform[];
export declare const JS_TRANSFORMS: import("@baseline-surgeon/core").Transform[];
export declare const CSS_TRANSFORMS: import("@baseline-surgeon/core").Transform[];
export declare function getTransformById(id: string): import("@baseline-surgeon/core").Transform | undefined;
export declare function getTransformsByFeature(featureId: string): import("@baseline-surgeon/core").Transform[];
//# sourceMappingURL=index.d.ts.map