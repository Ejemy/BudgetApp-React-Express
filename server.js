const express = require("express");
require("dotenv").config({ path: "./.gitignore/.env" });
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path")
const url = process.env.MONGO_URI;


const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.static(path.join(__dirname, 'build')))


const db = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true })

var categorySchema = new mongoose.Schema({ _id: String, name: String, amount: Number, spent: Number, bdate: String, persist: Boolean });
var transactionSchema = new mongoose.Schema({ _id: String, tname: String, date: Date, category: String, expense: Number, income: Number })
var savingsSchema = new mongoose.Schema({ _id: String, sname: String, samount: Number, stotal: Number, sss: String, sdate: String })
var autoTranSchema = new mongoose.Schema({ _id: String, adate: Date, acategory: String, aexpense: Number, aincome: Number, aaa: String })
var settingsSchema = new mongoose.Schema({ payday: Number })
let Category = db.model("Category", categorySchema);
let Transaction = db.model("Transaction", transactionSchema)
let Savings = db.model("Savings", savingsSchema)
let Autotrans = db.model("Autotrans", autoTranSchema)
let Settings = db.model("Settings", settingsSchema)


app.post("/login", (req, res) => {
  console.log(req.body)
  if (req.body.passcode === process.env.PASS_KEY) {
    res.json({ success: true })
  }
})



app.get("/load", async (req, res) => {
  try {
    const data = await Category.find({})
    const transD = await Transaction.find({}) //.sort({date: 1}) I should look into pagination
    const savingsD = await Savings.find({})
    const autoD = await Autotrans.find({})
    const setD = await Settings.find({})

    const combinedData = { category: data, transaction: transD, savings: savingsD, auto: autoD, settings: setD }

    return res.json(combinedData);



  } catch (err) {
    console.error("ERR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/update", async (req, res) => {
  try {
    const reqdata = req.body;
    console.log("POST query to /update!...")
    if (reqdata.payday) {
      console.log("UPDATING settings");
      const doc = await Settings.updateOne({}, { payday: reqdata.payday }, { new: true, upsert: true });
      return res.status(200).json({ data: doc })
    }

    const bulkOperation = [];
    let collection;
    let result;

    req.body.forEach((item) => {
      if (item[5] && item[4] != "savings" && item[5] != "aaa" && typeof item[5] === "number") {
        console.log("updating TRANSACTIONS", item)
        collection = "transaction"
        bulkOperation.push({
          updateOne: {
            filter: { _id: item[0] },
            update: { tname: item[1], date: item[2], category: item[3], expense: item[4], income: item[5] },
            upsert: true
          }
        });
      } else if (item[5] === "aaa") {
        console.log("updating AUTO", req.body)
        collection = "auto"
        bulkOperation.push({
          updateOne: {
            filter: { _id: item[0] },
            update: { adate: item[1], acategory: item[2], aexpense: item[3], aincome: item[4], aaa: item[5] },
            upsert: true
          }
        });
      }
      else if (item[4] === "savings") {
        console.log("updating SAVINGS")
        collection = "saving"
        bulkOperation.push({
          updateOne: {
            filter: { _id: item[0] },
            update: { sname: item[1], samount: item[2], stotal: item[3], sss: item[4], sdate: item[5] },
            upsert: true
          }
        })
      }
      else if (typeof item[5] === "boolean") {
        console.log("UPDATING BUDGET", req.body)
        collection = "budget"
        bulkOperation.push({
          updateOne: {
            filter: { _id: item[0] },
            update: { name: item[1], amount: item[2], spent: item[3], bdate: item[4], persist: item[5] },
            upsert: true
          }
        })
      }
    })
    switch (collection) {
      case "transaction":
        console.log("switch trans")
        result = await Transaction.bulkWrite(bulkOperation);
        break;
      case "auto":
        result = await Autotrans.bulkWrite(bulkOperation);
        break;
      case "saving":
        result = await Savings.bulkWrite(bulkOperation);
        break;
      case "budget":
        result = await Category.bulkWrite(bulkOperation);
        break;
    }
    return res.status(200).json({ data: result });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal server error." })
  }






});


app.post("/delete", async (req, res) => {
  try {

    if (!req.body[0].includes("aaa") && !req.body[0].includes("savings") && typeof req.body[0][5] === "number") {
      const deletion = await Transaction.findOneAndDelete({ _id: req.body[0][0] })
      console.log("Deleting: ", req.body)
      return res.status(200).json({ data: deletion })
    } else if (req.body[0][4] === "savings") {
      const deletion = await Savings.findOneAndDelete({ _id: req.body[0][0] })
      return res.status(200).json({ data: deletion })
    } else if (req.body[0][5] === "aaa") {
      console.log("Deleting AUTO transaction", req.body)
      const deletion = await Autotrans.findOneAndDelete({ _id: req.body[0][0] })
      return res.status(200).json({ data: deletion })
    } else {
      const deletion = await Category.findOneAndDelete({ _id: req.body[0][0] })
      return res.status(200).json({ data: deletion })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong with deleting..." })
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port: ${process.env.PORT} `)
});

