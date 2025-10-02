export type { BaselineTarget, BaselineFeatureInfo, Finding, FileContext, ApplyResult, Transform, BaselineAdapter, AnalysisResult, EngineConfig } from './types.js';
export type { BaselineScore, FeatureUsage, FixImpact } from './metrics.js';
export { calculateBaselineScore, analyzeFeatureUsage, calculateFixImpact } from './metrics.js';
export { DefaultBaselineAdapter } from './baseline-adapter.js';
export { Analyzer, FindingBuilder } from './analyzer.js';
export { Engine, type EngineResult } from './engine.js';
import type { Transform } from './types.js';
import { Engine } from './engine.js';
export declare function createEngine(transforms?: Transform[]): Engine;
//# sourceMappingURL=index.d.ts.map