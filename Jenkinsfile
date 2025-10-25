pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Install Node.js if not available
                    sh '''
                        if ! command -v node &> /dev/null; then
                            echo "Installing Node.js ${NODE_VERSION}"
                            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        fi
                        
                        echo "Node.js version: $(node --version)"
                        echo "npm version: $(npm --version)"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing project dependencies..."
                    npm ci
                    
                    echo "Installing Playwright browsers..."
                    npx playwright install --with-deps
                '''
            }
        }
        
        stage('Lint Code') {
            steps {
                sh '''
                    echo "Running TypeScript compiler check..."
                    npx tsc --noEmit
                '''
            }
        }
        
        stage('Run API Tests') {
            parallel {
                stage('JSONPlaceholder API Tests') {
                    steps {
                        sh '''
                            echo "Running JSONPlaceholder API tests..."
                            npx playwright test tests/jsonplaceholder.api.spec.ts --reporter=allure-playwright
                        '''
                    }
                }
                
                stage('HTTPBin API Tests') {
                    steps {
                        sh '''
                            echo "Running HTTPBin API tests..."
                            npx playwright test tests/httpbin.api.spec.ts --reporter=allure-playwright
                        '''
                    }
                }
                
                stage('Enhanced API Tests') {
                    steps {
                        sh '''
                            echo "Running Enhanced API tests..."
                            npx playwright test tests/enhanced-api.spec.ts --reporter=allure-playwright
                        '''
                    }
                }
            }
        }
        
        stage('Run All Tests') {
            steps {
                sh '''
                    echo "Running all API tests..."
                    npx playwright test --reporter=html,allure-playwright
                '''
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                sh '''
                    echo "Generating Allure report..."
                    npx allure generate ${ALLURE_RESULTS} --clean -o ${ALLURE_REPORT}
                '''
            }
        }
        
        stage('Archive Test Results') {
            steps {
                archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true, allowEmptyArchive: true
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true, allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            // Publish Allure report
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
            
            // Publish HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
            
            // Clean up workspace
            cleanWs()
        }
        
        success {
            echo 'Pipeline executed successfully!'
            script {
                // Send success notification (customize as needed)
                emailext (
                    subject: "✅ API Tests Passed - Build #${env.BUILD_NUMBER}",
                    body: """
                    <h2>API Testing Pipeline - SUCCESS</h2>
                    <p><strong>Build:</strong> #${env.BUILD_NUMBER}</p>
                    <p><strong>Branch:</strong> ${env.BRANCH_NAME}</p>
                    <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                    <p><strong>Allure Report:</strong> <a href="${env.BUILD_URL}allure/">View Report</a></p>
                    <p><strong>Playwright Report:</strong> <a href="${env.BUILD_URL}playwright-report/">View Report</a></p>
                    """,
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'your-email@example.com'}",
                    mimeType: 'text/html'
                )
            }
        }
        
        failure {
            echo 'Pipeline failed!'
            script {
                // Send failure notification (customize as needed)
                emailext (
                    subject: "❌ API Tests Failed - Build #${env.BUILD_NUMBER}",
                    body: """
                    <h2>API Testing Pipeline - FAILURE</h2>
                    <p><strong>Build:</strong> #${env.BUILD_NUMBER}</p>
                    <p><strong>Branch:</strong> ${env.BRANCH_NAME}</p>
                    <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                    <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console/">View Logs</a></p>
                    <p><strong>Allure Report:</strong> <a href="${env.BUILD_URL}allure/">View Report</a></p>
                    """,
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'your-email@example.com'}",
                    mimeType: 'text/html'
                )
            }
        }
        
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}
