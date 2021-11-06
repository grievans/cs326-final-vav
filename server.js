"use strict";

const express = require("express");
const app = express();

app.listen(3000, err => {
    if (err) {
        console.log("problem!!", err);
        return;
    }
    console.log("listening to port 3000");
});