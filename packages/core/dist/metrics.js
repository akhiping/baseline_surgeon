/**
 * Calculate Baseline Adoption Score from analysis results
 */
export function calculateBaselineScore(results) {
    const allFindings = [];
    const filesWithIssues = new Set();
    const filesByLanguage = {
        javascript: new Set(),
        css: new Set()
    };
    // Collect all findings and categorize files
    for (const result of results) {
        allFindings.push(...result.findings);
        if (result.findings.length > 0 && result.filePath) {
            filesWithIssues.add(result.filePath);
        }
        if (result.filePath) {
            if (result.language === 'javascript' || result.language === 'typescript') {
                filesByLanguage.javascript.add(result.filePath);
            }
            else if (result.language === 'css') {
                filesByLanguage.css.add(result.filePath);
            }
        }
    }
    const totalFindings = allFindings.length;
    const criticalFindings = allFindings.filter(f => f.severity === 'error').length;
    const fixableFindings = allFindings.filter(f => f.fixable).length;
    const totalFiles = results.length;
    // Calculate scores
    // Base score starts at 100 and deducts points for issues
    let jsScore = 100;
    let cssScore = 100;
    const jsFindings = allFindings.filter(f => {
        const file = results.find(r => r.findings.includes(f));
        return file && (file.language === 'javascript' || file.language === 'typescript');
    });
    const cssFindings = allFindings.filter(f => {
        const file = results.find(r => r.findings.includes(f));
        return file && file.language === 'css';
    });
    // Deduct points for JavaScript issues
    if (filesByLanguage.javascript.size > 0) {
        const jsIssuesPerFile = jsFindings.length / filesByLanguage.javascript.size;
        jsScore = Math.max(0, 100 - (jsIssuesPerFile * 10));
    }
    // Deduct points for CSS issues
    if (filesByLanguage.css.size > 0) {
        const cssIssuesPerFile = cssFindings.length / filesByLanguage.css.size;
        cssScore = Math.max(0, 100 - (cssIssuesPerFile * 10));
    }
    // Calculate overall score (weighted average)
    const jsWeight = filesByLanguage.javascript.size / totalFiles;
    const cssWeight = filesByLanguage.css.size / totalFiles;
    const overall = Math.round(jsScore * jsWeight + cssScore * cssWeight);
    // Determine grade
    let grade;
    let interpretation;
    if (overall >= 90) {
        grade = 'A';
        interpretation = 'Excellent Baseline compatibility! Your code uses widely-supported web features.';
    }
    else if (overall >= 75) {
        grade = 'B';
        interpretation = 'Good Baseline compatibility with minor improvements needed.';
    }
    else if (overall >= 60) {
        grade = 'C';
        interpretation = 'Moderate Baseline compatibility. Consider refactoring newer features.';
    }
    else if (overall >= 40) {
        grade = 'D';
        interpretation = 'Poor Baseline compatibility. Many features need polyfills or alternatives.';
    }
    else {
        grade = 'F';
        interpretation = 'Critical Baseline issues. Significant refactoring recommended.';
    }
    return {
        overall,
        breakdown: {
            javascript: Math.round(jsScore),
            css: Math.round(cssScore)
        },
        metrics: {
            totalFindings,
            criticalFindings,
            fixableFindings,
            filesScanned: totalFiles,
            filesWithIssues: filesWithIssues.size
        },
        grade,
        interpretation
    };
}
/**
 * Analyze feature usage across the codebase
 */
export function analyzeFeatureUsage(results) {
    const featureMap = new Map();
    for (const result of results) {
        if (!result.filePath)
            continue;
        for (const finding of result.findings) {
            const existing = featureMap.get(finding.featureId);
            if (existing) {
                existing.count++;
                if (!existing.files.includes(result.filePath)) {
                    existing.files.push(result.filePath);
                }
            }
            else {
                featureMap.set(finding.featureId, {
                    featureId: finding.featureId,
                    count: 1,
                    files: [result.filePath],
                    baselineStatus: finding.baselineStatus || 'unknown'
                });
            }
        }
    }
    return Array.from(featureMap.values())
        .sort((a, b) => b.count - a.count);
}
export function calculateFixImpact(results, currentScore) {
    const fixableIssues = currentScore.metrics.fixableFindings;
    const totalIssues = currentScore.metrics.totalFindings;
    // Project score improvement if all fixable issues are resolved
    const fixRatio = totalIssues > 0 ? fixableIssues / totalIssues : 0;
    const potentialImprovement = (100 - currentScore.overall) * fixRatio * 0.8; // 80% of theoretical max
    const projectedScore = Math.min(100, currentScore.overall + potentialImprovement);
    // Estimate effort based on number of fixes
    let estimatedEffort;
    if (fixableIssues <= 10) {
        estimatedEffort = 'low';
    }
    else if (fixableIssues <= 50) {
        estimatedEffort = 'medium';
    }
    else {
        estimatedEffort = 'high';
    }
    return {
        currentScore: currentScore.overall,
        projectedScore: Math.round(projectedScore),
        improvement: Math.round(projectedScore - currentScore.overall),
        fixableIssues,
        totalIssues,
        estimatedEffort
    };
}
//# sourceMappingURL=metrics.js.map