"use strict";

import express from "express";
const app = express();
app.use('/', express.static('public'));
app.use(express.json());

import pgPromise from 'pg-promise'; 

//Considered earlier that maybe this should be moved into database.js
//Decided against it though ultimately since then we'd just end up needing a ton of methods that are basically just used once for the various totally different queries to the database
//So it seemed neater just to access it directly
//My (G.E.) initial comments on the subject:
//    maybe should move into separate database.js? I'm finding this way to be easier though
//    I think just gonna leave this way for now; have a database.js with functions for Find, Update etc. but the operations
//    I'm doing are too specific for me to use that without having to write like a separate function/if statement for every
//    time it's called at which point it'd just make the code harder to follow
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
        await db.none({text:"CREATE TABLE IF NOT EXISTS tasks (title text, description text, user_name text, location text, email text, phone_number text, req_status text, id serial UNIQUE)"});
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

import expressSession from 'express-session';  // for managing session state
import passport from 'passport';               // handles authentication
import {Strategy as LocalStrategy} from 'passport-local'; // username/password strategy
import minicrypt from './miniCrypt.js';
const mc = new minicrypt();

// Session configuration

const session = {
    //Leaving the session storing as-is for now, but if wanting to make this scale up (to like thousands of users though; works fine small-scale) should replace it
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    {
        usernameField: 'user_email',
        passwordField: 'password'
      },
    async (username, password, done) => {
        try {
            if (!(await findUser(username))) {
                // no such user
                await new Promise((r) => setTimeout(r, 2000)); // two second delay
                return done(null, false, { 'message' : 'Wrong username' });
            }
        } catch(err) {
            console.error(err);
        }
        try {
            if (!(await validatePassword(username, password))) {
                // invalid password
                // should disable logins after N messages
                // delay return to rate-limit brute-force attacks
                await new Promise((r) => setTimeout(r, 2000)); // two second delay
                return done(null, false, { 'message' : 'Wrong password' });
            }
        } catch(err) {
            console.error(err);
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



//code here modified from provided code for exercise
// Returns true iff the user exists.
async function findUser(email) {
    try {
        const userData = await db.any({text:"SELECT email FROM users WHERE email = $1 LIMIT 1", values:[email]});
        if (userData.length <= 0) {
            return false;
        }
        return true
    }
    catch(err) {
        console.error(err);
        return false; //should really return something else, like just undefined I guess, to clarify it just failed and didn't actually confirm they didn't exist, but doesn't really matter for this.
    }
}

// Returns true iff the password is the one we have stored.
async function validatePassword(email, pwd) {
    // CHECK PASSWORD
    try {
        const userData = await db.any({text:"SELECT email, salt, hash FROM users WHERE email = $1 LIMIT 1", values:[email]});
        if (userData.length <= 0) {
            return false;
        }
        const userSalt = userData[0].salt;
        const userHash = userData[0].hash;
        return mc.check(pwd, userSalt, userHash);
    } catch(err) {
        console.error(err);
        return false; //not sure best approach for what to return here; see comment in findUser
    }
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
    if (email === "" || password === "") {
        res.status(400)
        res.send("Empty parameters.")
    } else if (await findUser(email)) {
        res.status(304);
        res.send("Account already exists.")
    } else {
        const [salt, hash] = mc.hash(password);
        try {
            await db.none({text:"INSERT INTO users(email, salt, hash) VALUES ($1, $2, $3)", values:[email, salt, hash]});
            console.log(`Created account: ${email}`);
            res.status(201);
            res.send('Created account.');
        } catch(err)
        {
            console.error(err);
            res.status(500);
            res.send('Failed to add account.');
        }
    }
});

//Not totally sure if this is setup right, but works with the command:
//curl -H 'user_email : Test password : ABCDEF Content-Type: application/json' http://localhost:3000/user/login/
app.post("/user/login",
    passport.authenticate("local")
    , (req, res) => {
            res.status(200);
            res.send(JSON.stringify({
                "login_status": "valid"
            }));
    }
);

// curl -X PUT -d '{ "session_token" : "Test" }' -H "Content-Type: application/json" http://localhost:3000/user/edit
app.put("/user/edit", 
    checkLoggedIn, //Authentication
    async (req, res) => {
        const email = req.body["user_email"];
        const displayName = req.body["display_name"];
        const phoneNumber = req.body["phone_number"];
        //check if proper user
        if (email === req.user) {
            try {
                //Note for now I'm leaving tip_link out of it since none of our API stuff from last time mentioned it, I can re-add if people want it
                await db.none({text:"UPDATE users SET display_name = $2, phone_number = $3 WHERE email = $1", values:[email, displayName, phoneNumber]});
                console.log(`Updated account: ${email} ${displayName} ${phoneNumber}`);
                res.status(204);
                res.send('Updated account details.');
            } catch(err) {
                console.error(err);
                res.status(500);
                res.send('Failed to add account.');
            }
        } else {
            res.status(403);
            res.send('Invalid session.');
        }
        
    });

//curl -X DELETE -d '{ "dsession_token" : "Test" }' -H "Content-Type: application/json" http://localhost:3000/user/delete
//not sure I should actually make this accessible to user since it'll cause issues presumably if someone were to make a task then delete the account might cause issues? IDK
app.delete("/user/delete", 
    checkLoggedIn, //Authentication
    async (req, res) => {
        const email = req.body["user_email"];
        //check if proper user
        if (email === req.user) {
            //Considered adding a check for if the user has open tasks but not going to right now since the tasks aren't really set up for that
            try {
                await db.none({text:"DELETE FROM users WHERE email = $1", values:[email]});
                console.log(`Deleted account ${email}`);
                res.status(204);
                res.send('Deleted account.');
            } catch(err) {
                console.error(err);
                res.status(500);
                res.send('Failed to delete account.');
            }
        } else {
            res.status(403);
            res.send('Invalid session.');
        }
        
    });

//Test curl:
//curl -H "Content-Type: application/json" http://localhost:3000/user/data?target_email=test@umass.edu
app.get("/user/data", async (req, res) => {
    const email = req.query["target_email"];
    let details = null;
    try {
        const userData = await db.any({text:"SELECT email, display_name, phone_number FROM users WHERE email = $1 LIMIT 1", values:[email]});
        if (userData.length > 0) {
            details = userData[0];
        }
    } catch(err) {
        console.error(err);
        // details = null; //< line not needed but leaving here as reminder that it will still be null
    }
    if (details !== null) {
        let output = {};
        output.email = details.email;
        output.display_name = details.display_name || "";
        output.phone_number = details.phone_number || "";
        res.status(200);
        res.send(JSON.stringify(output));
    } else {
        res.status(404);
        res.send();
    }
});

app.get('/user/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/index.html'); // back to login
});

