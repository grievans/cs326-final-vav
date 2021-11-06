"use strict";

import express from "express";
import faker from "faker"; //IMPORTANT PROBABLY: note "npm i faker" needed to be run to use this, probably will have to mention in the docs/setup.md file; TODO
const app = express();

app.use(express.json()); // lets you handle JSON input

app.get("/", (req, res) => {
    // console.log(req.headers);
    // console.log(req.url);
    // console.log(req.ip);
    // console.log(req.method);
    // console.log(req.protocol);
    // console.log(req.path);
    // console.log(req.query);
    // console.log(req.subdomains);
    // console.log(req.params);
    // res.status(404).end();
    res.send("Test");
});


//Command used to test:
//curl -d '{ "user_email" : "Test", "password" : "ABCDEF" }' -H "Content-Type: application/json" http://localhost:3000/user/new/
app.post("/user/new", (req, res) => {
    const email = req.body["user_email"];
    const password = req.body["password"];
    //TODO: processes and sets data in some database
    //Not sure what needs to be done in regards to that for this milestone since it's all dummy anyway... maybe nothing?
    console.log(`Created account: ${email}`);
    res.status(201);
    res.send('Created account.');
});

//Not totally sure if this is setup right, but works with the command:
//curl -H 'user_email : Test password : ABCDEF Content-Type: application/json' http://localhost:3000/user/login/
app.get("/user/login", (req, res) => {
    const email = req.params["user_email"];
    const password = req.params["password"];
    //TODO processes account info and gets relevant data, makes session token. On success:
    const session_token = faker.internet.password();
    res.status(200);
    res.send(JSON.stringify({
        "login_status": "valid",
        "session_token": session_token
    }));
    // res.send(`login_status = "valid", session_token = ${session_token}`);
});

//TODO not sure if needed?
app.get("*", (req, res) => {
    res.status(404)
    res.send("Request invalid.");
});

app.listen(3000, err => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});