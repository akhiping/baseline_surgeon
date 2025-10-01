import { Analyzer } from './analyzer.js';
import { DefaultBaselineAdapter } from './baseline-adapter.js';
export class Engine {
    transforms = new Map();
    baseline;
    analyzer;
    constructor(transforms = [], baseline = new DefaultBaselineAdapter()) {
        this.baseline = baseline;
        // Register transforms
        transforms.forEach(transform => {
            this.transforms.set(transform.id, transform);
        });
        this.analyzer = new Analyzer(transforms);
    }
    /**
     * Analyze files and return findings without applying transforms
     */
    async analyze(patterns, config) {
        return this.analyzer.analyze(patterns, {
            ignore: this.buildIgnorePatterns(config)
        });
    }
    /**
     * Apply transforms to files based on configuration
     */
    async fix(patterns, config) {
        // First analyze to get findings
        const analysisResult = await this.analyze(patterns, config);
        // Filter findings based on config and baseline status
        const applicableFindings = this.filterApplicableFindings(analysisResult.findings, config);
        // Group findings by file
        const findingsByFile = this.groupFindingsByFile(applicableFindings);
        const results = [];
        let appliedTransforms = 0;
        // Process each file
        for (const [filePath, findings] of findingsByFile) {
            try {
                const result = await this.processFile(filePath, findings, config);
                results.push(result);
                if (result.applied) {
                    appliedTransforms += result.changes.length;
                }
            }
            catch (error) {
                results.push({
                    file: filePath,
                    applied: false,
                    changes: [],
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }
        return {
            success: true,
            totalFiles: findingsByFile.size,
            totalFindings: applicableFindings.length,
            appliedTransforms,
            results
        };
    }
    /**
     * Filter findings based on config and baseline status
     */
    filterApplicableFindings(findings, config) {
        return findings.filter(finding => {
            // Check if transform is included/excluded
            if (config.include && !config.include.includes(finding.transformId)) {
                return false;
            }
            if (config.exclude && config.exclude.includes(finding.transformId)) {
                return false;
            }
            // Check if the feature is baseline for the target
            const transform = this.transforms.get(finding.transformId);
            if (!transform) {
                return false;
            }
            return transform.canApply(finding, config.target, this.baseline);
        });
    }
    /**
     * Group findings by file path
     */
    groupFindingsByFile(findings) {
        const map = new Map();
        for (const finding of findings) {
            const existing = map.get(finding.file) || [];
            existing.push(finding);
            map.set(finding.file, existing);
        }
        return map;
    }
    /**
     * Process a single file with its findings
     */
    async processFile(filePath, findings, config) {
        // Read file content
        const fs = await import('fs');
        const content = fs.readFileSync(filePath, 'utf-8');
        // Determine language
        const language = this.getLanguageFromPath(filePath);
        const context = {
            filePath,
            content,
            language
        };
        // Parse AST if needed
        if (language === 'javascript' || language === 'typescript') {
            const { parse } = await import('@babel/parser');
            context.ast = parse(content, {
                sourceType: 'module',
                plugins: language === 'typescript' ? ['typescript', 'jsx'] : ['jsx']
            });
        }
        else if (language === 'css') {
            const postcss = await import('postcss');
            context.ast = postcss.default.parse(content);
        }
        // Sort findings by line number (descending) to avoid position shifts
        const sortedFindings = findings.sort((a, b) => (b.loc.line - a.loc.line) || (b.loc.column - a.loc.column));
        let modifiedContent = content;
        const allChanges = [];
        let hasChanges = false;
        // Apply each transform
        for (const finding of sortedFindings) {
            const transform = this.transforms.get(finding.transformId);
            if (!transform) {
                continue;
            }
            try {
                // Update context with current content
                const currentContext = { ...context, content: modifiedContent };
                const result = transform.apply(currentContext, finding);
                if (result.success && result.content) {
                    modifiedContent = result.content;
                    allChanges.push(...result.changes);
                    hasChanges = true;
                }
            }
            catch (error) {
                console.warn(`Failed to apply transform ${transform.id} to ${filePath}:`, error);
            }
        }
        // Write file if not dry run and has changes
        if (hasChanges && !config.dryRun) {
            const fs = await import('fs');
            fs.writeFileSync(filePath, modifiedContent, 'utf-8');
        }
        return {
            file: filePath,
            applied: hasChanges,
            changes: allChanges
        };
    }
    /**
     * Get programming language from file path
     */
    getLanguageFromPath(filePath) {
        const { extname } = require('path');
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
                return 'javascript';
        }
    }
    /**
     * Build ignore patterns from config
     */
    buildIgnorePatterns(config) {
        return [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.min.js',
            '**/*.min.css',
            // Add any custom ignore patterns from config if needed
        ];
    }
    /**
     * Add a transform to the engine
     */
    addTransform(transform) {
        this.transforms.set(transform.id, transform);
        // Update analyzer with new transform
        this.analyzer = new Analyzer(Array.from(this.transforms.values()));
    }
    /**
     * Remove a transform from the engine
     */
    removeTransform(transformId) {
        this.transforms.delete(transformId);
        // Update analyzer
        this.analyzer = new Analyzer(Array.from(this.transforms.values()));
    }
    /**
     * Get all registered transforms
     */
    getTransforms() {
        return Array.from(this.transforms.values());
    }
    /**
     * Get baseline adapter
     */
    getBaseline() {
        return this.baseline;
    }
}
//# sourceMappingURL=engine.js.map