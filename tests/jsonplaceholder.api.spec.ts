import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('JSONPlaceholder API Tests', () => {
  test.beforeEach(async () => {
    allure.epic('JSONPlaceholder API');
    allure.feature('REST API Testing');
  });

  test('should get all posts', async ({ request }) => {
    allure.story('Get All Posts');
    allure.severity('critical');
    allure.description('Test to verify that we can retrieve all posts from the API');

    const response = await request.get('/posts');
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify post structure
    const firstPost = posts[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('title');
    expect(firstPost).toHaveProperty('body');
    expect(firstPost).toHaveProperty('userId');
  });

  test('should get specific post by ID', async ({ request }) => {
    allure.story('Get Post by ID');
    allure.severity('high');
    allure.description('Test to verify retrieving a specific post by its ID');

    const postId = 1;
    const response = await request.get(`/posts/${postId}`);
    
    expect(response.status()).toBe(200);
    
    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post.title).toBeDefined();
    expect(post.body).toBeDefined();
    expect(post.userId).toBeDefined();
  });

  test('should create a new post', async ({ request }) => {
    allure.story('Create New Post');
    allure.severity('high');
    allure.description('Test to verify creating a new post via POST request');

    const newPost = {
      title: 'Test Post Title',
      body: 'This is a test post body content',
      userId: 1
    };

    const response = await request.post('/posts', {
      data: newPost,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(201);
    
    const createdPost = await response.json();
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost.id).toBeDefined();
  });

  test('should update an existing post', async ({ request }) => {
    allure.story('Update Post');
    allure.severity('medium');
    allure.description('Test to verify updating an existing post via PUT request');

    const postId = 1;
    const updatedPost = {
      id: postId,
      title: 'Updated Post Title',
      body: 'This is the updated post body content',
      userId: 1
    };

    const response = await request.put(`/posts/${postId}`, {
      data: updatedPost,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result.title).toBe(updatedPost.title);
    expect(result.body).toBe(updatedPost.body);
    expect(result.id).toBe(postId);
  });

  test('should delete a post', async ({ request }) => {
    allure.story('Delete Post');
    allure.severity('medium');
    allure.description('Test to verify deleting a post via DELETE request');

    const postId = 1;
    const response = await request.delete(`/posts/${postId}`);
    
    expect(response.status()).toBe(200);
  });

  test('should get posts for a specific user', async ({ request }) => {
    allure.story('Get User Posts');
    allure.severity('medium');
    allure.description('Test to verify retrieving posts for a specific user');

    const userId = 1;
    const response = await request.get(`/posts?userId=${userId}`);
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    
    // Verify all posts belong to the specified user
    posts.forEach(post => {
      expect(post.userId).toBe(userId);
    });
  });

  test('should handle non-existent post gracefully', async ({ request }) => {
    allure.story('Handle Non-existent Post');
    allure.severity('low');
    allure.description('Test to verify API behavior when requesting a non-existent post');

    const response = await request.get('/posts/99999');
    
    expect(response.status()).toBe(404);
  });

  test('should validate response headers', async ({ request }) => {
    allure.story('Validate Response Headers');
    allure.severity('low');
    allure.description('Test to verify that response headers are correct');

    const response = await request.get('/posts/1');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
