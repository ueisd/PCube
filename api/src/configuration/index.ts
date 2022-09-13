'use strict';

import * as fs from 'fs';

import { config } from './config-dev';

let actualConfig: any = {};

const loadConfig: Function = () => {
  return new Promise((resolve, reject) => {
    try {
      actualConfig = {
        ...config,
        jwt_refresh_token_expires: 12345679,
        rsaKeyPublic: readRsaPublic() || process.env.RSA_PUBLIC_KEY,
        rsaKeyPrivate: readRsaPrivate() || process.env.RSA_KEY_PRIVATE,
        database_host: process.env.DATABASE_HOST || 'localhost',
        database_port: process.env.DATABASE_PORT || 3308,
        database_user: process.env.DATABASE_USER || 'root',
        database_password: process.env.DATABASE_PASSWORD || '12345678',
        database_db: process.env.DATABASE_DB || 'pcube',
        api_url_origin: process.env.API_URL_ORIGIN || 'http://localhost',
        api_address: process.env.API_ADDRESS || 'http://localhost',
        oauth2_google_id: process.env.OAUTH2_GOOGLE_ID,
        oauth2_google_secret: process.env.OAUTH2_GOOGLE_SECRET,
      };

      resolve(actualConfig);
    } catch (error) {
      reject(error);
    }
  });
};

// EMAIL_USERNAME=emailbidon@gmail.com
// EMAIL_PASSWORD=passwordbidon

function readRsaPrivate() {
  try {
    const res = fs.readFileSync('./src/rsa/key', 'utf8');
    return res;
  } catch (err) {
    return null;
  }
}

function readRsaPublic() {
  try {
    const res = fs.readFileSync('./src/rsa/key.pub', 'utf8');
    return res;
  } catch (err) {
    return null;
  }
}

export { loadConfig, actualConfig };
