import type { AnalysisResult, BaselineScore, FeatureUsage, FixImpact } from '@baseline-surgeon/core';
export interface MarkdownReporterOptions {
    includeScore?: boolean;
    includeFeatureUsage?: boolean;
    includeFixImpact?: boolean;
    includeDetailedFindings?: boolean;
    maxFindingsPerFeature?: number;
}
export declare class MarkdownReporter {
    private options;
    constructor(options?: MarkdownReporterOptions);
    generate(results: AnalysisResult[], score?: BaselineScore, featureUsage?: FeatureUsage[], fixImpact?: FixImpact): string;
    private generateScoreSection;
    private generateFixImpactSection;
    private generateSummarySection;
    private generateFeatureUsageSection;
    private generateFindingsSection;
    private generateRecommendationsSection;
    private formatEffort;
    private formatBaselineStatus;
    private generateBar;
    private getFixRecommendation;
}
//# sourceMappingURL=markdown-reporter.d.ts.map