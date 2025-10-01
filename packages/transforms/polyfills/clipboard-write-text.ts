/**
 * Polyfill for navigator.clipboard.writeText
 * Falls back to execCommand if Clipboard API is not available
 */

export async function clipboardWriteText(text: string): Promise<void> {
  // Try native Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback to execCommand
  return polyfillClipboardWriteText(text);
}

function polyfillClipboardWriteText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      
      const success = document.execCommand('copy');
      
      if (success) {
        resolve();
      } else {
        reject(new Error('execCommand copy failed'));
      }
    } catch (error) {
      reject(error);
    } finally {
      document.body.removeChild(textarea);
    }
  });
} 