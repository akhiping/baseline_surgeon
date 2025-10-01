import * as t from '@babel/types';
import postcss from 'postcss';
import type { Finding, AnalysisResult, Transform } from './types.js';
export declare class Analyzer {
    private transforms;
    constructor(transforms?: Transform[]);
    /**
     * Analyze files matching the given patterns
     */
    analyze(patterns: string[], options?: {
        ignore?: string[];
    }): Promise<AnalysisResult>;
    /**
     * Analyze a single file
     */
    analyzeFile(filePath: string): Promise<Finding[]>;
    /**
     * Find files matching patterns
     */
    private findFiles;
    /**
     * Detect file language based on extension
     */
    private detectLanguage;
    /**
     * Parse JavaScript/TypeScript code into AST
     */
    private parseJavaScript;
    /**
     * Parse CSS code into AST
     */
    private parseCSS;
    /**
     * Create analysis result summary
     */
    private createAnalysisResult;
}
/**
 * Utility functions for creating findings in transforms
 */
export declare class FindingBuilder {
    /**
     * Create a finding from a Babel AST node
     */
    static fromBabelNode(filePath: string, node: t.Node, featureId: string, transformId: string, content: string, message?: string): Finding;
    /**
     * Create a finding from a PostCSS node
     */
    static fromPostCSSNode(filePath: string, node: postcss.Node, featureId: string, transformId: string, content: string, message?: string): Finding;
}
//# sourceMappingURL=analyzer.d.ts.map