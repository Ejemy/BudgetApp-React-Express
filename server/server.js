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

var categorySchema = new mongoose.Schema({_id: Number, name: String, amount: Number, spent: Number});
var transactionSchema = new mongoose.Schema({_id: Number, tname: String, date: Date, category: String, expense: Number, income: Number})
let Category = db.model("Category", categorySchema);
let Transaction = db.model("Transaction", transactionSchema)

app.get("/load", async (req, res) => {
  try {
    const data = await Category.find({})
    const transD = await Transaction.find({})
    const combinedData = {category: data, transaction: transD}
    if (data && data.length > 0) {
      res.json(combinedData);
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

  try{
    if(typeof req.body[0] != "number"){
      console.log("error400", req.body[0], typeof req.body[0])
      return res.status(400).json({error: "Invalid request data."})
    }

    if (req.body[5] != undefined){
      console.log("updating transactions..."); 
      console.log("/update if it's a transaction: ", req.body)
      const update = await Transaction.findOneAndUpdate({_id: req.body[0]}, 
        {tname: req.body[1], date: req.body[2], category: req.body[3], expense: req.body[4], income: req.body[5]}, {new:true, upsert: true})
      return res.status(200).json({data: update})
    }
    else {
      console.log("updating categories...", req.body);
      const update =  await Category.findOneAndUpdate({_id: req.body[0]}, 
        {name: req.body[1], amount: req.body[2], spent: req.body[3]}, {new:true, upsert: true})
      return res.status(200).json({data: update})

    }  
      
      
  } catch(err){
    console.log(err)
    res.status(500).json({error: "Internal server error."})
  }
 
});

app.post("/delete", async (req,res)=> {
  try {
    const deleting = await Category.findOneAndDelete({_id: req.body[0][0]})
    return res.status(200).json({data: deleting})
  } catch(err){
    console.log(err)
    res.status(500).json({error: "Something went wrong with deleting..."})
  }
})

app.listen(5000, () => {
    console.log("Server running!")
});