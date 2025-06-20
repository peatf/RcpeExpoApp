/**
 * Test script to verify all 9 synthesis categories have proper highlighting support
 * in the BlueprintCanvas component
 */

const fs = require('fs');
const path = require('path');

// Read the BlueprintCanvas file
const canvasPath = path.join(__dirname, 'src/components/EnergeticBlueprint/BlueprintCanvas.tsx');
const canvasContent = fs.readFileSync(canvasPath, 'utf8');

// Read the UserBaseChartScreen file to get categories
const screenPath = path.join(__dirname, 'src/screens/Main/UserBaseChartScreen.tsx');
const screenContent = fs.readFileSync(screenPath, 'utf8');

// Extract categories from UserBaseChartScreen
const categoryRegex = /category:\s*["']([^"']+)["']/g;
const categories = [];
let match;
while ((match = categoryRegex.exec(screenContent)) !== null) {
  categories.push(match[1]);
}

console.log('✅ Found categories in UserBaseChartScreen:');
categories.forEach((cat, idx) => {
  console.log(`${idx + 1}. ${cat}`);
});

console.log('\n🔍 Checking BlueprintCanvas for highlighting support...\n');

const results = [];

categories.forEach(category => {
  // Check if category has highlighting logic
  const highlightPattern = new RegExp(`highlightedCategory === ['"]${category}['"]`, 'g');
  const hasHighlighting = highlightPattern.test(canvasContent);
  
  // Check if category has visual elements
  const commentPattern = new RegExp(`/\\*.*${category}.*\\*/`, 'i');
  const hasVisualComment = commentPattern.test(canvasContent);
  
  const status = hasHighlighting ? '✅' : (hasVisualComment ? '⚠️' : '❌');
  const note = hasHighlighting ? 'Full support' : 
               hasVisualComment ? 'Visual elements but no highlighting' : 'Missing';
  
  results.push({ category, status, note, hasHighlighting, hasVisualComment });
  console.log(`${status} ${category}: ${note}`);
});

console.log('\n📊 Summary:');
const fullSupport = results.filter(r => r.hasHighlighting).length;
const partialSupport = results.filter(r => !r.hasHighlighting && r.hasVisualComment).length;
const missing = results.filter(r => !r.hasHighlighting && !r.hasVisualComment).length;

console.log(`Full highlighting support: ${fullSupport}/${categories.length}`);
console.log(`Partial support (visual only): ${partialSupport}/${categories.length}`);
console.log(`Missing: ${missing}/${categories.length}`);

if (fullSupport === categories.length) {
  console.log('\n🎉 SUCCESS: All 9 synthesis categories have full highlighting support!');
} else if (fullSupport + partialSupport === categories.length) {
  console.log('\n⚠️  PARTIAL: All categories have visual elements, some need highlighting logic.');
} else {
  console.log('\n❌ INCOMPLETE: Some categories are missing visual representation.');
}

// Also check for general isHighlighted usage that might need category-specific logic
const generalHighlightedMatches = canvasContent.match(/isHighlighted \?[^:]+:[^};\n]+/g) || [];
if (generalHighlightedMatches.length > 0) {
  console.log('\n🔧 Found general isHighlighted usage (may need category-specific logic):');
  generalHighlightedMatches.forEach((match, idx) => {
    console.log(`${idx + 1}. ${match.trim()}`);
  });
}
