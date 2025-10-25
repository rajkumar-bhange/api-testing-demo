#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testSuites = [
      'jsonplaceholder.api.spec.ts',
      'restcountries.api.spec.ts', 
      'httpbin.api.spec.ts',
      'enhanced-api.spec.ts'
    ];
  }

  async runTests() {
    console.log('🚀 Starting API Testing Demo...\n');

    try {
      // Check if dependencies are installed
      await this.checkDependencies();
      
      // Install Playwright browsers if needed
      await this.installPlaywright();
      
      // Run all tests
      await this.runAllTests();
      
      // Generate Allure report
      await this.generateReport();
      
      console.log('\n✅ All tests completed successfully!');
      console.log('📊 Check the allure-report directory for detailed results.');
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    if (!fs.existsSync('node_modules')) {
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    console.log('✅ Dependencies are ready\n');
  }

  async installPlaywright() {
    console.log('🎭 Installing Playwright browsers...');
    execSync('npx playwright install', { stdio: 'inherit' });
    console.log('✅ Playwright browsers installed\n');
  }

  async runAllTests() {
    console.log('🧪 Running API tests...');
    
    const command = 'npx playwright test --reporter=html,allure-playwright';
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ All tests executed\n');
  }

  async generateReport() {
    console.log('📊 Generating Allure report...');
    
    try {
      // Generate report
      execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
      
      // Open report in browser
      console.log('🌐 Opening report in browser...');
      execSync('npx allure open allure-report', { stdio: 'inherit' });
      
    } catch (error) {
      console.log('⚠️  Could not open Allure report automatically.');
      console.log('   You can manually open allure-report/index.html in your browser.');
    }
  }

  async runSpecificSuite(suiteName) {
    console.log(`🧪 Running ${suiteName} tests...`);
    
    const command = `npx playwright test tests/${suiteName} --reporter=html,allure-playwright`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ ${suiteName} tests completed\n`);
  }

  async runInDebugMode() {
    console.log('🐛 Running tests in debug mode...');
    
    const command = 'npx playwright test --debug';
    execSync(command, { stdio: 'inherit' });
  }

  async runWithUI() {
    console.log('🖥️  Running tests with UI...');
    
    const command = 'npx playwright test --ui';
    execSync(command, { stdio: 'inherit' });
  }
}

// CLI interface
const args = process.argv.slice(2);
const runner = new TestRunner();

if (args.length === 0) {
  runner.runTests();
} else {
  const command = args[0];
  
  switch (command) {
    case 'debug':
      runner.runInDebugMode();
      break;
    case 'ui':
      runner.runWithUI();
      break;
    case 'suite':
      if (args[1]) {
        runner.runSpecificSuite(args[1]);
      } else {
        console.log('Please specify a test suite name');
      }
      break;
    case 'help':
      console.log(`
Available commands:
  node run-tests.js          - Run all tests and generate report
  node run-tests.js debug    - Run tests in debug mode
  node run-tests.js ui       - Run tests with UI
  node run-tests.js suite <name> - Run specific test suite
  node run-tests.js help     - Show this help message

Available test suites:
  ${runner.testSuites.join('\n  ')}
      `);
      break;
    default:
      console.log('Unknown command. Use "help" to see available commands.');
  }
}
