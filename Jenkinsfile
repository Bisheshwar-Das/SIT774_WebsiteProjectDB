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
                    # Install Node.js dependencies
                    npm ci
                    
                    # Create build artifact info
                    echo "Build Number: ${BUILD_NUMBER}" > build-info.txt
                    echo "Build Date: $(date)" >> build-info.txt
                    echo "Git Commit: ${GIT_COMMIT}" >> build-info.txt
                    
                    # Run build script
                    npm run build
                    
                    # Create uploads directory if it doesn't exist
                    mkdir -p uploads
                '''
            }
            post {
                success {
                    echo 'Build stage completed successfully!'
                }
                failure {
                    echo 'Build stage failed!'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh '''
                    # Run unit tests with coverage
                    npm test -- --coverage --watchAll=false
                    
                    # Generate test report
                    npm run test:coverage
                '''
            }
            post {
                always {
                    // Publish test results
                    publishTestResults testResultsPattern: 'coverage/lcov.info'
                }
                success {
                    echo 'All tests passed!'
                }
                failure {
                    echo 'Tests failed!'
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                echo 'Running code quality analysis...'
                sh '''
                    # Run ESLint for code quality
                    npm run lint -- --format json --output-file eslint-report.json || true
                    
                    # Display lint results
                    echo "ESLint analysis completed"
                    
                    # You can add SonarQube here:
                    # sonar-scanner -Dsonar.projectKey=sit774-website -Dsonar.sources=. -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONAR_AUTH_TOKEN}
                '''
            }
            post {
                always {
                    // Archive code quality reports
                    archiveArtifacts artifacts: 'eslint-report.json', allowEmptyArchive: true
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security analysis...'
                sh '''
                    # Run npm audit for dependency vulnerabilities
                    npm audit --audit-level=moderate --json > security-report.json || true
                    
                    # Display security scan results
                    echo "Security scan completed. Check security-report.json for details."
                    
                    # Optional: Add Snyk scanning
                    # snyk test --json > snyk-report.json || true
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
                script {
                    def dockerImage = docker.build("${DOCKER_IMAGE}")
                    echo "Docker image built: ${DOCKER_IMAGE}"
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    # Stop existing container if running
                    docker stop sit774-staging || true
                    docker rm sit774-staging || true
                    
                    # Run new container in staging
                    docker run -d \
                        --name sit774-staging \
                        -p 3001:3000 \
                        -v $(pwd)/uploads:/app/uploads \
                        ${DOCKER_IMAGE}
                    
                    # Wait for application to start
                    sleep 10
                    
                    # Health check
                    curl -f http://localhost:3001/health || exit 1
                '''
            }
            post {
                success {
                    echo 'Deployment to staging successful!'
                }
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
                    # Test main endpoints
                    curl -f http://localhost:3001/ || exit 1
                    curl -f http://localhost:3001/health || exit 1
                    curl -f http://localhost:3001/all-scenarios || exit 1
                    
                    echo "Integration tests passed!"
                '''
            }
        }
        
        stage('Release to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production environment...'
                sh '''
                    # Stop existing production container
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
                    sleep 15
                    
                    # Production health check
                    curl -f http://localhost:3000/health || exit 1
                    
                    echo "Production deployment successful!"
                '''
            }
            post {
                success {
                    echo 'Production deployment completed successfully!'
                }
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
# Simple monitoring script
while true; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "$(date): Application is healthy"
    else
        echo "$(date): Application health check failed!" 
        # In real scenario, send alert here
    fi
    sleep 60
done
EOF
                    chmod +x monitor.sh
                    
                    # Start monitoring in background (for demo purposes)
                    nohup ./monitor.sh > monitoring.log 2>&1 &
                    
                    echo "Monitoring setup completed"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
            // Send success notification
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
            sh 'docker logs sit774-staging || true'
            sh 'docker logs sit774-production || true'
        }
    }
}