import type {
  AnalysisResult,
  Finding,
  BaselineScore,
  FeatureUsage,
  FixImpact
} from '@baseline-surgeon/core';

export interface MarkdownReporterOptions {
  includeScore?: boolean;
  includeFeatureUsage?: boolean;
  includeFixImpact?: boolean;
  includeDetailedFindings?: boolean;
  maxFindingsPerFeature?: number;
}

export class MarkdownReporter {
  private options: Required<MarkdownReporterOptions>;

  constructor(options: MarkdownReporterOptions = {}) {
    this.options = {
      includeScore: options.includeScore !== false,
      includeFeatureUsage: options.includeFeatureUsage !== false,
      includeFixImpact: options.includeFixImpact !== false,
      includeDetailedFindings: options.includeDetailedFindings !== false,
      maxFindingsPerFeature: options.maxFindingsPerFeature || 5
    };
  }

  generate(
    results: AnalysisResult[],
    score?: BaselineScore,
    featureUsage?: FeatureUsage[],
    fixImpact?: FixImpact
  ): string {
    const sections: string[] = [];

    // Header
    sections.push('# Baseline Surgeon Report\n');
    sections.push(`Generated: ${new Date().toISOString()}\n`);
    sections.push('---\n');

    // Baseline Score
    if (this.options.includeScore && score) {
      sections.push(this.generateScoreSection(score));
    }

    // Fix Impact
    if (this.options.includeFixImpact && fixImpact) {
      sections.push(this.generateFixImpactSection(fixImpact));
    }

    // Summary
    sections.push(this.generateSummarySection(results));

    // Feature Usage
    if (this.options.includeFeatureUsage && featureUsage) {
      sections.push(this.generateFeatureUsageSection(featureUsage));
    }

    // Detailed Findings
    if (this.options.includeDetailedFindings) {
      sections.push(this.generateFindingsSection(results));
    }

    // Recommendations
    sections.push(this.generateRecommendationsSection(results, score));

    return sections.join('\n');
  }

  private generateScoreSection(score: BaselineScore): string {
    const lines: string[] = [];

    lines.push('## 📊 Baseline Adoption Score\n');
    lines.push(`### Overall: **${score.overall}/100** (Grade: ${score.grade})\n`);
    
    // Visual score bar
    const filled = Math.round(score.overall / 5);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    lines.push(`\`\`\`\n${bar} ${score.overall}%\n\`\`\`\n`);
    
    lines.push(`${score.interpretation}\n`);

    // Breakdown
    lines.push('### Breakdown by Language\n');
    lines.push('| Language | Score |');
    lines.push('|----------|-------|');
    lines.push(`| JavaScript/TypeScript | ${score.breakdown.javascript}/100 |`);
    lines.push(`| CSS | ${score.breakdown.css}/100 |\n`);

    // Metrics
    lines.push('### Key Metrics\n');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Files Scanned | ${score.metrics.filesScanned} |`);
    lines.push(`| Files with Issues | ${score.metrics.filesWithIssues} |`);
    lines.push(`| Total Findings | ${score.metrics.totalFindings} |`);
    lines.push(`| Critical Findings | ${score.metrics.criticalFindings} |`);
    lines.push(`| Fixable Findings | ${score.metrics.fixableFindings} |\n`);

    lines.push('---\n');
    return lines.join('\n');
  }

  private generateFixImpactSection(impact: FixImpact): string {
    const lines: string[] = [];

    lines.push('## 🎯 Fix Impact Analysis\n');
    lines.push(`If you apply all ${impact.fixableIssues} automatic fixes:\n`);
    
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Current Score | ${impact.currentScore}/100 |`);
    lines.push(`| Projected Score | **${impact.projectedScore}/100** |`);
    lines.push(`| Improvement | +${impact.improvement} points |`);
    lines.push(`| Fixable Issues | ${impact.fixableIssues}/${impact.totalIssues} |`);
    lines.push(`| Estimated Effort | ${this.formatEffort(impact.estimatedEffort)} |\n`);

    // Visual improvement bar
    const improvement = impact.projectedScore - impact.currentScore;
    if (improvement > 0) {
      lines.push('### Score Improvement\n');
      lines.push('```');
      lines.push(`Before:  ${this.generateBar(impact.currentScore)} ${impact.currentScore}%`);
      lines.push(`After:   ${this.generateBar(impact.projectedScore)} ${impact.projectedScore}% ↑`);
      lines.push('```\n');
    }

