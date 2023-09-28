const express = require("express");
require("dotenv").config();
const {MongoClient} = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


const url = process.env.MONGO_URI;

const db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true})

var categorySchema = new mongoose.Schema({_id: Number, name: String, amount: Number, spent: Number})
let Category = db.model("Category", categorySchema);


//MIBHG NEED TO MAKE DOCUMENTS IN THE boxvalue BEFORE IT CAN UPDATE.



app.get("/load", async (req, res) => {
  try {
    const data = await Category.find({}).exec();
    if (data && data.length > 0) {
      console.log(data);
      res.json(data);
    } else {
      console.log("No data found.");
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    console.error("ERR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/update", async (req, res) => {
  for(let i in req.body){
    Category.findByIdAndUpdate({_id: req.body[i][0]}, {name: req.body[i][1], amount: req.body[i][2], spent: req.body[i][3]}, {new:true})
  } 
  
});

app.listen(5000, () => {
    console.log("Server running!")
});