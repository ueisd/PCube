const passport = require('passport');
const { User } = require('../models/user.model');
const { Role } = require('../models/role.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var nconf = require('nconf');

const { app } = require('../index');

app.use(passport.initialize());

createUserFromProfile = async (email, profile) =>{
  let firstName = (profile.name.givenName) 
                ? profile.name.givenName: "Anonymous";
  let lastName = (profile.name.familyName) ? profile.name.familyName : "";

  let roles = await Role.findAll({raw : true});
  let memberRole = roles.find(r => r.name == 'membre');
  // @Todo écrire une requête avec where name='membre'
  
  return User.create({ 
    email:      email,
    firstName:  firstName,
    lastName:   lastName,
    password:   "",
    RoleId:     memberRole.id
  });
}

passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: nconf.get('oauth2_google_id'),
        clientSecret: nconf.get('oauth2_google_secret'),
        callbackURL: nconf.get('api_address') + '/api/auth/google/cb',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let verifiedEmails = profile.emails
            .filter(e => e.verified)
            .map(e => e.value);
          if(verifiedEmails.length <=0) done("no verified emails");
          else {
            let users = await User.findUserByEmail(verifiedEmails);
            let user = (users.length > 0) ? users[0] : null;
            if(user) done(null, user);
            else {
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