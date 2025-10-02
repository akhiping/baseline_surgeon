export const urlCanParseTransform = {
    id: 'js.url-canparse',
    title: 'URL.canParse polyfill',
    featureIds: ['url-canparse'],
    detect(ctx) {
        if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const urlCanParseMatch = line.match(/URL\.canParse\s*\(/);
            if (urlCanParseMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: urlCanParseMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (urlCanParseMatch.index || 0) + urlCanParseMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'url-canparse',
                    transformId: 'js.url-canparse',
                    message: 'Usage of URL.canParse() detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('url-canparse', target);
    },
    apply(ctx, finding) {
        try {
            let content = ctx.content;
            const changes = [];
            // Add import at the top if not already present
            if (!content.includes('canParseURL')) {
                const importLine = "import { canParseURL } from '@baseline-surgeon/polyfills/url-canparse';\n";
                content = importLine + content;
                changes.push({
                    type: 'add',
                    line: 1,
                    content: importLine.trim(),
                    reason: 'Added URL.canParse polyfill import'
                });
            }
            // Replace URL.canParse with canParseURL
            content = content.replace(/URL\.canParse\s*\(/g, 'canParseURL(');
            changes.push({
                type: 'modify',
                line: finding.loc.line,
                content: 'Replaced URL.canParse with canParseURL polyfill',
                reason: 'Updated to use polyfilled URL.canParse'
            });
            return {
                success: true,
                content,
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
        return `URL.canParse() is a static method that checks if a string can be parsed as a URL. This transform replaces it with a polyfill that uses try/catch with the URL constructor. See: https://developer.mozilla.org/docs/Web/API/URL/canParse_static`;
    }
};
//# sourceMappingURL=url-canparse.js.map