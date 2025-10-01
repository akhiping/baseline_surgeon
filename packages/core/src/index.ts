// Core types
export type {
  BaselineTarget,
  BaselineFeatureInfo,
  Finding,
  FileContext,
  ApplyResult,
  Transform,
  BaselineAdapter,
  AnalysisResult,
  EngineConfig
} from './types.js';

// Main classes
export { DefaultBaselineAdapter } from './baseline-adapter.js';
export { Analyzer, FindingBuilder } from './analyzer.js';
export { Engine, type EngineResult } from './engine.js';

// Utility function to create a default engine with baseline adapter
import type { Transform } from './types.js';
import { Engine } from './engine.js';
import { DefaultBaselineAdapter } from './baseline-adapter.js';

export function createEngine(transforms: Transform[] = []) {
  return new Engine(transforms, new DefaultBaselineAdapter());
} 