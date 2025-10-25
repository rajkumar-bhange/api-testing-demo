# API Testing Demo

A comprehensive API testing automation framework using Playwright and Allure reporting.

## Features

- 🚀 **Playwright** for API testing
- 📊 **Allure** reporting for beautiful test reports
- 🔧 **TypeScript** support
- 📝 **Multiple API examples** (JSONPlaceholder, REST Countries, etc.)
- 🛠️ **Utility functions** for common API operations
- 📋 **Test data management**

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run setup
   ```

4. Install Allure commandline (optional, for local reporting):
   ```bash
   npm run install:allure
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

## Allure Reporting

### Generate and view report
```bash
npm run test:generate-report
npm run test:report
```

This will:
1. Generate the Allure report from test results
2. Open the report in your default browser

## Project Structure

```
├── tests/                    # Test files
│   ├── api/                  # API-specific tests
│   ├── fixtures/             # Test fixtures and data
│   └── utils/                # Utility functions
├── allure-results/           # Allure test results (generated)
├── allure-report/            # Allure HTML report (generated)
├── playwright.config.ts      # Playwright configuration
└── package.json              # Dependencies and scripts
```

## Test Examples

The framework includes tests for popular open source APIs:

- **JSONPlaceholder** - Fake REST API for testing
- **REST Countries** - Country information API
- **JSON Server** - Local mock API
- **HTTPBin** - HTTP testing service

## Configuration

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
BASE_URL=https://jsonplaceholder.typicode.com
API_KEY=your_api_key_here
TIMEOUT=30000
```

### Playwright Configuration

The `playwright.config.ts` file contains:
- Test directory configuration
- Reporter settings (HTML + Allure)
- Browser and device configurations
- Base URL settings

## Writing Tests

### Basic API Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API Tests', () => {
  test('should get user data', async ({ request }) => {
    allure.description('Test to verify user data retrieval');
    allure.tag('api', 'users');
    
    const response = await request.get('/users/1');
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(1);
    expect(user.name).toBeDefined();
  });
});
```

### Using Allure Features

```typescript
import { allure } from 'allure-playwright';

test('API test with Allure features', async ({ request }) => {
  allure.epic('User Management');
  allure.feature('User CRUD Operations');
  allure.story('Get User Details');
  allure.severity('critical');
  
  // Test implementation
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tests
4. Run tests to ensure they pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details
