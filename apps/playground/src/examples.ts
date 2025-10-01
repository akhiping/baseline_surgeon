export interface Example {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'typescript' | 'css';
  code: string;
  transformIds: string[];
}

export const EXAMPLES: Example[] = [
  {
    id: 'structured-clone',
    title: 'structuredClone',
    description: 'Deep cloning objects with structuredClone API',
    language: 'javascript',
    code: `// Deep clone complex objects
const original = {
  user: 'Alice',
  score: 42,
  settings: {
    theme: 'dark',
    notifications: true
  },
  tags: ['dev', 'js']
};

const cloned = structuredClone(original);
cloned.settings.theme = 'light';

console.log(original.settings.theme); // 'dark'
console.log(cloned.settings.theme);   // 'light'`,
    transformIds: ['js.structured-clone']
  },
  {
    id: 'url-canparse',
    title: 'URL.canParse',
    description: 'Safely validate URLs before parsing',
    language: 'javascript',
    code: `// Validate URLs without try/catch
function isValidUrl(input) {
  return URL.canParse(input);
}

console.log(isValidUrl('https://example.com')); // true
console.log(isValidUrl('not a url')); // false

// Safe to use in conditions
if (URL.canParse(userInput)) {
  const url = new URL(userInput);
  console.log(url.hostname);
}`,
    transformIds: ['js.url-canparse']
  },
  {
    id: 'array-at',
    title: 'Array.at()',
    description: 'Access array elements with negative indices',
    language: 'javascript',
    code: `// Access array elements from the end
const items = ['first', 'second', 'third', 'last'];

const last = items.at(-1);      // 'last'
const secondLast = items.at(-2); // 'third'
const first = items.at(0);       // 'first'

// Useful for dynamic access
function getRelativeItem(arr, index) {
  return arr.at(index);
}`,
    transformIds: ['js.array-at']
  },
  {
    id: 'clipboard',
    title: 'Clipboard API',
    description: 'Copy text to clipboard',
    language: 'javascript',
    code: `// Copy to clipboard with async/await
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copied!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Usage with button click
document.querySelector('#copy-btn').addEventListener('click', () => {
  copyToClipboard('Hello, World!');
});`,
    transformIds: ['js.clipboard-write-text']
  },
  {
    id: 'abort-signal',
    title: 'AbortSignal.timeout',
    description: 'Auto-canceling fetch with timeout',
    language: 'javascript',
    code: `// Fetch with automatic timeout
async function fetchWithTimeout(url, ms = 5000) {
  try {
    const signal = AbortSignal.timeout(ms);
    const response = await fetch(url, { signal });
    return await response.json();
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.error('Request timed out');
    }
    throw err;
  }
}

// Usage
fetchWithTimeout('/api/data', 3000)
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
    transformIds: ['js.abort-signal-timeout']
  },
  {
    id: 'text-wrap-balance',
    title: 'text-wrap: balance',
    description: 'Balanced text wrapping for headlines',
    language: 'css',
    code: `.headline {
  text-wrap: balance;
  font-size: 3rem;
  line-height: 1.2;
  max-width: 50ch;
}

.card-title {
  text-wrap: balance;
  font-size: 1.5rem;
}

/* Prevents awkward single words on last line */
.intro-text {
  text-wrap: balance;
  max-width: 60ch;
}`,
    transformIds: ['css.text-wrap-balance']
  },
  {
    id: 'has-selector',
    title: ':has() selector',
    description: 'Parent selector based on children',
    language: 'css',
    code: `/* Style card only if it contains an image */
.card:has(img) {
  padding: 0;
  overflow: hidden;
}

/* Style form with errors */
form:has(.error) {
  border: 2px solid red;
}

/* Article with code blocks */
article:has(pre) {
  background: #f5f5f5;
  padding: 2rem;
}

/* Navigation with active link */
nav:has(.active) {
  border-bottom: 2px solid blue;
}`,
    transformIds: ['css.has-selector']
  },
  {
    id: 'css-nesting',
    title: 'CSS Nesting',
    description: 'Nested selectors for cleaner CSS',
    language: 'css',
    code: `.button {
  background: blue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background: darkblue;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &.primary {
    background: green;
  }
  
  & .icon {
    margin-right: 0.5rem;
  }
}`,
    transformIds: ['css.nesting']
  },
  {
    id: 'focus-visible',
    title: ':focus-visible',
    description: 'Keyboard-only focus styles',
    language: 'css',
    code: `/* Show focus ring only for keyboard navigation */
button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}

input:focus-visible {
  border-color: blue;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}

a:focus-visible {
  outline: 2px dashed orange;
  outline-offset: 4px;
}

/* Remove default focus styles */
:focus:not(:focus-visible) {
  outline: none;
}`,
    transformIds: ['css.focus-visible']
  },
  {
    id: 'all-features',
    title: 'All JavaScript Features',
    description: 'Combined example showing multiple transforms',
    language: 'javascript',
    code: `// Multiple modern JavaScript features
async function processData(items, url) {
  // 1. Array.at for accessing from end
  const lastItem = items.at(-1);
  
  // 2. structuredClone for deep copying
  const backup = structuredClone(items);
  
  // 3. URL.canParse for validation
  if (!URL.canParse(url)) {
    throw new Error('Invalid URL');
  }
  
  // 4. AbortSignal.timeout for fetch timeout
  const signal = AbortSignal.timeout(5000);
  const response = await fetch(url, { signal });
  const data = await response.json();
  
  // 5. Clipboard API
  await navigator.clipboard.writeText(JSON.stringify(data));
  
  return { lastItem, backup, data };
}`,
    transformIds: [
      'js.array-at',
      'js.structured-clone',
      'js.url-canparse',
      'js.abort-signal-timeout',
      'js.clipboard-write-text'
    ]
  }
];

export function getExampleById(id: string): Example | undefined {
  return EXAMPLES.find(ex => ex.id === id);
}

export function getExamplesByLanguage(language: 'javascript' | 'typescript' | 'css'): Example[] {
  return EXAMPLES.filter(ex => ex.language === language);
} 