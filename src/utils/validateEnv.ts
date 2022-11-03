import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'uat', 'staging', 'production', 'testing'],
    }),
    PROVIDER_URL_1: str(),
    
  });
};

export default validateEnv;
