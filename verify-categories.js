/**
 * Simple verification of all 9 synthesis categories in BlueprintCanvas
 */

const categories = [
  'Energy Family',
  'Energy Class', 
  'Processing Core',
  'Decision Growth Vector',
  'Drive Mechanics',
  'Manifestation Interface Rhythm',
  'Energy Architecture',
  'Tension Points',
  'Evolutionary Path'
];

const fs = require('fs');
const path = require('path');

// Read the BlueprintCanvas file
const canvasPath = path.join(__dirname, 'src/components/EnergeticBlueprint/BlueprintCanvas.tsx');
const canvasContent = fs.readFileSync(canvasPath, 'utf8');

console.log('🔍 Verifying all 9 synthesis categories in BlueprintCanvas...\n');

let allSupported = true;

categories.forEach((category, idx) => {
  // Check for highlighting logic
  const hasHighlighting = canvasContent.includes(`highlightedCategory === '${category}'`);
  
  // Check for visual comment/implementation
  const hasVisualComment = canvasContent.includes(category);
  
  const status = hasHighlighting ? '✅' : (hasVisualComment ? '⚠️' : '❌');
  const note = hasHighlighting ? 'Full highlighting support' : 
               hasVisualComment ? 'Visual elements present' : 'Missing implementation';
  
  console.log(`${idx + 1}. ${status} ${category}: ${note}`);
  
  if (!hasHighlighting) {
    allSupported = false;
  }
});

console.log('\n📊 Summary:');
const fullSupport = categories.filter(cat => 
  canvasContent.includes(`highlightedCategory === '${cat}'`)
).length;

console.log(`Categories with full highlighting support: ${fullSupport}/${categories.length}`);

if (allSupported) {
  console.log('🎉 SUCCESS: All 9 synthesis categories have full highlighting support!');
} else {
  console.log('⚠️  Some categories may need highlighting logic updates.');
}

// List specific highlighting patterns found
console.log('\n🎯 Highlighting patterns found:');
const highlightingMatches = canvasContent.match(/highlightedCategory === '[^']+'/g) || [];
highlightingMatches.forEach((match, idx) => {
  console.log(`${idx + 1}. ${match}`);
});
