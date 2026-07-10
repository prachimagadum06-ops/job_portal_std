pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/prachimagadum06-ops/job_portal_std.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t prachimagadum06/job-portal:v1 .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '3a273aaa-28c9-401c-8027-f7296f95630a',   // Your Jenkins Credential ID
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat 'docker push %DOCKER_USER%/job-portal:v1'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                bat '''
                docker rm -f job-portal
                exit /b 0
                '''

                bat 'docker run -d --name job-portal -p 8080:80 prachimagadum06/job-portal:v1'
            }
        }
    }
}