#!/usr/bin/env node

// Final verification script to test all resolved issues
const testEndpoints = async () => {
    const results = {
        userIdFix: false,
        assessmentFix: false,
        baseChartFix: false,
        serverHealth: false
    };

    console.log('🧪 FINAL VERIFICATION: Testing All Resolved Issues\n');

    try {
        // Test 1: Server Health
        const healthResponse = await fetch('http://localhost:3001/health');
        if (healthResponse.ok) {
            results.serverHealth = true;
            console.log('✅ Server Health: PASSED');
        }

        // Test 2: User ID Display (should show email, not mock-user-123)
        const profilesResponse = await fetch('http://localhost:3001/api/v1/user-data/users/me/profiles', {
            headers: { 'Authorization': 'Bearer token456' }
        });
        const profilesData = await profilesResponse.json();
        
        if (profilesData.profiles && profilesData.profiles[0].user_id === 'bob@example.com') {
            results.userIdFix = true;
            console.log('✅ User ID Fix: PASSED - Shows "bob@example.com" instead of "mock-user-123"');
        } else {
            console.log('❌ User ID Fix: FAILED - Still showing:', profilesData.profiles?.[0]?.user_id);
        }

        // Test 3: Assessment Response Preservation
        const createProfileResponse = await fetch('http://localhost:3001/profile/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer token456',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Final Test Profile',
                assessment_responses: [
                    { question_id: 'test1', response: 'right' },
                    { question_id: 'test2', response: 'left' },
                    { question_id: 'test3', response: 'right' }
                ]
            })
        });
        
        const createData = await createProfileResponse.json();
        
        if (createData.profile_id) {
            const getProfileResponse = await fetch(`http://localhost:3001/profile/${createData.profile_id}`, {
                headers: { 'Authorization': 'Bearer token456' }
            });
            const profileData = await getProfileResponse.json();
            
            const responses = profileData.assessment_responses;
            const hasRight = responses.some(r => r.response === 'right');
            const hasLeft = responses.some(r => r.response === 'left');
            
            if (hasRight && hasLeft) {
                results.assessmentFix = true;
                console.log('✅ Assessment Response Fix: PASSED - Mixed responses preserved');
            } else {
                console.log('❌ Assessment Response Fix: FAILED - Not preserving mixed responses');
            }
        }

        // Test 4: Base Chart JavaScript Error Fix
        if (createData.profile_id) {
            const baseChartResponse = await fetch(`http://localhost:3001/api/v1/profiles/${createData.profile_id}/base_chart`, {
                headers: { 'Authorization': 'Bearer token456' }
            });
            const baseChartData = await baseChartResponse.json();
            
            const energyArch = baseChartData.data?.energy_architecture;
            
            if (Array.isArray(energyArch?.channel_list) && Array.isArray(energyArch?.split_bridges)) {
                results.baseChartFix = true;
                console.log('✅ Base Chart Fix: PASSED - Arrays properly structured, JavaScript error resolved');
                console.log(`   channel_list: [${energyArch.channel_list.join(', ')}]`);
            } else {
                console.log('❌ Base Chart Fix: FAILED - Arrays not properly structured');
            }
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }

    // Summary
    console.log('\n📋 FINAL VERIFICATION SUMMARY:');
    console.log('================================');
    console.log(`Server Health: ${results.serverHealth ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`User ID Fix: ${results.userIdFix ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Assessment Response Fix: ${results.assessmentFix ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Base Chart Fix: ${results.baseChartFix ? '✅ PASSED' : '❌ FAILED'}`);
    
    const allPassed = Object.values(results).every(r => r === true);
    
    if (allPassed) {
        console.log('\n🎉 ALL ISSUES RESOLVED SUCCESSFULLY!');
        console.log('The RcpeExpoApp connection issues have been completely fixed.');
        console.log('\nApp is ready for use at: http://localhost:8082');
    } else {
        console.log('\n⚠️  Some issues may still need attention.');
    }
};

testEndpoints();
