# Reporting Guide 📊

Baseline Surgeon provides powerful reporting capabilities to help you understand and improve your codebase's Baseline compatibility.

## Table of Contents

1. [Baseline Adoption Score](#baseline-adoption-score)
2. [Report Formats](#report-formats)
3. [CLI Usage](#cli-usage)
4. [Metrics Explained](#metrics-explained)
5. [CI/CD Integration](#cicd-integration)
6. [Examples](#examples)

---

## Baseline Adoption Score

The **Baseline Adoption Score** is a metric (0-100) that measures how well your codebase aligns with Baseline web standards.

### Score Ranges

| Score | Grade | Interpretation |
|-------|-------|----------------|
| 90-100 | A | Excellent Baseline compatibility |
| 75-89 | B | Good compatibility with minor improvements needed |
| 60-74 | C | Moderate compatibility, refactoring recommended |
| 40-59 | D | Poor compatibility, many features need polyfills |
| 0-39 | F | Critical issues, significant refactoring needed |

### How It's Calculated

The score is calculated based on:

1. **Number of findings** per file
2. **Severity** of issues (error, warning, info)
3. **Language breakdown** (JavaScript/TypeScript vs CSS)
4. **Fixable vs non-fixable** issues

**Formula:**
```
Base Score = 100
Deduction = (Issues Per File) × 10
Final Score = max(0, Base Score - Deduction)
Overall = Weighted Average(JS Score, CSS Score)
```

### Score Breakdown

The score includes:

- **Overall Score**: Combined metric across all languages
- **JavaScript/TypeScript Score**: Issues in JS/TS files
- **CSS Score**: Issues in CSS files
- **Key Metrics**: Files scanned, findings, fixable issues

---

## Report Formats

Baseline Surgeon supports three output formats:

### 1. Markdown (Default)

Human-readable reports with visual elements, perfect for documentation and PRs.

**Features:**
- 📊 Baseline Adoption Score with visual bars
- 🎯 Fix Impact Analysis showing potential improvements
- 📋 Summary of findings by feature
- 🔍 Feature Usage Analysis with Baseline status
- 🔧 Detailed findings with code snippets
- 💡 Actionable recommendations

**Example:**
```bash
baseline-surgeon report --format markdown --output report.md
```

**Output Preview:**
```markdown
# Baseline Surgeon Report

## 📊 Baseline Adoption Score

### Overall: **87/100** (Grade: B)

███████████████████░ 87%

Good Baseline compatibility with minor improvements needed.

### Breakdown by Language
| Language | Score |
|----------|-------|
| JavaScript/TypeScript | 85/100 |
| CSS | 92/100 |
```

### 2. SARIF

Machine-readable format for CI/CD integration, supported by GitHub Code Scanning, Azure DevOps, and more.

**Features:**
- Standards-compliant SARIF 2.1.0
- Integrates with GitHub Security tab
- Shows findings as code annotations
- Supports automated PR comments

**Example:**
```bash
baseline-surgeon report --format sarif --output baseline.sarif
```

**GitHub Actions Integration:**
```yaml
- name: Upload SARIF to GitHub
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: baseline.sarif
```

### 3. JSON

Structured data for custom integrations and programmatic access.

**Features:**
- Complete analysis results
- Baseline score metrics
- Feature usage statistics
- Fix impact analysis
- Easy to parse and process

**Example:**
```bash
baseline-surgeon report --format json --output report.json
```

---

## CLI Usage

### Basic Usage

```bash
# Generate markdown report (default)
baseline-surgeon report

# Generate markdown report to file
baseline-surgeon report --output baseline-report.md

# Generate SARIF for CI
baseline-surgeon report --format sarif --output baseline.sarif

# Generate JSON for custom processing
baseline-surgeon report --format json --output data.json
```

### Advanced Options

```bash
# Specify Baseline target
baseline-surgeon report --target baseline-2024

# Analyze specific files
baseline-surgeon report src/**/*.{js,ts,tsx}

# Exclude patterns
baseline-surgeon report --exclude "**/*.test.ts,**/*.spec.ts"

# Include patterns
baseline-surgeon report --include "src/components/**"
```

### Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `--format` | Output format: markdown, sarif, json | `markdown` |
| `--output` | Output file path | stdout |
| `--target` | Baseline target: baseline-now, baseline-2024, baseline-2025 | `baseline-now` |
| `--include` | Comma-separated include patterns | - |
| `--exclude` | Comma-separated exclude patterns | - |

---

## Metrics Explained

### Total Findings

Total number of non-Baseline features detected across all files.

### Critical Findings

High-severity issues that significantly impact browser compatibility.

### Fixable Findings

Issues that can be automatically fixed by running `baseline-surgeon fix`.

### Files with Issues

Number of files containing at least one non-Baseline feature.

### Fix Impact

Projected score improvement if all automatic fixes are applied.

**Example:**
```
Current Score: 75/100
Projected Score: 88/100
Improvement: +13 points
```

### Feature Usage

Analysis of which non-Baseline features are used and how frequently.

**Baseline Status:**
- ✅ **Widely Available**: Baseline feature, widely supported
- 🆕 **Newly Available**: Recently added to Baseline
- ⚠️ **Limited Availability**: Not yet Baseline, limited support
- ❓ **Unknown**: Baseline status unknown

---

## CI/CD Integration

### GitHub Actions

Add Baseline Surgeon to your CI pipeline:

```yaml
name: Baseline Check

on: [push, pull_request]

jobs:
  baseline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Baseline Surgeon
        run: |
          npx baseline-surgeon report \
            --format sarif \
            --output baseline.sarif
      
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: baseline.sarif
          category: baseline-surgeon
      
      - name: Generate PR Comment
        run: |
          npx baseline-surgeon report \
            --format markdown \
            --output report.md
          # Add logic to post report.md as PR comment
```

### GitLab CI

```yaml
baseline-check:
  stage: test
  script:
    - npm install
    - npx baseline-surgeon report --format json --output gl-code-quality-report.json
  artifacts:
    reports:
      codequality: gl-code-quality-report.json
```

### Azure Pipelines

```yaml
- task: Npm@1
  displayName: 'Run Baseline Surgeon'
  inputs:
    command: 'custom'
    customCommand: 'exec baseline-surgeon report --format sarif --output baseline.sarif'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: 'baseline.sarif'
    ArtifactName: 'CodeAnalysisLogs'
```

---

## Examples

### Example 1: Generate Weekly Report

```bash
#!/bin/bash
# weekly-baseline-report.sh

DATE=$(date +%Y-%m-%d)
OUTPUT_DIR="reports/$DATE"

mkdir -p "$OUTPUT_DIR"

# Generate all formats
baseline-surgeon report \
  --format markdown \
  --output "$OUTPUT_DIR/report.md"

baseline-surgeon report \
  --format json \
  --output "$OUTPUT_DIR/data.json"

echo "Reports generated in $OUTPUT_DIR"
```

### Example 2: Score Tracking Script

```bash
#!/bin/bash
# track-baseline-score.sh

SCORE=$(baseline-surgeon report --format json | jq '.score.overall')
DATE=$(date +%Y-%m-%d)

echo "$DATE,$SCORE" >> baseline-scores.csv

echo "Current Baseline Score: $SCORE/100"
```

### Example 3: Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run Baseline Surgeon on staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|tsx|css)$')

if [ -n "$STAGED_FILES" ]; then
  echo "Running Baseline Surgeon..."
  
  baseline-surgeon report $STAGED_FILES --format json > /tmp/baseline-report.json
  
  SCORE=$(jq '.score.overall' /tmp/baseline-report.json)
  
  if [ "$SCORE" -lt 60 ]; then
    echo "❌ Baseline Score too low: $SCORE/100"
    echo "   Please fix Baseline issues before committing."
    exit 1
  fi
  
  echo "✅ Baseline Score: $SCORE/100"
fi
```

### Example 4: Markdown Report in PR

**GitHub Action:**
```yaml
- name: Comment PR with Baseline Report
  uses: actions/github-script@v6
  with:
    script: |
      const fs = require('fs');
      const report = fs.readFileSync('report.md', 'utf8');
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: report
      });
```

---

## Best Practices

### 1. Track Score Over Time

Store your Baseline Score history to visualize progress:

```bash
# Add to CI
baseline-surgeon report --format json | \
  jq '{date: now | strftime("%Y-%m-%d"), score: .score.overall}' >> history.jsonl
```

### 2. Set Score Thresholds

Enforce minimum scores in CI:

```bash
SCORE=$(baseline-surgeon report --format json | jq '.score.overall')

if [ "$SCORE" -lt 75 ]; then
  echo "Baseline Score below threshold: $SCORE < 75"
  exit 1
fi
```

### 3. Focus on Fixable Issues

Prioritize automatic fixes for quick wins:

```bash
# Generate report
baseline-surgeon report --output report.md

# Apply automatic fixes
baseline-surgeon fix

# Regenerate report to see improvement
baseline-surgeon report --output report-after-fix.md
```

### 4. Use SARIF in GitHub

Upload SARIF to GitHub Security tab for integrated code scanning:

```yaml
- uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: baseline.sarif
```

---

## Troubleshooting

### Issue: Report shows 0 findings

**Cause:** No files matched the patterns or all code is Baseline-compatible.

**Solution:**
- Verify file patterns: `baseline-surgeon report src/**/*.js`
- Check that files exist in the specified paths
- Try with `--include` to narrow down search

### Issue: Score seems inaccurate

**Cause:** Score calculation is based on findings density.

**Solution:**
- Review the "Detailed Findings" section in the markdown report
- Check language breakdown (JS vs CSS scores)
- Use `--format json` to inspect raw metrics

### Issue: SARIF not showing in GitHub

**Cause:** GitHub requires specific upload action.

**Solution:**
```yaml
- uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: baseline.sarif
    category: baseline-surgeon  # Unique category name
```

---

## API Reference

For programmatic access:

```typescript
import {
  calculateBaselineScore,
  analyzeFeatureUsage,
  calculateFixImpact
} from '@baseline-surgeon/core';

import { MarkdownReporter, SarifReporter } from '@baseline-surgeon/reporters';

// Calculate score
const score = calculateBaselineScore(analysisResults);
console.log(`Score: ${score.overall}/100 (${score.grade})`);

// Generate report
const reporter = new MarkdownReporter();
const report = reporter.generate(results, score, featureUsage, fixImpact);
```

---

## Further Reading

- [Baseline Initiative](https://web.dev/baseline)
- [SARIF Specification](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
- [Baseline Surgeon Transforms](./TRANSFORMS.md)

---

*Last updated: Day 4 of Baseline Tooling Hackathon* 