    lines.push(`**Recommendation:** ${this.getFixRecommendation(impact)}\n`);
    lines.push('---\n');
    return lines.join('\n');
  }

  private generateSummarySection(results: AnalysisResult[]): string {
    const lines: string[] = [];
    const allFindings: Finding[] = results.flatMap(r => r.findings);
    
    lines.push('## 📋 Summary\n');
    
    const totalFiles = results.length;
    const filesWithIssues = results.filter(r => r.findings.length > 0).length;
    const totalFindings = allFindings.length;

    lines.push(`- **Files Scanned:** ${totalFiles}`);
    lines.push(`- **Files with Issues:** ${filesWithIssues}`);
    lines.push(`- **Total Findings:** ${totalFindings}\n`);

    // Group by feature
    const byFeature: Record<string, number> = {};
    allFindings.forEach(f => {
      byFeature[f.featureId] = (byFeature[f.featureId] || 0) + 1;
    });

    if (Object.keys(byFeature).length > 0) {
      lines.push('### Issues by Feature\n');
      lines.push('| Feature | Count |');
      lines.push('|---------|-------|');
      Object.entries(byFeature)
        .sort((a, b) => b[1] - a[1])
        .forEach(([feature, count]) => {
          lines.push(`| \`${feature}\` | ${count} |`);
        });
      lines.push('');
    }

    lines.push('---\n');
    return lines.join('\n');
  }

  private generateFeatureUsageSection(featureUsage: FeatureUsage[]): string {
    const lines: string[] = [];

    lines.push('## 🔍 Feature Usage Analysis\n');
    lines.push('Features detected in your codebase and their Baseline status:\n');

    lines.push('| Feature | Usage Count | Files | Baseline Status |');
    lines.push('|---------|-------------|-------|-----------------|');

    featureUsage.slice(0, 15).forEach(feature => {
      const status = this.formatBaselineStatus(feature.baselineStatus);
      lines.push(`| \`${feature.featureId}\` | ${feature.count} | ${feature.files.length} | ${status} |`);
    });

    if (featureUsage.length > 15) {
      lines.push(`\n*...and ${featureUsage.length - 15} more features*\n`);
    }

    lines.push('\n---\n');
    return lines.join('\n');
  }

  private generateFindingsSection(results: AnalysisResult[]): string {
    const lines: string[] = [];
    const allFindings = results.flatMap(r => r.findings);

    if (allFindings.length === 0) {
      lines.push('## ✅ No Issues Found\n');
      lines.push('Your code appears to be using Baseline-compatible web features!\n');
      return lines.join('\n');
    }

    lines.push('## 🔧 Detailed Findings\n');

    // Group findings by feature
    const findingsByFeature: Record<string, Finding[]> = {};
    allFindings.forEach(f => {
      if (!findingsByFeature[f.featureId]) {
        findingsByFeature[f.featureId] = [];
      }
      findingsByFeature[f.featureId].push(f);
    });

    Object.entries(findingsByFeature).forEach(([featureId, findings]) => {
      lines.push(`### \`${featureId}\` (${findings.length} occurrence${findings.length > 1 ? 's' : ''})\n`);
      
      findings.slice(0, this.options.maxFindingsPerFeature).forEach(finding => {
        lines.push(`**${finding.file}:${finding.loc.line}:${finding.loc.column}**\n`);
        lines.push('```');
        lines.push(finding.snippet);
        lines.push('```\n');
        if (finding.message) {
          lines.push(`💡 ${finding.message}\n`);
        }
      });

      if (findings.length > this.options.maxFindingsPerFeature) {
        const remaining = findings.length - this.options.maxFindingsPerFeature;
        lines.push(`*...and ${remaining} more occurrence${remaining > 1 ? 's' : ''}*\n`);
      }
    });

    lines.push('---\n');
    return lines.join('\n');
  }

  private generateRecommendationsSection(results: AnalysisResult[], score?: BaselineScore): string {
    const lines: string[] = [];

    lines.push('## 💡 Recommendations\n');

    if (score) {
      if (score.overall >= 90) {
        lines.push('✅ **Excellent work!** Your codebase has great Baseline compatibility.\n');
        lines.push('- Continue using widely-supported web features');
        lines.push('- Consider running Baseline Surgeon in CI to maintain this score\n');
      } else if (score.overall >= 75) {
        lines.push('👍 **Good progress!** A few improvements will boost your score:\n');
        lines.push('- Run `baseline-surgeon fix` to apply automatic fixes');
        lines.push('- Review remaining issues and add polyfills where needed\n');
      } else if (score.overall >= 60) {
        lines.push('⚠️ **Moderate issues detected.** Recommended actions:\n');
        lines.push('- Apply automatic fixes: `baseline-surgeon fix --target baseline-now`');
        lines.push('- Review feature usage and consider alternatives for non-Baseline features');
        lines.push('- Add polyfills for critical features\n');
      } else {
        lines.push('🚨 **Significant issues found.** Urgent actions needed:\n');
        lines.push('- Prioritize fixing critical findings first');
        lines.push('- Run automatic fixes: `baseline-surgeon fix --target baseline-now`');
        lines.push('- Consider refactoring to use more widely-supported features');
        lines.push('- Review the [Baseline documentation](https://web.dev/baseline)\n');
      }
    }

    lines.push('### Next Steps\n');
    lines.push('1. Apply automatic fixes: `baseline-surgeon fix`');
    lines.push('2. Review and test changes');
    lines.push('3. Add Baseline Surgeon to your CI pipeline');
    lines.push('4. Monitor your score over time\n');

    lines.push('---\n');
    lines.push('*Report generated by [Baseline Surgeon](https://github.com/yourusername/baseline-surgeon)*\n');

    return lines.join('\n');
  }

  private formatEffort(effort: 'low' | 'medium' | 'high'): string {
    const emoji = { low: '🟢', medium: '🟡', high: '🔴' };
    const text = { low: 'Low', medium: 'Medium', high: 'High' };
    return `${emoji[effort]} ${text[effort]}`;
  }

  private formatBaselineStatus(status: string): string {
    const emoji = {
      widely_available: '✅',
      newly_available: '🆕',
      limited_availability: '⚠️',
      unknown: '❓'
    };
    return emoji[status as keyof typeof emoji] || '❓';
  }

  private generateBar(percentage: number): string {
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  private getFixRecommendation(impact: FixImpact): string {
    if (impact.improvement >= 20) {
      return 'Applying these fixes will significantly improve your Baseline compatibility. Highly recommended!';
    } else if (impact.improvement >= 10) {
      return 'These fixes will provide a noticeable improvement to your Baseline score.';
    } else if (impact.improvement >= 5) {
      return 'These fixes will provide a modest improvement to your score.';
    } else {
      return 'While the score improvement is small, fixing these issues improves overall code quality.';
    }
  }
} 