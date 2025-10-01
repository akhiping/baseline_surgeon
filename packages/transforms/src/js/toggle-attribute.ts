import type { Transform, Finding, FileContext, ApplyResult, BaselineTarget, BaselineAdapter } from '@baseline-surgeon/core';

export const toggleAttributeTransform: Transform = {
  id: 'js.toggle-attribute',
  title: 'Element.toggleAttribute polyfill',
  featureIds: ['toggle-attribute'],

  detect(ctx: FileContext): Finding[] {
    if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
      return [];
    }

    const findings: Finding[] = [];
    const lines = ctx.content.split('\n');

    lines.forEach((line, index) => {
      const toggleAttrMatch = line.match(/\.toggleAttribute\s*\(/);
      if (toggleAttrMatch) {
        findings.push({
          file: ctx.filePath,
          loc: {
            line: index + 1,
            column: toggleAttrMatch.index || 0,
            endLine: index + 1,
            endColumn: (toggleAttrMatch.index || 0) + toggleAttrMatch[0].length
          },
          snippet: line.trim(),
          featureId: 'toggle-attribute',
          transformId: 'js.toggle-attribute',
          message: 'Usage of Element.toggleAttribute() detected'
        });
      }
    });

    return findings;
  },

  canApply(finding: Finding, target: BaselineTarget, baseline: BaselineAdapter): boolean {
    return !baseline.isBaseline('toggle-attribute', target);
  },

  apply(ctx: FileContext, finding: Finding): ApplyResult {
    try {
      let content = ctx.content;
      const changes: ApplyResult['changes'] = [];

      // Add import if not present
      if (!content.includes('toggleAttribute')) {
        const importLine = "import { toggleAttribute } from '@baseline-surgeon/polyfills/toggle-attribute';\n";
        content = importLine + content;
        changes.push({
          type: 'add',
          line: 1,
          content: importLine.trim(),
          reason: 'Added toggleAttribute polyfill import'
        });
      }

      // Replace element.toggleAttribute(...) with toggleAttribute(element, ...)
      const lines = content.split('\n');
      const targetLineIndex = finding.loc.line - 1;
      
      if (targetLineIndex >= 0 && targetLineIndex < lines.length) {
        const originalLine = lines[targetLineIndex];
        const modifiedLine = originalLine.replace(/(\w+)\.toggleAttribute\s*\(/, 'toggleAttribute($1, ');
        
        if (modifiedLine !== originalLine) {
          lines[targetLineIndex] = modifiedLine;
          content = lines.join('\n');
          
          changes.push({
            type: 'modify',
            line: finding.loc.line,
            content: 'Replaced .toggleAttribute() with polyfill',
            reason: 'Updated to use polyfilled toggleAttribute'
          });
        }
      }

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
    return `Element.toggleAttribute() toggles a boolean attribute on an element. This transform provides a polyfill for browsers that don't support it. See: https://developer.mozilla.org/docs/Web/API/Element/toggleAttribute`;
  }
}; 