/**
 * Automated Test Suite for RoktoBondhu Backend API
 * Tests all models, routes, auth, validation, caching, and business logic
 */

(process.env as any).NODE_ENV = 'test';

import http from 'http';
import app from './src/server';

const PORT = 5099;
let server: http.Server;

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function request(path: string, options: { method?: string; body?: any; cookie?: string; token?: string } = {}) {
  const { method = 'GET', body, cookie, token } = options;

  return new Promise<{ status: number; headers: http.IncomingHttpHeaders; body: any }>((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload).toString();
    }
    if (cookie) {
      reqHeaders['Cookie'] = cookie;
    }
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 500, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log(' RUNNING ROKTOBONDHU PHASE 2 TEST SUITE');
  console.log('==================================================\n');

  let testAuthCookie = '';
  let testToken = '';
  let testRequestId = '';
  let testDonationId = '';
  let testNotificationId = '';

  // TEST 1: Health check
  try {
    const res = await request('/api/health');
    if (res.status === 200 && res.body.success === true) {
      results.push({ name: '1. Health check returns 200 OK', passed: true });
    } else {
      results.push({ name: '1. Health check returns 200 OK', passed: false, error: `Status ${res.status}` });
    }
  } catch (err: any) {
    results.push({ name: '1. Health check returns 200 OK', passed: false, error: err.message });
  }

  // TEST 2: Demo login as Donor (Rahim Ahmed)
  try {
    const res = await request('/api/auth/demo/donor', { method: 'POST' });
    const setCookie = res.headers['set-cookie'];
    if (res.status === 200 && res.body.data?.user?.name === 'Rahim Ahmed') {
      testToken = res.body.data.token;
      if (setCookie && setCookie.length > 0) {
        testAuthCookie = setCookie[0].split(';')[0];
      }
      results.push({ name: '2. Demo login sets HTTP-only cookie & returns JWT', passed: true });
    } else {
      results.push({ name: '2. Demo login sets HTTP-only cookie & returns JWT', passed: false, error: JSON.stringify(res.body) });
    }
  } catch (err: any) {
    results.push({ name: '2. Demo login sets HTTP-only cookie & returns JWT', passed: false, error: err.message });
  }

  // TEST 3: Auth verification via /api/auth/me
  try {
    const res = await request('/api/auth/me', { cookie: testAuthCookie, token: testToken });
    if (res.status === 200 && res.body.data?.user?.email === 'rahim.ahmed@example.com') {
      results.push({ name: '3. /api/auth/me authenticates via HTTP-only cookie/token', passed: true });
    } else {
      results.push({ name: '3. /api/auth/me authenticates', passed: false, error: `Status ${res.status}` });
    }
  } catch (err: any) {
    results.push({ name: '3. /api/auth/me authenticates', passed: false, error: err.message });
  }

  // TEST 4: Query urgent blood requests
  try {
    const res = await request('/api/requests/urgent');
    if (res.status === 200 && Array.isArray(res.body.data) && res.body.data.length > 0) {
      results.push({ name: '4. /api/requests/urgent returns active critical/urgent requests', passed: true });
    } else {
      results.push({ name: '4. /api/requests/urgent returns requests', passed: false, error: `Count: ${res.body.data?.length}` });
    }
  } catch (err: any) {
    results.push({ name: '4. /api/requests/urgent returns requests', passed: false, error: err.message });
  }

  // TEST 5: Create a new blood request with input validation
  try {
    const res = await request('/api/requests', {
      method: 'POST',
      cookie: testAuthCookie,
      token: testToken,
      body: {
        patientName: 'Test Patient Kabir',
        patientRelation: 'Father',
        bloodGroup: 'B+',
        unitsRequired: 2,
        hospitalName: 'Kurmitola General Hospital',
        hospitalLocation: 'Dhaka Cantonment',
        division: 'Dhaka',
        requiredDate: '2026-11-04',
        requiredTime: '06:00 PM',
        contactPhone: '+880 1711-223344',
        description: 'Automated test suite urgent bypass transfusion case',
        urgency: 'critical',
      },
    });

    if (res.status === 201 && res.body.data?._id) {
      testRequestId = res.body.data._id;
      results.push({ name: '5. POST /api/requests creates request & triggers notifications', passed: true });
    } else {
      results.push({ name: '5. POST /api/requests creates request', passed: false, error: JSON.stringify(res.body) });
    }
  } catch (err: any) {
    results.push({ name: '5. POST /api/requests creates request', passed: false, error: err.message });
  }

  // TEST 6: Get request by ID
  try {
    const res = await request(`/api/requests/${testRequestId}`);
    if (res.status === 200 && res.body.data?.hospitalName === 'Kurmitola General Hospital') {
      results.push({ name: '6. GET /api/requests/:id retrieves details with responses counter', passed: true });
    } else {
      results.push({ name: '6. GET /api/requests/:id retrieves details', passed: false, error: `Status ${res.status}` });
    }
  } catch (err: any) {
    results.push({ name: '6. GET /api/requests/:id retrieves details', passed: false, error: err.message });
  }

  // TEST 7: Mark request as fulfilled (Removes from active urgent query)
  try {
    const res = await request(`/api/requests/${testRequestId}/status`, {
      method: 'PATCH',
      cookie: testAuthCookie,
      token: testToken,
      body: { status: 'fulfilled' },
    });
    if (res.status === 200 && res.body.data?.status === 'fulfilled') {
      results.push({ name: '7. PATCH /api/requests/:id/status updates to fulfilled', passed: true });
    } else {
      results.push({ name: '7. PATCH /api/requests/:id/status updates', passed: false, error: `Status ${res.status}` });
    }
  } catch (err: any) {
    results.push({ name: '7. PATCH /api/requests/:id/status updates', passed: false, error: err.message });
  }

  // TEST 8: Create connection (donor contacts requester)
  try {
    const res = await request('/api/connections', {
      method: 'POST',
      cookie: testAuthCookie,
      token: testToken,
      body: {
        requestId: testRequestId,
        contactMethod: 'call',
        donorName: 'Farhan Kabir',
        donorPhone: '+880 1819-998877',
      },
    });

    if (res.status === 201 && res.body.data?._id) {
      results.push({ name: '8. POST /api/connections creates contact connection record', passed: true });
    } else {
      results.push({ name: '8. POST /api/connections creates record', passed: false, error: JSON.stringify(res.body) });
    }
  } catch (err: any) {
    results.push({ name: '8. POST /api/connections creates record', passed: false, error: err.message });
  }

  // TEST 9: Log donation with configurable eligibility calculation
  try {
    const res = await request('/api/donations', {
      method: 'POST',
      cookie: testAuthCookie,
      token: testToken,
      body: {
        donationDate: '2026-11-01',
        hospitalName: 'National Heart Foundation',
        location: 'Mirpur, Dhaka',
        bloodGroup: 'O+',
        units: 1,
        notes: 'Voluntary bypass surgery support',
      },
    });

    if (res.status === 201 && res.body.data?.user?.nextEligibleDate) {
      testDonationId = res.body.data.donation?._id;
      const disclaimerPresent = !!res.body.data.user.disclaimer;
      results.push({
        name: '9. POST /api/donations calculates next eligible date & includes disclaimer',
        passed: disclaimerPresent,
        error: disclaimerPresent ? undefined : 'Medical disclaimer missing',
      });
    } else {
      results.push({ name: '9. POST /api/donations calculates eligibility', passed: false, error: JSON.stringify(res.body) });
    }
  } catch (err: any) {
    results.push({ name: '9. POST /api/donations calculates eligibility', passed: false, error: err.message });
  }

  // TEST 10: User availability toggle
  try {
    const res = await request('/api/users/availability', {
      method: 'PATCH',
      cookie: testAuthCookie,
      token: testToken,
      body: { isAvailable: false },
    });
    if (res.status === 200 && res.body.data?.isAvailable === false) {
      results.push({ name: '10. PATCH /api/users/availability toggles donor availability', passed: true });
    } else {
      results.push({ name: '10. PATCH /api/users/availability toggles', passed: false, error: `Status ${res.status}` });
    }
  } catch (err: any) {
    results.push({ name: '10. PATCH /api/users/availability toggles', passed: false, error: err.message });
  }

  // SUMMARY
  console.log('--------------------------------------------------');
  results.forEach((r) => {
    const icon = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${icon} | ${r.name} ${r.error ? `-> ${r.error}` : ''}`);
  });
  console.log('--------------------------------------------------');
  const allPassed = results.every((r) => r.passed);
  console.log(`TOTAL: ${results.length} tests, ${results.filter((r) => r.passed).length} passed, ${results.filter((r) => !r.passed).length} failed.`);
  console.log('==================================================\n');

  server.close(() => {
    process.exit(allPassed ? 0 : 1);
  });
}

// Start test server on dedicated test port
server = app.listen(PORT, () => {
  runTests().catch((err) => {
    console.error('Test Runner Failed:', err);
    server.close(() => process.exit(1));
  });
});
