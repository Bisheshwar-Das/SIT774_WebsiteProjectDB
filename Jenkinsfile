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
                git branch: 'main',
                    url: 'https://github.com/Bisheshwar-Das/SIT774_WebsiteProjectDB.git'
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
                echo 'Running ESLint...'
                sh 'npm run lint || true'
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security scan...'
                sh 'npm audit --audit-level=moderate || true'
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker --version
                    docker build -t ${DOCKER_IMAGE} .
                    echo "Docker image built: ${DOCKER_IMAGE}"
                '''
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
                        ${DOCKER_IMAGE}
                    
                    sleep 10
                    echo "Staging deployment completed"
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
