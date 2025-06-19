#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running TypeScript type check...');

try {
  // Run TypeScript compiler in check mode
  execSync('npx tsc --noEmit --project .', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('✅ TypeScript check passed! No type errors found.');
  process.exit(0);
} catch (error) {
  console.log('❌ TypeScript check failed! Please fix the errors above before running the app.');
  process.exit(1);
}
