import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('HTTPBin API Tests', () => {
  test.beforeEach(async () => {
    allure.epic('HTTPBin API');
    allure.feature('HTTP Testing Service');
  });

  test('should test GET request', async ({ request }) => {
    allure.story('Test GET Request');
    allure.severity('critical');
    allure.description('Test to verify GET request functionality');

    const response = await request.get('https://httpbin.org/get');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('headers');
    expect(data).toHaveProperty('args');
    expect(data.url).toBe('https://httpbin.org/get');
  });

  test('should test POST request with JSON data', async ({ request }) => {
    allure.story('Test POST Request with JSON');
    allure.severity('high');
    allure.description('Test to verify POST request with JSON payload');

    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    };

    const response = await request.post('https://httpbin.org/post', {
      data: testData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('json');
    expect(data.json).toEqual(testData);
  });

  test('should test PUT request', async ({ request }) => {
    allure.story('Test PUT Request');
    allure.severity('high');
    allure.description('Test to verify PUT request functionality');

    const updateData = {
      id: 1,
      title: 'Updated Title',
      content: 'Updated content'
    };

    const response = await request.put('https://httpbin.org/put', {
      data: updateData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('json');
    expect(data.json).toEqual(updateData);
  });

  test('should test DELETE request', async ({ request }) => {
    allure.story('Test DELETE Request');
    allure.severity('medium');
    allure.description('Test to verify DELETE request functionality');

    const response = await request.delete('https://httpbin.org/delete');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('url');
    expect(data.url).toBe('https://httpbin.org/delete');
  });

  test('should test request with custom headers', async ({ request }) => {
    allure.story('Test Custom Headers');
    allure.severity('medium');
    allure.description('Test to verify that custom headers are properly sent');

    const customHeaders = {
      'X-Custom-Header': 'Test Value',
      'X-API-Key': 'test-api-key-123',
      'User-Agent': 'Playwright Test Agent'
    };

    const response = await request.get('https://httpbin.org/headers', {
      headers: customHeaders
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('headers');
    
    // Verify custom headers are present
    expect(data.headers['X-Custom-Header']).toBe('Test Value');
    expect(data.headers['X-Api-Key']).toBe('test-api-key-123');
    expect(data.headers['User-Agent']).toBe('Playwright Test Agent');
  });

  test('should test request with query parameters', async ({ request }) => {
    allure.story('Test Query Parameters');
    allure.severity('medium');
    allure.description('Test to verify that query parameters are properly handled');

    const queryParams = {
      param1: 'value1',
      param2: 'value2',
      number: '123'
    };

    const response = await request.get('https://httpbin.org/get', {
      params: queryParams
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('args');
    expect(data.args).toEqual(queryParams);
  });

  test('should test response time', async ({ request }) => {
    allure.story('Test Response Time');
    allure.severity('low');
    allure.description('Test to verify that API response time is acceptable');

    const startTime = Date.now();
    const response = await request.get('https://httpbin.org/delay/1');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    
    const responseTime = endTime - startTime;
    expect(responseTime).toBeGreaterThan(900); // Should be at least 900ms due to 1s delay
    expect(responseTime).toBeLessThan(5000); // Should be less than 5 seconds
  });

  test('should test status codes', async ({ request }) => {
    allure.story('Test Status Codes');
    allure.severity('medium');
    allure.description('Test to verify different HTTP status codes');

    // Test 200 OK
    const okResponse = await request.get('https://httpbin.org/status/200');
    expect(okResponse.status()).toBe(200);

    // Test 404 Not Found
    const notFoundResponse = await request.get('https://httpbin.org/status/404');
    expect(notFoundResponse.status()).toBe(404);

    // Test 500 Internal Server Error
    const serverErrorResponse = await request.get('https://httpbin.org/status/500');
    expect(serverErrorResponse.status()).toBe(500);
  });

  test('should test authentication', async ({ request }) => {
    allure.story('Test Authentication');
    allure.severity('medium');
    allure.description('Test to verify basic authentication functionality');

    const response = await request.get('https://httpbin.org/basic-auth/user/pass', {
      headers: {
        'Authorization': 'Basic dXNlcjpwYXNz' // base64 encoded 'user:pass'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('authenticated');
    expect(data.authenticated).toBe(true);
    expect(data.user).toBe('user');
  });
});
