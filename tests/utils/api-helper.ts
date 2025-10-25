import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * Makes a GET request and returns the response
   */
  async get(url: string, options?: any) {
    return await this.request.get(url, options);
  }

  /**
   * Makes a POST request and returns the response
   */
  async post(url: string, data?: any, options?: any) {
    const requestOptions = {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    };
    return await this.request.post(url, requestOptions);
  }

  /**
   * Makes a PUT request and returns the response
   */
  async put(url: string, data?: any, options?: any) {
    const requestOptions = {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    };
    return await this.request.put(url, requestOptions);
  }

  /**
   * Makes a DELETE request and returns the response
   */
  async delete(url: string, options?: any) {
    return await this.request.delete(url, options);
  }

  /**
   * Validates that a response has the expected status code
   */
  async validateStatus(response: any, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Validates that a response contains JSON data
   */
  async validateJsonResponse(response: any) {
    expect(response.headers()['content-type']).toContain('application/json');
    return await response.json();
  }

  /**
   * Validates that a response contains an array
   */
  async validateArrayResponse(response: any) {
    const data = await this.validateJsonResponse(response);
    expect(Array.isArray(data)).toBe(true);
    return data;
  }

  /**
   * Validates that a response contains an object with required fields
   */
  async validateObjectResponse(response: any, requiredFields: string[]) {
    const data = await this.validateJsonResponse(response);
    requiredFields.forEach(field => {
      expect(data).toHaveProperty(field);
    });
    return data;
  }

  /**
   * Validates response time is within acceptable limits
   */
  validateResponseTime(startTime: number, maxTime: number = 5000) {
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(maxTime);
    return responseTime;
  }

  /**
   * Creates test data for API requests
   */
  createTestData(type: string, overrides?: any) {
    const baseData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        phone: '123-456-7890'
      },
      post: {
        title: 'Test Post Title',
        body: 'This is a test post body content',
        userId: 1
      },
      comment: {
        postId: 1,
        name: 'Test Commenter',
        email: 'commenter@example.com',
        body: 'This is a test comment'
      }
    };

    return { ...baseData[type], ...overrides };
  }

  /**
   * Generates random test data
   */
  generateRandomData() {
    const randomId = Math.floor(Math.random() * 1000);
    const timestamp = Date.now();
    
    return {
      id: randomId,
      timestamp,
      randomString: `test_${randomId}_${timestamp}`,
      randomEmail: `test${randomId}@example.com`
    };
  }

  /**
   * Waits for a specific condition to be met
   */
  async waitForCondition(condition: () => Promise<boolean>, timeout: number = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Retries a request with exponential backoff
   */
  async retryRequest(requestFn: () => Promise<any>, maxRetries: number = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}
