const express = require('express');

const router = express.Router();
const passport = require('passport');


const home_Controller = require('../controller/home_controller');

//Home page (Login)
router.get('/' , home_Controller.home);
//SingUp page
router.get('/signin' , home_Controller.signIn);
//SingUp page
router.get('/Sign_Up' , home_Controller.signUp);
//SignOut
router.get('/signout' ,home_Controller.signout);

 router.post('/create-session' ,passport.authenticate('local',
    {failureRedirect:'/signin'},
  ),home_Controller.createSession);



//To get SignUp data
router.post('/create-User' , home_Controller.create);

router.get('/profile' ,passport.checkAuthentication, home_Controller.profile);

//Google data

router.get('/auth/google' ,passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signin'}),home_Controller.createSession);

router.get('/getpasswordChange' ,passport.checkAuthentication, home_Controller.resetPasswordPage);

//Reset Password
router.post('/reset-password' , passport.checkAuthentication , home_Controller.resetPassword);



//Exporting this in main index.js file
module.exports = router;

