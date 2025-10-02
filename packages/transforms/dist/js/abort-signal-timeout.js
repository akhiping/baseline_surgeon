export const abortSignalTimeoutTransform = {
    id: 'js.abort-signal-timeout',
    title: 'AbortSignal.timeout polyfill',
    featureIds: ['abort-signal-timeout'],
    detect(ctx) {
        if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
            return [];
        }
        const findings = [];
        const lines = ctx.content.split('\n');
        lines.forEach((line, index) => {
            const abortSignalMatch = line.match(/AbortSignal\.timeout\s*\(/);
            if (abortSignalMatch) {
                findings.push({
                    file: ctx.filePath,
                    loc: {
                        line: index + 1,
                        column: abortSignalMatch.index || 0,
                        endLine: index + 1,
                        endColumn: (abortSignalMatch.index || 0) + abortSignalMatch[0].length
                    },
                    snippet: line.trim(),
                    featureId: 'abort-signal-timeout',
                    transformId: 'js.abort-signal-timeout',
                    message: 'Usage of AbortSignal.timeout() detected'
                });
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        return !baseline.isBaseline('abort-signal-timeout', target);
    },
    apply(ctx, finding) {
        try {
            let content = ctx.content;
            const changes = [];
            // Add import if not present
            if (!content.includes('abortSignalTimeout')) {
                const importLine = "import { abortSignalTimeout } from '@baseline-surgeon/polyfills/abort-signal-timeout';\n";
                content = importLine + content;
                changes.push({
                    type: 'add',
                    line: 1,
                    content: importLine.trim(),
                    reason: 'Added AbortSignal.timeout polyfill import'
                });
            }
            // Replace AbortSignal.timeout with abortSignalTimeout
            content = content.replace(/AbortSignal\.timeout\s*\(/g, 'abortSignalTimeout(');
            changes.push({
                type: 'modify',
                line: finding.loc.line,
                content: 'Replaced AbortSignal.timeout with polyfill',
                reason: 'Updated to use polyfilled AbortSignal.timeout'
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
        return `AbortSignal.timeout() creates an AbortSignal that automatically aborts after a specified time. This transform provides a polyfill using AbortController and setTimeout. See: https://developer.mozilla.org/docs/Web/API/AbortSignal/timeout_static`;
    }
};
//# sourceMappingURL=abort-signal-timeout.js.map