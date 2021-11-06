"use strict";

const express = require("express");
const app = express();

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
    res.status(404).end();
});

// app.post("/");

app.listen(3000, err => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});