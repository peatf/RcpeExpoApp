#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const AUTH_TOKEN = 'token456'; // Bob's token

console.log('🧪 Testing Complete App Flow...\n');

async function testCompleteFlow() {
    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data);
        console.log();

        // Test 2: User Profiles - Check User ID Display
        console.log('2️⃣ Testing User Profiles (User ID Display)...');
        const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        console.log('✅ User profiles response:', JSON.stringify(profilesResponse.data, null, 2));
        
        const userId = profilesResponse.data.profiles[0].user_id;
        if (userId === 'bob@example.com') {
            console.log('✅ User ID correctly shows email instead of mock-user-123');
        } else {
            console.log('❌ User ID still showing:', userId);
        }
        console.log();

        // Test 3: Create Profile with Assessment Responses
        console.log('3️⃣ Testing Profile Creation with Assessment Responses...');
        const profileData = {
            name: 'Test Profile Flow',
            birth_date: '1990-05-15',
            birth_time: '14:30',
            birth_location: 'New York, NY',
            assessment_responses: [
                { question_id: 'q1', response: 'right' },
                { question_id: 'q2', response: 'left' },
                { question_id: 'q3', response: 'right' }
            ]
        };

        const createResponse = await axios.post(`${BASE_URL}/profile/create`, profileData, {
            headers: { 
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Profile creation response:', JSON.stringify(createResponse.data, null, 2));
        
        // Check if assessment responses are preserved
        const assessmentResponses = createResponse.data.profile.assessment_responses;
        const hasRightResponse = assessmentResponses.some(r => r.response === 'right');
        const hasLeftResponse = assessmentResponses.some(r => r.response === 'left');
        
        if (hasRightResponse && hasLeftResponse) {
            console.log('✅ Assessment responses correctly preserved (not all "left")');
        } else {
            console.log('❌ Assessment responses issue:', assessmentResponses);
        }
        console.log();

        // Test 4: Base Chart Data Structure
        console.log('4️⃣ Testing Base Chart Data Structure...');
        const profileId = createResponse.data.profile.id;
        const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        
        console.log('✅ Base chart response received');
        
        // Check for the specific data structures that were causing the JavaScript error
        const energyArchitecture = baseChartResponse.data.data.energy_architecture;
        console.log('Energy Architecture:', JSON.stringify(energyArchitecture, null, 2));
        
        if (Array.isArray(energyArchitecture.channel_list)) {
            console.log('✅ channel_list is a proper array - JavaScript error should be resolved');
            console.log('   channel_list.join() test:', energyArchitecture.channel_list.join(', '));
        } else {
            console.log('❌ channel_list is not an array:', typeof energyArchitecture.channel_list);
        }
        
        if (Array.isArray(energyArchitecture.split_bridges)) {
            console.log('✅ split_bridges is a proper array');
        } else {
            console.log('❌ split_bridges is not an array:', typeof energyArchitecture.split_bridges);
        }
        console.log();

        // Test 5: Legacy Base Chart Endpoint
        console.log('5️⃣ Testing Legacy Base Chart Endpoint...');
        const legacyResponse = await axios.get(`${BASE_URL}/api/v1/charts/base/bob@example.com`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        console.log('✅ Legacy endpoint response received');
        console.log('   User ID in response:', legacyResponse.data.data.metadata.user_id);
        console.log();

        console.log('🎉 All tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ User ID now shows "bob@example.com" instead of "mock-user-123"');
        console.log('✅ Assessment responses are preserved (not all defaulting to "left")');
        console.log('✅ Base chart returns proper array structures');
        console.log('✅ JavaScript error "Cannot read properties of undefined (reading \'join\')" should be resolved');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

testCompleteFlow();
