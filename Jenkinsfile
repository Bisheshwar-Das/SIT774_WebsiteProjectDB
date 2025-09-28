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
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t ${DOCKER_IMAGE} .'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
        }
        success { echo 'Pipeline executed successfully!' }
        failure { echo 'Pipeline failed!' }
    }
}
