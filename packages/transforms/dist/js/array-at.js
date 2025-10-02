export const arrayAtTransform = {
    id: 'js.array-at',
    title: 'Array.prototype.at polyfill',
    featureIds: ['array-at'],
    detect(ctx) {
        if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            // Match array.at() calls - simple regex for now
            const arrayAtMatch = line.match(/\w+\.at\s*\(/);
            if (arrayAtMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: arrayAtMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (arrayAtMatch.index || 0) + arrayAtMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'array-at',
                    transformId: 'js.array-at',
                    message: 'Usage of Array.prototype.at() detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('array-at', target);
    },
    apply(ctx, finding) {
        try {
            let content = ctx.content;
            const changes = [];
            // Add import at the top if not already present
            if (!content.includes('arrayAt')) {
                const importLine = "import { arrayAt } from '@baseline-surgeon/polyfills/array-at';\n";
                content = importLine + content;
                changes.push({
                    type: 'add',
                    line: 1,
                    content: importLine.trim(),
                    reason: 'Added Array.at polyfill import'
                });
            }
            // Replace .at( with arrayAt(array, 
            // This is a simplified approach - for production would use AST
            const lines = content.split('\n');
            const targetLineIndex = finding.loc.line - 1;
            if (targetLineIndex >= 0 && targetLineIndex < lines.length) {
                const originalLine = lines[targetLineIndex];
                // Replace arr.at(index) with arrayAt(arr, index)
                const modifiedLine = originalLine.replace(/(\w+)\.at\s*\(/, 'arrayAt($1, ');
                if (modifiedLine !== originalLine) {
                    lines[targetLineIndex] = modifiedLine;
                    content = lines.join('\n');
                    changes.push({
                        type: 'modify',
                        line: finding.loc.line,
                        content: 'Replaced .at() with arrayAt() polyfill',
                        reason: 'Updated to use polyfilled Array.at'
                    });
                }
            }
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
        return `Array.prototype.at() allows negative indices for accessing array elements from the end. This transform replaces it with a polyfill that provides the same functionality for older browsers. See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/at`;
    }
};
//# sourceMappingURL=array-at.js.map