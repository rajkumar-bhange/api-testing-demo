import { test as base } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';

export interface TestFixtures {
  apiHelper: ApiHelper;
}

export const test = base.extend<TestFixtures>({
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  }
});

export { expect } from '@playwright/test';
