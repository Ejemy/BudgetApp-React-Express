import "./styles.css";

import { useState, useEffect, useCallback } from "react";

function CategoryAmount({ parentCallback, idval, val }) {
  return (
    <input
      className="categorybox"
      placeholder="Budgeted"
      id="categoryamount"
      value={"¥" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      onChange={(event) => parentCallback(event, idval)}
    />
  );
}

function CategoryName({ categname, idval, val }) {
  return (
    <div  className="category">
      <input type="checkbox" id={idval} value="savings" className="checkbox" />
      <input
        placeholder="Category"
        className="category-name"
        value={val[1]}
        onChange={(event) => categname(event, idval)}
      />
    </div>
  );
}

function AmountBox({ Numvalue, Spent }) {
  //const [numval, setNumval] = useState(Numvalue);

  /*
  useEffect(() => {
    setNumval(Numvalue);
  }, [Numvalue]);
  */
  return (
    <div className="amount-children" id="amountbox">
      ¥{(Numvalue - Spent).toLocaleString()}
    </div>
  );
}



function NewBox({ handleClick, title, id }) {
  return <button className="newbutton" onClick={handleClick}>{title}</button>;
}

function TransCat({ categories, change, index, data }) {
  
  return (
    <select
      name="dropdown"
      className="options"
      value= {data[3]}
      onChange={(event) => change(event, index)}
    >
      <option value = "1" className="firstoption"></option>
      <option value= "income" className="paycheck">Income</option>
      {categories.map((item, index) => (
        <option key = {index} value={item[1]}>{item[1]}</option>
      ))}
    </select>
  );
}

function Row({
  index,
  data,
  boxvalue,
  handleCatOption,
  inputCallback,
  nameCallback,
  handleDate
}) {
  return (
    <div className="row-transaction">
      <input 
      placeholder="Date" 
      className="date" 
      type="date" 
      value={data[2].slice(0,10)}    
      onChange = {(eventD)=>{
        handleDate(eventD, index)
      } } />
      <input
        placeholder={index}
        className="trans-name"
        value = {data[1]}
        onChange={(eventData) => nameCallback(eventData, index)}
      />
      <TransCat
        categories={boxvalue}
        data = {data}
        change={(extra) => handleCatOption(extra, index)}
      />
      <input
        placeholder="Expenditure"
        className="expend"
        id="out"
        value = {"¥" + data[4].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index)}
      />
      <input
        placeholder="Income"
        className="income"
        id="in"
        value = {"¥" + data[5].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index)}
      />
    </div>
  );
}

function Totals({ tots, transaction }){
  let expense = 0;
  let income = 0;
  for(let i in transaction){
    if(transaction[i][4] > 0){
      expense -= transaction[i][4]
    }
    if(transaction[i][5] > 0){
      income += transaction[i][5]
    }
  }
  const actual = income + expense;
  let actualcolor = "black"
  if(actual < 0){
    actualcolor = "red"
  } else {
    actualcolor = "black"
  }

  return (
    <div className = "totals-container">
      <div className="budgeted">Budgeted: ¥{tots.toLocaleString()}</div>
      <div className="budgeted">Left to budget: ¥{(income-tots).toLocaleString()}</div>
      <div className="actual" style={{color: actualcolor}} >Actual: ¥{actual.toLocaleString()} </div>
    </div>
    
  )
}

function Delete( {value, index, callback} ){
  return (
    <button className="delete" onClick={(event)=> {callback(event, index)}}>X</button>
  )
}

