import { promises as fs } from 'fs';
import { createEngine } from '@baseline-surgeon/core';
import { calculateBaselineScore, analyzeFeatureUsage, calculateFixImpact } from '@baseline-surgeon/core';
import { ALL_TRANSFORMS } from '@baseline-surgeon/transforms';
import { MarkdownReporter, SarifReporter, JsonReporter } from '@baseline-surgeon/reporters';
export async function reportCommand(paths, options) {
    try {
        console.log('🔍 Analyzing codebase...\n');
        // Create engine and analyze
        const engine = createEngine(ALL_TRANSFORMS);
        const target = options.target || 'baseline-now';
        // For now, simulate analysis results
        // In a full implementation, this would call engine.analyze()
        const results = [];
        // Calculate metrics
        const score = calculateBaselineScore(results);
        const featureUsage = analyzeFeatureUsage(results);
        const fixImpact = calculateFixImpact(results, score);
        // Generate report based on format
        let reportContent;
        const format = options.format || 'markdown';
        switch (format) {
            case 'markdown': {
                const reporter = new MarkdownReporter({
                    includeScore: true,
                    includeFeatureUsage: true,
                    includeFixImpact: true,
                    includeDetailedFindings: true
                });
                reportContent = reporter.generate(results, score, featureUsage, fixImpact);
                break;
            }
            case 'sarif': {
                const reporter = new SarifReporter();
                reportContent = reporter.generate(results);
                break;
            }
            case 'json': {
                const reporter = new JsonReporter();
                reportContent = reporter.generate({
                    results,
                    score,
                    featureUsage,
                    fixImpact,
                    timestamp: new Date().toISOString()
                });
                break;
            }
            default:
                throw new Error(`Unknown format: ${format}`);
        }
        // Output report
        if (options.output) {
            await fs.writeFile(options.output, reportContent, 'utf-8');
            console.log(`✅ Report saved to: ${options.output}`);
        }
        else {
            console.log(reportContent);
        }
        // Print summary
        console.log(`\n📊 Baseline Score: ${score.overall}/100 (${score.grade})`);
        console.log(`📁 Files Scanned: ${score.metrics.filesScanned}`);
        console.log(`🔧 Fixable Issues: ${score.metrics.fixableFindings}`);
        if (fixImpact.improvement > 0) {
            console.log(`\n💡 Potential Improvement: +${fixImpact.improvement} points`);
            console.log(`   Run 'baseline-surgeon fix' to apply automatic fixes`);
        }
    }
    catch (error) {
        console.error('❌ Error generating report:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=report.js.map