import * as fs from 'fs';
import * as nconf from 'nconf';

export function configRsa() {
  let nconfKeyPrivate;
  try {
    nconfKeyPrivate = fs.readFileSync('./src/rsa/key', 'utf8');
  } catch (err) {
    nconfKeyPrivate = nconf.get('rsa_key_private');
  }
  nconf.set('rsaKeyPrivate', nconfKeyPrivate);

  let rsaPublicKey;
  try {
    rsaPublicKey = fs.readFileSync('./src/rsa/key.pub', 'utf8');
  } catch (err) {
    rsaPublicKey = nconf.get('rsa_public_key');
  }

  nconf.set('rsaKeyPublic', rsaPublicKey);
}
