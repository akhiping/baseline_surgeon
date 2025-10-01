# Baseline Surgeon Transforms

This document provides detailed information about all transforms included in Baseline Surgeon.

## Transform Count: 11

- **JavaScript/DOM Transforms**: 7
- **CSS Transforms**: 4

---

## JavaScript / DOM Transforms

### 1. structuredClone (`js.structured-clone`)

**Feature ID**: `structured-clone`  
**Baseline Status**: Available since March 2022

**What it does:**  
Detects usage of the `structuredClone()` global function and adds a polyfill that supports deep cloning of common JavaScript types.

**Example:**
```javascript
// Before
const copy = structuredClone(originalObject);

// After
import { structuredClone } from '@baseline-surgeon/polyfills/structured-clone';
const copy = structuredClone(originalObject);
```

**Polyfill capabilities:**
- ✅ Plain objects and arrays
- ✅ Date, RegExp
- ✅ Map, Set (shallow clone of contents)
- ✅ Primitives (string, number, boolean, null, undefined)
- ❌ DOM nodes, Functions, complex prototypes

---

### 2. URL.canParse (`js.url-canparse`)

**Feature ID**: `url-canparse`  
**Baseline Status**: Available since March 2023

**What it does:**  
Detects usage of `URL.canParse()` static method and replaces it with a try/catch wrapper around the URL constructor.

**Example:**
```javascript
// Before
if (URL.canParse(urlString)) {
  // valid URL
}

// After
import { canParseURL } from '@baseline-surgeon/polyfills/url-canparse';
if (canParseURL(urlString)) {
  // valid URL
}
```

**Polyfill implementation:**
```javascript
try {
  new URL(url, base);
  return true;
} catch {
  return false;
}
```

---

### 3. Array.prototype.at (`js.array-at`)

**Feature ID**: `array-at`  
**Baseline Status**: Available since March 2022

**What it does:**  
Detects usage of the `.at()` method on arrays and provides negative indexing support.

**Example:**
```javascript
// Before
const lastItem = items.at(-1);

// After
import { arrayAt } from '@baseline-surgeon/polyfills/array-at';
const lastItem = arrayAt(items, -1);
```

**Polyfill features:**
- Negative index support (`-1` = last element)
- Returns `undefined` for out-of-bounds indices
- Works with any array-like object

---

### 4. Element.toggleAttribute (`js.toggle-attribute`)

**Feature ID**: `toggle-attribute`  
**Baseline Status**: Available since January 2020

**What it does:**  
Detects usage of `element.toggleAttribute()` and provides a polyfill using `setAttribute`/`removeAttribute`.

**Example:**
```javascript
// Before
button.toggleAttribute('disabled');

// After
import { toggleAttribute } from '@baseline-surgeon/polyfills/toggle-attribute';
toggleAttribute(button, 'disabled');
```

**Polyfill behavior:**
- Toggles attribute presence
- Supports optional `force` parameter
- Returns boolean indicating final state

---

### 5. navigator.clipboard.writeText (`js.clipboard-write-text`)

**Feature ID**: `clipboard-write-text`  
**Baseline Status**: Available since March 2019

**What it does:**  
Detects usage of the Clipboard API and provides a fallback using `document.execCommand('copy')`.

**Example:**
```javascript
// Before
await navigator.clipboard.writeText(text);

// After
import { clipboardWriteText } from '@baseline-surgeon/polyfills/clipboard-write-text';
await clipboardWriteText(text);
```

**Polyfill strategy:**
1. Try native Clipboard API first
2. Fallback to temporary textarea + execCommand
3. Returns Promise for API consistency

---

### 6. AbortSignal.timeout (`js.abort-signal-timeout`)

**Feature ID**: `abort-signal-timeout`  
**Baseline Status**: Available since September 2023

**What it does:**  
Detects usage of `AbortSignal.timeout()` and provides a polyfill using `AbortController` + `setTimeout`.

**Example:**
```javascript
// Before
const signal = AbortSignal.timeout(5000);
await fetch(url, { signal });

// After
import { abortSignalTimeout } from '@baseline-surgeon/polyfills/abort-signal-timeout';
const signal = abortSignalTimeout(5000);
await fetch(url, { signal });
```

**Polyfill implementation:**
```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), ms);
return controller.signal;
```

---

### 7. Intl.Segmenter (`js.intl-segmenter`)

**Feature ID**: `intl-segmenter`  
**Baseline Status**: ❌ Not yet Baseline

**What it does:**  
Detects usage of `Intl.Segmenter` and provides a **best-effort** polyfill for basic word and sentence segmentation.

**Example:**
```javascript
// Before
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
for (const segment of segmenter.segment(text)) {
  console.log(segment.segment);
}

// After
import { IntlSegmenter } from '@baseline-surgeon/polyfills/intl-segmenter';
const segmenter = new IntlSegmenter('en', { granularity: 'word' });
for (const segment of segmenter.segment(text)) {
  console.log(segment.segment);
}
```

