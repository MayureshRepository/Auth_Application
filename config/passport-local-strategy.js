const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
//Here, saltRounds is set to 10, which means that bcrypt will perform 2^10 (1024) iterations of the key derivation function.
// You can adjust this value based on your security requirements. A higher 
//value will increase the security of your passwords but will also make the hashing process slower.
const saltRounds = 10;

const User = require('../model/user');

passport.use(new LocalStrategy(
  {
      usernameField: 'email',
     
  },
  async function (email, password, done) {
      try {
          // find a user and establish the identity
          const user = await User.findOne({ email: email });


        if (!user) {
            console.log('Invalid Username');
            return done(null, false);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid Password');
            return done(null, false);
        }

          return done(null, user);
      } catch (err) {
       // req.flash('error',err)
           console.log('Error in finding user --> Passport');
          return done(err);
      }
  }
));


//Serialize the user into the cookie 

passport.serializeUser(function(user, done){
     done(null,user.id);

})




passport.deserializeUser(async function(id, done) {
  try {
      const user = await User.findById(id);
      if (!user) {
          console.log('User not found');
          return done(null, false);
      }
      return done(null, user);
  } catch (err) {
      console.log('There is an error:', err);
      return done(err);
  }
});

//Checjk if the user is Authenticated
passport.checkAuthentication=function(req,res,next){
    //If the user is sign in pass on the request to next function(controller's Action)
    if(req.isAuthenticated()){
        return next();
    }
    //If user is not signed in then redirect to singin Page
    return res.redirect('/signin');
}

//Why Locals is used?

//1.locals is a property of the res (response) object in Express. The res.locals object is an area that you can use to store variables 
//that are local to the request-response cycle.These variables are available to the views rendered during that cycle.

//2.So, whenever you call passport.setAuthenticatedUser, it checks if the user is authenticated and makes 
//the user information available to the views through res.locals.user. 
//This is commonly used in middleware to make certain data available globally in your views.

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    next();
}


module.exports = passport;