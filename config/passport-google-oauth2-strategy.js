const passport=require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../model/user');


//Will get it from  
//Tell passport to use a new google strategy
passport.use(new googleStrategy({
    clientID:"727152983836-3levmmfjuic6sgt94j3dgjvc7cutk0le.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/auth/google/callback",

},
async function(accessToken,refreshToken,profile,done){
    try{

          // Print profile to console for debugging
          console.log("Google Profile:", profile);

        //Find user
    const user = await User.findOne({ email: profile.emails[0].value }).exec();
  
    if(user){
        return done(null,user);
    }

    
    else{
        //If not found create user and set it
        const users = await User.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            password:crypto.randomBytes(20).toString('hex')
        });

        if(users){
            done(null,users);
        }
    }
    }
    catch(error){
     console.log("There is an error in passport google",error);
    }

}

))


module.exports =passport;