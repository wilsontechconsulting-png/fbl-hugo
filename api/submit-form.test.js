/**
 * Test suite for FBL form submission handler
 * Run with: node api/submit-form.test.js
 * 
 * This uses a mock Resend implementation - no real emails are sent
 */

// Mock environment variables
process.env.RESEND_API_KEY = 'test_key_mock';
process.env.MEMBERSHIP_FORM_RECIPIENT_EMAIL = 'member@fblconnect.com';
process.env.PARTNER_FORM_RECIPIENT_EMAIL = 'member@fblconnect.com';
process.env.ALLOWED_ORIGINS = 'https://fblconnect.com';
process.env.NODE_ENV = 'test';

// Mock fetch for Resend API
global.fetch = async (url, options) => {
  if (url === 'https://api.resend.com/emails') {
    const body = JSON.parse(options.body);
    
    // Validate email structure
    if (!body.from || !body.to || !body.subject || !body.html) {
      return {
        ok: false,
        status: 400,
        text: async () => 'Missing required email fields',
      };
    }
    
    // Simulate successful send
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'mock-email-id-' + Date.now() }),
    };
  }
  
  throw new Error(`Unexpected fetch URL: ${url}`);
};

// Import the handler
const handler = require('./submit-form.js').default;

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual === expected) {
    testsPassed++;
    console.log(`  ✓ ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ ${message}`);
    console.error(`    Expected: ${expected}`);
    console.error(`    Actual: ${actual}`);
  }
}

// Mock request/response objects
function createMockReq(method, body, headers = {}) {
  return {
    method,
    body,
    headers: {
      origin: 'https://fblconnect.com',
      'x-forwarded-for': '127.0.0.1',
      ...headers,
    },
  };
}

function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let responseData = null;
  
  return {
    setHeader: (key, value) => { headers[key] = value; },
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseData = data; },
        end: () => {},
      };
    },
    json: (data) => { responseData = data; },
    getStatus: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headers,
  };
}

