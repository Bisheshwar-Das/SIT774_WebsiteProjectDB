pipeline {
    agent any

    environment {
        APP_NAME = 'sit774-website'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
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
                echo 'Installing dependencies...'
                sh '''
                    npm --version
                    node --version
                    npm ci
                    echo "Build completed successfully"
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running code quality analysis...'
                sh '''
                    npm run lint || true
                    echo "Code quality analysis completed"
                '''
            }
        }

        stage('Security') {
            steps {
                echo 'Running security scan...'
                sh '''
                    npm audit --audit-level=moderate || true
                    echo "Security scan completed"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                script {
                    def dockerImage = docker.build("${DOCKER_IMAGE}")
                    echo "Docker image built: ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    docker stop sit774-staging || true
                    docker rm sit774-staging || true
                    docker run -d -p 3001:3000 --name sit774-staging ''' + "${DOCKER_IMAGE}" + '''
                    sleep 10
                    echo "Staging deployment completed"
                '''
            }
        }

        stage('Release') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                sh '''
                    docker stop sit774-production || true
                    docker rm sit774-production || true
                    docker run -d -p 3000:3000 --name sit774-production ''' + "${DOCKER_IMAGE}" + '''
                    sleep 15
                    echo "Production deployment completed"
                '''
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Setting up monitoring...'
                sh '''
                    # Create simple monitoring script
                    cat > monitor.sh << 'EOF'
#!/bin/bash
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "$(date): Application is healthy"
else
    echo "$(date): Health check failed"
fi
EOF
                    chmod +x monitor.sh
                    ./monitor.sh
                    echo "Monitoring setup completed"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}