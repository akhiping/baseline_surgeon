import type { Transform, Finding, FileContext, ApplyResult, BaselineTarget, BaselineAdapter } from '@baseline-surgeon/core';

export const intlSegmenterTransform: Transform = {
  id: 'js.intl-segmenter',
  title: 'Intl.Segmenter polyfill',
  featureIds: ['intl-segmenter'],

  detect(ctx: FileContext): Finding[] {
    if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
      return [];
    }

    const findings: Finding[] = [];
    const lines = ctx.content.split('\n');

    lines.forEach((line, index) => {
      const segmenterMatch = line.match(/new\s+Intl\.Segmenter\s*\(/);
      if (segmenterMatch) {
        findings.push({
          file: ctx.filePath,
          loc: {
            line: index + 1,
            column: segmenterMatch.index || 0,
            endLine: index + 1,
            endColumn: (segmenterMatch.index || 0) + segmenterMatch[0].length
          },
          snippet: line.trim(),
          featureId: 'intl-segmenter',
          transformId: 'js.intl-segmenter',
          message: 'Usage of Intl.Segmenter detected'
        });
      }
    });

    return findings;
  },

  canApply(finding: Finding, target: BaselineTarget, baseline: BaselineAdapter): boolean {
    return !baseline.isBaseline('intl-segmenter', target);
  },

  apply(ctx: FileContext, finding: Finding): ApplyResult {
    try {
      let content = ctx.content;
      const changes: ApplyResult['changes'] = [];

      // Add import if not present
      if (!content.includes('IntlSegmenter') && !content.includes('from \'@baseline-surgeon/polyfills/intl-segmenter\'')) {
        const importLine = "import { IntlSegmenter } from '@baseline-surgeon/polyfills/intl-segmenter';\n";
        content = importLine + content;
        changes.push({
          type: 'add',
          line: 1,
          content: importLine.trim(),
          reason: 'Added Intl.Segmenter polyfill import'
        });
      }

      // Replace new Intl.Segmenter with new IntlSegmenter
      content = content.replace(/new\s+Intl\.Segmenter\s*\(/g, 'new IntlSegmenter(');
      
      changes.push({
        type: 'modify',
        line: finding.loc.line,
        content: 'Replaced Intl.Segmenter with polyfill',
        reason: 'Updated to use best-effort Intl.Segmenter polyfill (basic word/sentence segmentation)'
      });

      return {
        success: true,
        content,
        changes
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to apply transform: ${error}`,
        changes: []
      };
    }
  },

  explain(finding: Finding): string {
    return `Intl.Segmenter provides locale-aware text segmentation. This transform adds a best-effort polyfill with basic word and sentence segmentation. ⚠️ The polyfill does NOT handle complex Unicode or language-specific rules. Consider feature detection for production. See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter`;
  }
}; 