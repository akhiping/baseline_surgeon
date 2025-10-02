import type { AnalysisResult } from '@baseline-surgeon/core';
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
export declare class SarifReporter {
    private version;
    private toolName;
    private toolUri;
    constructor(version?: string, toolName?: string, toolUri?: string);
    generate(results: AnalysisResult[]): string;
    private extractRules;
    private convertFinding;
    private mapSeverity;
    private getHelpUri;
}
//# sourceMappingURL=sarif-reporter.d.ts.map