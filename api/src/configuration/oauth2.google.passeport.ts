'use strict';

import GatewayRegisterImpl from '../EntitiesFamilies/utils/GatewayRegisterImpl';
import User from '../EntitiesFamilies/User/entities/User';
import { actualConfig } from './index';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

export function getInitializedPassport() {
  return passport.initialize();
}

const createUserFromProfile = async (email, profile) => {
  const userDb = GatewayRegisterImpl.getUserDbGateway();

  let firstName = profile.name.givenName || 'Anonymous';
  let lastName = profile.name.familyName || '';

  let roles = await userDb.findAllRoles();
  let memberRole = roles.find((r) => r.name == 'membre');
  // @Todo écrire une requête avec where name='membre'

  return userDb.createUser(new User({ firstName, lastName, email, password: '', role: memberRole }));
};

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: actualConfig.oauth2_google_id,
      clientSecret: actualConfig.oauth2_google_secret,
      callbackURL: actualConfig.api_address + '/api/auth/google/cb',
    },
    async (accessToken, refreshToken, profile, done) => {
      const userDb = GatewayRegisterImpl.getUserDbGateway();
      try {
        let verifiedEmails = profile.emails.filter((e) => e.verified).map((e) => e.value);
        if (verifiedEmails.length <= 0) {
          done('no verified emails');
        } else {
          const user = await userDb.findUserByEmail(verifiedEmails);

          if (user) {
            done(null, user);
          } else {
            let email = verifiedEmails[0];
            let user = await createUserFromProfile(email, profile);
            done(null, user);
          }
        }
      } catch (e) {
        done(e);
      }
    }
  )
);
