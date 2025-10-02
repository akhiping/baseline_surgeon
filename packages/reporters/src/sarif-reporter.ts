import type { AnalysisResult, Finding } from '@baseline-surgeon/core';

/**
 * SARIF (Static Analysis Results Interchange Format) Reporter
 * 
 * Generates SARIF 2.1.0 compliant output for CI/CD integration.
 * Supported by GitHub Code Scanning, Azure DevOps, and other platforms.
 * 
 * @see https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
 */

export interface SarifLog {
  version: '2.1.0';
  $schema: string;
  runs: SarifRun[];
}

export interface SarifRun {
  tool: {
    driver: {
      name: string;
      version: string;
      informationUri: string;
      rules: SarifRule[];
    };
  };
  results: SarifResult[];
}

export interface SarifRule {
  id: string;
  name: string;
  shortDescription: {
    text: string;
  };
  fullDescription?: {
    text: string;
  };
  helpUri?: string;
  properties?: {
    tags?: string[];
  };
}

export interface SarifResult {
  ruleId: string;
  level: 'error' | 'warning' | 'note';
  message: {
    text: string;
  };
  locations: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string;
      };
      region: {
        startLine: number;
        startColumn: number;
        endLine?: number;
        endColumn?: number;
        snippet?: {
          text: string;
        };
      };
    };
  }>;
  fixes?: Array<{
    description: {
      text: string;
    };
    artifactChanges: Array<{
      artifactLocation: {
        uri: string;
      };
      replacements: Array<{
        deletedRegion: {
          startLine: number;
          startColumn: number;
          endLine: number;
          endColumn: number;
        };
        insertedContent?: {
          text: string;
        };
      }>;
    }>;
  }>;
}

export class SarifReporter {
  private version: string;
  private toolName: string;
  private toolUri: string;

  constructor(version = '1.0.0', toolName = 'Baseline Surgeon', toolUri = 'https://github.com/yourusername/baseline-surgeon') {
    this.version = version;
    this.toolName = toolName;
    this.toolUri = toolUri;
  }

  generate(results: AnalysisResult[]): string {
    const allFindings: Finding[] = results.flatMap(r => r.findings);
    
    // Extract unique rules from findings
    const rules = this.extractRules(allFindings);
    
    // Convert findings to SARIF results
    const sarifResults = allFindings.map(finding => this.convertFinding(finding));

    const sarifLog: SarifLog = {
      version: '2.1.0',
      $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
      runs: [
        {
          tool: {
            driver: {
              name: this.toolName,
              version: this.version,
              informationUri: this.toolUri,
              rules
            }
          },
          results: sarifResults
        }
      ]
    };

    return JSON.stringify(sarifLog, null, 2);
  }

  private extractRules(findings: Finding[]): SarifRule[] {
    const ruleMap = new Map<string, SarifRule>();

    findings.forEach(finding => {
      if (!ruleMap.has(finding.transformId)) {
        ruleMap.set(finding.transformId, {
          id: finding.transformId,
          name: finding.transformId,
          shortDescription: {
            text: `Non-Baseline feature detected: ${finding.featureId}`
          },
          fullDescription: {
            text: finding.message || `This code uses '${finding.featureId}' which may not be widely supported across all browsers. Consider using a polyfill or alternative approach.`
          },
          helpUri: this.getHelpUri(finding.featureId),
          properties: {
            tags: ['baseline', 'compatibility', 'web-platform']
          }
        });
      }
    });

    return Array.from(ruleMap.values());
  }

  private convertFinding(finding: Finding): SarifResult {
    const level = this.mapSeverity(finding.severity);
    
    return {
      ruleId: finding.transformId,
      level,
      message: {
        text: finding.message || `Non-Baseline feature '${finding.featureId}' detected`
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: finding.file
            },
            region: {
              startLine: finding.loc.line,
              startColumn: finding.loc.column,
              endLine: finding.loc.endLine,
              endColumn: finding.loc.endColumn,
              snippet: {
                text: finding.snippet
              }
            }
          }
        }
      ]
    };
  }

  private mapSeverity(severity?: string): 'error' | 'warning' | 'note' {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'note';
      default:
        return 'warning';
    }
  }

  private getHelpUri(featureId: string): string {
    // Try to generate MDN URL from feature ID
    const cleanId = featureId.replace(/[._-]/g, '/');
    return `https://developer.mozilla.org/docs/Web/API/${cleanId}`;
  }
} 