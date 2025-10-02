export const textWrapBalanceTransform = {
    id: 'css.text-wrap-balance',
    title: 'text-wrap: balance @supports guard',
    featureIds: ['css-text-wrap-balance'],
    detect(ctx) {
        if (ctx.language !== 'css') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const textWrapMatch = line.match(/text-wrap\s*:\s*balance/);
            if (textWrapMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: textWrapMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (textWrapMatch.index || 0) + textWrapMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'css-text-wrap-balance',
                    transformId: 'css.text-wrap-balance',
                    message: 'Usage of text-wrap: balance detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('css-text-wrap-balance', target);
    },
    apply(ctx, finding) {
        try {
            const lines = ctx.content.split('\n');
            const changes = [];
            let modified = false;
            // Find the rule containing text-wrap: balance
            const targetLine = finding.loc.line - 1; // Convert to 0-based
            // Look backwards to find the opening brace of the rule
            let ruleStart = targetLine;
            while (ruleStart > 0 && !lines[ruleStart].includes('{')) {
                ruleStart--;
            }
            // Look forwards to find the closing brace
            let ruleEnd = targetLine;
            while (ruleEnd < lines.length - 1 && !lines[ruleEnd].includes('}')) {
                ruleEnd++;
            }
            // Extract the rule
            const ruleLines = lines.slice(ruleStart, ruleEnd + 1);
            const originalRule = ruleLines.join('\n');
            // Wrap the rule in @supports
            const wrappedRule = `@supports (text-wrap: balance) {\n${originalRule}\n}`;
            // Replace the original rule with the wrapped version
            lines.splice(ruleStart, ruleEnd - ruleStart + 1, wrappedRule);
            changes.push({
                type: 'modify',
                line: ruleStart + 1,
                content: 'Wrapped text-wrap: balance in @supports query',
                reason: 'Added progressive enhancement for text-wrap: balance'
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
        return `text-wrap: balance is a CSS property that balances text across multiple lines, but it's not widely supported. This transform wraps the rule in @supports (text-wrap: balance) for progressive enhancement. See: https://developer.mozilla.org/docs/Web/CSS/text-wrap`;
    }
};
//# sourceMappingURL=text-wrap-balance.js.map