// Main classes
export { DefaultBaselineAdapter } from './baseline-adapter.js';
export { Analyzer, FindingBuilder } from './analyzer.js';
export { Engine } from './engine.js';
import { Engine } from './engine.js';
import { DefaultBaselineAdapter } from './baseline-adapter.js';
export function createEngine(transforms = []) {
    return new Engine(transforms, new DefaultBaselineAdapter());
}
//# sourceMappingURL=index.js.map