
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

async function testAuth() {
    console.log('--- Starting Auth Test ---');

    // 1. Register a new test user
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        mobile: '1234567890'
    };

    console.log(`\n1. Registering user: ${testUser.email}`);
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const regData = await regRes.json();
        console.log(`Status: ${regRes.status}`);
        if (regRes.status !== 201) {
            console.error('Registration Failed:', regData);
            return;
        }
        console.log('Registration Success!');

        // 2. Login with the same user
        console.log(`\n2. Logging in with: ${testUser.email}`);
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });

        const loginData = await loginRes.json();
        console.log(`Status: ${loginRes.status}`);
        if (loginRes.status === 200) {
            console.log('Login Success!');
            console.log('Token received:', !!loginData.token);
        } else {
            console.error('Login Failed:', loginData);
        }

    } catch (error) {
        console.error('Test script error:', error);
    }
}

testAuth();
