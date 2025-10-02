import type { BaselineTarget } from '@baseline-surgeon/core';
interface AnalyzeOptions {
    target: BaselineTarget;
    reporter: string;
    strict: boolean;
    out: string;
}
export declare function analyzeCommand(patterns: string[], options: AnalyzeOptions): Promise<void>;
export {};
//# sourceMappingURL=analyze.d.ts.map