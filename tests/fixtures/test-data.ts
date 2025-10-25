export const testData = {
  users: {
    validUser: {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org'
    },
    newUser: {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '123-456-7890',
      website: 'test.com'
    }
  },
  
  posts: {
    validPost: {
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      userId: 1
    },
    newPost: {
      title: 'Test Post Title',
      body: 'This is a test post body content',
      userId: 1
    }
  },

  comments: {
    validComment: {
      id: 1,
      postId: 1,
      name: 'id labore ex et quam laborum',
      email: 'Eliseo@gardner.biz',
      body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium'
    },
    newComment: {
      postId: 1,
      name: 'Test Commenter',
      email: 'commenter@example.com',
      body: 'This is a test comment'
    }
  },

  countries: {
    usa: {
      name: 'United States',
      code: 'USA',
      capital: 'Washington, D.C.',
      region: 'Americas',
      population: 331002651
    },
    canada: {
      name: 'Canada',
      code: 'CAN',
      capital: 'Ottawa',
      region: 'Americas',
      population: 37742154
    }
  },

  httpBin: {
    testHeaders: {
      'X-Test-Header': 'Test Value',
      'X-API-Key': 'test-api-key',
      'User-Agent': 'Playwright Test Agent'
    },
    testParams: {
      param1: 'value1',
      param2: 'value2',
      number: '123'
    }
  }
};

export const apiEndpoints = {
  jsonPlaceholder: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    users: '/users',
    posts: '/posts',
    comments: '/comments',
    albums: '/albums',
    photos: '/photos',
    todos: '/todos'
  },
  
  restCountries: {
    baseUrl: 'https://restcountries.com/v3.1',
    all: '/all',
    name: '/name',
    code: '/alpha',
    region: '/region',
    capital: '/capital'
  },

  httpBin: {
    baseUrl: 'https://httpbin.org',
    get: '/get',
    post: '/post',
    put: '/put',
    delete: '/delete',
    headers: '/headers',
    status: '/status',
    delay: '/delay',
    auth: '/basic-auth'
  }
};

export const expectedStatusCodes = {
  success: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500
};

export const responseTimeLimits = {
  fast: 1000,      // 1 second
  normal: 3000,    // 3 seconds
  slow: 5000,      // 5 seconds
  verySlow: 10000  // 10 seconds
};
