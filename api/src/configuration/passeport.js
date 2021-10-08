const passport = require('passport');
const { User } = require('../models/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { app } = require('../index');

app.use(passport.initialize());

passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: '830137652122-qt007h8omkhsn58ktqrkkgdpg7kd2cbe.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/api/auth/google/cb',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(util.inspect(profile, { compact: true, depth: 5, breakLength: 80 }));
        try {
          let verifiedEmails = profile.emails
            .filter(e => e.verified)
            .map(e => e.value);
          if(verifiedEmails.length <=0) done("no verified emails");
          else {
            let users = await User.findUserByEmail(verifiedEmails);
            let user = (users.length > 0) ? users[0] : null;
            if(user) done(null, user);
            else { // @todo créer l'utilisateur
              done("We should create user but we do not do it for now.");
            }
          }
        } catch (e) {
          done(e);
        }
      }
    )
  );