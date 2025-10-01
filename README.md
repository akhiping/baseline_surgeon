# Baseline Surgeon 🔧

**Auto-refactor web code to Baseline-safe patterns using official web-features data**

Baseline Surgeon is an open-source TypeScript toolkit that analyzes your web code and automatically transforms modern features to be compatible with your target Baseline. It uses the official [web-features](https://github.com/web-platform-dx/web-features) dataset to make informed decisions about when to apply polyfills and fallbacks.

## What & Why

Modern web APIs are great, but browser support varies. Baseline Surgeon helps you use cutting-edge features while maintaining compatibility by:

- **Analyzing** your code for non-Baseline features
- **Transforming** them with safe, conservative polyfills and fallbacks  
- **Preserving** the original behavior through progressive enhancement
- **Reporting** what changed and why

## How It Works

Baseline Surgeon is Baseline-aware: it only applies transforms when features are **not Baseline** for your selected target (`baseline-now`, `baseline-2024`, `baseline-2025`). This ensures you get the benefits of modern APIs while maintaining broad browser support.

## Installation & Usage

```bash
# Analyze your code
npx @baseline-surgeon/cli analyze "src/**/*.{js,ts,tsx,css}"

# See what would be changed (dry run)
npx @baseline-surgeon/cli fix "src/**/*.{js,ts,tsx,css}" --dry-run --diff

# Apply transforms
npx @baseline-surgeon/cli fix "src/**/*.{js,ts,tsx,css}" --target baseline-now
```

## Supported Transforms

### JavaScript / DOM (7 transforms)

1. **`structuredClone`** → Polyfill for deep cloning objects (handles objects, arrays, Date, Map, Set)
2. **`URL.canParse`** → Safe URL validation fallback using try/catch
3. **`Array.prototype.at`** → Negative indexing support for arrays
4. **`Element.toggleAttribute`** → Toggle boolean attributes on DOM elements
5. **`navigator.clipboard.writeText`** → Clipboard API with execCommand fallback
6. **`AbortSignal.timeout`** → Auto-aborting signals using AbortController
7. **`Intl.Segmenter`** → Best-effort word/sentence segmentation (⚠️ simplified implementation)

### CSS (4 transforms)

8. **`text-wrap: balance`** → Wrapped in `@supports` for progressive enhancement
9. **`:has()` selector** → Wrapped in `@supports selector()` guard
10. **CSS Nesting** → Flattens nested selectors for broader compatibility
11. **`:focus-visible`** → Adds `:focus` fallback for older browsers

## Configuration

Create a `baseline-surgeon.config.ts` file:

```typescript
export default {
  target: 'baseline-now',
  include: ['js.structured-clone', 'css.text-wrap-balance'],
  exclude: [],
  accessibilityHeuristic: false,
  ignore: ['**/dist/**', '**/*.min.js']
} as const;
```

## 🌐 Live Playground

**Try it now: [https://baseline-surgeon-6lr2egvej-tars-projects-b718b6e1.vercel.app](https://baseline-surgeon-6lr2egvej-tars-projects-b718b6e1.vercel.app)**

Features:
- **Monaco Editor**: VS Code-quality editing experience
- **10 Interactive Examples**: See transforms in action
- **Before/After View**: Side-by-side comparison
- **Instant Feedback**: Run transforms in your browser
- **Explanations**: Learn why each transform is needed

Run locally:
```bash
cd apps/playground
npm install
npm run dev
```

## GitHub Action

Add to your workflow:

```yaml
- name: Baseline Surgeon
  uses: baseline-surgeon/action@v1
  with:
    target: baseline-now
    paths: "src/**/*.{js,ts,tsx,css}"
```

## Architecture

This is a monorepo with:

- **`@baseline-surgeon/core`** - Analysis engine and Baseline adapter
- **`@baseline-surgeon/transforms`** - Transform implementations and polyfills
- **`@baseline-surgeon/cli`** - Command-line interface  
- **`@baseline-surgeon/reporters`** - Markdown, JSON, and SARIF output
- **`@baseline-surgeon/action`** - GitHub Action wrapper

## Philosophy & Limitations

Baseline Surgeon follows a **progressive enhancement** philosophy:

- ✅ Safe, conservative transforms only
- ✅ Preserves original behavior when supported
- ✅ Clear explanations for every change
- ❌ No risky behavioral modifications
- ❌ No speculative fallbacks

## Development

```bash
npm install
npm run build
npm run test
```

## Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

## License

MIT - see [LICENSE](./LICENSE) file.

---

Made for the Baseline Tooling Hackathon
A.P