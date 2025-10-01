import type { Transform, BaselineAdapter, EngineConfig, ApplyResult } from './types.js';
export interface EngineResult {
    success: boolean;
    totalFiles: number;
    totalFindings: number;
    appliedTransforms: number;
    results: Array<{
        file: string;
        applied: boolean;
        changes: ApplyResult['changes'];
        error?: string;
    }>;
}
export declare class Engine {
    private transforms;
    private baseline;
    private analyzer;
    constructor(transforms?: Transform[], baseline?: BaselineAdapter);
    /**
     * Analyze files and return findings without applying transforms
     */
    analyze(patterns: string[], config: EngineConfig): Promise<import("./types.js").AnalysisResult>;
    /**
     * Apply transforms to files based on configuration
     */
    fix(patterns: string[], config: EngineConfig): Promise<EngineResult>;
    /**
     * Filter findings based on config and baseline status
     */
    private filterApplicableFindings;
    /**
     * Group findings by file path
     */
    private groupFindingsByFile;
    /**
     * Process a single file with its findings
     */
    private processFile;
    /**
     * Get programming language from file path
     */
    private getLanguageFromPath;
    /**
     * Build ignore patterns from config
     */
    private buildIgnorePatterns;
    /**
     * Add a transform to the engine
     */
    addTransform(transform: Transform): void;
    /**
     * Remove a transform from the engine
     */
    removeTransform(transformId: string): void;
    /**
     * Get all registered transforms
     */
    getTransforms(): Transform[];
    /**
     * Get baseline adapter
     */
    getBaseline(): BaselineAdapter;
}
//# sourceMappingURL=engine.d.ts.map