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

console.log('Sample project loaded with non-Baseline features'); 