'use strict';

const nconf = require('nconf');
import { configRsa } from './rsa.config';

const loadConfig: Function = () => {
  return new Promise((resolve, reject) => {
    try {
      // console.log(nconfi);
      nconf.env({ lowerCase: true }); // préséance
      nconf.use('file', { file: '/app/src/configuration/config.json' });
      nconf.load(() => {
        configRsa();
        nconf.use('memory');
        resolve('Configuration chargée');
      });
    } catch (error) {
      reject(error);
    }
  });
};

export { loadConfig };
