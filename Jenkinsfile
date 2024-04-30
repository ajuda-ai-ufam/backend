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
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                    cp -r /home/jenkins/monitoria-static-files/. .
                    ls -la
                    make build
                    make up
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
            }
        }
    }
}