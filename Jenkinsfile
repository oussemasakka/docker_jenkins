pipeline {
    agent any

    environment {
        REMOTE_HOST = '151.80.119.195'
        SSH_USER = 'ubuntu'
        SSH_PASSWORD = credentials('sakka123') // Jenkins credential ID for the SSH password
    }

    stages {
        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building frontend Docker image on remote server...'
                script {
                    sh """
                    sshpass -p '${env.SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.REMOTE_HOST} '
                        cd frontend && docker build -t frontend-app .
                    '
                    """
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building backend Docker image on remote server...'
                script {
                    sh """
                    sshpass -p '${env.SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.REMOTE_HOST} '
                        cd backend && docker build -t backend-app .
                    '
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Set up containers on remote server...'
            script {
                sh """
                sshpass -p '${env.SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.REMOTE_HOST} '
                    docker-compose up -d
                '
                """
            }
        }
    }
}
