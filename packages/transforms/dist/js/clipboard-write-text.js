export const clipboardWriteTextTransform = {
    id: 'js.clipboard-write-text',
    title: 'navigator.clipboard.writeText polyfill',
    featureIds: ['clipboard-write-text'],
    detect(ctx) {
        if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const clipboardMatch = line.match(/navigator\.clipboard\.writeText\s*\(/);
            if (clipboardMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: clipboardMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (clipboardMatch.index || 0) + clipboardMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'clipboard-write-text',
                    transformId: 'js.clipboard-write-text',
                    message: 'Usage of navigator.clipboard.writeText() detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('clipboard-write-text', target);
    },
    apply(ctx, finding) {
        try {
            let content = ctx.content;
            const changes = [];
            // Add import if not present
            if (!content.includes('clipboardWriteText')) {
                const importLine = "import { clipboardWriteText } from '@baseline-surgeon/polyfills/clipboard-write-text';\n";
                content = importLine + content;
                changes.push({
                    type: 'add',
                    line: 1,
                    content: importLine.trim(),
                    reason: 'Added clipboard.writeText polyfill import'
                });
            }
            // Replace navigator.clipboard.writeText with clipboardWriteText
            content = content.replace(/navigator\.clipboard\.writeText\s*\(/g, 'clipboardWriteText(');
            changes.push({
                type: 'modify',
                line: finding.loc.line,
                content: 'Replaced navigator.clipboard.writeText with polyfill',
                reason: 'Updated to use polyfilled clipboard.writeText with execCommand fallback'
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
        return `navigator.clipboard.writeText() copies text to the clipboard. This transform provides a polyfill that falls back to document.execCommand('copy') for older browsers. See: https://developer.mozilla.org/docs/Web/API/Clipboard/writeText`;
    }
};
//# sourceMappingURL=clipboard-write-text.js.map