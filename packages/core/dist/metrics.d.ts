import type { AnalysisResult } from './types';
/**
 * Baseline Adoption Score (0-100)
 *
 * Measures how well a codebase aligns with Baseline standards.
 * Higher scores indicate better compatibility with widely-supported web features.
 */
export interface BaselineScore {
    /** Overall score (0-100) */
    overall: number;
    /** Breakdown by category */
    breakdown: {
        javascript: number;
        css: number;
    };
    /** Detailed metrics */
    metrics: {
        totalFindings: number;
        criticalFindings: number;
        fixableFindings: number;
        filesScanned: number;
        filesWithIssues: number;
    };
    /** Score interpretation */
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    interpretation: string;
}
/**
 * Feature usage statistics
 */
export interface FeatureUsage {
    featureId: string;
    count: number;
    files: string[];
    baselineStatus: 'widely_available' | 'newly_available' | 'limited_availability' | 'unknown';
}
/**
 * Calculate Baseline Adoption Score from analysis results
 */
export declare function calculateBaselineScore(results: AnalysisResult[]): BaselineScore;
/**
 * Analyze feature usage across the codebase
 */
export declare function analyzeFeatureUsage(results: AnalysisResult[]): FeatureUsage[];
/**
 * Calculate impact of applying all fixes
 */
export interface FixImpact {
    currentScore: number;
    projectedScore: number;
    improvement: number;
    fixableIssues: number;
    totalIssues: number;
    estimatedEffort: 'low' | 'medium' | 'high';
}
export declare function calculateFixImpact(results: AnalysisResult[], currentScore: BaselineScore): FixImpact;
//# sourceMappingURL=metrics.d.ts.map