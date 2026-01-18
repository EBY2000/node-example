@Library('jenkins-shared-lib') _

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
                sh 'docker build -t platform-node-test:${BUILD_ID} .'
                
            }
        }

        stage('Runtime Platform Up') {
            steps {
				
				
				sh 'docker compose up -d'
				sh 'echo "Checking containers..."'
				sh 'docker compose ps'
				sh 'docker compose logs node'
				
            }
        }
		
		stage('Wait for platform healthy') {
			steps {
				script {
					waitForHealthy('node')
				}
			}
		}
		stage('Smoke tests') {
			steps {
				script{
					SmokeTest("localhost",$PORT,10)
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

