
const express = require('express');
const cookieParser = require('cookie-parser');

const path = require('path');
//It should be above express app fired 
const db = require('./config/mongoose');
const newProject = require('./model/user');

const app = express();

const port =8000;
//Used for Session Cookie
const session =require('express-session');


const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const googleStrategy = require('./config/passport-google-oauth2-strategy');

const expressLayouts = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');



app.use(expressLayouts);

app.set('view engine' ,'ejs');
app.set('views' , './views');


//to extract the sty;es and scripts from subpage into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts', true);



//Mongo store is used to store session cookie in db
app.use(session({
    name:'Auth',
    //TODO chnge it before deployment
    secret:'Mayu',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/AuthApp',
        autoRemove: 'interval',
        autoRemoveInterval: 10 // In minutes. Default
      })
}));

// URI encoded (To read the post requests)
app.use(express.urlencoded({ extended: true }));


// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);




app.use(cookieParser());


//Adding Assets files and style

app.use(express.static('./assets'));



//Adding Routes

app.use('/',require('./router/index'));


app.listen(port,function(err){
    if(err){
        console.log("There is an error");
        return;
    }

    console.log(`Server is Up and Running oN Port ${port}`);

})



