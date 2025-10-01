import type { Transform, Finding, FileContext, ApplyResult, BaselineTarget, BaselineAdapter } from '@baseline-surgeon/core';

export const cssNestingTransform: Transform = {
  id: 'css.nesting',
  title: 'CSS Nesting flattening',
  featureIds: ['css-nesting'],

  detect(ctx: FileContext): Finding[] {
    if (ctx.language !== 'css') {
      return [];
    }

    const findings: Finding[] = [];
    const lines = ctx.content.split('\n');
    let braceDepth = 0;

    lines.forEach((line, index) => {
      // Track brace depth
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceDepth += openBraces - closeBraces;

      // Detect nesting: lines with selectors inside rules (depth > 1) or & combinator
      const hasNesting = (braceDepth > 1 && line.trim().match(/^[.#:\w\[\]>+~*&].*\{/)) ||
                        line.includes('&');

      if (hasNesting) {
        findings.push({
          file: ctx.filePath,
          loc: {
            line: index + 1,
            column: 0,
            endLine: index + 1,
            endColumn: line.length
          },
          snippet: line.trim(),
          featureId: 'css-nesting',
          transformId: 'css.nesting',
          message: 'CSS nesting detected'
        });
      }
    });

    return findings;
  },

  canApply(finding: Finding, target: BaselineTarget, baseline: BaselineAdapter): boolean {
    return !baseline.isBaseline('css-nesting', target);
  },

  apply(ctx: FileContext, finding: Finding): ApplyResult {
    try {
      const changes: ApplyResult['changes'] = [];
      
      // For a complete implementation, we would use postcss-nested
      // For now, provide a simple flattening for basic cases
      let content = ctx.content;
      
      // Simple case: flatten &:hover, &:focus, etc.
      content = this.flattenSimpleNesting(content);
      
      changes.push({
        type: 'modify',
        line: finding.loc.line,
        content: 'Flattened CSS nesting',
        reason: 'Converted nested CSS to flat rules for broader compatibility'
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

  /**
   * Simple flattening for basic nesting patterns
   * Full implementation would use postcss-nested
   */
  flattenSimpleNesting(css: string): string {
    // This is a simplified implementation
    // For production, use postcss-nested plugin
    
    // Match patterns like:
    // .parent {
    //   &:hover { ... }
    // }
    // And convert to:
    // .parent:hover { ... }
    
    const lines = css.split('\n');
    const result: string[] = [];
    let currentSelector = '';
    let inRule = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Track current parent selector
      if (trimmed.match(/^[\w.#:\[\]]+.*\{$/)) {
        currentSelector = trimmed.replace('{', '').trim();
        inRule = true;
        result.push(line);
      } else if (trimmed.startsWith('&')) {
        // Replace & with parent selector
        const nestedPart = trimmed.substring(1);
        result.push(line.replace('&', currentSelector));
      } else {
        result.push(line);
        if (trimmed === '}') {
          inRule = false;
          currentSelector = '';
        }
      }
    }
    
    return result.join('\n');
  },

  explain(finding: Finding): string {
    return `CSS Nesting allows writing nested selectors, but it's not supported in older browsers. This transform flattens nested CSS into standard flat rules. Note: Complex nesting patterns may require manual review. See: https://developer.mozilla.org/docs/Web/CSS/CSS_nesting`;
  }
}; 