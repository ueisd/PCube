const fs = require('fs');
var nconf = require('nconf');

exports.configRsa = () => {
    let nconfKeyPrivate;
    fs.stat('./src/rsa/key', function(err, stat) {
        if(err == null) {
            console.log('File exists');
        } else if(err.code === 'ENOENT') {
            // file does not exist
            console.log("./src/rsa/key not exist")
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    /*try {
        nconfKeyPrivate = fs.readFileSync('./src/rsa/key', 'utf8')
    }catch (err) {
        nconfKeyPrivate = nconf.get('rsa_key_private'); 
    }*/
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

    fs.stat('./src/rsa/key.pub', function(err, stat) {
        if(err == null) {
            console.log('File exists');
        } else if(err.code === 'ENOENT') {
            // file does not exist
            console.log("./src/rsa/key.pub not exist");
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    let rsaPublicKey;
    /*try {
        rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
    } catch (err) {
        rsaPublicKey = nconf.get('rsa_public_key');
    }*/
    nconf.set('rsaKeyPublic', rsaPublicKey);
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    console.log(rsaPublicKey);
    /*let rsaPublicKey = nconf.get('rsa_public_key');
    if(!rsaPublicKey) {
        rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
        nconf.set('rsaKeyPublic', rsaPublicKey);
    } else {
        nconf.set('rsaKeyPublic', rsaPublicKey);
    }*/
}