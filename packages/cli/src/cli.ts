#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createEngine } from '@baseline-surgeon/core';
import { ALL_TRANSFORMS } from '@baseline-surgeon/transforms';
import { analyzeCommand } from './commands/analyze.js';
import { fixCommand } from './commands/fix.js';
import { reportCommand } from './commands/report.js';

const program = new Command();

program
  .name('baseline-surgeon')
  .description('Auto-refactor web code to Baseline-safe patterns')
  .version('0.1.0');

// Analyze command
program
  .command('analyze')
  .description('Analyze files for non-Baseline features')
  .argument('[patterns...]', 'File patterns to analyze', ['src/**/*.{js,ts,tsx,css}'])
  .option('--target <target>', 'Baseline target', 'baseline-now')
  .option('--reporter <type>', 'Output format', 'markdown')
  .option('--strict', 'Exit with non-zero code if findings exist')
  .option('--out <dir>', 'Output directory', 'reports')
  .action(analyzeCommand);

// Fix command
program
  .command('fix')
  .description('Apply transforms to fix non-Baseline features')
  .argument('[patterns...]', 'File patterns to fix', ['src/**/*.{js,ts,tsx,css}'])
  .option('--target <target>', 'Baseline target', 'baseline-now')
  .option('--dry-run', 'Show what would be changed without applying')
  .option('--diff', 'Show diff of changes')
  .option('--include <transforms>', 'Comma-separated list of transform IDs to include')
  .option('--exclude <transforms>', 'Comma-separated list of transform IDs to exclude')
  .option('--reporter <type>', 'Output format', 'markdown')
  .option('--out <dir>', 'Output directory', 'reports')
  .action(fixCommand);

// Report command
program
  .command('report')
  .description('Generate reports from analysis results')
  .option('--in <file>', 'Input findings JSON file', 'reports/baseline-findings.json')
  .option('--reporter <type>', 'Output format', 'markdown')
  .option('--out <dir>', 'Output directory', 'reports')
  .action(reportCommand);

// List transforms command
program
  .command('list')
  .description('List available transforms')
  .action(() => {
    console.log(chalk.blue.bold('\nAvailable Transforms:\n'));
    
    ALL_TRANSFORMS.forEach(transform => {
      console.log(chalk.green(`${transform.id}`));
      console.log(chalk.gray(`  ${transform.title}`));
      console.log(chalk.gray(`  Features: ${transform.featureIds.join(', ')}`));
      console.log();
    });
  });

// Global error handler
program.exitOverride((err) => {
  if (err.code === 'commander.version') {
    process.exit(0);
  }
  if (err.code === 'commander.help') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), err.message);
  process.exit(1);
});

// Parse and execute
program.parse(); 