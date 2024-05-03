pipeline {
    agent { 
        node {
            label 'alpine-docker-agent'
        }
    }
    
    // We set this variable because Docker cannot bind mount the source files from the host to the container, so we just create a normal volume with the source directory.
    environment {
        BIND_SOURCE_VOLUME = '/usr/src/app'
    }
    
    stages {
        stage('Checkout SCM') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/development']], // Specify the branch you want to build
                    userRemoteConfigs: [[url: 'https://github.com/jpafrota/monitoria-backend-tcc.git', credentialsId: 'github-creds']],
                    extensions: [[$class: 'CleanCheckout']]
                ])
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                // sh '''
                //     npm i
                //     npm run test:cov
                // '''
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                sh '''
                    cp -r /home/jenkins/monitoria-static-files/. .
                    make build up-silent
                '''
            }
        }
        stage('Ensure API is up') {
            steps {
                echo 'Checking if API is up...'
                script {
                    // Wait until the log contains "app started successfully"
                    def appStarted = false
                    timeout(2) { // Timeout after 2 minutes
                        waitUntil {
                            sleep(5) // Poll every 5 seconds
                            appStarted = sh(script: "make logs | grep 'Nest application successfully started'", returnStatus: true) == 0
                            return appStarted
                        }
                    }
                }
            }
        }
        stage('Populate DB') {
            steps {
                echo 'Populating DB..'
                sh '''
                    make db-start
                    make db-migrate-deploy
                    make db-seed
                    make db-populate
                '''
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
            }
        }
    }
    post {
        always {
            sh 'make down'
        }
    }
}