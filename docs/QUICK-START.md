# Quick Start Guide

Get started with Baseline Surgeon in 5 minutes!

## Installation

```bash
npm install @baseline-surgeon/cli
# or
npx @baseline-surgeon/cli
```

## Basic Usage

### 1. Analyze Your Code

Check what non-Baseline features you're using:

```bash
npx @baseline-surgeon/cli analyze "src/**/*.{js,ts,css}"
```

Output:
```
🔍 Analyzing files for non-Baseline features...
Files analyzed: 12
Findings: 8

Findings by feature:
  structured-clone: 2
  url-canparse: 1
  text-wrap-balance: 3
  css-has-selector: 2
```

### 2. See What Would Change

Preview transforms without modifying files:

```bash
npx @baseline-surgeon/cli fix "src/**/*.{js,ts,css}" --dry-run --diff
```

### 3. Apply Transforms

Actually fix the code:

```bash
npx @baseline-surgeon/cli fix "src/**/*.{js,ts,css}"
```

## Common Examples

### Target Specific Baseline

```bash
# Target browsers from 2024
npx @baseline-surgeon/cli fix "src/**/*.js" --target baseline-2024

# Target browsers from 2025
npx @baseline-surgeon/cli fix "src/**/*.js" --target baseline-2025
```

### Select Specific Transforms

```bash
# Only apply specific transforms
npx @baseline-surgeon/cli fix "src/**/*.js" \
  --include js.structured-clone,js.url-canparse

# Exclude specific transforms
npx @baseline-surgeon/cli fix "src/**/*.css" \
  --exclude css.nesting
```

### Generate Reports

```bash
# Markdown report
npx @baseline-surgeon/cli analyze "src/**/*" \
  --reporter markdown \
  --out reports/

# JSON report
npx @baseline-surgeon/cli analyze "src/**/*" \
  --reporter json \
  --out reports/
```

## Configuration File

Create `baseline-surgeon.config.ts`:

```typescript
export default {
  target: 'baseline-now',
  include: [
    'js.structured-clone',
    'js.url-canparse',
    'css.text-wrap-balance'
  ],
  exclude: [],
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/*.min.js'
  ]
};
```

Then run without flags:

```bash
npx @baseline-surgeon/cli fix "src/**/*"
```

## What Gets Transformed?

### JavaScript Examples

**Before:**
```javascript
const copy = structuredClone(data);
if (URL.canParse(url)) { /* ... */ }
const last = items.at(-1);
button.toggleAttribute('disabled');
await navigator.clipboard.writeText(text);
const signal = AbortSignal.timeout(5000);
const segmenter = new Intl.Segmenter('en');
```

**After:**
```javascript
import { structuredClone } from '@baseline-surgeon/polyfills/structured-clone';
import { canParseURL } from '@baseline-surgeon/polyfills/url-canparse';
import { arrayAt } from '@baseline-surgeon/polyfills/array-at';
import { toggleAttribute } from '@baseline-surgeon/polyfills/toggle-attribute';
import { clipboardWriteText } from '@baseline-surgeon/polyfills/clipboard-write-text';
import { abortSignalTimeout } from '@baseline-surgeon/polyfills/abort-signal-timeout';
import { IntlSegmenter } from '@baseline-surgeon/polyfills/intl-segmenter';

const copy = structuredClone(data);
if (canParseURL(url)) { /* ... */ }
const last = arrayAt(items, -1);
toggleAttribute(button, 'disabled');
await clipboardWriteText(text);
const signal = abortSignalTimeout(5000);
const segmenter = new IntlSegmenter('en');
```

### CSS Examples

**Before:**
```css
.title {
  text-wrap: balance;
}

.card:has(img) {
  padding: 0;
}

.button {
  &:hover { background: blue; }
}

input:focus-visible {
  outline: 2px solid blue;
}
```

**After:**
```css
@supports (text-wrap: balance) {
  .title {
    text-wrap: balance;
  }
}

@supports selector(:has(a)) {
  .card:has(img) {
    padding: 0;
  }
}

.button { }
.button:hover { background: blue; }

/* Fallback for browsers without :focus-visible */
input:focus {
  outline: 2px solid blue;
}
/* Modern :focus-visible */
input:focus-visible {
  outline: 2px solid blue;
}
```

## Tips & Tricks

### 1. Always Review Changes First

```bash
# ALWAYS use --dry-run first!
npx @baseline-surgeon/cli fix "src/**/*" --dry-run --diff | less
```

### 2. Use Version Control

```bash
# Commit before running
git add -A
git commit -m "Before Baseline Surgeon"

# Run transforms
npx @baseline-surgeon/cli fix "src/**/*"

# Review changes
git diff

# Commit or revert
git commit -m "Applied Baseline Surgeon transforms"
# or
git reset --hard HEAD
```

### 3. Incremental Adoption

```bash
# Start with one directory
npx @baseline-surgeon/cli fix "src/components/**/*" --dry-run

# Then expand
npx @baseline-surgeon/cli fix "src/**/*"
```

### 4. CI Integration

Add to `.github/workflows/baseline.yml`:

```yaml
name: Baseline Check

on: [pull_request]

jobs:
  baseline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx @baseline-surgeon/cli analyze "src/**/*" --strict
```

## List Available Transforms

```bash
npx @baseline-surgeon/cli list
```

Output:
```
Available Transforms:

js.structured-clone
  structuredClone polyfill
  Features: structured-clone

js.url-canparse
  URL.canParse polyfill
  Features: url-canparse

... (11 total)
```

## Troubleshooting

### "No findings detected"

Your code might already be Baseline-compatible! Try:
```bash
npx @baseline-surgeon/cli analyze "src/**/*" --target baseline-2025
```

### "Transform failed"

Some edge cases might not be handled. File an issue with:
- The code that failed
- The error message
- Your Baseline Surgeon version

### False Positives

Transforms might detect code in:
- Comments
- String literals
- Template strings

Use `--exclude` to skip specific transforms if needed.

## Next Steps

- 📖 Read [TRANSFORMS.md](./TRANSFORMS.md) for detailed transform docs
- 🎮 Try the [Playground](https://baseline-surgeon.dev) (coming soon)
- 🤝 [Contribute](../CONTRIBUTING.md) new transforms
- 🐛 [Report issues](https://github.com/baseline-surgeon/baseline-surgeon/issues)

## Need Help?

- 💬 [Discord Community](https://discord.gg/baseline-surgeon)
- 📧 Email: support@baseline-surgeon.dev
- 🐦 Twitter: [@BaselineSurgeon](https://twitter.com/BaselineSurgeon)

---

**Happy coding with confidence!** 🚀 