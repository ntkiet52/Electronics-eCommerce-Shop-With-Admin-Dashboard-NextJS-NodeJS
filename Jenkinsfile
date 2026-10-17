pipeline {
  agent any
  options {
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
    timestamps()
  }
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
        sh '$COMPOSE up -d --wait'
        sh '$COMPOSE exec -T web npx prisma db push --skip-generate'
      }
    }

    stage('Seed') {
      steps {
        sh '''
          for i in $(seq 1 30); do
            if $COMPOSE exec -T api node utills/insertDemoData.js; then
              echo "Seed OK"; exit 0
            fi
            sleep 3
          done
          echo "Seed FAILED"; exit 1
        '''
      }
    }

    stage('Verify') {
      steps {
        sh '''
          for i in $(seq 1 30); do
            if $COMPOSE exec -T web wget -q -O /dev/null http://localhost:3000/ \
               && $COMPOSE exec -T api wget -q -O - http://localhost:3001/api/products | grep -q '"id"'; then
              echo "Web + API OK"; exit 0
            fi
            sleep 5
          done
          echo "Verify FAILED"; exit 1
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
            if docker image inspect shop-web:previous >/dev/null 2>&1 \
               && docker image inspect shop-api:previous >/dev/null 2>&1; then
              docker tag shop-web:previous shop-web:latest
              docker tag shop-api:previous shop-api:latest
              $COMPOSE up -d --no-build
              echo "ROLLBACK xong ve ban truoc"
            else
              echo "Khong co ban truoc de rollback"
            fi
          '''
        }
        try {
            mail to: 'alert@kietlucidtech.opik.net',
               subject: "Build #${env.BUILD_NUMBER} FAIL: ${env.JOB_NAME}",
               body: "Build loi, xem: ${env.BUILD_URL}"
        } catch (e) { echo 'Chua cau hinh mail (lam o ngay 4)' }
      }
    }
    success {
      echo "Build #${env.BUILD_NUMBER} thanh cong"
    }
    cleanup { sh 'rm -f .env' }
  }
}