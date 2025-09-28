pipeline {
    agent any

    environment {
        APP_NAME = 'sit774-website'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
        SONAR_LOGIN = credentials('sonar-token') // Your SonarCloud token stored in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                deleteDir()
                git branch: 'main',
                    url: 'https://github.com/Bisheshwar-Das/SIT774_WebsiteProjectDB.git',
                    credentialsId: '8972af68-adf2-49e6-8431-8280277d87a8'
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh '''
                    npm --version
                    node --version
                    npm ci
                    npm install --save-dev sonar-scanner
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
                echo 'Running SonarCloud analysis...'
                sh """
                    ./node_modules/.bin/sonar-scanner \
                        -Dsonar.login=${SONAR_LOGIN}
                """
            }
        }

        stage('Security') {
            steps {
                echo 'Running security scan...'
                sh '''
                    npm audit --audit-level=moderate
                    trivy fs --exit-code 1 --severity HIGH,CRITICAL .
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to staging environment...'
                sh """
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true
                    docker run -d -p 3000:3000 --name ${APP_NAME} ${DOCKER_IMAGE}
                """
            }
        }

        stage('Release') {
            steps {
                echo 'Tagging and pushing Docker image...'
                sh """
                    docker tag ${DOCKER_IMAGE} ${APP_NAME}:latest
                    docker push ${APP_NAME}:latest
                """
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Monitoring application health...'
                sh 'curl -f http://localhost:3000/health || echo "Health check failed"'
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
