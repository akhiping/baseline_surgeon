export type BaselineTarget = 'baseline-now' | 'baseline-2024' | 'baseline-2025';

export interface BaselineFeatureInfo {
  name: string;
  description?: string;
  mdn?: string;
  spec?: string;
}

export interface Finding {
  file: string;
  loc: {
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
  };
  snippet: string;
  featureId: string;
  transformId: string;
  message?: string;
}

export interface FileContext {
  filePath: string;
  content: string;
  language: 'javascript' | 'typescript' | 'css';
  ast?: any; // Babel AST or PostCSS AST
}

export interface ApplyResult {
  success: boolean;
  content?: string;
  error?: string;
  changes: Array<{
    type: 'add' | 'remove' | 'modify';
    line: number;
    content: string;
    reason: string;
  }>;
}

export interface Transform {
  id: string; // e.g., "js.structured-clone"
  title: string;
  featureIds: string[]; // Baseline feature IDs
  detect(ctx: FileContext): Finding[]; // non-destructive
  canApply(finding: Finding, target: BaselineTarget, baseline: BaselineAdapter): boolean;
  apply(ctx: FileContext, finding: Finding): ApplyResult; // returns patch or modified AST
  explain(finding: Finding): string; // human-readable rationale + links
}

export interface BaselineAdapter {
  isBaseline(featureId: string, target: BaselineTarget): boolean;
  info(featureId: string): BaselineFeatureInfo | undefined;
  getAllFeatures(): string[];
}

export interface AnalysisResult {
  findings: Finding[];
  summary: {
    totalFiles: number;
    totalFindings: number;
    byFeature: Record<string, number>;
    byTransform: Record<string, number>;
  };
}

export interface EngineConfig {
  target: BaselineTarget;
  include?: string[];
  exclude?: string[];
  accessibilityHeuristic?: boolean;
  dryRun?: boolean;
} 