@Library('jenkins-shared-lib') _

pipeline {
    agent any

    stages {
        

        stage('Prepare Platform') {
            steps {
                script {
				PrepareCompose()
				
				}
            }
        }

        stage('Deploy') {
			steps {
				script {
					withEnvFile([
						DB_HOST: 'mongo_db',
						DB_NAME: 'bezkoder_db',
						PORT: 8091,
						SERVICE_TAG: BUILD_ID
					]) {
						ComposeDown()
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