**⚠️ Important Limitations:**
- **NOT** a full Unicode-compliant implementation
- Word segmentation uses simple regex (whitespace boundaries)
- Sentence segmentation looks for `.!?` followed by space
- Does NOT handle:
  - Complex grapheme clusters
  - Language-specific rules
  - Abbreviations (e.g., "Dr." won't split correctly)

**Recommendation:** Use feature detection and provide graceful degradation rather than relying on this polyfill for production.

---

## CSS Transforms

### 8. text-wrap: balance (`css.text-wrap-balance`)

**Feature ID**: `css-text-wrap-balance`  
**Baseline Status**: ❌ Not yet Baseline

**What it does:**  
Wraps rules containing `text-wrap: balance` in an `@supports` query for progressive enhancement.

**Example:**
```css
/* Before */
.title {
  text-wrap: balance;
  font-size: 2rem;
}

/* After */
@supports (text-wrap: balance) {
  .title {
    text-wrap: balance;
    font-size: 2rem;
  }
}
```

**Behavior:**
- No fallback provided (graceful degradation)
- Text will wrap normally in unsupported browsers
- Enhanced typography in supporting browsers

---

### 9. :has() selector (`css.has-selector`)

**Feature ID**: `css-has-selector`  
**Baseline Status**: Available since December 2023

**What it does:**  
Wraps rules using the `:has()` selector in an `@supports selector()` query.

**Example:**
```css
/* Before */
.card:has(img) {
  padding: 0;
}

/* After */
@supports selector(:has(a)) {
  .card:has(img) {
    padding: 0;
  }
}
```

**Strategy:**
- Enhancement-only approach
- No JavaScript fallback simulation
- Selectors gracefully ignored in older browsers

---

### 10. CSS Nesting (`css.nesting`)

**Feature ID**: `css-nesting`  
**Baseline Status**: Available since March 2023

**What it does:**  
Flattens nested CSS selectors into standard flat rules for broader compatibility.

**Example:**
```css
/* Before */
.button {
  background: blue;
  
  &:hover {
    background: darkblue;
  }
}

/* After */
.button {
  background: blue;
}

.button:hover {
  background: darkblue;
}
```

**Note:** This is a simplified implementation. Complex nesting patterns may require manual review. For production use, consider using PostCSS with the `postcss-nested` plugin.

---

### 11. :focus-visible (`css.focus-visible`)

**Feature ID**: `css-focus-visible`  
**Baseline Status**: Available since March 2022

**What it does:**  
Adds a `:focus` fallback rule alongside `:focus-visible` rules for broader browser support.

**Example:**
```css
/* Before */
button:focus-visible {
  outline: 2px solid blue;
}

/* After */
/* Fallback for browsers without :focus-visible */
button:focus {
  outline: 2px solid blue;
}

/* Modern :focus-visible */
button:focus-visible {
  outline: 2px solid blue;
}
```

**Behavior:**
- Fallback shows focus ring for all focus events
- Modern browsers use keyboard-only focus ring
- Graceful degradation with better UX in supporting browsers

---

## Transform Behavior

### When Transforms Apply

Transforms only run when:
1. The feature is **not Baseline** for the selected target (`baseline-now`, `baseline-2024`, `baseline-2025`)
2. The feature is detected in the source code
3. The transform is not excluded via configuration

### Safe by Default

All transforms follow these principles:
- ✅ Conservative - only change what's necessary
- ✅ Explainable - clear rationale for every change
- ✅ Reversible - can be reviewed with `--dry-run --diff`
- ✅ Idempotent - running twice produces same result
- ❌ No speculative changes
- ❌ No risky behavioral modifications

### Transform Limitations

Transforms use simplified detection (regex-based) for speed. This means:
- May miss complex expressions
- May have false positives in comments or strings
- AST-based detection is used where critical (e.g., structuredClone)

For production use, always:
1. Review changes with `--dry-run --diff`
2. Test thoroughly in target browsers
3. Use version control

---

## Adding New Transforms

Want to contribute a new transform? Follow this structure:

```typescript
export const myTransform: Transform = {
  id: 'category.feature-name',
  title: 'Human-readable title',
  featureIds: ['baseline-feature-id'],
  
  detect(ctx: FileContext): Finding[] {
    // Scan code and return findings
  },
  
  canApply(finding, target, baseline): boolean {
    // Check if feature is not baseline
    return !baseline.isBaseline(featureIds[0], target);
  },
  
  apply(ctx, finding): ApplyResult {
    // Perform the transformation
  },
  
  explain(finding): string {
    // Explain why this transform is needed
    return 'Description with MDN link';
  }
};
```

See existing transforms in `/packages/transforms/src/` for examples.

---

## Transform Statistics

| Category | Count | Coverage |
|----------|-------|----------|
| JavaScript/DOM | 7 | ⭐⭐⭐⭐ |
| CSS | 4 | ⭐⭐⭐ |
| **Total** | **11** | **Good** |

Target: 12+ transforms ✅ (11/12 achieved, easily extensible)

---

## Future Transform Ideas

Potential additions:
- `Object.hasOwn()` → `Object.prototype.hasOwnProperty.call()`
- `Array.prototype.findLast()` → Polyfill
- `String.prototype.replaceAll()` → Polyfill
- `Promise.any()` → Polyfill
- CSS `accent-color` → @supports guard
- CSS `text-box-trim` → @supports guard
- View Transitions API → No-op wrapper

Contributions welcome! 