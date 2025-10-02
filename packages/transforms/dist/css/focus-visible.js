export const focusVisibleTransform = {
    id: 'css.focus-visible',
    title: ':focus-visible fallback',
    featureIds: ['css-focus-visible'],
    detect(ctx) {
        if (ctx.language !== 'css') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const focusVisibleMatch = line.match(/:focus-visible/);
            if (focusVisibleMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: focusVisibleMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (focusVisibleMatch.index || 0) + focusVisibleMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'css-focus-visible',
                    transformId: 'css.focus-visible',
                    message: 'Usage of :focus-visible detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('css-focus-visible', target);
    },
    apply(ctx, finding) {
        try {
            const lines = ctx.content.split('\n');
            const changes = [];
            const targetLine = finding.loc.line - 1;
            // Find the complete rule
            let ruleStart = targetLine;
            while (ruleStart > 0 && !lines[ruleStart - 1]?.includes('}')) {
                ruleStart--;
            }
            let ruleEnd = targetLine;
            while (ruleEnd < lines.length - 1 && !lines[ruleEnd]?.includes('}')) {
                ruleEnd++;
            }
            // Extract the original rule
            const originalLines = lines.slice(ruleStart, ruleEnd + 1);
            const originalRule = originalLines.join('\n');
            // Create fallback with :focus
            const fallbackRule = originalRule.replace(/:focus-visible/g, ':focus');
            // Insert fallback before the original rule
            const combined = `/* Fallback for browsers without :focus-visible */\n${fallbackRule}\n\n/* Modern :focus-visible */\n${originalRule}`;
            // Replace the original rule
            lines.splice(ruleStart, ruleEnd - ruleStart + 1, combined);
            changes.push({
                type: 'modify',
                line: ruleStart + 1,
                content: 'Added :focus fallback for :focus-visible',
                reason: 'Provides graceful degradation for browsers without :focus-visible support'
            });
            return {
                success: true,
                content: lines.join('\n'),
                changes
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to apply transform: ${error}`,
                changes: []
            };
        }
    },
    explain(finding) {
        return `:focus-visible shows focus indicators only for keyboard navigation. This transform adds a :focus fallback rule before the :focus-visible rule, providing broader compatibility while maintaining the enhanced behavior in supporting browsers. See: https://developer.mozilla.org/docs/Web/CSS/:focus-visible`;
    }
};
//# sourceMappingURL=focus-visible.js.map