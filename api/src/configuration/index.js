var nconf = require('nconf');

const { configRsa } = require('../configuration/rsa.config');

exports.loadConfig = () => {
    return new Promise((resolve, reject) => {
        try {
            nconf.env({lowerCase: true}); // préséance
            nconf.use('file', { file: '/app/src/configuration/config.json' });
            nconf.load(() => { 
                configRsa();
                nconf.use('memory');
                resolve("Configuration chargée");
            });
        }catch (error) {
            reject(error);
        }
    }) 
}

