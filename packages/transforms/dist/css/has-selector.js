export const hasSelectorTransform = {
    id: 'css.has-selector',
    title: ':has() selector @supports guard',
    featureIds: ['css-has-selector'],
    detect(ctx) {
        if (ctx.language !== 'css') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const hasMatch = line.match(/:has\s*\(/);
            if (hasMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: hasMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (hasMatch.index || 0) + hasMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'css-has-selector',
                    transformId: 'css.has-selector',
                    message: 'Usage of :has() selector detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('css-has-selector', target);
    },
    apply(ctx, finding) {
        try {
            const lines = ctx.content.split('\n');
            const changes = [];
            // Find the rule containing :has()
            const targetLine = finding.loc.line - 1;
            // Look backwards to find the opening brace
            let ruleStart = targetLine;
            while (ruleStart > 0 && !lines[ruleStart]?.includes('{')) {
                ruleStart--;
            }
            // Include the selector line
            if (ruleStart > 0 && lines[ruleStart].includes('{')) {
                ruleStart--;
            }
            // Look forwards to find the closing brace
            let ruleEnd = targetLine;
            while (ruleEnd < lines.length - 1 && !lines[ruleEnd]?.includes('}')) {
                ruleEnd++;
            }
            // Extract the rule
            const ruleLines = lines.slice(ruleStart, ruleEnd + 1);
            const originalRule = ruleLines.join('\n');
            // Wrap in @supports
            const wrappedRule = `@supports selector(:has(a)) {\n${originalRule}\n}`;
            // Replace the original rule
            lines.splice(ruleStart, ruleEnd - ruleStart + 1, wrappedRule);
            changes.push({
                type: 'modify',
                line: ruleStart + 1,
                content: 'Wrapped :has() selector in @supports query',
                reason: 'Added progressive enhancement for :has() selector'
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
        return `:has() is a relational pseudo-class that selects elements containing specific descendants. This transform wraps rules using :has() in @supports selector(:has(a)) for progressive enhancement. No fallback is provided - this is enhancement only. See: https://developer.mozilla.org/docs/Web/CSS/:has`;
    }
};
//# sourceMappingURL=has-selector.js.map