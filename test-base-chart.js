// Simple test script to verify base chart API integration
const axios = require('axios');

async function testBaseChart() {
  try {
    console.log('Testing base chart endpoint...');
    
    const testUserId = 'test-user-12345';
    const url = `http://localhost:3001/api/v1/charts/base/${testUserId}`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await axios.get(url);
    
    console.log('✅ Success! Base chart data received:');
    console.log('Status:', response.status);
    console.log('Data structure:');
    console.log('- Energy Family:', response.data.energy_family?.name || 'Not found');
    console.log('- Energy Class:', response.data.energy_class?.name || 'Not found');
    console.log('- Processing Core:', response.data.processing_core?.name || 'Not found');
    console.log('- Synthesis Theme:', response.data.synthesis?.theme || 'Not found');
    console.log('- User ID:', response.data.user_id);
    console.log('- Generated At:', response.data.generated_at);
    
    console.log('\n🎉 Base chart endpoint is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing base chart endpoint:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the test
testBaseChart();