export default function App() {
  //boxvlue = [id, category, budgetamount, spent]
  const [boxvalue, setBoxvalue] = useState(Array(3).fill([0, "", 0, 0]));
  const [total, setTotal] = useState(0);
  //transaction = [id, name, date, category, expense, income]
  const [transaction, setTransaction] = useState(Array(1).fill([0, "","", "", 0, 0]));
  //Backend
 


  useEffect(()=> {
    console.log("load...")
    fetch("/load")
    .then(response => response.json())
    .then(data => {
      let stuff = boxvalue.slice()
      let transstuff = transaction.slice();
      for(let i in data.category){
        stuff[i] = [
          data.category[i]._id, 
          data.category[i].name, 
          data.category[i].amount, 
          data.category[i].spent
        ];
      }
      for(let x in data.transaction){
        if(!data.transaction[x].date){
          data.transaction[x].date = "2000-01-01";
        }
        transstuff[x] = [
          data.transaction[x]._id, 
          data.transaction[x].tname, 
          data.transaction[x].date,
          data.transaction[x].category,
          data.transaction[x].expense,
          data.transaction[x].income,
        ]
      }
      setTransaction(transstuff)
      setBoxvalue(stuff)
      calculateTotal(stuff)
    })
  }, [])

  

  function update(boxstuff){
    console.log("update: ", boxstuff)
    fetch("/update", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(boxstuff)})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js category fetch: ", data)
        }
      )
  }

  function updateTransaction(stuff){
    console.log("updateTransaction", stuff)
    fetch("/update", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(stuff)})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js transaction fetch: ", data)
        }
      )
  }

  function deleteBox(stuff){
    console.log("Deleting...", stuff);
    fetch("/delete", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(stuff)})
      .then(response=> response.json())
      .then(
        data=> {
          console.log("app.js delete fetch: ", data)
        }
      )
  }