//for submiting request quarantiining.html
app.post("/task", async (req, res) => {
    const requestTitle = req.body["title"];
    const requestDescription = req.body["description"];
    const name = req.body["user_name"]; 
    const req_location = req.body["location"];
    const email = req.body["email"];
    const phoneNumber = req.body["phone_number"];

    try {
        await db.query ("INSERT INTO tasks(title, description, user_name, location, email, phone_number, req_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
        [requestTitle, requestDescription, name, req_location, email, phoneNumber, "pending"]);
        console.log(`Created task: ${requestTitle}`);
        res.status(201);
        res.send('Created task.');
    }catch(err) {
        console.error(err);
        res.status(500);
        res.send('Failed to add request.');
    }
});

app.put("/task/:id", async (req, res) => {
        const id = req.params["id"];
        const requestTitle = req.body["title"];
        const requestDescription = req.body["description"];
        const name = req.body["user_name"]; 
        const req_location = req.body["location"];
        const email = req.body["email"];
        const phoneNumber = req.body["phone_number"];

        try {
                await db.query (
                    "UPDATE tasks SET email = $1, title = $2, description = $3, name = $4, location = $5, phone_number = $6 WHERE id = $7", 
                [email, requestTitle, requestDescription, name, req_location, phoneNumber, id]);
                res.status(204);
                res.send('Updated related task details.');
            } catch(err) {
                console.error(err);
                res.status(500);
                res.send('Failed to update task details.');
            }
  
        
        
    });
//for geting request quarantiining.html
app.get("/task", async (req, res) => {
    
    try {
        const results = await db.query("SELECT * FROM tasks");// db named task
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send('Failed to get list of tasks.');
    }
});
//for deleting request quarantining.html
app.delete("/task/:id", 
    // checkLoggedIn, //Authentication here is needed
    async (req, res) => {
        const id = req.params["id"];
        try {
            await db.query ("DELETE FROM tasks WHERE id = $1", [id]);
            await db.query ("DELETE FROM comments WHERE task_id = $1", [id]); //remove associated comments
            console.log(`Deleted task ${id}`);
            res.status(204);
            res.send('Deleted task.');
        } catch(err) {
            console.error(err);
            res.status(500);
            res.send('Failed to delete task.');
        }
    });


//for submiting request requestProgress.html
app.put("/markProgress/:id", 
    async (req, res) => {
        const id = req.params["id"];
        try {
            await db.query ("UPDATE tasks SET req_status = $1 WHERE id = $2", ["in progress", id]);
                res.status(204);
                res.send('submitted, you are all set!!!!');
        }catch(err) {
            console.error(err);
            res.status(500);
            res.send('Failed to update request status.');
        }
});
// create comment
app.post("/comment", 
    checkLoggedIn,
    async (req, res) => {
    const task_id = req.body["task_id"];
    const user_name = req.body["user_name"];
    const contents = req.body["contents"]; 
    try {
       await db.none ({text:"INSERT INTO comments(task_id, user_name, contents) VALUES ($1, $2, $3)", values:[task_id, user_name, contents]});
       console.log(`Created comment for ${task_id}`);
       res.status(201);
       res.send('Created comment.');
    }
    catch(err) {
       console.error(err);
       res.status(500);
       res.send('Failed to add comment.');
    }
});
// get comment
app.get("/comment", async (req, res) => {
    const task_id = req.body["task_id"];
    try {
        const comms = await db.query("SELECT * FROM comments WHERE task_id = $1", [task_id]);
        res.status(200);
        res.json(comms.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.send('Failed to load comments.');
    }
});


const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});