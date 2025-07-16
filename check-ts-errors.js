#!/usr/bin/env node
/**
 * check-ts-errors.js
 * A utility script to check TypeScript errors without running the full build
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Checking for TypeScript errors...'));

try {
  // Run TypeScript compiler in noEmit mode to just check for errors
  const output = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log(chalk.green('✅ No TypeScript errors found!'));
} catch (error) {
  console.log(chalk.red('❌ TypeScript errors found:'));
  console.log(error.stdout);
  process.exit(1);
}
