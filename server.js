"use strict";

import express from "express";
// import faker from "faker"; //IMPORTANT PROBABLY: note "npm i faker" needed to be run to use this, probably will have to mention in the docs/setup.md file; TODO
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

import pgPromise from 'pg-promise'; 
//TODO maybe should move into database.js
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
import ConnectPgSimple from 'connect-pg-simple';
const pgSession = ConnectPgSimple(expressSession);
// TODO might have to change that to add a store that scales better, maybe connect-pg-simple since that'll integrate with our db
import passport from 'passport';               // handles authentication
import {Strategy as LocalStrategy} from 'passport-local'; // username/password strategy
/// NEW
import minicrypt from './miniCrypt.js'; //NOT SURE if we're supposed to be doing encryption stuff in this but putting it in anyway
const mc = new minicrypt();

// Session configuration

const session = {
    // store: new pgSession({
    //     createTableIfMissing : true,
    //     conString : process.env.DATABASE_URL,
    //     // ssl: {
    //     //   rejectUnauthorized: false
    //     // }
    //     // pool : null
    //     // conObject: {
    //     //     connectionString: process.env.DATABASE_URL,
    //     //     // ssl: true,
    //     // },
    // }),
    //TODO maybe leave the store as is for now since it does *work* it's just not gonna scale up?
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    //TODO maybe need to set up this^? I don't totally understand what I need to put exactly (added a config var in heroku for it, not sure if anything else is needed)
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
        // const userExists = await db.any({text:"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", values:[email]});
        // if (!userExists[0]) {
        //     return false;
        // } else {
        //     return true;
        // }
        //might change back to that^? seems to work fine as is
        const userData = await db.any({text:"SELECT email FROM users WHERE email = $1 LIMIT 1", values:[email]});
        if (userData.length <= 0) {
            return false;
        }
        return true
    }
    catch(err) {
        console.error(err);
        return false; //not sure what's best to do here really; might not end up using this function anyway tbh
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
        return false; //not sure best approach for what to return here
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
            //TODO maybe should move into separate database.js? I'm finding this way to be easier though
            //I think just gonna leave this way for now; have a database.js with functions for Find, Update etc. but the operations
            //I'm doing are too specific for me to use that without having to write like a separate function/if statement for every
            //time it's called at which point it'd just make the code harder to follow
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
        //(to be honest I'm not totally sure if this checks right but going off of what the code shown in class has had it seems good?)
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
            //Considered adding a check for if the user has open tasks but not going to right now since I'm not sure how we're tracking that?
            // try {
            //     const activeTasks = await db.any({text:"SELECT email FROM tasks WHERE email = $1 LIMIT 1", values:[email]});
            //     if (activeTasks.length <= 0) {
            //         return false;
            //     }
            //     return true
            // } catch {
            //     res.status(409);
            //     res.send('Failed to delete account as it still has active tasks.');
            // }
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
        // output.tip_link = details.tip_link || "";
        //^was in dummy function but not in table since we didn't specify it in our API; so will just be blank currently. Can add to table later if needed
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
//for deleting request quarantiining.html
app.delete("/task/:id", 
    // checkLoggedIn, //Authentication here is needed
    async (req, res) => {
        const id = req.params["id"];
        // const email = req.body["user_email"];
        //check if proper user
        // if (email === req.user) {
        // try {
        //     const userData = await db.one({text:"SELECT email FROM tasks WHERE task_id = $1 LIMIT 1", values:[id]});
        //     if (userData.length > 0) {
        try {
            await db.query ("DELETE FROM tasks WHERE id = $1", [id]);
            await db.query ("DELETE FROM comments WHERE task_id = $1", [id]); //remove associated comments
            // console.log(`Deleted task from user ${email}`);
            res.status(204);
            res.send('Deleted task.');
        } catch(err) {
            console.error(err);
            res.status(500);
            res.send('Failed to delete task.');
        }
        //     } else {

        //     }
        // } catch(err) {
        //     console.error(err);
        //     res.status(500);
        //     res.send('Failed to find task.');
        // }
    });


//for submiting request requestProgress.html
app.put("/task/:id", 
    async (req, res) => {
        
        const id = req.params["id"];
        try {
            
            await db.query ("UPDATE tasks SET req_status = $1 WHERE id = $2", ["completed", id]);
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
    //    await db.none ({text:"INSERT INTO tasks(user_name, salt, hash) VALUES ($1, $2, $3)", values:[user_name, salt, hash]});
    //    await db.none ({text:"INSERT INTO tasks(contents, salt, hash) VALUES ($1, $2, $3)", values:[contents, salt, hash]});
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