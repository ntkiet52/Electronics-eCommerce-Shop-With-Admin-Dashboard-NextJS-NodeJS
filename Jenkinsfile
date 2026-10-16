pipeline {
  agent any
  options { timeout(time: 30, unit: 'MINUTES'); disableConcurrentBuilds() }
  environment { COMPOSE = 'docker compose -p shop' }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Test (lint)') {
      steps {
        sh '''
          docker run --rm --volumes-from jenkins -u $(id -u):$(id -g) -e HOME=/tmp \
            -w "$WORKSPACE" node:20-alpine sh -c "npm ci && npm run lint"
        '''
      }
    }

    stage('Prepare env') {
      steps {
        withCredentials([file(credentialsId: 'shop-env', variable: 'ENVFILE')]) {
          sh 'cp "$ENVFILE" .env'
        }
      }
    }

    stage('Backup current image') {
      steps {
        sh '''
          docker tag shop-web:latest shop-web:previous || true
          docker tag shop-api:latest shop-api:previous || true
        '''
      }
    }

    stage('Build') { steps { sh '$COMPOSE build' } }

    stage('Deploy') {
      steps {
        script { env.DEPLOY_STARTED = 'true' }
        sh '$COMPOSE up -d'
        sh 'sleep 10; $COMPOSE exec -T web npx prisma db push --skip-generate || true'
      }
    }

    stage('Verify') {
      steps {
        sh '''
          for i in $(seq 1 30); do
            if $COMPOSE exec -T web wget -q -O /dev/null http://localhost:3000/; then
              echo "Web OK"; exit 0
            fi
            sleep 5
          done
          echo "Web khong len"; exit 1
        '''
      }
    }

    stage('Cleanup') {
      steps { sh 'docker image prune -f; docker builder prune -f --filter until=24h' }
    }
  }

  post {
    failure {
      script {
        if (env.DEPLOY_STARTED == 'true') {
          sh '''
            if docker image inspect shop-web:previous >/dev/null 2>&1; then
              docker tag shop-web:previous shop-web:latest
              docker tag shop-api:previous shop-api:latest
              $COMPOSE up -d --no-build
              echo "ROLLBACK xong"
            fi
          '''
        }
        try {
          mail to: 'EMAIL_CUA_BAN', subject: "Build #${env.BUILD_NUMBER} FAIL: ${env.JOB_NAME}",
               body: "Build loi, xem: ${env.BUILD_URL}"
        } catch (e) { echo 'Chua cau hinh mail (lam o ngay 4)' }
      }
    }
    cleanup { sh 'rm -f .env' }
  }
}