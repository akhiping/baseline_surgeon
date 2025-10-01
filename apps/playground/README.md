# Baseline Surgeon Playground

Interactive web-based demo of Baseline Surgeon transforms.

## Features

- **Monaco Editor**: Professional code editing experience
- **Two-pane view**: See before and after side-by-side
- **10 Pre-loaded examples**: Covering all major transforms
- **Instant transforms**: Run transforms in-browser
- **Explanation panel**: Understand what changed and why
- **Responsive design**: Works on desktop and mobile

## Running Locally

```bash
# From the playground directory
npm install
npm run dev
```

Open http://localhost:5173

## Building

```bash
npm run build
```

Output will be in `/dist` directory.

## Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

## Technology Stack

- **Vite**: Lightning-fast dev server and build tool
- **React**: UI framework
- **TypeScript**: Type-safe development
- **Monaco Editor**: VS Code's editor in the browser
- **Baseline Surgeon**: Core transform engine

## Examples Included

1. **structuredClone** - Deep object cloning
2. **URL.canParse** - URL validation
3. **Array.at()** - Negative array indexing
4. **Clipboard API** - Copy to clipboard
5. **AbortSignal.timeout** - Fetch with timeout
6. **text-wrap: balance** - Balanced text wrapping (CSS)
7. **:has() selector** - Parent selector (CSS)
8. **CSS Nesting** - Nested CSS rules
9. **:focus-visible** - Keyboard-only focus (CSS)
10. **All Features Combined** - Multi-transform demo

## How It Works

1. User selects an example or writes custom code
2. Chooses a Baseline target (now/2024/2025)
3. Clicks "Run Transform"
4. Transform engine runs in-browser
5. Results shown with explanations

## Limitations

- Simplified transform engine (not full CLI)
- No file system access
- Limited AST manipulation in browser
- Some transforms may not work perfectly in browser context

## Contributing

Want to add more examples? Edit `src/examples.ts`

Want to improve the UI? Edit `src/App.tsx` and `src/App.css` 