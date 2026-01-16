pipeline {
    agent any

    environment {
        COMPOSE_PROJECT = 'Node-MongoDb-Example'
        DB_HOST = credentials('DB_HOST_CRED')
        PORT = 8081
        DB_NAME = credentials('DB_NAME_APP')
    }

    stages {
        stage("Set environment variables") {
            steps {
                script {
                   def date = new Date()
                   def data = "DB_HOST='${DB_HOST}'\nPORT='${PORT}'\nDB_NAME='${DB_NAME}'\nSERVICE_TAG=${BUILD_ID}"
                   writeFile(file: '.env', text: data)
                   
               }
            }
        }

        stage('Prepare Platform') {
            steps {
                sh 'docker --version'
                sh 'docker compose version || true'
                sh 'docker compose down -v || true'
            }
        }

        stage('Build Platform Images TEST') {
            steps {
                sh 'docker build --target builder -t platform-node-test:${BUILD_ID} .'
                
            }
        }

        stage('Runtime Platform Up') {
            steps {
				
				
				sh 'docker compose up -d'
				sh 'echo "Checking containers..."'
				sh 'docker compose ps'
				
            }
        }
		
		stage('Smoke Platform Test') {
            steps {
                retry(5){
                    sh 'echo "Testing ingress path..."'
                    sh 'curl --connect-timeout 5 --retry 5 --max-time 10 --retry-delay 0 --retry-max-time 40 http://localhost:8091/health'
                    sh 'echo "Testing ingress path /..."'
                    sh 'curl -I http://localhost:8091'
                }
            }
        }

    
	
		stage('Build Production') {
			steps {
					sh 'docker build -t node-mongo-pd:v${BUILD_ID} .'
					sh 'docker tag node-mongo-pd:v${BUILD_ID} node-mongo-pd'
			}
		}
		
	}		
	

    post {
        always {
            sh 'docker compose down -v || true'
            sh 'docker rmi platform-node-test:${BUILD_ID}'
            
        }
    }
}
