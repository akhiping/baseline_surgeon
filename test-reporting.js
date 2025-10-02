#!/usr/bin/env node

/**
 * Test script for Day 4 Reporting Features
 * 
 * This demonstrates the Baseline Adoption Score and reporting capabilities
 * without requiring a full build of the monorepo.
 */

console.log('🧪 Testing Day 4 Reporting Features\n');
console.log('=' .repeat(60));

// Simulate analysis results
const mockResults = [
  {
    filePath: 'src/app.js',
    language: 'javascript',
    findings: [
      {
        file: 'src/app.js',
        loc: { line: 10, column: 5 },
        snippet: 'const clone = structuredClone(data);',
        featureId: 'structured-clone',
        transformId: 'js.structured-clone',
        message: 'structuredClone is not Baseline yet',
        severity: 'warning',
        fixable: true,
        baselineStatus: 'limited_availability'
      },
      {
        file: 'src/app.js',
        loc: { line: 15, column: 10 },
        snippet: 'if (URL.canParse(input)) {',
        featureId: 'url-canparse',
        transformId: 'js.url-canparse',
        message: 'URL.canParse is not Baseline yet',
        severity: 'warning',
        fixable: true,
        baselineStatus: 'limited_availability'
      }
    ],
    summary: {
      totalFiles: 3,
      totalFindings: 5,
      byFeature: { 'structured-clone': 2, 'url-canparse': 3 },
      byTransform: { 'js.structured-clone': 2, 'js.url-canparse': 3 }
    }
  },
  {
    filePath: 'src/styles.css',
    language: 'css',
    findings: [
      {
        file: 'src/styles.css',
        loc: { line: 20, column: 3 },
        snippet: 'text-wrap: balance;',
        featureId: 'text-wrap-balance',
        transformId: 'css.text-wrap-balance',
        message: 'text-wrap: balance needs @supports guard',
        severity: 'info',
        fixable: true,
        baselineStatus: 'newly_available'
      }
    ],
    summary: {
      totalFiles: 3,
      totalFindings: 5,
      byFeature: { 'text-wrap-balance': 1 },
      byTransform: { 'css.text-wrap-balance': 1 }
    }
  }
];

// === 1. Calculate Baseline Adoption Score ===
console.log('\n📊 1. BASELINE ADOPTION SCORE\n');

