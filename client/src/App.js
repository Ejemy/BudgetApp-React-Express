import "./styles.css";

import { useState, useEffect, useCallback } from "react";

function CategoryAmount({ parentCallback, idval, val, id }) {
  return (
    <input
      className="categorybox"
      placeholder="Budgeted"
      id="categoryamount"
      value={"¥" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      onChange={(event) => parentCallback(event, idval, id)}
    />
  );
}

function CategoryName({ categname, idval, val, id }) {
  return (
    <div  className="category">
      <input type="checkbox" id={idval} value="savings" className="checkbox" />
      <input
        placeholder="Category"
        className="category-name"
        value={val[1]}
        onChange={(event) => categname(event, idval, id)}
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

function Budget({ 
  value, 
  index,
  handleCatName,
  handleInput,
  handleDelete,
  box
 }) {
  return (
    <div className="row-budget">
          
        <div className="categorydiv">
            <CategoryName key={index} idval={index} val={value} id = {value[0]} categname={(eventData)=>{handleCatName(eventData, index, value[0])}} />
        </div>
        <div className="categoryamount" id="inputamount">
            <CategoryAmount
              key={index}
              idval={index}
              val = {value[2]}
              id = {value[0]}
              parentCallback={(event) => handleInput(event, index, value[0])}
            />
        </div>
        <div className="amount-box" id="amountdiv">
            <AmountBox
              key={index}
              idval={index}
              Numvalue={value[2]}
              Spent={value[3]}
            />
        </div>
        <div className="deleteCat">
            <Delete 
              value = {value}
              index = {index}
              key = {index}
              id = {value[0]}
              callback = {(stuff) => {
                handleDelete(stuff, index, value[0])
              }}
              boxv = {box}
            />
        </div>
        </div>
  )
}



function Savings( {data, index, handleDelete, savingsCallback, savingsname, sav} ){
  return (
    <div className="row-savings">
      <input 
        className="savings-name"
        placeholder="Savings Account Name"
        value={data[1]}
        onChange= {(event)=> savingsname(event, index, data[0])}
      />
      <input 
        className="savings-amount" 
        placeholder="Budgeted amount"
        value = {"¥" + data[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        id = "savings"
        onChange={(event)=> savingsCallback(event, index, data[0])}        
      />
      <div className="savings-total">{"¥" + (data[3] + data[2]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
      <Delete 
      value={data}
      index = {index}
      key ={index}
      id = {data[0]}
      savingsDelcallback = {(event)=> handleDelete(event, index, data[0])}
      sav = {sav}
      />
    </div>
    
  )
}


function Row({
  index,
  data,
  boxvalue,
  handleCatOption,
  inputCallback,
  nameCallback,
  handleDate,
  handleDelete
}) {
  return (
    <div className="row-transaction">
      <input 
      placeholder="Date" 
      className="date" 
      type="date" 
      value={data[2].slice(0,10)}    
      onChange = {(eventD)=>{
        handleDate(eventD, index, data[0])
      } } />
      <input
        placeholder="Memo"
        className="trans-name"
        value = {data[1]}
        onChange={(eventData) => nameCallback(eventData, index, data[0])}
      />
      <TransCat
        categories={boxvalue}
        data = {data}
        change={(extra) => handleCatOption(extra, index, data[0])}
      />
      <input
        placeholder="Expenditure"
        className="expend"
        id="out"
        value = {"¥" + data[4].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <input
        placeholder="Income"
        className="income"
        id="in"
        value = {"¥" + data[5].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <Delete 
        value = {data}
        index = {index}
        key = {index}
        id = {data[0]}
        transcallback = {(stuff) => {
          handleDelete(stuff,  index, data[0])
        }}
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

function Delete( {value, index, callback, transcallback, savingsDelcallback, id, boxv, sav} ){
  if(boxv != undefined){
    if(boxv.flat().filter(i=>i===id)){
      return (
      <button className="delete" onClick={(event)=>callback(event, index, id)}>X</button>
    )
    }
  } else if(value[5] != undefined && value[4] != "savings"){
      return (
      <button className="delete" onClick={(event)=>transcallback(event, index, id)}>X</button>
    )
    } else if(sav != undefined){
      if(sav.flat().filter(i=>i===id)){
        return (
          <button className="delete" onClick={(event)=>savingsDelcallback(event,index,id)}>X</button>
        )
      }
    }
     
  
}

export default function App() {
  const date = new Date();

  //boxvlue = [id, category, budgetamount, spent]
  const [boxvalue, setBoxvalue] = useState(Array(1).fill(["abc123", "", 0, 0, date]));
  const [total, setTotal] = useState(0); //budgeted total i think
  //transaction = [id, name, date, category, expense, income]
  const [transaction, setTransaction] = useState(Array(1).fill(["123abc", "","", "", 0, 0]));
  //Backend
  const [firstload, setFirstload] = useState(true)
  const [deleteBool, setDeletebool] = useState([false, []])

  //savings = [id, name, budgetamount, total, datestamp]
  const [savings, setSavings] = useState(Array(1).fill(["1a2b3c", "", 0, 0, "savings", date]));

  useEffect(()=> {
    console.log("load...")
    fetch("/load")
    .then(response => response.json())
    .then(data => {
      console.log("LOAD payload:", data)
      let stuff = boxvalue.slice()
      let transstuff = transaction.slice();
      let sav = savings.slice();
      
      const todaydate = new Date()
      const todayDate = todaydate.getDate();
      const todayMonth = todaydate.getMonth();

      for(let i in data.category){
        const bdate = new Date(data.category[i].bdate);
        const bDate = bdate.getDate();
        const bMonth = bdate.getMonth();
        //UPDATE LATER when serious
        if(todayMonth === bMonth + 1 && todayDate >= 20){
          stuff[i] = [
            data.category[i]._id,
            data.category[i].name,
            data.category[i].amount,
            0,
            todaydate,
          ]
        } else {
          stuff[i] = [
            data.category[i]._id, 
            data.category[i].name, 
            data.category[i].amount, 
            data.category[i].spent,
            data.category[i].bdate
          ];
        }
      }
      for(let x in data.transaction){
        if(!data.transaction[x].date){
          data.transaction[x].date = "0000-0-0";
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
      //if past or is payday, samount should be 0 and stotal should be combined with samount
      for(let s in data.savings){
        const dbdate = new Date(data.savings[s].sdate)
        const dbMonth = dbdate.getMonth();
        //CHANGE to this when serious... todayMonth === dbMonth + 1 && todayDate >= 20
        if(todayMonth === dbMonth + 1 && todayDate >= 20){
          sav[s]=[
            data.savings[s]._id,
            data.savings[s].sname,
            0,
            data.savings[s].stotal + data.savings[s].samount,
            data.savings[s].sss,
            todaydate
          ]
        } else {
          sav[s]=[
            data.savings[s]._id,
            data.savings[s].sname,
            data.savings[s].samount,
            data.savings[s].stotal,
            data.savings[s].sss,
            data.savings[s].sdate
        ]
          
        }
        
      }
      console.log("LOG savings", sav)
      setTransaction(transstuff)
      setSavings(sav)
      setBoxvalue(stuff)
      calculateTotal(sav, stuff)
      setFirstload(false)

    })

  }, [])


  useEffect(()=>{
if(!firstload && !deleteBool[0]){
    fetch("/update", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(boxvalue)})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js category fetch: ", data)
        }
      )
    }
    else if(deleteBool[0]){
      fetch("/delete", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(deleteBool[1])})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js category DELETE fetch: ", data)
        }
      )
      setDeletebool([false, []])
    }
  }, [boxvalue])
  


  useEffect(()=> {
    if(!firstload && !deleteBool[0]){
      console.log("transaction state", transaction)
      fetch("/update", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(transaction)})
        .then(response=> response.json())
        .then(
          data=> {
            console.log("app.js transaction fetch: ", data)
          }
        )
    } else if(deleteBool[0]){
      fetch("/delete", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(deleteBool[1])})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js transaction DELETE fetch: ", data)
        }
      )
      setDeletebool([false, []])
    }
    
  }, [transaction])

  useEffect(()=> {
    if(!firstload && !deleteBool[0]){
      console.log("savings state", savings)
      fetch("/update", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(savings)})
        .then(response=> response.json())
        .then(
          data=> {
            console.log("app.js savings fetch: ", data)
          }
        )
    } else if(deleteBool[0]){
      fetch("/delete", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(deleteBool[1])})
      .then(response=> response.json())
      .then(
        data=> {
           console.log("app.js savings DELETE fetch: ", data)
        }
      )
      setDeletebool([false, []])
    }
    
  }, [savings])
  

 

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

  function calculateTotal(savingss, boxv){
    let total = 0;
    for(let x in boxv){
      total += boxv[x][2]
    }
    for(let z in savingss){
      //add savings to budgeted total
      total += savingss[z][2]    
    
    }
    setTotal(total)
  }


  function handleInput(event, ind, id) {
    const nextBoxVal = boxvalue.slice();
    let val = event.target.value;
    const nextTransaction = transaction.slice();
    const tempSavings = savings.slice();
    //out transactions
    if (event.target.id === "out") {
      console.log("ID", id)
      //if OUT then cross check category names and change boxvalue?
      //This LOOP formats transaction numbers
      for (let index = 0; index < nextTransaction.length; index++) {
        if (nextTransaction[index][0] === id) {
          console.log("OUT transaction: ", nextTransaction[index][0])
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextTransaction[index] = [
            nextTransaction[index][0],
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
        if (nextTransaction[index][0] === id) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextTransaction[index] = [
            nextTransaction[index][0],
            nextTransaction[index][1],
            nextTransaction[index][2],
            nextTransaction[index][3],
            nextTransaction[index][4],
            parseFloat(boxstr)
          ];
        }
      }
    } else if(event.target.id === "categoryamount"){
      //This is for category amount changes
      for (let i = 0; i < nextBoxVal.length; i++) {
        if (nextBoxVal[i][0] === id) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          nextBoxVal[i] = [
            nextBoxVal[i][0],
            nextBoxVal[i][1],
            parseFloat(boxstr),
            nextBoxVal[i][3],
            nextBoxVal[i][4]
          ];
        }
      }
      calculateTotal(tempSavings, nextBoxVal)
    } else if(event.target.id === "savings"){
      //update savings amount
      for(let i = 0; i < tempSavings.length; i++){
        if(tempSavings[i][0] === id){
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;
          tempSavings[i] = [
            tempSavings[i][0],
            tempSavings[i][1],
            parseFloat(boxstr),
            tempSavings[i][3],
            tempSavings[i][4],
            tempSavings[i][5]
          ]
          calculateTotal(tempSavings, nextBoxVal)

        }
      }
    }
// Calculating SPENT in boxvalue
    for (let x = 0; x < nextBoxVal.length; x++) {
      let spent = 0;
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth();
    


      for (let ii = 0; ii < nextTransaction.length; ii++) {
        const ttoday = new Date(nextTransaction[ii][2]);
        const tday = ttoday.getDate();
        const tmonth = ttoday.getMonth();
        const payperiod = (month === tmonth + 1 && day >= 1)

        if (
          nextBoxVal[x][1] === nextTransaction[ii][3] &&
          nextTransaction[ii][4] > 0 && 
          !payperiod
        ) {
          spent += nextTransaction[ii][4];
        } else if (
          nextBoxVal[x][1] === nextTransaction[ii][3] &&
          nextTransaction[ii][5] > 0 &&
          !payperiod
        ) {
          spent -= nextTransaction[ii][5];
        }
      }
      nextBoxVal[x] = [nextBoxVal[x][0], nextBoxVal[x][1], nextBoxVal[x][2], spent, nextBoxVal[x][4]];

    }
    setSavings(tempSavings)
    setBoxvalue(nextBoxVal);
    setTransaction(nextTransaction);
  }

  function handleCatName(event, ind, id) {
    const nextBox = boxvalue.slice();
    for (let i = 0; i < nextBox.length; i++) {
      if (nextBox[i][0] === id) {
        nextBox[i] = [id, event.target.value, nextBox[i][2], nextBox[i][3]];
      }
    }
    setBoxvalue(nextBox);

  }

  function handleCatOption(event, index, id) {
    const tempTransaction = transaction.slice();

    tempTransaction[index] = [
      tempTransaction[index][0],
      tempTransaction[index][1],
      tempTransaction[index][2],
      event.target.value,
      tempTransaction[index][4],
      tempTransaction[index][5]
    ];
    setTransaction(tempTransaction);
  }

  function newRow() {
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random()* 100);
    const ranNum2 = Math.floor(Math.random()* 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)]
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)]
    const newId = ranNum + ranLet + ranNum2 + ranLet2;
    const newArr = [newId, "", "", "", 0, 0];
    setTransaction([...transaction, newArr]);
  }

  function newSavings(){
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random()* 100);
    const ranNum2 = Math.floor(Math.random()* 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)]
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)]
    const newId = ranNum + ranLet + ranNum2 + ranLet2;
    const date = new Date();
    const day = date.getDate();
    console.log(day)
    const newArr = [newId, "", 0, 0, "savings", date]
    setSavings([...savings, newArr])
  }

  function transName(data, index, id) {
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      tempTrans[index][0],
      data.target.value,
      tempTrans[index][2],
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5]
    ];
    setTransaction(tempTrans);
  }

  function handleDate(data, index, id){
    console.log(data.target.value)
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      tempTrans[index][0],
      tempTrans[index][1],
      data.target.value,
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5]
    ];
    setTransaction(tempTrans);
  }

  function handleNewCat(){
    const date = new Date();
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random()* 100);
    const ranNum2 = Math.floor(Math.random()* 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)]
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)]
    const idVal = ranNum + ranLet + ranNum2 + ranLet2;
    setBoxvalue([...boxvalue, [idVal, "", 0, 0, date]])
  }

  function handleDelete(val, index, id){
    const tempBox = boxvalue.slice();
    const tempTrans = transaction.slice();
    const tempSavings = savings.slice();

    for(let t in tempTrans){
      if(tempTrans[t][0] === id){
        console.log("Deleting trans...")

        //Set the spent value minus whatever was deleted
        for(let x in tempBox){
          if(tempBox[x][1] === tempTrans[t][3]){
            const newspent = tempTrans[t][4]
            const newincome = tempTrans[t][5]
            const boxspent = tempBox[x][3]
            const newspentbox = newincome - newspent + boxspent;
            tempBox[x] = [tempBox[x][0], tempBox[x][1], tempBox[x][2], newspentbox, tempBox[x][4]];

          }
        }
        const deleteItem = tempTrans.slice(t, t+1)
        tempTrans.splice(t, 1)
        if(!tempTrans[0]){
          tempTrans[0] = ["123abc", "","", "", 0, 0]
        }

        setDeletebool([true, deleteItem])
        setTransaction(tempTrans)
        
      }
    }
    for(let s in tempSavings){
      if(tempSavings[s][0] === id){
        console.log("deleting savings")
        const deleteItem = tempSavings.slice(s, s+1)
        tempSavings.splice(s, 1);
        const date = new Date();
        const day = date.getDate()
        if(!tempSavings[0]){
          tempSavings[0] = ["kljasdf", "", 0, 0, "savings", date]
        }
        calculateTotal(tempSavings, tempBox)
        setDeletebool([true, deleteItem])
        setSavings(tempSavings)

      }
    }
    for(let i in tempBox){
      if(tempBox[i][0] === id){
        console.log("Deleting cats...")
        const deleteItem = tempBox.slice(i, i+ 1)
        tempBox.splice(i, 1)

        if(!tempBox[0]){
          tempBox[0] = ["asjkldfklasdh", "", 0, 0, date]
        }
        calculateTotal(tempSavings, tempBox)
        setDeletebool([true, deleteItem])
        setBoxvalue(tempBox)

      }
    }
    
    
  }

  function handleSavingsName(val, index, id){
    console.log("handleSavingsName",index)
    const tempSavings = savings.slice();
    tempSavings[index] = [
      tempSavings[index][0],
      val.target.value,
      tempSavings[index][2],
      tempSavings[index][3],
      tempSavings[index][4],
      tempSavings[index][5]
    ] 
    setSavings(tempSavings)
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
      <div className="budget-titles">
          <p>Category</p>
          <p>Budgeted</p>
          <p>Remaining</p>
      </div>  
      <div className="budget">
        {boxvalue.map((value, index) => 
          (
          <Budget 
            value = {value}
            index = {index}
            handleDelete = {handleDelete}
            handleCatName = {(x,y,z)=> handleCatName(x,y,z)}
            handleInput = {(x,y,z)=> handleInput(x,y,z)}
            box = {boxvalue}
          />
          )
        )}
      
      </div>
      
        <div className="newcat">
          <NewBox
            title="New Category"
            handleClick={handleNewCat}
            
          />
        </div>
        
        <div className="budget-titles">
          <p>Savings Name</p>
          <p>Budgeted</p>
          <p>Total</p>
      </div> 
      <div className="savings">
            {savings.map((value, index) => (
              <Savings 
              data = {value}
              index = {index}
              handleDelete = {handleDelete}
              savingsCallback= {(x,y,z)=> handleInput(x,y,z)}
              savingsname = {(x,y,z) => handleSavingsName(x,y,z)}
              sav = {savings}
              />
            ))}
      </div>
      <div className="new-savings">
            <button className ="newSavings" onClick={newSavings}>New Savings</button>
      </div>
      
      <div className="newrow">
        <button className="newbutton" onClick={newRow}>
          New Row
        </button>
      </div>
      <div className="transaction-titles">
          <p>Memo</p>
          <p>Category</p>
          <p>Expense</p>
          <p>Income</p>
      </div>
      <div className="transactions">
        {transaction.map((event, index) => (
          <Row
            index={index}
            data={event}
            boxvalue={boxvalue}
            handleCatOption={handleCatOption}
            inputCallback={(x, y, z) => handleInput(x, y, z)}
            nameCallback={(x, y, z) => transName(x, y, z)}
            handleDate = {(x,y, z)=> handleDate(x,y, z)}
            handleDelete = {handleDelete}
            key={index}
          />
        ))}
      </div>

      
    </div>
  );
}