//Ensures that the input is only a number
  function modifyNum(arr, filterArr) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].match(/\d/)) {
        filterArr.push(arr[j]);
      }
    }

    const boxvalstr = filterArr.join("");
    return boxvalstr;
  }

  function calculateTotal(value){
    let total = 0;
    for(let x in value){
      total += value[x][2]
    }
    setTotal(total)
  }

  function handleInput(event, id) {
    const nextBoxVal = boxvalue.slice();
    let val = event.target.value;
    const nextTransaction = transaction.slice();

    //out transactions
    if (event.target.id === "out") {
      //if OUT then cross check category names and change boxvalue?
      //This LOOP formats transaction numbers
      for (let index = 0; index < nextTransaction.length; index++) {
        if (id === index) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextTransaction[index] = [
            index,
            nextTransaction[index][1],
            nextTransaction[index][2],
            nextTransaction[index][3],
            parseFloat(boxstr),
            nextTransaction[index][5]
          ];
        }
      }
    } else if (event.target.id === "in") {
      for (let index = 0; index < nextTransaction.length; index++) {
        if (id === index) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextTransaction[index] = [
            index,
            nextTransaction[index][1],
            nextTransaction[index][2],
            nextTransaction[index][3],
            nextTransaction[index][4],
            parseFloat(boxstr)
          ];
        }
      }
    } else {
      for (let i = 0; i < nextBoxVal.length; i++) {
        if (i === id) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextBoxVal[id] = [
            nextBoxVal[id][0],
            nextBoxVal[id][1],
            parseFloat(boxstr),
            nextBoxVal[id][3]
          ];
        }
        
      }
      calculateTotal(nextBoxVal)
    }

    for (let x = 0; x < nextBoxVal.length; x++) {
      let spent = 0;
      for (let ii = 0; ii < nextTransaction.length; ii++) {
        if (
          nextBoxVal[x][1] === nextTransaction[ii][3] &&
          nextTransaction[ii][4] > 0
        ) {
          spent += nextTransaction[ii][4];
        } else if (
          nextBoxVal[x][1] === nextTransaction[ii][3] &&
          nextTransaction[ii][5] > 0
        ) {
          spent -= nextTransaction[ii][5];
        }
      }
      nextBoxVal[x] = [id, nextBoxVal[x][1], nextBoxVal[x][2], spent];

    }
    setBoxvalue(nextBoxVal);
    setTransaction(nextTransaction);
    updateTransaction(nextTransaction[id])
    update(nextBoxVal[id])
  }

  function handleCatName(event, id) {
    // want to save name to database. This isnt working though?

    const nextBox = boxvalue.slice();
    for (let i = 0; i <= nextBox.length; i++) {
      if (i === id) {
        nextBox[i] = [id, event.target.value, nextBox[i][2], nextBox[i][3]];
      }
    }
    setBoxvalue(nextBox);
    update(nextBox[id])

  }

  function handleCatOption(event, index) {
    const tempTransaction = transaction.slice();

    tempTransaction[index] = [
      index,
      tempTransaction[index][1],
      tempTransaction[index][2],
      event.target.value,
      tempTransaction[index][4],
      tempTransaction[index][5]
    ];
    updateTransaction(tempTransaction[index])
    setTransaction(tempTransaction);
  }

  function newRow() {
    const newId = transaction.length;
    const newArr = [newId, "", "", "", 0, 0];
    setTransaction([...transaction, newArr]);
    updateTransaction(newArr)
  }

  function transName(data, index) {
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      index,
      data.target.value,
      tempTrans[index][2],
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5]
    ];
    updateTransaction(tempTrans[index])
    setTransaction(tempTrans);
  }

  function handleDate(data, index){
    console.log(data.target.value)
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      index,
      tempTrans[index][1],
      data.target.value,
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5]
    ];
    updateTransaction(tempTrans[index])
    setTransaction(tempTrans);
  }

  function handleNewCat(){
    setBoxvalue([[boxvalue.length, "", 0, 0], ...boxvalue])
    update([boxvalue.length, "", 0, 0])
  }

  function handleDelete(val, index){
    const tempBox = boxvalue.slice();
    let todelete = []
    for(let i in tempBox){
      if(tempBox[i][0] == index){
        todelete = tempBox.slice(i, i+1)
        tempBox.splice(i, 1)
      }
    }
    setBoxvalue(tempBox)
    deleteBox(todelete)
  }



  return (
    <div className="App">
      <div className="title">
        <h1> Budget thingy </h1>
        <h1 className="dateTitle">
         {
         (()=> {
          const date = new Date();
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          const month = date.getMonth()
          const year = date.getFullYear()

          return months[month] + " " + year
          })()
        }
        </h1>
      </div>
      <div className="total-amount" id="total">
          <Totals 
          tots = {total}
          transaction = {transaction}
          />
          
        </div>

      <div className="budget">
          <p>Category</p>
          <p>Budgeted</p>
          <p>Remaining</p>
        <div className="categorydiv">
          {boxvalue.map((value, index) => (
            <CategoryName key={index} idval={index} val={value} categname={handleCatName} />
          ))}
        </div>
        <div className="categoryamount" id="inputamount">
          {boxvalue.map((value, index) => (
            <CategoryAmount
              key={index}
              idval={index}
              val = {value[2]}
              parentCallback={(x, y) => handleInput(x, y)}
            />
          ))}
        </div>
        <div className="amount-box" id="amountdiv">
          {boxvalue.map((value, index) => (
            <AmountBox
              key={index}
              idval={index}
              Numvalue={value[2]}
              Spent={value[3]}
            />
          ))}
        </div>
        <div className="deleteCat">
          {boxvalue.map((value, index)=> (
            <Delete 
              value = {value}
              index = {index}
              key = {index}
              callback = {(x,y) => handleDelete(x,y)}
            />
          ))}
        </div>
        <div className="newcat">
          <NewBox
            title="New Category"
            handleClick={handleNewCat}
          />
        </div>
        
      </div>
      
      <div className="newrow">
        <button className="newbutton" onClick={newRow}>
          New Row
        </button>
      </div>
      <div className="transactions">
        {transaction.map((event, index) => (
          <Row
            index={index}
            data={event}
            boxvalue={boxvalue}
            handleCatOption={handleCatOption}
            inputCallback={(x, y) => handleInput(x, y)}
            nameCallback={(x, y) => transName(x, y)}
            handleDate = {(x,y)=> handleDate(x,y)}
            key={index}
          />
        ))}
      </div>

      
    </div>
  );
}
