const express = require("express");

const app = express();

app.get("/api", (req,res) => {
    res.send({"What": "Howdy there"})
})

app.listen(5000, () => {
    console.log("Server running!")
})