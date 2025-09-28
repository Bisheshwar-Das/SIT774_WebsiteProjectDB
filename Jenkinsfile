pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_NAME = 'sit774-website'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
        TEST_DATABASE = 'test_scenarios.db'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo 'Installing dependencies and building application...'
                sh '''
                    echo "Installing Node.js dependencies..."
                    npm ci
                    
                    echo "Saving build metadata..."
                    echo "Build Number: ${BUILD_NUMBER}" > build-info.txt
                    echo "Build Date: $(date)" >> build-info.txt
                    echo "Git Commit: ${GIT_COMMIT}" >> build-info.txt
                    
                    echo "Running build..."
                    npm run build
                    
                    mkdir -p uploads
                '''
            }
            post {
                success { echo 'Build stage completed successfully!' }
                failure { echo 'Build stage failed!' }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh '''
                    npm test
                '''
            }
            post {
                always {
                    // Archive any test outputs
                    archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                }
                success { echo 'All tests passed!' }
                failure { echo 'Tests failed!' }
            }
        }
        
        stage('Code Quality') {
            steps {
                echo 'Running code quality analysis...'
                sh '''
                    npm run lint -- --format json --output-file eslint-report.json || true
                    echo "ESLint analysis completed."
                    
                    # Display some lint results
                    if [ -f eslint-report.json ]; then
                        echo "Lint report generated successfully"
                        # Count issues if any
                        ISSUES=$(cat eslint-report.json | grep -o '"errorCount":[0-9]*' | cut -d':' -f2 | awk '{sum+=$1} END {print sum}' || echo "0")
                        echo "Total lint issues found: $ISSUES"
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'eslint-report.json', allowEmptyArchive: true
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security analysis...'
                sh '''
                    npm audit --audit-level=moderate --json > security-report.json || true
                    echo "Security scan completed."
                    
                    # Display security summary
                    if [ -f security-report.json ]; then
                        echo "Security report generated"
                        VULNERABILITIES=$(cat security-report.json | grep -o '"vulnerabilities":{[^}]*}' || echo "No vulnerabilities section found")
                        echo "Security scan summary: $VULNERABILITIES"
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'security-report.json', allowEmptyArchive: true
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t ${DOCKER_IMAGE} .
                    echo "Docker image built: ${DOCKER_IMAGE}"
                    
                    # Verify image was created
                    docker images | grep ${APP_NAME} || exit 1
                '''
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to staging...'
                sh '''
                    # Clean up existing staging container
                    docker stop sit774-staging || true
                    docker rm sit774-staging || true
                    
                    # Deploy to staging
                    docker run -d \
                        --name sit774-staging \
                        -p 3001:3000 \
                        -v $(pwd)/uploads:/app/uploads \
                        ${DOCKER_IMAGE}
                    
                    # Wait for application to start
                    echo "Waiting for application to start..."
                    sleep 15
                    
                    # Health check
                    curl -f http://localhost:3001/health || exit 1
                    echo "Staging deployment health check passed!"
                '''
            }
            post {
                success { echo 'Deployment to staging successful!' }
                failure {
                    echo 'Staging deployment failed!'
                    sh 'docker logs sit774-staging || true'
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests against staging...'
                sh '''
                    echo "Testing main endpoints..."
                    
                    # Test health endpoint
                    curl -f http://localhost:3001/health || exit 1
                    echo "Health endpoint test passed"
                    
                    # Test main page
                    curl -f http://localhost:3001/ || exit 1
                    echo "Main page test passed"
                    
                    # Test scenarios page
                    curl -f http://localhost:3001/all-scenarios || exit 1
                    echo "Scenarios page test passed"
                    
                    echo "All integration tests passed!"
                '''
            }
        }
        
        stage('Release to Production') {
            when { 
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Deploying to production...'
                sh '''
                    # Clean up existing production container
                    docker stop sit774-production || true
                    docker rm sit774-production || true
                    
                    # Deploy to production
                    docker run -d \
                        --name sit774-production \
                        -p 3000:3000 \
                        -v $(pwd)/uploads:/app/uploads \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}
                    
                    # Wait for application to start
                    echo "Waiting for production deployment..."
                    sleep 20
                    
                    # Production health check
                    curl -f http://localhost:3000/health || exit 1
                    echo "Production deployment successful!"
                '''
            }
            post {
                success { echo 'Production deployment completed successfully!' }
                failure {
                    echo 'Production deployment failed!'
                    sh 'docker logs sit774-production || true'
                }
            }
        }
        
        stage('Monitoring Setup') {
            steps {
                echo 'Setting up monitoring and alerting...'
                sh '''
                    # Create monitoring script
                    cat > monitor.sh << 'EOF'
#!/bin/bash
LOG_FILE="monitoring.log"
echo "$(date): Starting monitoring for sit774-website" >> $LOG_FILE

while true; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "$(date): Application is healthy" >> $LOG_FILE
    else
        echo "$(date): ALERT - Application health check failed!" >> $LOG_FILE
        # In production, this would trigger alerts (email, Slack, etc.)
    fi
    sleep 60
done
EOF
                    
                    chmod +x monitor.sh
                    
                    # Start monitoring in background (for demo)
                    nohup ./monitor.sh &
                    
                    # Verify monitoring started
                    sleep 5
                    if [ -f monitoring.log ]; then
                        echo "Monitoring setup completed successfully"
                        tail -5 monitoring.log
                    else
                        echo "Warning: Monitoring setup may have issues"
                    fi
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
            // Archive important artifacts
            archiveArtifacts artifacts: 'build-info.txt, monitoring.log', allowEmptyArchive: true
            // Clean workspace
            cleanWs()
        }
        success { 
            echo 'Pipeline executed successfully!'
            // In production: send success notification
        }
        failure {
            echo 'Pipeline failed!'
            sh '''
                echo "Collecting failure information..."
                docker logs sit774-staging || echo "No staging logs available"
                docker logs sit774-production || echo "No production logs available"
            '''
            // In production: send failure notification
        }
    }
}