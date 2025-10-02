export class SarifReporter {
    version;
    toolName;
    toolUri;
    constructor(version = '1.0.0', toolName = 'Baseline Surgeon', toolUri = 'https://github.com/yourusername/baseline-surgeon') {
        this.version = version;
        this.toolName = toolName;
        this.toolUri = toolUri;
    }
    generate(results) {
        const allFindings = results.flatMap(r => r.findings);
        // Extract unique rules from findings
        const rules = this.extractRules(allFindings);
        // Convert findings to SARIF results
        const sarifResults = allFindings.map(finding => this.convertFinding(finding));
        const sarifLog = {
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
    extractRules(findings) {
        const ruleMap = new Map();
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
    convertFinding(finding) {
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
    mapSeverity(severity) {
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
    getHelpUri(featureId) {
        // Try to generate MDN URL from feature ID
        const cleanId = featureId.replace(/[._-]/g, '/');
        return `https://developer.mozilla.org/docs/Web/API/${cleanId}`;
    }
}
//# sourceMappingURL=sarif-reporter.js.map