import { parse } from '@babel/parser';
import postcss from 'postcss';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import { extname } from 'path';
export class Analyzer {
    transforms = [];
    constructor(transforms = []) {
        this.transforms = transforms;
    }
    /**
     * Analyze files matching the given patterns
     */
    async analyze(patterns, options = {}) {
        const files = await this.findFiles(patterns, options.ignore);
        const findings = [];
        for (const filePath of files) {
            try {
                const fileFindings = await this.analyzeFile(filePath);
                findings.push(...fileFindings);
            }
            catch (error) {
                console.warn(`Failed to analyze ${filePath}:`, error);
            }
        }
        return this.createAnalysisResult(findings);
    }
    /**
     * Analyze a single file
     */
    async analyzeFile(filePath) {
        const content = readFileSync(filePath, 'utf-8');
        const language = this.detectLanguage(filePath);
        const context = {
            filePath,
            content,
            language
        };
        // Parse the file into an AST
        try {
            if (language === 'javascript' || language === 'typescript') {
                context.ast = this.parseJavaScript(content, language === 'typescript');
            }
            else if (language === 'css') {
                context.ast = this.parseCSS(content);
            }
        }
        catch (error) {
            console.warn(`Failed to parse ${filePath}:`, error);
            return [];
        }
        // Run all transforms' detect methods
        const findings = [];
        for (const transform of this.transforms) {
            try {
                const transformFindings = transform.detect(context);
                findings.push(...transformFindings);
            }
            catch (error) {
                console.warn(`Transform ${transform.id} failed on ${filePath}:`, error);
            }
        }
        return findings;
    }
    /**
     * Find files matching patterns
     */
    async findFiles(patterns, ignore = []) {
        const allFiles = [];
        for (const pattern of patterns) {
            const files = await glob(pattern, {
                ignore: [
                    '**/node_modules/**',
                    '**/dist/**',
                    '**/*.min.js',
                    '**/*.min.css',
                    ...ignore
                ]
            });
            allFiles.push(...files);
        }
        // Remove duplicates
        return Array.from(new Set(allFiles));
    }
    /**
     * Detect file language based on extension
     */
    detectLanguage(filePath) {
        const ext = extname(filePath).toLowerCase();
        switch (ext) {
            case '.ts':
            case '.tsx':
                return 'typescript';
            case '.js':
            case '.jsx':
            case '.mjs':
                return 'javascript';
            case '.css':
                return 'css';
            default:
                // Default to JavaScript for unknown extensions
                return 'javascript';
        }
    }
    /**
     * Parse JavaScript/TypeScript code into AST
     */
    parseJavaScript(content, isTypeScript) {
        return parse(content, {
            sourceType: 'module',
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            plugins: [
                'jsx',
                'asyncGenerators',
                'bigInt',
                'classProperties',
                'decorators-legacy',
                'doExpressions',
                'dynamicImport',
                'exportDefaultFrom',
                'exportNamespaceFrom',
                'functionBind',
                'functionSent',
                'importMeta',
                'nullishCoalescingOperator',
                'numericSeparator',
                'objectRestSpread',
                'optionalCatchBinding',
                'optionalChaining',
                'throwExpressions',
                'topLevelAwait',
                ...(isTypeScript ? ['typescript'] : [])
            ]
        });
    }
    /**
     * Parse CSS code into AST
     */
    parseCSS(content) {
        return postcss.parse(content);
    }
    /**
     * Create analysis result summary
     */
    createAnalysisResult(findings) {
        const byFeature = {};
        const byTransform = {};
        const files = new Set();
        for (const finding of findings) {
            files.add(finding.file);
            byFeature[finding.featureId] = (byFeature[finding.featureId] || 0) + 1;
            byTransform[finding.transformId] = (byTransform[finding.transformId] || 0) + 1;
        }
        return {
            findings,
            summary: {
                totalFiles: files.size,
                totalFindings: findings.length,
                byFeature,
                byTransform
            }
        };
    }
}
/**
 * Utility functions for creating findings in transforms
 */
export class FindingBuilder {
    /**
     * Create a finding from a Babel AST node
     */
    static fromBabelNode(filePath, node, featureId, transformId, content, message) {
        const loc = node.loc;
        const startLine = loc?.start.line || 1;
        const startColumn = loc?.start.column || 0;
        const endLine = loc?.end.line;
        const endColumn = loc?.end.column;
        // Extract snippet from content
        const lines = content.split('\n');
        const snippet = lines.slice(Math.max(0, startLine - 2), Math.min(lines.length, (endLine || startLine) + 1)).join('\n');
        const finding = {
            file: filePath,
            loc: {
                line: startLine,
                column: startColumn,
                endLine,
                endColumn
            },
            snippet,
            featureId,
            transformId
        };
        if (message) {
            finding.message = message;
        }
        return finding;
    }
    /**
     * Create a finding from a PostCSS node
     */
    static fromPostCSSNode(filePath, node, featureId, transformId, content, message) {
        const startLine = node.source?.start?.line || 1;
        const startColumn = node.source?.start?.column || 0;
        const endLine = node.source?.end?.line;
        const endColumn = node.source?.end?.column;
        // Extract snippet from content
        const lines = content.split('\n');
        const snippet = lines.slice(Math.max(0, startLine - 2), Math.min(lines.length, (endLine || startLine) + 1)).join('\n');
        const finding = {
            file: filePath,
            loc: {
                line: startLine,
                column: startColumn,
                endLine,
                endColumn
            },
            snippet,
            featureId,
            transformId
        };
        if (message) {
            finding.message = message;
        }
        return finding;
    }
}
//# sourceMappingURL=analyzer.js.map