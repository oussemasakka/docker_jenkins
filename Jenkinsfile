pipeline {
    agent any

    stages {
        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building frontend Docker image...'
                dir('frontend') {
                    script {
                        sh 'docker build -t frontend-app .'
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building backend Docker image...'
                dir('backend') {
                    script {
                        sh 'docker build -t backend-app .'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Set up containers...'
            script {
                sh 'docker-compose up'
            }
        }
    }


    post {
        always {
            echo 'Cleaning up containers...'
            script {
                sh 'docker-compose down'
            }
        }
    }
}