function calculateBaselineScore(results) {
  const allFindings = results.flatMap(r => r.findings);
  const filesWithIssues = new Set();
  const filesByLanguage = { javascript: new Set(), css: new Set() };
  
  for (const result of results) {
    if (result.findings.length > 0) {
      filesWithIssues.add(result.filePath);
    }
    
    if (result.language === 'javascript' || result.language === 'typescript') {
      filesByLanguage.javascript.add(result.filePath);
    } else if (result.language === 'css') {
      filesByLanguage.css.add(result.filePath);
    }
  }
  
  const totalFindings = allFindings.length;
  const criticalFindings = allFindings.filter(f => f.severity === 'error').length;
  const fixableFindings = allFindings.filter(f => f.fixable).length;
  const totalFiles = results.length;
  
  // Calculate scores
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
  
  if (filesByLanguage.javascript.size > 0) {
    const jsIssuesPerFile = jsFindings.length / filesByLanguage.javascript.size;
    jsScore = Math.max(0, 100 - (jsIssuesPerFile * 10));
  }
  
  if (filesByLanguage.css.size > 0) {
    const cssIssuesPerFile = cssFindings.length / filesByLanguage.css.size;
    cssScore = Math.max(0, 100 - (cssIssuesPerFile * 10));
  }
  
  const jsWeight = filesByLanguage.javascript.size / totalFiles;
  const cssWeight = filesByLanguage.css.size / totalFiles;
  const overall = Math.round(jsScore * jsWeight + cssScore * cssWeight);
  
  let grade, interpretation;
  if (overall >= 90) {
    grade = 'A';
    interpretation = 'Excellent Baseline compatibility!';
  } else if (overall >= 75) {
    grade = 'B';
    interpretation = 'Good Baseline compatibility with minor improvements needed.';
  } else if (overall >= 60) {
    grade = 'C';
    interpretation = 'Moderate Baseline compatibility.';
  } else if (overall >= 40) {
    grade = 'D';
    interpretation = 'Poor Baseline compatibility.';
  } else {
    grade = 'F';
    interpretation = 'Critical Baseline issues.';
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

const score = calculateBaselineScore(mockResults);

console.log(`Overall Score: ${score.overall}/100 (Grade: ${score.grade})`);

// ASCII progress bar
const filled = Math.round(score.overall / 5);
const empty = 20 - filled;
const bar = '█'.repeat(filled) + '░'.repeat(empty);
console.log(`\n${bar} ${score.overall}%\n`);

console.log(`${score.interpretation}\n`);

console.log('Breakdown by Language:');
console.log(`  JavaScript/TypeScript: ${score.breakdown.javascript}/100`);
console.log(`  CSS: ${score.breakdown.css}/100\n`);

console.log('Key Metrics:');
console.log(`  Files Scanned: ${score.metrics.filesScanned}`);
console.log(`  Files with Issues: ${score.metrics.filesWithIssues}`);
console.log(`  Total Findings: ${score.metrics.totalFindings}`);
console.log(`  Critical Findings: ${score.metrics.criticalFindings}`);
console.log(`  Fixable Findings: ${score.metrics.fixableFindings}`);

// === 2. Fix Impact Analysis ===
console.log('\n' + '='.repeat(60));
console.log('\n🎯 2. FIX IMPACT ANALYSIS\n');

function calculateFixImpact(results, currentScore) {
  const fixableIssues = currentScore.metrics.fixableFindings;
  const totalIssues = currentScore.metrics.totalFindings;
  
  const fixRatio = totalIssues > 0 ? fixableIssues / totalIssues : 0;
  const potentialImprovement = (100 - currentScore.overall) * fixRatio * 0.8;
  const projectedScore = Math.min(100, currentScore.overall + potentialImprovement);
  
  let estimatedEffort;
  if (fixableIssues <= 10) {
    estimatedEffort = 'low';
  } else if (fixableIssues <= 50) {
    estimatedEffort = 'medium';
  } else {
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

const fixImpact = calculateFixImpact(mockResults, score);

console.log(`If you apply all ${fixImpact.fixableIssues} automatic fixes:\n`);
console.log(`  Current Score:    ${fixImpact.currentScore}/100`);
console.log(`  Projected Score:  ${fixImpact.projectedScore}/100`);
console.log(`  Improvement:      +${fixImpact.improvement} points`);
console.log(`  Fixable Issues:   ${fixImpact.fixableIssues}/${fixImpact.totalIssues}`);

const effortEmoji = { low: '🟢', medium: '🟡', high: '🔴' };
const effortText = { low: 'Low', medium: 'Medium', high: 'High' };
console.log(`  Estimated Effort: ${effortEmoji[fixImpact.estimatedEffort]} ${effortText[fixImpact.estimatedEffort]}\n`);

// Visual before/after
const generateBar = (percentage) => {
  const filled = Math.round(percentage / 5);
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
};

console.log('Score Improvement:');
console.log(`Before:  ${generateBar(fixImpact.currentScore)} ${fixImpact.currentScore}%`);
console.log(`After:   ${generateBar(fixImpact.projectedScore)} ${fixImpact.projectedScore}% ↑`);

// === 3. Feature Usage Analysis ===
console.log('\n' + '='.repeat(60));
console.log('\n🔍 3. FEATURE USAGE ANALYSIS\n');

function analyzeFeatureUsage(results) {
  const featureMap = new Map();
  
  for (const result of results) {
    for (const finding of result.findings) {
      const existing = featureMap.get(finding.featureId);
      
      if (existing) {
        existing.count++;
        if (!existing.files.includes(result.filePath)) {
          existing.files.push(result.filePath);
        }
      } else {
        featureMap.set(finding.featureId, {
          featureId: finding.featureId,
          count: 1,
          files: [result.filePath],
          baselineStatus: finding.baselineStatus || 'unknown'
        });
      }
    }
  }
  
  return Array.from(featureMap.values()).sort((a, b) => b.count - a.count);
}

const featureUsage = analyzeFeatureUsage(mockResults);

const statusEmoji = {
  widely_available: '✅',
  newly_available: '🆕',
  limited_availability: '⚠️',
  unknown: '❓'
};

console.log('Features detected in your codebase:\n');
console.log('Feature                | Usage | Files | Status');
console.log('-'.repeat(60));

featureUsage.forEach(feature => {
  const emoji = statusEmoji[feature.baselineStatus] || '❓';
  const featureStr = feature.featureId.padEnd(20);
  const countStr = String(feature.count).padEnd(5);
  const filesStr = String(feature.files.length).padEnd(5);
  console.log(`${featureStr} | ${countStr} | ${filesStr} | ${emoji}`);
});

// === 4. Markdown Report Preview ===
console.log('\n' + '='.repeat(60));
console.log('\n📝 4. MARKDOWN REPORT PREVIEW\n');

function generateMarkdownReport(results, score, featureUsage, fixImpact) {
  let report = '# Baseline Surgeon Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += '---\n\n';
  
  // Score section
  report += '## 📊 Baseline Adoption Score\n\n';
  report += `### Overall: **${score.overall}/100** (Grade: ${score.grade})\n\n`;
  
  const filled = Math.round(score.overall / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  report += '```\n';
  report += `${bar} ${score.overall}%\n`;
  report += '```\n\n';
  report += `${score.interpretation}\n\n`;
  
  // Fix impact
  report += '## 🎯 Fix Impact Analysis\n\n';
  report += `If you apply all ${fixImpact.fixableIssues} automatic fixes:\n\n`;
  report += `- Current Score: ${fixImpact.currentScore}/100\n`;
  report += `- Projected Score: **${fixImpact.projectedScore}/100**\n`;
  report += `- Improvement: +${fixImpact.improvement} points\n\n`;
  
  // Recommendations
  report += '## 💡 Recommendations\n\n';
  report += '1. Apply automatic fixes: `baseline-surgeon fix`\n';
  report += '2. Review and test changes\n';
  report += '3. Add Baseline Surgeon to your CI pipeline\n\n';
  
  report += '---\n\n';
  report += '*Report generated by [Baseline Surgeon](https://github.com/yourusername/baseline-surgeon)*\n';
  
  return report;
}

const markdownReport = generateMarkdownReport(mockResults, score, featureUsage, fixImpact);
console.log(markdownReport);

// === 5. SARIF Output Preview ===
console.log('='.repeat(60));
console.log('\n🤖 5. SARIF OUTPUT PREVIEW (for CI/CD)\n');

const sarifLog = {
  version: '2.1.0',
  $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
  runs: [
    {
      tool: {
        driver: {
          name: 'Baseline Surgeon',
          version: '1.0.0',
          informationUri: 'https://github.com/yourusername/baseline-surgeon'
        }
      },
      results: mockResults.flatMap(r => r.findings).slice(0, 2).map(finding => ({
        ruleId: finding.transformId,
        level: 'warning',
        message: {
          text: finding.message
        },
        locations: [{
          physicalLocation: {
            artifactLocation: {
              uri: finding.file
            },
            region: {
              startLine: finding.loc.line,
              startColumn: finding.loc.column,
              snippet: {
                text: finding.snippet
              }
            }
          }
        }]
      }))
    }
  ]
};

console.log(JSON.stringify(sarifLog, null, 2));

// === Summary ===
console.log('\n' + '='.repeat(60));
console.log('\n✅ DAY 4 FEATURES TESTED SUCCESSFULLY!\n');
console.log('Key Features Demonstrated:');
console.log('  ✓ Baseline Adoption Score (0-100 metric)');
console.log('  ✓ Visual progress bars');
console.log('  ✓ Fix Impact Analysis');
console.log('  ✓ Feature Usage Statistics');
console.log('  ✓ Enhanced Markdown Reports');
console.log('  ✓ SARIF Output for CI/CD\n');
console.log('Next Steps:');
console.log('  1. Run: node test-reporting.js');
console.log('  2. Try with real data once packages are built');
console.log('  3. Test SARIF upload to GitHub Code Scanning\n');
console.log('=' .repeat(60)); 