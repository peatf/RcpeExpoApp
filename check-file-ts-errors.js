#!/usr/bin/env node
/**
 * check-file-ts-errors.js
 * A utility script to check TypeScript errors in specific files without running the full build
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.log(chalk.red('Please provide a file path to check'));
  console.log(chalk.yellow('Usage: node check-file-ts-errors.js <file-path>'));
  process.exit(1);
}

// Get absolute path
const absolutePath = path.resolve(filePath);

console.log(chalk.blue(`🔍 Checking TypeScript errors in ${filePath}...`));

try {
  // Run TypeScript compiler on the specific file
  const output = execSync(`npx tsc ${absolutePath} --noEmit`, { encoding: 'utf8' });
  console.log(chalk.green('✅ No TypeScript errors found in this file!'));
} catch (error) {
  console.log(chalk.red('❌ TypeScript errors found:'));
  console.log(error.stdout);
  process.exit(1);
}
