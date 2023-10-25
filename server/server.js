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
var savingsSchema = new mongoose.Schema({_id: String, sname: String, samount: Number, stotal: Number, sss: String})
let Category = db.model("Category", categorySchema);
let Transaction = db.model("Transaction", transactionSchema)
let Savings = db.model("Savings", savingsSchema)

app.get("/load", async (req, res) => {
  try {
    const data = await Category.find({})
    const transD = await Transaction.find({})
    const savingsD = await Savings.find({})
    const combinedData = {category: data, transaction: transD, savings: savingsD}
    return res.json(combinedData);
   
  } catch (err) {
    console.error("ERR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/update", async (req, res) => {
  try{
    if(req.body[0][5] != undefined){
      const updateAll = await Promise.all(
        req.body.map(async (item)=> {
          const update = await Transaction.findOneAndUpdate({_id: item[0]}, 
            {tname: item[1], date: item[2], category: item[3], expense: item[4], income: item[5]}, {new:true, upsert: true})
          return update;
        })
      )
      
      return res.status(200).json({data: updateAll})
  }
    else if(req.body[0][4] === "savings"){
      console.log("updating SAVINGS")
      const updateAll = await Promise.all(
        req.body.map(async (item)=> {
          const update = await Savings.findOneAndUpdate({_id: item[0]},
            {sname: item[1], samount: item[2], stotal: item[3], sss: item[4]}, {new:true, upsert: true})
            return update;
        })
        );
      return res.status(200).json({data: updateAll})
    }
    else if(req.body[0][4] === undefined){
      console.log("UPDATING BUDGET")
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
    } else if(req.body[0][4] === "savings"){
      const reqbodyId = req.body.map((id) => id[0]);
      await Promise.all(
        req.body.map(async (item)=> {
          await Savings.findOneAndUpdate({_id: item[0]}, 
          {sname: item[1], samount: item[2], stotal: item[3], sss: item[4]}, {new:true, upsert: true})
      })
      );
      Savings.find({}).then(async (existingDocs) => {
        const existingDocId = existingDocs.map((item)=> item._id);
        const missingId = existingDocId.filter(
          (id) => !reqbodyId.includes(id)
        )

        const deletion = await Savings.findOneAndDelete({_id: missingId[0]})

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