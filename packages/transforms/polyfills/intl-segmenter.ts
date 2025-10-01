/**
 * Best-effort polyfill for Intl.Segmenter
 * 
 * @warning This is a simplified implementation that only supports basic word/sentence segmentation.
 * It does NOT properly handle:
 * - Complex Unicode grapheme clusters
 * - Language-specific segmentation rules
 * - Proper sentence boundaries with abbreviations
 * 
 * For production use, consider a full polyfill library or feature detection with graceful degradation.
 */

interface SegmentData {
  segment: string;
  index: number;
  input: string;
  isWordLike?: boolean;
}

class PolyfillSegments {
  private segments: SegmentData[];
  
  constructor(segments: SegmentData[]) {
    this.segments = segments;
  }
  
  [Symbol.iterator](): Iterator<SegmentData> {
    return this.segments[Symbol.iterator]();
  }
  
  containing(index: number): SegmentData | undefined {
    return this.segments.find(seg => 
      index >= seg.index && index < seg.index + seg.segment.length
    );
  }
}

export class IntlSegmenter {
  private granularity: 'word' | 'sentence' | 'grapheme';
  private locale: string;
  
  constructor(locale?: string | string[], options?: { granularity?: 'word' | 'sentence' | 'grapheme' }) {
    this.locale = typeof locale === 'string' ? locale : (Array.isArray(locale) ? locale[0] : 'en');
    this.granularity = options?.granularity || 'word';
  }
  
  segment(input: string): PolyfillSegments {
    const segments: SegmentData[] = [];
    
    if (this.granularity === 'word') {
      this.segmentWords(input, segments);
    } else if (this.granularity === 'sentence') {
      this.segmentSentences(input, segments);
    } else {
      // Grapheme segmentation - just split by character (very naive)
      for (let i = 0; i < input.length; i++) {
        segments.push({
          segment: input[i],
          index: i,
          input
        });
      }
    }
    
    return new PolyfillSegments(segments);
  }
  
  private segmentWords(input: string, segments: SegmentData[]): void {
    // Simple word boundary detection using regex
    const wordRegex = /\S+|\s+/g;
    let match;
    
    while ((match = wordRegex.exec(input)) !== null) {
      segments.push({
        segment: match[0],
        index: match.index,
        input,
        isWordLike: /\S/.test(match[0])
      });
    }
  }
  
  private segmentSentences(input: string, segments: SegmentData[]): void {
    // Very basic sentence segmentation - split on period, exclamation, question mark followed by space
    const sentenceRegex = /[^.!?]+[.!?]+(?:\s+|$)/g;
    let match;
    let lastIndex = 0;
    
    while ((match = sentenceRegex.exec(input)) !== null) {
      segments.push({
        segment: match[0],
        index: match.index,
        input
      });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text if any
    if (lastIndex < input.length) {
      segments.push({
        segment: input.slice(lastIndex),
        index: lastIndex,
        input
      });
    }
  }
  
  resolvedOptions(): { locale: string; granularity: 'word' | 'sentence' | 'grapheme' } {
    return {
      locale: this.locale,
      granularity: this.granularity
    };
  }
}

// Export as Intl.Segmenter compatible
export const Segmenter = IntlSegmenter; 