# Jenkins Configuration for API Testing Framework

## Prerequisites

### Required Jenkins Plugins
Install the following plugins in Jenkins:

1. **Allure Jenkins Plugin**
   - Plugin ID: `allure-jenkins-plugin`
   - Used for generating Allure reports

2. **HTML Publisher Plugin**
   - Plugin ID: `htmlpublisher`
   - Used for publishing Playwright HTML reports

3. **Email Extension Plugin**
   - Plugin ID: `email-ext`
   - Used for sending email notifications

4. **Pipeline Plugin**
   - Plugin ID: `workflow-aggregator`
   - Required for declarative pipelines

### System Requirements
- Jenkins 2.400+ (LTS recommended)
- Node.js 18+ (will be installed automatically if not present)
- Git
- Allure Commandline (will be installed via npm)

## Jenkins Job Configuration

### 1. Create New Pipeline Job
1. Go to Jenkins Dashboard
2. Click "New Item"
3. Enter job name: `api-testing-pipeline`
4. Select "Pipeline"
5. Click "OK"

### 2. Configure Pipeline
1. In the job configuration:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/rajkumar-bhange/api-testing-demo.git`
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`

### 3. Build Triggers (Optional)
Configure build triggers as needed:
- **GitHub hook trigger for GITScm polling** (if using GitHub webhooks)
- **Poll SCM** (e.g., `H/5 * * * *` for every 5 minutes)
- **Build periodically** (e.g., `H 2 * * *` for daily at 2 AM)

### 4. Environment Variables
Add these environment variables in Jenkins:
- `CHANGE_AUTHOR_EMAIL`: Email for notifications
- `ALLURE_RESULTS_DIR`: Directory for Allure results (default: `allure-results`)
- `ALLURE_REPORT_DIR`: Directory for Allure reports (default: `allure-report`)

## Pipeline Features

### Stages Overview
1. **Checkout**: Gets the latest code from repository
2. **Setup Node.js**: Installs Node.js if not available
3. **Install Dependencies**: Installs npm packages and Playwright browsers
4. **Lint Code**: Runs TypeScript compiler check
5. **Run API Tests**: Executes tests in parallel for different APIs
6. **Run All Tests**: Runs complete test suite
7. **Generate Allure Report**: Creates Allure HTML report
8. **Archive Test Results**: Saves test artifacts

### Parallel Test Execution
The pipeline runs tests in parallel for better performance:
- JSONPlaceholder API Tests
- HTTPBin API Tests  
- Enhanced API Tests

### Reporting
- **Allure Reports**: Comprehensive test reports with trends, categories, and detailed results
- **Playwright HTML Reports**: Visual test reports with screenshots and videos
- **Email Notifications**: Success/failure notifications with report links

### Artifacts
The pipeline archives:
- Test results (`test-results/`)
- Playwright HTML reports (`playwright-report/`)
- Allure results (`allure-results/`)

## Customization

### Email Notifications
Update email addresses in the Jenkinsfile:
```groovy
to: "${env.CHANGE_AUTHOR_EMAIL ?: 'your-email@example.com'}"
```

### Test Execution
Modify test execution by updating the parallel stages:
```groovy
stage('Custom API Tests') {
    steps {
        sh 'npx playwright test tests/custom.api.spec.ts --reporter=allure-playwright'
    }
}
```

### Environment Variables
Add custom environment variables:
```groovy
environment {
    CUSTOM_API_URL = 'https://api.example.com'
    TEST_TIMEOUT = '30000'
}
```

## Troubleshooting

### Common Issues
1. **Node.js not found**: The pipeline will install Node.js automatically
2. **Playwright browsers missing**: Run `npx playwright install --with-deps`
3. **Allure plugin not found**: Install the Allure Jenkins plugin
4. **Permission issues**: Ensure Jenkins has proper file system permissions

### Debug Mode
To run tests in debug mode, modify the pipeline:
```groovy
sh 'npx playwright test --debug'
```

### Test Selection
Run specific tests by modifying the command:
```groovy
sh 'npx playwright test --grep "should get all posts"'
```

## Security Considerations

1. **Credentials**: Store API keys and secrets in Jenkins Credentials Store
2. **Permissions**: Use Jenkins Role-Based Access Control (RBAC)
3. **Secrets**: Never hardcode sensitive information in Jenkinsfile
4. **Network**: Ensure Jenkins can access external APIs

## Monitoring and Maintenance

### Health Checks
- Monitor build success rates
- Check test execution times
- Review Allure report trends

### Updates
- Keep Jenkins plugins updated
- Update Node.js and npm packages regularly
- Monitor API endpoint availability

## Integration with GitHub

### Webhook Setup
1. Go to your GitHub repository settings
2. Navigate to "Webhooks"
3. Add webhook URL: `https://your-jenkins-url/github-webhook/`
4. Select "Just the push event"

### Branch Protection
Configure branch protection rules in GitHub to require successful Jenkins builds before merging.
