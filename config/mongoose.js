const express = require('express');

const mongoose = require('mongoose');



// mongoose.connect('mongodb://localhost:27017/AuthApp');


// Use the environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


const db= mongoose.connection;


db.on('error',console.error.bind(console,'there is an error'));

db.once('open' ,function(){
    console.log(" Conneccted to IssueTracker DB!!");
});



module.exports = db;