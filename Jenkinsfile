pipeline {
    agent any

    environment {
        COMPOSE_PROJECT='Node-MongoDb-Example'
        DB_HOST = 'mongo_db'
        PORT = '8081'
        DB_NAME = 'bezkoder_db'
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
		
	stage('Wait for platform healthy') {
		steps {
			script {
				retry(10) {
					sh '''
					echo "Waiting for node container to be healthy..."
					docker inspect --format=json State platform-node-test:${BUILD_ID}
					'''
					sleep 3
				}
			}
		}
}
		
		stage('Smoke Platform Test') {
            steps {
                retry(5){
                    sh 'echo "Testing ingress path..."'
                    sh 'curl --connect-timeout 5 --retry 5 --max-time 10 --retry-delay 0 --retry-max-time 40 http://localhost:${PORT}/health'
                    sh 'echo "Testing ingress path /..."'
                    sh 'curl -I http://localhost:${PORT}'
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
