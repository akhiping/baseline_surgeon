import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import { extname } from 'path';
import type { Finding, FileContext, AnalysisResult, Transform } from './types.js';

export class Analyzer {
  private transforms: Transform[] = [];

  constructor(transforms: Transform[] = []) {
    this.transforms = transforms;
  }

  /**
   * Analyze files matching the given patterns
   */
  async analyze(patterns: string[], options: { ignore?: string[] } = {}): Promise<AnalysisResult> {
    const files = await this.findFiles(patterns, options.ignore);
    const findings: Finding[] = [];

    for (const filePath of files) {
      try {
        const fileFindings = await this.analyzeFile(filePath);
        findings.push(...fileFindings);
      } catch (error) {
        console.warn(`Failed to analyze ${filePath}:`, error);
      }
    }

    return this.createAnalysisResult(findings);
  }

  /**
   * Analyze a single file
   */
  async analyzeFile(filePath: string): Promise<Finding[]> {
    const content = readFileSync(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    
    const context: FileContext = {
      filePath,
      content,
      language
    };

    // Parse the file into an AST
    try {
      if (language === 'javascript' || language === 'typescript') {
        context.ast = this.parseJavaScript(content, language === 'typescript');
      } else if (language === 'css') {
        context.ast = this.parseCSS(content);
      }
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error);
      return [];
    }

    // Run all transforms' detect methods
    const findings: Finding[] = [];
    for (const transform of this.transforms) {
      try {
        const transformFindings = transform.detect(context);
        findings.push(...transformFindings);
      } catch (error) {
        console.warn(`Transform ${transform.id} failed on ${filePath}:`, error);
      }
    }

    return findings;
  }

  /**
   * Find files matching patterns
   */
  private async findFiles(patterns: string[], ignore: string[] = []): Promise<string[]> {
    const allFiles: string[] = [];
    
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
  private detectLanguage(filePath: string): 'javascript' | 'typescript' | 'css' {
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
  private parseJavaScript(content: string, isTypeScript: boolean): t.File {
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
        ...(isTypeScript ? ['typescript' as const] : [])
      ] as any
    });
  }

  /**
   * Parse CSS code into AST
   */
  private parseCSS(content: string): postcss.Root {
    return postcss.parse(content);
  }

  /**
   * Create analysis result summary
   */
  private createAnalysisResult(findings: Finding[]): AnalysisResult {
    const byFeature: Record<string, number> = {};
    const byTransform: Record<string, number> = {};
    const files = new Set<string>();

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
  static fromBabelNode(
    filePath: string,
    node: t.Node,
    featureId: string,
    transformId: string,
    content: string,
    message?: string
  ): Finding {
    const loc = node.loc;
    const startLine = loc?.start.line || 1;
    const startColumn = loc?.start.column || 0;
    const endLine = loc?.end.line;
    const endColumn = loc?.end.column;

    // Extract snippet from content
    const lines = content.split('\n');
    const snippet = lines.slice(
      Math.max(0, startLine - 2),
      Math.min(lines.length, (endLine || startLine) + 1)
    ).join('\n');

    const finding: Finding = {
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
  static fromPostCSSNode(
    filePath: string,
    node: postcss.Node,
    featureId: string,
    transformId: string,
    content: string,
    message?: string
  ): Finding {
    const startLine = node.source?.start?.line || 1;
    const startColumn = node.source?.start?.column || 0;
    const endLine = node.source?.end?.line;
    const endColumn = node.source?.end?.column;

    // Extract snippet from content
    const lines = content.split('\n');
    const snippet = lines.slice(
      Math.max(0, startLine - 2),
      Math.min(lines.length, (endLine || startLine) + 1)
    ).join('\n');

    const finding: Finding = {
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