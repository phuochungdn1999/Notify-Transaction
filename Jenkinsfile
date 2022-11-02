pipeline {
  agent any
  options {
    skipStagesAfterUnstable()
  }

  stages('cicd'){

    stage('build') {
      steps {
        echo 'BUILDING ............'
        echo "${GIT_BRANCH}"
      }
    }

    stage('deploy'){
      steps {
        script {
          switch(GIT_BRANCH) {
            case "origin/deploy_dev":
              echo "DEPLOYING ${GIT_BRANCH}..."
              sshagent(['ssh-rn-dev']) {sh "${SSH_DEV} ./script/deploy-backend.sh deploy_dev"}
              break;
            case "origin/deploy_staging":
              echo "DEPLOYING ${GIT_BRANCH}..."
              sshagent(['ssh-rn-stg']) {sh "${SSH_STG} ./script/deploy-backend.sh deploy_staging"}
              break;
            case "origin/deploy_uat":
              echo "DEPLOYING ${GIT_BRANCH}..."
              sshagent(['ssh-rn-uat']) {sh "${SSH_UAT} ./script/deploy-backend.sh deploy_uat"}
              break;
            default:
              echo "No branch deploying ${GIT_BRANCH}"
          }
        }
      }
    }
  }
}
