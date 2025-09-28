pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

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
                success { echo '✅ Build stage completed successfully!' }
                failure { echo '❌ Build stage failed!' }
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh '''
                    npm test -- --coverage --watchAll=false
                    npm run test:coverage
                '''
            }
            post {
                always {
                    junit 'coverage/lcov-report/*.xml' // publish test results
                }
                success { echo '✅ All tests passed!' }
                failure { echo '❌ Tests failed!' }
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running code quality analysis...'
                sh '''
                    npm run lint -- --format json --output-file eslint-report.json || true
                    echo "ESLint analysis completed."
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
                    echo "✅ Docker image built: ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to staging...'
                sh '''
                    docker stop sit774-staging || true
                    docker rm sit774-staging || true

                    docker run -d \
                        --name sit774-staging \
                        -p 3001:3000 \
                        -v $(pwd)/uploads:/app/uploads \
                        ${DOCKER_IMAGE}

                    sleep 10
                    curl -f http://localhost:3001/health || exit 1
                '''
            }
            post {
                success { echo '✅ Deployment to staging successful!' }
                failure {
                    echo '❌ Staging deployment failed!'
                    sh 'docker logs sit774-staging || true'
                }
            }
        }

        stage('Integration Tests') {
            steps {
                echo 'Running integration tests against staging...'
                sh '''
                    curl -f http://localhost:3001/ || exit 1
                    curl -f http://localhost:3001/health || exit 1
                    curl -f http://localhost:3001/all-scenarios || exit 1
                    echo "✅ Integration tests passed!"
                '''
            }
        }

        stage('Release to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying to production...'
                sh '''
                    docker stop sit774-production || true
                    docker rm sit774-production || true

                    docker run -d \
                        --name sit774-production \
                        -p 3000:3000 \
                        -v $(pwd)/uploads:/app/uploads \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}

                    sleep 15
                    curl -f http://localhost:3000/health || exit 1
                    echo "✅ Production deployment successful!"
                '''
            }
            post {
                success { echo '✅ Production deployment completed successfully!' }
                failure {
                    echo '❌ Production deployment failed!'
                    sh 'docker logs sit774-production || true'
                }
            }
        }

        stage('Monitoring Setup') {
            steps {
                echo 'Setting up monitoring...'
                sh '''
                    cat > monitor.sh << 'EOF'
#!/bin/bash
while true; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "$(date): Application is healthy"
    else
        echo "$(date): Application health check failed!" 
    fi
    sleep 60
done
EOF
                    chmod +x monitor.sh
                    nohup ./monitor.sh > monitoring.log 2>&1 &
                    echo "Monitoring setup completed"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed!'
            cleanWs()
        }
        success { echo '🎉 Pipeline executed successfully!' }
        failure {
            echo '❌ Pipeline failed!'
            sh 'docker logs sit774-staging || true'
            sh 'docker logs sit774-production || true'
        }
    }
}
