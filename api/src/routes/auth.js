const router = require('express').Router();
const { 
  googleAuth, generateOAuth2UserToken, googleAuthCb 
} = require('../controllers/auth/auth.google.controller');
const { 
  signingLocal, refreshToken 
} = require('../controllers/auth/auth.controller');

// auth local
router.post('/signin', signingLocal);

// auth global
router.get('/refresh-token', refreshToken);


// auth google
router.get('/google', googleAuth);
router.get('/google/cb', googleAuthCb, generateOAuth2UserToken);


//@todo mettre en place
/*router.post('/signup', (req, res) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
  });

  newUser.save( (err) => {
    if (err) { res.status(500).json('erreur signup') }  
    res.status(200).json('signup ok !');
  })

});*/
module.exports = router;
