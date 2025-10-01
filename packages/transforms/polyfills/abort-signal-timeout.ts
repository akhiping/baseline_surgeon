/**
 * Polyfill for AbortSignal.timeout
 */

export function abortSignalTimeout(ms: number): AbortSignal {
  if ('timeout' in AbortSignal) {
    return (AbortSignal as any).timeout(ms);
  }

  return polyfillAbortSignalTimeout(ms);
}

function polyfillAbortSignalTimeout(ms: number): AbortSignal {
  const controller = new AbortController();
  
  setTimeout(() => {
    controller.abort(new DOMException('TimeoutError', 'TimeoutError'));
  }, ms);
  
  return controller.signal;
} 