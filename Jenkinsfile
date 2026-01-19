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
                script {
				PrepareCompose()
				ComposeDown()
				}
            }
        }

        stage('Deploy') {
			steps {
				script {
					WithEnvFile([
						DB_HOST: 'mongo_db',
						DB_NAME: 'bezkoder_db',
						PORT: PORT,
						SERVICE_TAG: BUILD_ID
					]) {
						DockerBuild("platform-node-test","v${BUILD_ID}")
						ComposeUp()
						waitForHealthy('node')
						SmokeTest('localhost', PORT.toInteger())
					}
				}
			}
		}


		
		stage('Build Production') {
			steps {
				script{
					DockerBuild('platform-node-prod')
					}
			}
		}
		
	}
	
	

    post {
        always {
            script {
				ComposeDown()
			}
            
        }
    }
}

