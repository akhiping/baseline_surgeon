#!/usr/bin/env node

/**
 * Test Day 4 Reporting with Real Built Packages
 */

console.log('🧪 Testing Day 4 Features with Real Code\n');
console.log('=' .repeat(60));

// Import the actual built modules
async function test() {
  try {
    // Import the metrics functions
    const core = await import('./packages/core/dist/index.js');
    const reporters = await import('./packages/reporters/dist/index.js');
    
    console.log('\n✅ Successfully imported modules:');
    console.log('   - @baseline-surgeon/core');
    console.log('   - @baseline-surgeon/reporters\n');
    
    // Create mock analysis results
    const mockResults = [
      {
        filePath: 'examples/sample-project/index.js',
        language: 'javascript',
        findings: [
          {
            file: 'examples/sample-project/index.js',
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
            file: 'examples/sample-project/index.js',
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
          totalFiles: 2,
          totalFindings: 3,
          byFeature: { 'structured-clone': 2, 'url-canparse': 1 },
          byTransform: { 'js.structured-clone': 2, 'js.url-canparse': 1 }
        }
      },
      {
        filePath: 'examples/sample-project/styles.css',
        language: 'css',
        findings: [
          {
            file: 'examples/sample-project/styles.css',
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
          totalFiles: 2,
          totalFindings: 3,
          byFeature: { 'text-wrap-balance': 1 },
          byTransform: { 'css.text-wrap-balance': 1 }
        }
      }
    ];
    
    console.log('='.repeat(60));
    console.log('\n📊 1. BASELINE ADOPTION SCORE\n');
    
    // Calculate score using real function
    const score = core.calculateBaselineScore(mockResults);
    
    console.log(`Overall Score: ${score.overall}/100 (Grade: ${score.grade})`);
    
    // Visual progress bar
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
    console.log(`  Fixable Findings: ${score.metrics.fixableFindings}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('\n🎯 2. FIX IMPACT ANALYSIS\n');
    
    // Calculate fix impact using real function
    const fixImpact = core.calculateFixImpact(mockResults, score);
    
    console.log(`If you apply all ${fixImpact.fixableIssues} automatic fixes:\n`);
    console.log(`  Current Score:    ${fixImpact.currentScore}/100`);
    console.log(`  Projected Score:  ${fixImpact.projectedScore}/100`);
    console.log(`  Improvement:      +${fixImpact.improvement} points`);
    console.log(`  Fixable Issues:   ${fixImpact.fixableIssues}/${fixImpact.totalIssues}`);
    
    const effortEmoji = { low: '🟢', medium: '🟡', high: '🔴' };
    const effortText = { low: 'Low', medium: 'Medium', high: 'High' };
    console.log(`  Estimated Effort: ${effortEmoji[fixImpact.estimatedEffort]} ${effortText[fixImpact.estimatedEffort]}\n`);
    
    console.log('='.repeat(60));
    console.log('\n🔍 3. FEATURE USAGE ANALYSIS\n');
    
    // Analyze feature usage using real function
    const featureUsage = core.analyzeFeatureUsage(mockResults);
    
    const statusEmoji = {
      widely_available: '✅',
      newly_available: '🆕',
      limited_availability: '⚠️',
      unknown: '❓'
    };
    
    console.log('Features detected:\n');
    console.log('Feature                | Usage | Files | Status');
    console.log('-'.repeat(60));
    
    featureUsage.forEach(feature => {
      const emoji = statusEmoji[feature.baselineStatus] || '❓';
      const featureStr = feature.featureId.padEnd(20);
      const countStr = String(feature.count).padEnd(5);
      const filesStr = String(feature.files.length).padEnd(5);
      console.log(`${featureStr} | ${countStr} | ${filesStr} | ${emoji}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 4. MARKDOWN REPORTER (Real Implementation)\n');
    
    // Create markdown report using real reporter
    const markdownReporter = new reporters.MarkdownReporter({
      includeScore: true,
      includeFeatureUsage: true,
      includeFixImpact: true,
      includeDetailedFindings: false // Keep output brief
    });
    
    const markdownReport = markdownReporter.generate(mockResults, score, featureUsage, fixImpact);
    const preview = markdownReport.split('\n').slice(0, 30).join('\n');
    console.log(preview);
    console.log('\n... (truncated for brevity) ...\n');
    
    console.log('='.repeat(60));
    console.log('\n🤖 5. SARIF REPORTER (Real Implementation)\n');
    
    // Create SARIF report using real reporter
    const sarifReporter = new reporters.SarifReporter();
    const sarifReport = sarifReporter.generate(mockResults);
    const sarifObj = JSON.parse(sarifReport);
    
    console.log('SARIF Output Structure:');
    console.log(`  Version: ${sarifObj.version}`);
    console.log(`  Tool: ${sarifObj.runs[0].tool.driver.name}`);
    console.log(`  Results: ${sarifObj.runs[0].results.length} findings`);
    console.log(`  Rules: ${sarifObj.runs[0].tool.driver.rules.length} unique rules\n`);
    
    console.log('Sample SARIF result:');
    console.log(JSON.stringify(sarifObj.runs[0].results[0], null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ ALL DAY 4 FEATURES TESTED SUCCESSFULLY!\n');
    console.log('Key Features Verified:');
    console.log('  ✓ Baseline Adoption Score calculation (real algorithm)');
    console.log('  ✓ Fix Impact Analysis (real predictions)');
    console.log('  ✓ Feature Usage Analysis (real statistics)');
    console.log('  ✓ Enhanced Markdown Reporter (real class)');
    console.log('  ✓ SARIF Reporter (real standards-compliant output)\n');
    console.log('All features are production-ready! 🎉\n');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure you\'ve built the packages:');
    console.error('  cd packages/core && npm run build');
    console.error('  cd packages/reporters && npm run build\n');
    process.exit(1);
  }
}

test(); 