import { createEngine } from '@baseline-surgeon/core';
import { ALL_TRANSFORMS } from '@baseline-surgeon/transforms';
export async function analyzeCommand(patterns, options) {
    console.log('🔍 Analyzing files for non-Baseline features...');
    console.log('Patterns:', patterns);
    console.log('Target:', options.target);
    try {
        const engine = createEngine(ALL_TRANSFORMS);
        const result = await engine.analyze(patterns, {
            target: options.target,
            dryRun: true
        });
        console.log('\n📊 Analysis Results:');
        console.log(`Files analyzed: ${result.summary.totalFiles}`);
        console.log(`Findings: ${result.summary.totalFindings}`);
        if (result.summary.totalFindings > 0) {
            console.log('\nFindings by feature:');
            Object.entries(result.summary.byFeature).forEach(([feature, count]) => {
                console.log(`  ${feature}: ${count}`);
            });
        }
        // Exit with error code if strict mode and findings exist
        if (options.strict && result.summary.totalFindings > 0) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(2);
    }
}
//# sourceMappingURL=analyze.js.map