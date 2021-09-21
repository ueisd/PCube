var nconf = require('nconf');

exports.loadConfig = () => {
    return new Promise((resolve, reject) => {
        try {
            nconf.env({lowerCase: true}); // préséance
            nconf.use('file', { file: '/app/src/configuration/config.json' });
            nconf.load(() => { 
                nconf.use('memory');
                resolve("Configuration chargée");
            });
        }catch (error) {
            reject(error);
        }
    }) 
}