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

var categorySchema = new mongoose.Schema({_id: String, name: String, amount: Number, spent: Number});
var transactionSchema = new mongoose.Schema({_id: String, tname: String, date: Date, category: String, expense: Number, income: Number})
let Category = db.model("Category", categorySchema);
let Transaction = db.model("Transaction", transactionSchema)

app.get("/load", async (req, res) => {
  try {
    const data = await Category.find({})
    const transD = await Transaction.find({})
    const combinedData = {category: data, transaction: transD}
    return res.json(combinedData);
   
  } catch (err) {
    console.error("ERR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/update", async (req, res) => {
  try{
    if(req.body[0][5] != undefined){
      console.log("updating transactions..."); 
      console.log("/update if it's a transaction: ", req.body)
      const updateAll = await Promise.all(
        req.body.map(async (item)=> {
          const update = await Transaction.findOneAndUpdate({_id: item[0]}, 
            {tname: item[1], date: item[2], category: item[3], expense: item[4], income: item[5]}, {new:true, upsert: true})
          return update;
        })
      )
      
      return res.status(200).json({data: updateAll})
  }
    else{
      console.log("update POST req.body,", req.body)
      const updateAll= await Promise.all(
        req.body.map(async (item)=> {
          const update =  await Category.findOneAndUpdate({_id: item[0]}, 
          {name: item[1], amount: item[2], spent: item[3]}, {new:true, upsert: true})
          return update;
      })
      );
    return res.status(200).json({data: updateAll})
  }
 } catch(err){
    console.log(err)
    res.status(500).json({error: "Internal server error."})
  }



         
  
      
  });
 

app.post("/delete", async (req,res)=> {
  try {
    console.log("updating /DELETE...", req.body);
    if(req.body[0][5] != undefined){
      const reqbodyId = req.body.map((id) => id[0]);
      Transaction.find({}).then(async (existingDocs) => {
        const existingDocId = existingDocs.map((item)=> item._id);
        const missingId = existingDocId.filter(
          (id) => !reqbodyId.includes(id)
        )

        const deletion = await Transaction.findOneAndDelete({_id: missingId[0]})

        return res.status(200).json({data: deletion})
      })
    } else {
      const reqbodyId = req.body.map((id) => id[0]);
      await Promise.all(
        req.body.map(async (item)=> {
          await Category.findOneAndUpdate({_id: item[0]}, 
          {name: item[1], amount: item[2], spent: item[3]}, {new:true, upsert: true})
      })
      );
      Category.find({}).then(async (existingDocs) => {
        const existingDocId = existingDocs.map((item)=> item._id);
        const missingId = existingDocId.filter(
          (id) => !reqbodyId.includes(id)
        )

        const deletion = await Category.findOneAndDelete({_id: missingId[0]})

        return res.status(200).json({data: deletion})
      })
    }
      
  } catch(err){
    console.log(err)
    res.status(500).json({error: "Something went wrong with deleting..."})
  }
})

app.listen(5000, () => {
    console.log("Server running!")
});