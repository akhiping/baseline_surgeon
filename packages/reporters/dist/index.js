// Export Markdown Reporter
export { MarkdownReporter } from './markdown-reporter.js';
// Export SARIF Reporter
export { SarifReporter } from './sarif-reporter.js';
// Export JSON Reporter (simple utility)
export class JsonReporter {
    generate(data) {
        return JSON.stringify(data, null, 2);
    }
}
//# sourceMappingURL=index.js.map