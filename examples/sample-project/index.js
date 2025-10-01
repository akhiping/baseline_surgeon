// This sample project demonstrates features that Baseline Surgeon can transform

// 1. structuredClone usage
const originalData = { name: 'John', age: 30, hobbies: ['reading', 'coding'] };
const clonedData = structuredClone(originalData);

// 2. URL.canParse usage
const urlString = 'https://example.com';
if (URL.canParse(urlString)) {
  console.log('Valid URL');
}

// 3. Array.at usage
const items = ['apple', 'banana', 'cherry'];
const lastItem = items.at(-1);
console.log('Last item:', lastItem);

// 4. Element.toggleAttribute usage
const button = document.querySelector('button');
if (button) {
  button.toggleAttribute('disabled');
}

// 5. navigator.clipboard.writeText usage
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  console.log('Copied to clipboard');
}

// 6. AbortSignal.timeout usage
async function fetchWithTimeout() {
  const signal = AbortSignal.timeout(5000);
  const response = await fetch('/api/data', { signal });
  return response.json();
}

// 7. Intl.Segmenter usage
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
const text = 'Hello world';
for (const segment of segmenter.segment(text)) {
  console.log(segment.segment);
}

console.log('Sample project loaded with non-Baseline features'); 