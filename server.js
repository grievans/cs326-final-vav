"use strict";

import express from "express";
import faker from "faker"; //IMPORTANT PROBABLY: note "npm i faker" needed to be run to use this, probably will have to mention in the docs/setup.md file; TODO
import {Database} from "./database.js";
const app = express();
app.use('/', express.static('public')); //TODO maybe should be "./public"? not sure if it matters in this case
// app.use('/', express.static('public/images')); //TODO not sure this needed or not if above included
// app.use(express.urlencoded({ extended: false })); //TODO do we need this? They seem to recommend to just use JSON anyway so this seems redundant
app.use(express.json());
const database = new Database();

// const database = new Database(["user", "task"]);

// app.get("/", (req, res) => {
//     // console.log(req.headers);
//     // console.log(req.url);
//     // console.log(req.ip);
//     // console.log(req.method);
//     // console.log(req.protocol);
//     // console.log(req.path);
//     // console.log(req.query);
//     // console.log(req.subdomains);
//     // console.log(req.params);
//     // res.status(404).end();
//     res.send("Test");
// });


import expressSession from 'express-session';  // for managing session state
import passport from 'passport';               // handles authentication
import {Strategy as LocalStrategy} from 'passport-local'; // username/password strategy
// const expressSession = require('express-session');  // for managing session state
// const passport = require('passport');               // handles authentication
// const LocalStrategy = require('passport-local').Strategy; // username/password strategy
/// NEW
import minicrypt from './miniCrypt.js'; //NOT SURE if we're supposed to be doing encryption stuff in this but putting it in anyway
const mc = new minicrypt();
// const minicrypt = require('./miniCrypt');
// const mc = new minicrypt();

// Session configuration

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    //TODO maybe need to set up this^? I don't totally understand what I need to put exactly
    resave : false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    async (username, password, done) => {
	if (!(await findUser(username))) {
	    // no such user
	    await new Promise((r) => setTimeout(r, 2000)); // two second delay
	    return done(null, false, { 'message' : 'Wrong username' });
	}
	if (!(await validatePassword(username, password))) {
	    // invalid password
	    // should disable logins after N messages
	    // delay return to rate-limit brute-force attacks
	    await new Promise((r) => setTimeout(r, 2000)); // two second delay
	    return done(null, false, { 'message' : 'Wrong password' });
	}
	// success!
	// should create a user object here, associated with a unique identifier
	return done(null, username);
    });

// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});


//TODO maybe should move into database.js
import pgPromise from 'pg-promise'; 

