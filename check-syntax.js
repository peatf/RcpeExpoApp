#!/usr/bin/env node
/**
 * check-syntax.js
 * A utility script to check basic syntax errors in TypeScript/JavaScript files
 * without doing a full type check
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.log(chalk.red('Please provide a file path to check'));
  console.log(chalk.yellow('Usage: node check-syntax.js <file-path>'));
  process.exit(1);
}

// Get absolute path
const absolutePath = path.resolve(filePath);

if (!fs.existsSync(absolutePath)) {
  console.log(chalk.red(`File does not exist: ${absolutePath}`));
  process.exit(1);
}

console.log(chalk.blue(`🔍 Checking syntax in ${filePath}...`));

try {
  // Use TypeScript's transpileModule which does syntax checking without type checking
  const output = execSync(
    `npx tsc --noEmit --allowJs --checkJs false --skipLibCheck --noResolve ${absolutePath}`, 
    { encoding: 'utf8' }
  );
  console.log(chalk.green('✅ No syntax errors found!'));
} catch (error) {
  console.log(chalk.red('❌ Syntax errors found:'));
  console.log(error.stdout || error.message);
  process.exit(1);
}
