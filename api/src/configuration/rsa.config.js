const fs = require('fs');
var nconf = require('nconf');

exports.configRsa = () => {
    let nconfKeyPrivate;
    try {
        nconfKeyPrivate = fs.readFileSync('./src/rsa/key', 'utf8')
    }catch (err) {
        nconfKeyPrivate = nconf.get('rsa_key_private'); 
    }
    nconf.set('rsaKeyPrivate', nconfKeyPrivate);
    console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
    console.log(nconfKeyPrivate);
    /*let nconfKeyPrivate = nconf.get('rsa_key_private');
    if(!nconfKeyPrivate) {
        nconfKeyPrivate = fs.readFileSync('./src/rsa/key', 'utf8');
        nconf.set('rsaKeyPrivate', nconfKeyPrivate);
    } else {
        nconf.set('rsaKeyPrivate', nconfKeyPrivate);
    }*/

    let rsaPublicKey;
    try {
        rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
    } catch (err) {
        rsaPublicKey = nconf.get('rsa_public_key');
    }
    nconf.set('rsaKeyPublic', rsaPublicKey);
    console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
    console.log(nconfKeyPrivate);
    /*let rsaPublicKey = nconf.get('rsa_public_key');
    if(!rsaPublicKey) {
        rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
        nconf.set('rsaKeyPublic', rsaPublicKey);
    } else {
        nconf.set('rsaKeyPublic', rsaPublicKey);
    }*/
}