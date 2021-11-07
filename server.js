"use strict";

import express from "express";
import faker from "faker"; //IMPORTANT PROBABLY: note "npm i faker" needed to be run to use this, probably will have to mention in the docs/setup.md file; TODO
import {Database} from "./database.js";
const app = express();
app.use('/', express.static('public')); //TODO maybe should be "./public"? not sure if it matters in this case
// app.use('/', express.static('public/images')); //TODO not sure this needed or not if above included
app.use(express.urlencoded({ extended: false })); //TODO do we need this? They seem to recommend to just use JSON anyway so this seems redundant
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


//Command used to test:
//curl -d '{ "user_email" : "Test", "password" : "ABCDEF" }' -H "Content-Type: application/json" http://localhost:3000/user/new/
app.post("/user/new", (req, res) => {
    const email = req.body["user_email"];
    const password = req.body["password"];
    //TODO: processes and sets data in some database
    //Not sure what needs to be done in regards to that for this milestone since it's all dummy anyway... maybe nothing?
    const hash = faker.internet.password(); //in practice would take password and apply some actual hashing algorithm to get this
    database.insert("user", {"email":email,"pass_hash":hash});
    console.log(`Created account: ${email}`);
    res.status(201);
    res.send('Created account.');
});

//Not totally sure if this is setup right, but works with the command:
//curl -H 'user_email : Test password : ABCDEF Content-Type: application/json' http://localhost:3000/user/login/
app.post("/user/login", (req, res) => {
    if ("user_email" in req.body) {
        const email = req.body["user_email"];
        const password = req.body["password"];
        database.find("user", {"email":email});
        //TODO tests if hash of passwords match, makes session token. On success:
        const session_token = faker.internet.password();

        res.status(200);
        res.send(JSON.stringify({
            "login_status": "valid",
            "session_token": session_token
        }));
        // res.send(`login_status = "valid", session_token = ${session_token}`);
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
app.get("*", (req, res) => {
    res.status(404);
    res.send("Request invalid.");
});

app.listen(3000, err => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});