// Test suite
async function runTests() {
  console.log('\n🧪 Running FBL Form Handler Tests\n');
  
  // Test 1: Valid membership application
  console.log('Test 1: Valid membership application');
  {
    const req = createMockReq('POST', {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Test Company',
      industry: 'Software & Technology',
      role: 'CEO / Chief Executive Officer',
      covenant_signature: 'John Doe',
      covenant_date: '2026-11-06',
      covenant_formation: 'on',
      covenant_confidentiality: 'on',
      covenant_integrity: 'on',
      covenant_contribution: 'on',
      covenant_agreement: 'on',
    });
    const res = createMockRes();
    
    await handler(req, res);
    
    const data = res.getData();
    assert(data?.success === true, 'Returns success');
    assert(data?.redirectUrl === '/membership-payment/', 'Includes redirect URL');
  }
  
  // Test 2: Valid partner application
  console.log('\nTest 2: Valid partner application');
  {
    const req = createMockReq('POST', {
      _subject: 'FBL Partner Application',
      company_name: 'Partner Corp',
      industry: 'Consulting',
      website: 'https://partner.example.com',
      contact_name: 'Jane Smith',
      email: 'jane@partner.example.com',
      phone: '555-0200',
      tier: 'founding',
      why_fbl: 'Want to reach business leaders',
      member_value: 'Provide consulting services',
      member_benefit: '20% discount for FBL members',
      commitment_communications: 'on',
      commitment_value: 'on',
      commitment_limits: 'on',
      commitment_agreement: 'on',
    });
    const res = createMockRes();
    
    await handler(req, res);
    
    const data = res.getData();
    assert(data?.success === true, 'Returns success');
    assert(data?.redirectUrl === null, 'No redirect for partner form');
  }
  
  // Test 3: Missing required fields
  console.log('\nTest 3: Missing required fields');
  {
    const req = createMockReq('POST', {
      full_name: 'John Doe',
      // Missing email and other required fields
    });
    const res = createMockRes();
    
    await handler(req, res);
    
    assertEquals(res.getStatus(), 400, 'Returns 400 status');
    const data = res.getData();
    assert(data?.success === false, 'Returns failure');
    assert(data?.error === 'Validation failed', 'Error is validation failed');
  }
  
  // Test 4: Invalid email format
  console.log('\nTest 4: Invalid email format');
  {
    const req = createMockReq('POST', {
      full_name: 'John Doe',
      email: 'invalid-email',
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Test Company',
      industry: 'Software & Technology',
      role: 'CEO',
    }, { 'x-forwarded-for': '10.0.0.4' }); // Unique IP
    const res = createMockRes();
    
    await handler(req, res);
    
    assertEquals(res.getStatus(), 400, 'Returns 400 status');
  }
  
  // Test 5: Honeypot spam detection
  console.log('\nTest 5: Honeypot spam detection');
  {
    const req = createMockReq('POST', {
      full_name: 'Spammer',
      email: 'spam@example.com',
      _gotcha: 'spam-value', // Honeypot filled
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Spam Corp',
      industry: 'Spam',
      role: 'Spammer',
    }, { 'x-forwarded-for': '10.0.0.5' }); // Unique IP
    const res = createMockRes();
    
    await handler(req, res);
    
    assertEquals(res.getStatus(), 400, 'Returns 400 status');
    const data = res.getData();
    assert(data?.details?.includes('Spam detected'), 'Detects spam');
  }
  
  // Test 6: Rate limiting
  console.log('\nTest 6: Rate limiting (3 submissions max per hour)');
  {
    const testIP = '192.168.1.100';
    const validBody = {
      full_name: 'Rate Test',
      email: 'rate@example.com',
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Test Company',
      industry: 'Software',
      role: 'CEO',
      covenant_signature: 'Rate Test',
      covenant_formation: 'on',
      covenant_confidentiality: 'on',
      covenant_integrity: 'on',
      covenant_contribution: 'on',
      covenant_agreement: 'on',
    };
    
    // Submit 3 times (should succeed)
    for (let i = 0; i < 3; i++) {
      const req = createMockReq('POST', validBody, { 'x-forwarded-for': testIP });
      const res = createMockRes();
      await handler(req, res);
      assert(res.getData()?.success === true, `Submission ${i + 1} succeeds`);
    }
    
    // 4th submission should be rate limited
    const req = createMockReq('POST', validBody, { 'x-forwarded-for': testIP });
    const res = createMockRes();
    await handler(req, res);
    assertEquals(res.getStatus(), 429, 'Returns 429 on 4th submission');
    assert(res.getData()?.error === 'Rate limit exceeded', 'Rate limit error message');
  }
  
  // Test 7: CORS headers
  console.log('\nTest 7: CORS headers');
  {
    const req = createMockReq('OPTIONS', {});
    const res = createMockRes();
    
    await handler(req, res);
    
    const headers = res.getHeaders();
    assert(headers['Access-Control-Allow-Methods'], 'Sets CORS methods');
    assert(headers['Access-Control-Allow-Headers'], 'Sets CORS headers');
  }
  
  // Test 8: Method not allowed
  console.log('\nTest 8: Method not allowed');
  {
    const req = createMockReq('GET', {});
    const res = createMockRes();
    
    await handler(req, res);
    
    assertEquals(res.getStatus(), 405, 'Returns 405 for GET');
  }
  
  // Test 9: Field length validation
  console.log('\nTest 9: Field length validation');
  {
    const req = createMockReq('POST', {
      full_name: 'A'.repeat(10001), // Exceeds 10KB limit
      email: 'test@example.com',
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Test',
      industry: 'Tech',
      role: 'CEO',
    }, { 'x-forwarded-for': '10.0.0.9' }); // Unique IP
    const res = createMockRes();
    
    await handler(req, res);
    
    assertEquals(res.getStatus(), 400, 'Returns 400 for oversized field');
  }
  
  // Test 10: Reply-To header uses applicant email
  console.log('\nTest 10: Reply-To uses applicant email');
  {
    // We need to intercept the fetch call to check reply_to
    const originalFetch = global.fetch;
    let capturedEmailBody = null;
    
    global.fetch = async (url, options) => {
      if (url === 'https://api.resend.com/emails') {
        capturedEmailBody = JSON.parse(options.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'test-id' }),
        };
      }
      return originalFetch(url, options);
    };
    
    const req = createMockReq('POST', {
      full_name: 'Reply Test',
      email: 'replytest@example.com',
      phone: '555-0100',
      city: 'Atlanta',
      state: 'GA',
      company: 'Test',
      industry: 'Tech',
      role: 'CEO',
      covenant_signature: 'Reply Test',
      covenant_formation: 'on',
      covenant_confidentiality: 'on',
      covenant_integrity: 'on',
      covenant_contribution: 'on',
      covenant_agreement: 'on',
    }, { 'x-forwarded-for': '10.0.0.10' }); // Unique IP
    const res = createMockRes();
    
    await handler(req, res);
    
    assert(capturedEmailBody?.from === 'FBL Forms <forms@send.fblconnect.com>', 'From is correct');
    assert(capturedEmailBody?.to === 'member@fblconnect.com', 'To is correct');
    assert(capturedEmailBody?.reply_to === 'replytest@example.com', 'Reply-To is applicant email');
    
    global.fetch = originalFetch;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log('='.repeat(50) + '\n');
  
  return testsFailed === 0;
}

// Run tests
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
