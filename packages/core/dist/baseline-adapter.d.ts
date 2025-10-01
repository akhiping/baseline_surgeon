import type { BaselineAdapter, BaselineTarget, BaselineFeatureInfo } from './types.js';
export declare class DefaultBaselineAdapter implements BaselineAdapter {
    private featureMap;
    private targetDates;
    constructor();
    private initializeFeatures;
    isBaseline(featureId: string, target: BaselineTarget): boolean;
    info(featureId: string): BaselineFeatureInfo | undefined;
    getAllFeatures(): string[];
    /**
     * Get the baseline status date for a feature
     */
    getBaselineDate(featureId: string): Date | null;
    /**
     * Check if a feature will be baseline by a specific date
     */
    willBeBaseline(featureId: string, targetDate: Date): boolean;
}
//# sourceMappingURL=baseline-adapter.d.ts.map