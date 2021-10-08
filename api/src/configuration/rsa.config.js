const fs = require('fs');
var nconf = require('nconf');

exports.configRsa = () => {
    let nconfKeyPrivate = nconf.get('rsa_key_private');
    if(!nconfKeyPrivate) {
        nconfKeyPrivate = fs.readFileSync('./src/rsa/key', 'utf8');
        nconf.set('rsaKeyPrivate', nconfKeyPrivate);
    } else {
        nconf.set('rsaKeyPrivate', nconfKeyPrivate);
    }

    let rsaPublicKey = nconf.get('rsa_public_key');
    if(!rsaPublicKey) {
        rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
        nconf.set('rsaKeyPublic', rsaPublicKey);
    } else {
        nconf.set('rsaKeyPublic', rsaPublicKey);
    }
}