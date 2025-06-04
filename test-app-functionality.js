/**
 * Test the base chart functionality in the actual React Native app
 * Run this by importing it in your App.tsx or a test component
 */

import baseChartService from '../src/services/baseChartService';
import connectionTestService from '../src/services/connectionTestService';

export async function testBaseChartInApp() {
  console.log('🧪 Testing Base Chart in React Native App');
  console.log('==========================================');

  const testUserId = 'test-user-123';

  try {
    // Test 1: Connection
    console.log('1️⃣ Testing backend connection...');
    const connectionResult = await connectionTestService.testBackendConnection();
    console.log('Connection result:', connectionResult);

    // Test 2: Get user base chart
    console.log('2️⃣ Testing base chart fetch...');
    const chartResult = await baseChartService.getUserBaseChart(testUserId);
    console.log('Chart result:', chartResult);

    if (chartResult.success) {
      // Test 3: Get chart sections
      console.log('3️⃣ Testing chart sections...');
      const sections = baseChartService.getChartSections(chartResult.data);
      console.log('Chart sections:', sections.map(s => s.title));

      console.log('✅ All tests passed in React Native app!');
      return {
        success: true,
        data: chartResult.data,
        sections: sections
      };
    } else {
      console.log('❌ Chart fetch failed:', chartResult.error);
      return {
        success: false,
        error: chartResult.error
      };
    }

  } catch (error) {
    console.error('❌ App test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Usage in a React component:
/*
import { testBaseChartInApp } from './test-app-functionality';

// In your component
useEffect(() => {
  testBaseChartInApp().then(result => {
    console.log('Test result:', result);
  });
}, []);
*/