const pgp = pgPromise();
const db = pgp({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
async function initializeDatabase() {
    try {
        await db.none({text:"CREATE TABLE IF NOT EXISTS users (email text UNIQUE, display_name text, phone_number text, salt text NOT NULL, hash text NOT NULL)"});
    }
    catch(err) {
        console.error(err);
    }
    try {
        await db.none({text:"CREATE TABLE IF NOT EXISTS tasks (title text, description text, user_name text, location text, email text, phone_number text, id serial)"});
    }
    catch(err) {
        console.error(err);
    }
    try {
        await db.none({text:"CREATE TABLE IF NOT EXISTS comments (task_id integer, user_name text, contents text)"});
    }
    catch(err) {
        console.error(err);
    }
}
initializeDatabase();


//code here modified from provided code for exercise
// Returns true iff the user exists.
async function findUser(email) {
    // async function helper(){
    try {
        // const userExists = await db.any({text:"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", values:[email]});
        // if (!userExists[0]) {
        //     return false;
        // } else {
        //     return true;
        // }
        const userData = await db.any({text:"SELECT email FROM users WHERE email = $1 LIMIT 1", values:[email]});
        // console.log(userData);
        if (userData.length <= 0) {
            return false;
        }
        // console.log("TEST");
        return true
    }
    catch(err) {
        console.error(err);
        return false; //not sure what's best to do here really; might not end up using this function anyway tbh
    }
    // }
    // let result = false;
    // helper().then(x => {result = x;});
    // return result;
}

// Returns true iff the password is the one we have stored.
async function validatePassword(email, pwd) {
    // async function helper(){
    // if (!findUser(email)) {
    //     return false;
    // }
    // CHECK PASSWORD
    try {
        const userData = await db.any({text:"SELECT email, salt, hash FROM users WHERE email = $1 LIMIT 1", values:[email]});
        console.log(userData);
        if (userData.length <= 0) {
            return false;
        }
        const userSalt = userData[0].salt;
        const userHash = userData[0].hash;
        return mc.check(pwd, userSalt, userHash);
    } catch(err) {
        console.error(err);
        return false; //not sure best approach here
    }
    // }
    // let result = false;
    // helper().then(x => {result = x;});
    // return result;
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/index.html');
    }
}



//Command used to test:
//curl -d '{ "user_email" : "Test", "password" : "ABCDEF" }' -H "Content-Type: application/json" http://localhost:3000/user/new/
app.post("/user/new", async (req, res) => {
    const email = req.body["user_email"];
    const password = req.body["password"];

    console.log(findUser(email));
    console.log(await findUser(email));
    if (await findUser(email)) {
        res.status(304);
        res.send("Account already exists.")
    } else {
        //TODO: processes and sets data in some database
        //Not sure what needs to be done in regards to that for this milestone since it's all dummy anyway... maybe nothing?
        // const hash = faker.internet.password(); //in practice would take password and apply some actual hashing algorithm to get this
        const [salt, hash] = mc.hash(password);
	    // users[name] = [salt, hash];
        console.log("TEST");
        try {
            //TODO maybe should move into separate database.js? I'm finding this way easier though
            await db.none({text:"INSERT INTO users(email, salt, hash) VALUES ($1, $2, $3)", values:[email, salt, hash]});
            // database.insert("user", {"email":email,"pass_hash":hash});
            console.log(`Created account: ${email}`);
            res.status(201);
            res.send('Created account.');
        } catch(err)
        {
            console.log("FAIL");
            console.error(err);
            res.status(500);
            res.send('Failed to add account.');
        }
    }
});

//Not totally sure if this is setup right, but works with the command:
//curl -H 'user_email : Test password : ABCDEF Content-Type: application/json' http://localhost:3000/user/login/
app.post("/user/login",
    passport.authenticate("local"), async (req, res) => {
    if ("user_email" in req.body) {
        const email = req.body["user_email"];
        const password = req.body["password"];
        // database.find("user", {"email":email});
        // if (findUser(email)) {
        if (await validatePassword(email)) {
            // }
            //TODO tests if hash of passwords match, makes session token. On success:
            // const session_token = faker.internet.password();
            // database.insert("session", {"token":session_token, "email":email});
            //^this was something I thought might be needed for authentification but I don't think is

            console.log(`New login from: ${email}`);
            res.status(200);
            res.redirect('/welcome.html');
            res.send(JSON.stringify({
                "login_status": "valid",
                // "session_token": session_token
            }));
            // res.send(`login_status = "valid", session_token = ${session_token}`);
        } else {
            res.status(403);
            res.send(JSON.stringify({
                "login_status": "invalid"
            }));
        }
    } else {
        res.status(400);
        res.send(JSON.stringify({
            "login_status": "invalid"
        }));
    }
});

// curl -X PUT -d '{ "session_token" : "Test" }' -H "Content-Type: application/json" http://localhost:3000/user/edit
app.put("/user/edit", (req, res) => {
    const session_token = req.body["session_token"];
    const changes = {};
    changes.user_email = req.body["user_email"];
    changes.display_name = req.body["display_name"];
    changes.phone_number = req.body["phone_number"];
    changes.tip_link = req.body["tip_link"]; //would have the database handle any of these being undefined I think
    const password = req.body["password"];
    changes.hash = faker.internet.password();

    const session_details = database.find("session", {"token":session_token});
    if (session_details !== null) {
        database.findAndUpdate("user", {"email": session_details.email}, changes);
        //^again, maybe should identify with some separate id instead of email? IDK really, probably depends somewhat on how our database is actually set up
        database.findAndUpdate("session", {"token":session_token}, {"email":changes.user_email});
        res.status(204);
        res.send('Updated account details.');
    } else {
        res.status(403);
        res.send('Invalid session.');
    }
    
});

//curl -X DELETE -d '{ "dsession_token" : "Test" }' -H "Content-Type: application/json" http://localhost:3000/user/delete
app.delete("/user/delete", (req, res) => {
    const session_token = req.body["session_token"];
    const session_details = database.find("session", {"token":session_token});
    if (session_details !== null) {
        database.findAndDelete("user", {"email": session_details.email});
        database.findAndDelete("session", {"token":session_token})
        console.log(`Deleted account ${session_details.email}`);
        res.status(204);
        res.send('Deleted account.');
    } else {
        res.status(403);
        res.send('Invalid session.');
    }
    
});

//Test curl:
//curl -H "Content-Type: application/json" http://localhost:3000/user/data?target_email=test@umass.edu
app.get("/user/data", (req, res) => {
    const email = req.query["target_email"];
    const details = database.find("user", {"email": email});
    if (details !== null) {
        let output = {};
        output.email = details.email;
        output.display_name = details.display_name;
        output.phone_number = details.phone_number;
        output.tip_link = details.tip_link;
        res.status(200);
        res.send(JSON.stringify(output));
    } else {
        res.status(404);
        res.send();
    }
});

//for submiting request quarantiining.html
app.post("/task", (req, res) => {
    const requestTitle = req.body["requestTitle"];
    const requestDescription = req.body["requestDescription"];
    const name = req.body["name"]; 
    const req_location = req.body["req_location"];
    const email = req.body["email"];
    const phoneNumber = req.body["phoneNumber"];

    console.log("Post body: ");
    console.log(req.body);
    res.status(201);
    res.send('submitted, you are all set!!!!');
});
//for updating request quarantiining.html
app.put("/task", (req, res) => {
    const requestTitle = req.body["requestTitle"];
    const requestDescription = req.body["requestDescription"];
    const name = req.body["name"]; 
    const req_location = req.body["req_location"];
    const email = req.body["email"];
    const phoneNumber = req.body["phoneNumber"];

    console.log("Updated body: ");
    console.log(req.body);
    res.status(201);
    res.send('Updated, you are all set!!!!');
});
//for geting request quarantiining.html
app.get("/task", (req, res) => {
    const requestTitle = req.query["requestTitle"];
    const requestDescription = req.query["requestDescription"];
    const name = req.query["name"]; 
    const req_location = req.query["req_location"];
    const email = req.query["email"];
    const phoneNumber = req.query["phoneNumber"];

    console.log("Get param: ");
    console.log(req.query);
    res.status(201);
    res.json(req.query);
});
//for deleting request quarantiining.html
app.delete("/task", (req, res) => {
    const requestTitle = req.body["requestTitle"];
    const requestDescription = req.body["requestDescription"];
    const name = req.body["name"]; 
    const req_location = req.body["req_location"];
    const email = req.body["email"];
    const phoneNumber = req.body["phoneNumber"];

    console.log("delete param: ");
    console.log(req.body);
    res.status(201);
    res.send('Deleted, you are all set!!!!');
});


//for submiting request requestProgress.html
app.post("/markProgress", (req, res) => {
    const data = req.body["data"];
    console.log("Post body: ");
    console.log(req.body);
    res.status(201);
    res.send('Marked!! Changing status right now!!');
});

app.get("/markProgress", (req, res) => {
    const data = req.params["data"];
    console.log("Get param: ");
    console.log(req.params);
    res.status(201);
    res.send('Marked!! Changing status right now!!');
    // res.send(data);
});



//TODO not sure if needed?
// app.get("*", (req, res) => {
//     res.status(404);
//     res.send("Request invalid.");
// });

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});