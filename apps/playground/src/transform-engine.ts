// Simplified standalone transform engine for playground demo

export type BaselineTarget = 'baseline-now' | 'baseline-2024' | 'baseline-2025';

export interface TransformResult {
  code: string;
  explanations: string[];
}

// Simple regex-based transforms for demo purposes
export async function transformCode(
  code: string,
  language: 'javascript' | 'typescript' | 'css',
  _target: BaselineTarget
): Promise<TransformResult> {
  let transformedCode = code;
  const explanations: string[] = [];

  if (language === 'javascript' || language === 'typescript') {
    // Transform structuredClone
    if (code.includes('structuredClone(')) {
      transformedCode = transformedCode.replace(
        /^/,
        "import { structuredClone } from '@baseline-surgeon/polyfills/structured-clone';\n\n"
      );
      explanations.push(
        '<strong>structuredClone polyfill:</strong> Added polyfill for deep cloning objects. Supports objects, arrays, Date, RegExp, Map, and Set. See: <a href="https://developer.mozilla.org/docs/Web/API/structuredClone" target="_blank">MDN</a>'
      );
    }

    // Transform URL.canParse
    if (code.includes('URL.canParse(')) {
      if (!transformedCode.includes('canParseURL')) {
        transformedCode = transformedCode.replace(
          /^/,
          "import { canParseURL } from '@baseline-surgeon/polyfills/url-canparse';\n"
        );
      }
      transformedCode = transformedCode.replace(/URL\.canParse\s*\(/g, 'canParseURL(');
      explanations.push(
        '<strong>URL.canParse polyfill:</strong> Replaced with try/catch wrapper around URL constructor for safe validation. See: <a href="https://developer.mozilla.org/docs/Web/API/URL/canParse_static" target="_blank">MDN</a>'
      );
    }

    // Transform Array.at
    if (code.match(/\w+\.at\s*\(/)) {
      if (!transformedCode.includes('arrayAt')) {
        transformedCode = transformedCode.replace(
          /^/,
          "import { arrayAt } from '@baseline-surgeon/polyfills/array-at';\n"
        );
      }
      transformedCode = transformedCode.replace(/(\w+)\.at\s*\(/g, 'arrayAt($1, ');
      explanations.push(
        '<strong>Array.at polyfill:</strong> Added support for negative array indexing. See: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/at" target="_blank">MDN</a>'
      );
    }

    // Transform clipboard.writeText
    if (code.includes('navigator.clipboard.writeText(')) {
      if (!transformedCode.includes('clipboardWriteText')) {
        transformedCode = transformedCode.replace(
          /^/,
          "import { clipboardWriteText } from '@baseline-surgeon/polyfills/clipboard-write-text';\n"
        );
      }
      transformedCode = transformedCode.replace(/navigator\.clipboard\.writeText\s*\(/g, 'clipboardWriteText(');
      explanations.push(
        '<strong>Clipboard API polyfill:</strong> Falls back to execCommand for older browsers. See: <a href="https://developer.mozilla.org/docs/Web/API/Clipboard/writeText" target="_blank">MDN</a>'
      );
    }

    // Transform AbortSignal.timeout
    if (code.includes('AbortSignal.timeout(')) {
      if (!transformedCode.includes('abortSignalTimeout')) {
        transformedCode = transformedCode.replace(
          /^/,
          "import { abortSignalTimeout } from '@baseline-surgeon/polyfills/abort-signal-timeout';\n"
        );
      }
      transformedCode = transformedCode.replace(/AbortSignal\.timeout\s*\(/g, 'abortSignalTimeout(');
      explanations.push(
        '<strong>AbortSignal.timeout polyfill:</strong> Uses AbortController + setTimeout for automatic timeouts. See: <a href="https://developer.mozilla.org/docs/Web/API/AbortSignal/timeout_static" target="_blank">MDN</a>'
      );
    }

    // Transform Intl.Segmenter
    if (code.includes('new Intl.Segmenter(')) {
      if (!transformedCode.includes('IntlSegmenter')) {
        transformedCode = transformedCode.replace(
          /^/,
          "import { IntlSegmenter } from '@baseline-surgeon/polyfills/intl-segmenter';\n"
        );
      }
      transformedCode = transformedCode.replace(/new\s+Intl\.Segmenter\s*\(/g, 'new IntlSegmenter(');
      explanations.push(
        '<strong>Intl.Segmenter polyfill:</strong> Best-effort word/sentence segmentation. ⚠️ Simplified implementation. See: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter" target="_blank">MDN</a>'
      );
    }
  } else if (language === 'css') {
    // Transform text-wrap: balance
    if (code.includes('text-wrap: balance')) {
      transformedCode = transformedCode.replace(
        /(\.[\w-]+\s*\{[^}]*text-wrap:\s*balance[^}]*\})/g,
        '@supports (text-wrap: balance) {\n$1\n}'
      );
      explanations.push(
        '<strong>text-wrap: balance guard:</strong> Wrapped in @supports for progressive enhancement. See: <a href="https://developer.mozilla.org/docs/Web/CSS/text-wrap" target="_blank">MDN</a>'
      );
    }

    // Transform :has() selector
    if (code.includes(':has(')) {
      transformedCode = transformedCode.replace(
        /(\.[\w-]+:has\([^)]+\)\s*\{[^}]+\})/g,
        '@supports selector(:has(a)) {\n$1\n}'
      );
      explanations.push(
        '<strong>:has() selector guard:</strong> Wrapped in @supports for progressive enhancement. See: <a href="https://developer.mozilla.org/docs/Web/CSS/:has" target="_blank">MDN</a>'
      );
    }

    // Transform CSS nesting
    if (code.includes('&')) {
      const lines = transformedCode.split('\n');
      const processed: string[] = [];
      let parentSelector = '';
      
      lines.forEach(line => {
        if (line.trim().match(/^[\w.#-]+.*\{$/)) {
          parentSelector = line.trim().replace('{', '').trim();
          processed.push(line);
        } else if (line.trim().startsWith('&')) {
          // Flatten nested selector
          processed.push(line.replace('&', parentSelector));
        } else {
          processed.push(line);
          if (line.trim() === '}') {
            parentSelector = '';
          }
        }
      });
      
      transformedCode = processed.join('\n');
      explanations.push(
        '<strong>CSS Nesting flattened:</strong> Converted nested selectors to flat rules for broader compatibility. See: <a href="https://developer.mozilla.org/docs/Web/CSS/CSS_nesting" target="_blank">MDN</a>'
      );
    }

    // Transform :focus-visible
    if (code.includes(':focus-visible')) {
      const focusRule = code.match(/([^\{]+:focus-visible[^\{]*\{[^\}]+\})/);
      if (focusRule) {
        const fallback = focusRule[0].replace(/:focus-visible/g, ':focus');
        transformedCode = transformedCode.replace(
          focusRule[0],
          `/* Fallback for browsers without :focus-visible */\n${fallback}\n\n/* Modern :focus-visible */\n${focusRule[0]}`
        );
        explanations.push(
          '<strong>:focus-visible fallback:</strong> Added :focus fallback for older browsers. See: <a href="https://developer.mozilla.org/docs/Web/CSS/:focus-visible" target="_blank">MDN</a>'
        );
      }
    }
  }

  return {
    code: transformedCode,
    explanations
  };
} 