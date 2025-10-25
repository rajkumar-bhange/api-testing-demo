import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelper } from './utils/api-helper';
import { testData, apiEndpoints, expectedStatusCodes } from './fixtures/test-data';

test.describe('Enhanced API Tests with Utilities', () => {
  test.beforeEach(async () => {
    allure.epic('Enhanced API Testing');
    allure.feature('Utility-based API Tests');
  });

  test('should create and validate user using utilities', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Create User with Utilities');
    allure.severity('high');
    allure.description('Test user creation using API helper utilities');

    const newUser = apiHelper.createTestData('user', {
      name: 'John Doe',
      email: 'john.doe@example.com'
    });

    const response = await apiHelper.post(
      `${apiEndpoints.jsonPlaceholder.baseUrl}${apiEndpoints.jsonPlaceholder.users}`,
      newUser
    );

    await apiHelper.validateStatus(response, expectedStatusCodes.created);
    const createdUser = await apiHelper.validateObjectResponse(response, ['name', 'email', 'id']);

    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
  });

  test('should test API with retry mechanism', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('API Test with Retry');
    allure.severity('medium');
    allure.description('Test API with retry mechanism for flaky endpoints');

    const response = await apiHelper.retryRequest(async () => {
      return await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/posts/1`);
    }, 3);

    await apiHelper.validateStatus(response, expectedStatusCodes.success);
    const post = await apiHelper.validateObjectResponse(response, ['id', 'title', 'body', 'userId']);

    expect(post.id).toBe(1);
    expect(post.title).toBeDefined();
  });

  test('should validate response time', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Validate Response Time');
    allure.severity('medium');
    allure.description('Test to ensure API response time is within acceptable limits');

    const startTime = Date.now();
    const response = await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/posts`);
    const responseTime = apiHelper.validateResponseTime(startTime, 3000);

    await apiHelper.validateStatus(response, expectedStatusCodes.success);
    const posts = await apiHelper.validateArrayResponse(response);

    expect(posts.length).toBeGreaterThan(0);
    expect(responseTime).toBeLessThan(3000);
  });

  test('should test multiple API endpoints in sequence', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Sequential API Testing');
    allure.severity('high');
    allure.description('Test multiple API endpoints in a sequence');

    // Test 1: Get all users
    const usersResponse = await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/users`);
    await apiHelper.validateStatus(usersResponse, expectedStatusCodes.success);
    const users = await apiHelper.validateArrayResponse(usersResponse);
    expect(users.length).toBeGreaterThan(0);

    // Test 2: Get posts for first user
    const userId = users[0].id;
    const postsResponse = await apiHelper.get(
      `${apiEndpoints.jsonPlaceholder.baseUrl}/posts?userId=${userId}`
    );
    await apiHelper.validateStatus(postsResponse, expectedStatusCodes.success);
    const posts = await apiHelper.validateArrayResponse(postsResponse);

    // Test 3: Get comments for first post
    if (posts.length > 0) {
      const postId = posts[0].id;
      const commentsResponse = await apiHelper.get(
        `${apiEndpoints.jsonPlaceholder.baseUrl}/comments?postId=${postId}`
      );
      await apiHelper.validateStatus(commentsResponse, expectedStatusCodes.success);
      const comments = await apiHelper.validateArrayResponse(commentsResponse);
      
      // Verify all comments belong to the post
      comments.forEach(comment => {
        expect(comment.postId).toBe(postId);
      });
    }
  });

  test('should test error handling', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Error Handling Test');
    allure.severity('medium');
    allure.description('Test API error handling and edge cases');

    // Test 404 error
    const notFoundResponse = await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/posts/99999`);
    await apiHelper.validateStatus(notFoundResponse, expectedStatusCodes.notFound);

    // Test invalid endpoint
    const invalidResponse = await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/invalid-endpoint`);
    await apiHelper.validateStatus(invalidResponse, expectedStatusCodes.notFound);
  });

  test('should test data validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Data Validation Test');
    allure.severity('medium');
    allure.description('Test API data validation and structure');

    const response = await apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/users/1`);
    await apiHelper.validateStatus(response, expectedStatusCodes.success);
    
    const user = await apiHelper.validateObjectResponse(response, [
      'id', 'name', 'username', 'email', 'phone', 'website'
    ]);

    // Validate data types
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.username).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.phone).toBe('string');
    expect(typeof user.website).toBe('string');

    // Validate email format
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('should test concurrent API requests', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    allure.story('Concurrent API Testing');
    allure.severity('high');
    allure.description('Test multiple API requests executed concurrently');

    const startTime = Date.now();

    // Execute multiple requests concurrently
    const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
      apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/users`),
      apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/posts`),
      apiHelper.get(`${apiEndpoints.jsonPlaceholder.baseUrl}/comments`)
    ]);

    const totalTime = Date.now() - startTime;

    // Validate all responses
    await apiHelper.validateStatus(usersResponse, expectedStatusCodes.success);
    await apiHelper.validateStatus(postsResponse, expectedStatusCodes.success);
    await apiHelper.validateStatus(commentsResponse, expectedStatusCodes.success);

    const users = await apiHelper.validateArrayResponse(usersResponse);
    const posts = await apiHelper.validateArrayResponse(postsResponse);
    const comments = await apiHelper.validateArrayResponse(commentsResponse);

    expect(users.length).toBeGreaterThan(0);
    expect(posts.length).toBeGreaterThan(0);
    expect(comments.length).toBeGreaterThan(0);

    // Concurrent requests should be faster than sequential
    expect(totalTime).toBeLessThan(5000);
  });
});
