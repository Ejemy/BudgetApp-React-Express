import "./styles.css";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
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
    <div className="category">
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

function AmountBox({ Numvalue, Spent, trans }) {
  //Numval is the budgeted value and spent is spent in that category
  //this is for remaining amount in budget category
  // I need to make it so that all income is kept no matter when it happened.
  let realSpent = 0;
  for(let x in trans){
    if(trans[x][0] === Numvalue[0]){
      console.log(trans[x])
      if(trans[x][4] > 0){
        realSpent += trans[x][4]
      } else if(trans[x][5] > 0){
        realSpent -= trans[x][5]
      }
    }
    console.log(realSpent)
  }

  
  return (
    <div className="amount-children" id="amountbox">
      ¥{(Numvalue[2] - realSpent).toLocaleString()}
    </div>
  );
}

function NewBox({ handleClick, title, id }) {
  return (
    <div className="new-savings">
      <FontAwesomeIcon
        icon={faSquarePlus}
        className="newbutton"
        onClick={handleClick}
      />
      <h4 className="faTitle">Budget</h4>
    </div>
  );
}

function TransCat({ categories, change, index, data }) {
  let theData;
  if (data[5] == "aaa") {
    theData = data[2];
  } else {
    theData = data[3];
  }
  return (
    <select
      name="dropdown"
      className="options"
      value={theData}
      onChange={(event) => change(event, index)}
    >
      <option value="1" className="firstoption"></option>
      <option value="income" className="paycheck">
        Income
      </option>
      {categories.map((item, index) => (
        <option key={index} value={item[1]}>
          {item[1]}
        </option>
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
  box,
  tran
}) {
  return (
    <div className="row-budget">
      <div className="categorydiv">
        <CategoryName
          key={index}
          idval={index}
          val={value}
          id={value[0]}
          categname={(eventData) => {
            handleCatName(eventData, index, value[0]);
          }}
        />
      </div>
      <div className="categoryamount" id="inputamount">
        <CategoryAmount
          key={index}
          idval={index}
          val={value[2]}
          id={value[0]}
          parentCallback={(event) => handleInput(event, index, value[0])}
        />
      </div>
      <div className="amount-box" id="amountdiv">
        <AmountBox
          key={index}
          idval={index}
          Numvalue={value}
          Spent={value[3]}
          trans = {tran}
        />
      </div>
      <div className="deleteCat">
        <Delete
          value={value}
          index={index}
          key={index}
          id={value[0]}
          callback={(stuff) => {
            handleDelete(stuff, index, value[0]);
          }}
          boxv={box}
        />
      </div>
    </div>
  );
}

function Savings({
  data,
  index,
  handleDelete,
  savingsCallback,
  savingsname,
  sav,
}) {
  return (
    <div className="row-savings">
      <input
        className="savings-name"
        placeholder="Savings Account Name"
        value={data[1]}
        onChange={(event) => savingsname(event, index, data[0])}
      />
      <input
        className="savings-amount"
        placeholder="Budgeted amount"
        value={"¥" + data[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        id="savings"
        onChange={(event) => savingsCallback(event, index, data[0])}
      />
      <div className="savings-total">
        {"¥" +
          (data[3] + data[2]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
      <Delete
        value={data}
        index={index}
        key={index}
        id={data[0]}
        savingsDelcallback={(event) => handleDelete(event, index, data[0])}
        sav={sav}
      />
    </div>
  );
}

function Row({
  index,
  data,
  tran,
  boxvalue,
  handleCatOption,
  inputCallback,
  nameCallback,
  handleDate,
  handleDelete,
}) {
  return (
    <div className="row-transaction">
      <input
        placeholder="Date"
        className="date"
        type="date"
        value={data[2].toString().slice(0, 10)}
        onChange={(eventD) => {
          handleDate(eventD, index, data[0]);
        }}
      />
      <input
        placeholder="Memo"
        className="trans-name"
        value={data[1]}
        onChange={(eventData) => nameCallback(eventData, index, data[0])}
      />
      <TransCat
        categories={boxvalue}
        data={data}
        change={(extra) => handleCatOption(extra, index, data[0], "trans")}
      />
      <input
        placeholder="Expenditure"
        className="expend"
        id="out"
        value={"¥" + data[4].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <input
        placeholder="Income"
        className="income"
        id="in"
        value={"¥" + data[5].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <Delete
        value={data}
        index={index}
        key={index}
        id={data[0]}
        tran={tran}
        transcallback={(stuff) => {
          handleDelete(stuff, index, data[0]);
        }}
      />
    </div>
  );
}

function AutoRow({
  data,
  index,
  autotransData,
  boxvalue,
  saveAuto,
  handleCatOption,
  inputCallback,
  handleSave,
  handleDelete,
}) {
  return (
    <div className="auto-transaction">
      <input
        type="date"
        className="date"
        value={data[1]}
        id="autoRowDate"
        onChange={(eventData) => saveAuto(eventData, data, index)}
      />
      <TransCat
        categories={boxvalue}
        data={data}
        change={(extra) => handleCatOption(extra, index, data[0], "auto")}
      />
      <input
        placeholder="Expenditure"
        className="expend"
        id="autoout"
        value={"¥" + data[3].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <input
        placeholder="Income"
        className="income"
        id="autoin"
        value={"¥" + data[4].toLocaleString()}
        onChange={(eventData) => inputCallback(eventData, index, data[0])}
      />
      <button
        onClick={(stuff) => {
          handleSave(stuff, index, data);
        }}
      >
        Save
      </button>
      <Delete
        value={data}
        index={index}
        key={index}
        id={data[0]}
        auto={autotransData}
        autocallback={(stuff) => {
          handleDelete(stuff, index, data[0]);
        }}
      />
    </div>
  );
}

function Totals({ tots, transaction, budget }) {
  //tots is the total of budgeted amount and savings but not remaining!
  let expense = 0;
  let income = 0;
  let totalRemaining = 0;
  let total = 0;
  for (let i in transaction) {
    if (transaction[i][4] > 0) {
      expense -= transaction[i][4];
    }
    if (transaction[i][5] > 0) {
      income += transaction[i][5];
    }
  }
  for (let x in budget) {
    const remaining = budget[x][2] - budget[x][3];
    if (remaining <= budget[x][2] && remaining >= 0) {
      total += budget[x][2]
    } else if(remaining > budget[x][2]) {
      totalRemaining += remaining
    } else if(remaining < 0){
      total += budget[x][2];
      totalRemaining -= remaining;
    }

  }

  const actual = income + expense;
  let actualcolor = "green";
  const calculatedRemaining = income - (totalRemaining + total)
  let remainingcolor = "green";
  if (actual < 0) {
    actualcolor = "red";
  } else {
    actualcolor = "green";
  }
  if(calculatedRemaining <= 0){
    remainingcolor = "red"
  } else if(calculatedRemaining > 0 && calculatedRemaining < 500){
    remainingcolor = "yellow"
  } else {
    remainingcolor = "green"
  }


  return (
    <div className="totals-container">
      <div className="budgeted">Budgeted: ¥{tots.toLocaleString()}</div>
      <div className="budgeted" style={{ color: remainingcolor }}>
        <p>Left to budget:</p> ¥{calculatedRemaining.toLocaleString()}
      </div>
      <div className="actual" style={{ color: actualcolor }}>
        <p>Actual:</p> ¥{actual.toLocaleString()}{" "}
      </div>
    </div>
  );
}

function Delete({
  value,
  index,
  callback,
  transcallback,
  savingsDelcallback,
  id,
  boxv,
  sav,
  auto,
  tran,
  autocallback,
}) {
  if (boxv != undefined) {
    if (boxv.flat().filter((i) => i === id)) {
      return (
        <button
          className="delete"
          onClick={(event) => callback(event, index, id)}
        >
          X
        </button>
      );
    }
  } else if (tran != undefined) {
    if (tran.flat().filter((i) => i === id)) {
      return (
        <button
          className="delete"
          onClick={(event) => transcallback(event, index, id)}
        >
          X
        </button>
      );
    }
  } else if (sav != undefined) {
    if (sav.flat().filter((i) => i === id)) {
      return (
        <button
          className="delete"
          onClick={(event) => savingsDelcallback(event, index, id)}
        >
          X
        </button>
      );
    }
  } else if (auto != undefined) {
    if (auto.flat().filter((i) => i === id)) {
      return (
        <button
          className="delete"
          onClick={(event) => autocallback(event, index, id)}
        >
          X
        </button>
      );
    }
  }
}

export default function App() {
  const date = new Date();

  //boxvlue = [id, category, budgetamount, spent, date]
  const [boxvalue, setBoxvalue] = useState(
    Array(1).fill(["abc123", "", 0, 0, date])
  );

  //budgeted total i think
  const [total, setTotal] = useState(0);

  //transaction = [id, name, date, category, expense, income]
  const [transaction, setTransaction] = useState(
    Array(1).fill(["123abc", "", "", "", 0, 0])
  );

  //Backend
  const [firstload, setFirstload] = useState(true);
  const [deleteBool, setDeletebool] = useState([false, []]);

  //savings = [id, name, budgetamount, total, datestamp]
  const [savings, setSavings] = useState(
    Array(1).fill(["1a2b3c", "", 0, 0, "savings", date])
  );

  //auto transactions = [id, dateday, category, expense, income, "aaa"]
  const [autoTrans, setAutotrans] = useState(
    Array(1).fill(["xyz123", "", "", 0, 0, "aaa"])
  );

  const [toggleAuto, setToggleAuto] = useState(false);
  const [toggleLock, setToggleLock] = useState(true);
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    console.log("load...");
    fetch("/load")
      .then((response) => response.json())
      .then((data) => {
        console.log("LOAD payload:", data);
        let stuff = boxvalue.slice();
        let transstuff = transaction.slice();
        let sav = savings.slice();
        let aut = autoTrans.slice();
        const todaydate = new Date();

        for (let i in data.category) {
          const bdate = new Date(data.category[i].bdate);
          const payday = calculatePayperiod(bdate);
          if (payday) {
            stuff[i] = [
              data.category[i]._id,
              data.category[i].name,
              data.category[i].amount,
              0,
              todaydate,
            ];
          } else {
            stuff[i] = [
              data.category[i]._id,
              data.category[i].name,
              data.category[i].amount,
              data.category[i].spent,
              data.category[i].bdate,
            ];
          }
        }
        for (let x in data.transaction) {
          if (!data.transaction[x].date) {
            data.transaction[x].date = "0000-0-0";
          }
          transstuff[x] = [
            data.transaction[x]._id,
            data.transaction[x].tname,
            data.transaction[x].date,
            data.transaction[x].category,
            data.transaction[x].expense,
            data.transaction[x].income,
          ];
        }
        //if past or is payday, samount should be 0 and stotal should be combined with samount
        for (let s in data.savings) {
          const dbdate = new Date(data.savings[s].sdate);
          //my payday is the 20th
          const payday = calculatePayperiod(dbdate);
          if (payday) {
            sav[s] = [
              data.savings[s]._id,
              data.savings[s].sname,
              0,
              data.savings[s].stotal + data.savings[s].samount,
              data.savings[s].sss,
              todaydate,
            ];
          } else {
            sav[s] = [
              data.savings[s]._id,
              data.savings[s].sname,
              data.savings[s].samount,
              data.savings[s].stotal,
              data.savings[s].sss,
              data.savings[s].sdate,
            ];
          }
        }
        for (let a in data.auto) {
          let checky = true;
          let dd = new Date(data.auto[a].adate);
          dd = dd.toISOString();
          dd = dd.slice(0, 10);
          aut[a] = [
            data.auto[a]._id,
            dd,
            data.auto[a].acategory,
            data.auto[a].aexpense,
            data.auto[a].aincome,
            data.auto[a].aaa,
          ];

          //my payday is the 20th
          for (let i in data.transaction) {
            const payperiod = calculatePayperiod(data.transaction[i].date)
            if (
              data.auto[a].acategory === data.transaction[i].category &&
              payperiod
            ) {
              checky = false;
              break;
            }
            if (data.auto[a].acategory === "") {
              checky = false;
              break;
            }
          }
          if (checky) {
            console.log("START");
            transstuff.push(addNewAuto(data.auto[a]));
          }
        }
        //sorting the state like this breaks the program. Get 503 errors for updates to transactions.
        //transstuff.sort((a,b)=>{return new Date(a[2]) - new Date(b[2])});

        setTransaction(transstuff);
        setSavings(sav);
        setAutotrans(aut);
        setBoxvalue(stuff);
        calculateSpentandSetBV(stuff, transstuff);
        calculateTotal(sav, stuff);
        setFirstload(false);
      });
  }, []);

  useEffect(() => {
    console.log("BOXVALUE WAS SET")
    if (!firstload && !deleteBool[0]) {
      fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boxvalue),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js boxvalue/category fetch: ", data);
        });
    } else if (deleteBool[0]) {
      fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteBool[1]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js category DELETE fetch: ", data);
        });
      setDeletebool([false, []]);
    }

  }, [boxvalue]);

  useEffect(() => {
    if (!firstload && !deleteBool[0]) {
      console.log("transaction state", typeof transaction, transaction);

      fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("app.js transaction fetch: ", data);
        });
    } else if (deleteBool[0]) {
      fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteBool[1]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js transaction DELETE fetch: ", data);
        });

      setDeletebool([false, []]);
    }

  }, [transaction]);

  useEffect(() => {
    if (!firstload && !deleteBool[0]) {
      console.log("savings state", savings);
      fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savings),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js savings fetch: ", data);
        });
    } else if (deleteBool[0]) {
      fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteBool[1]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js savings DELETE fetch: ", data);
        });
      setDeletebool([false, []]);
    }
  }, [savings]);

  useEffect(() => {
    if (!firstload && !deleteBool[0]) {
      console.log("autotrans state", autoTrans);
      fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoTrans),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js autotrans fetch: ", data);
        });
    } else if (deleteBool[0]) {
      fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteBool[1]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("app.js Autoo DELETE fetch: ", data);
        });
      setDeletebool([false, []]);
    }
  }, [autoTrans]);

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

  function calculateTotal(savingss, boxv) {
    let total = 0;
    for (let x in boxv) {
      total += boxv[x][2];
    }
    for (let z in savingss) {
      //add savings to budgeted total
      total += savingss[z][2];
    }
    setTotal(total);
  }

  function calculatePayperiod(theTrans) {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();

    const ttoday = new Date(theTrans);
    const tday = ttoday.getDate();
    const tmonth = ttoday.getMonth();

    const sameMonth = tmonth === month;
    const bothOver20 = tday >= 20 && day >= 20;
    const bothUnder20 = tday < 20 && day < 20;
    const bothOverOrUnder = bothOver20 || bothUnder20;

    const criteria1 = sameMonth && bothOverOrUnder;

    const differentMonths1 = tmonth === month - 1;
    const differentMonths2 = tmonth === month + 1;
    const different = differentMonths1 || differentMonths2; //if one is t is 2/13 and today is 3/20
    const tover20 = tday >= 20;
    const todayover20 = day >= 20;
    const todayAhead = tover20 && differentMonths1 && !todayover20;
   
    const criteria2 = todayAhead;

    const oneIsDec = tmonth === 11;
    const oneIsJan = month === 0;
    const decAndJan = oneIsDec && oneIsJan;

    const criteria3 = decAndJan && tover20 && !todayover20;

    const payperiod = criteria1 || criteria2 || criteria3;
    console.log(theTrans, " within payperiod? ", payperiod)
    return payperiod;
  }


  function calculateSpentandSetBV(nextBoxVal, nextTransaction) {
    for (let x = 0; x < nextBoxVal.length; x++) {
      let spent = 0;


      for (let ii = 0; ii < nextTransaction.length; ii++) {
        const pp = calculatePayperiod(nextTransaction[ii][2]);


        if (
          nextBoxVal[x][1] === nextTransaction[ii][3] && //if categories match, expense is present, and
          nextTransaction[ii][4] > 0 &&
          pp
        ) {
          console.log("updating how much spent...")
          spent += nextTransaction[ii][4];
          console.log("spent is... ", spent)
        } else if (
          nextBoxVal[x][1] === nextTransaction[ii][3] && //if categories match, income present, and
          nextTransaction[ii][5] > 0 &&
          pp
        ) {
          spent -= nextTransaction[ii][5];
        }
      }
      nextBoxVal[x] = [
        nextBoxVal[x][0],
        nextBoxVal[x][1],
        nextBoxVal[x][2],
        spent,
        nextBoxVal[x][4],
      ];
    }
    setBoxvalue(nextBoxVal);
  }
  function handleInput(event, ind, id) {
    const nextBoxVal = boxvalue.slice();
    let val = event.target.value;
    const nextTransaction = transaction.slice();
    const tempSavings = savings.slice();
    const tempAuto = autoTrans.slice();
    console.log("event id", event.target.id);
    //out transactions
    if (event.target.id === "out") {
      console.log("handleInput()", event.target.id, id);
      //if OUT then cross check category names and change boxvalue?
      //This LOOP formats transaction numbers
      for (let index = 0; index < nextTransaction.length; index++) {
        if (nextTransaction[index][0] === id) {
          console.log("OUT transaction: ", nextTransaction[index][0]);
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
            nextTransaction[index][5],
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
            parseFloat(boxstr),
          ];
        }
      }
    } else if (event.target.id === "categoryamount") {
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
            nextBoxVal[i][4],
          ];
        }
      }
      calculateTotal(tempSavings, nextBoxVal);
    } else if (event.target.id === "savings") {
      //update savings amount
      for (let i = 0; i < tempSavings.length; i++) {
        if (tempSavings[i][0] === id) {
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
            tempSavings[i][5],
          ];
          calculateTotal(tempSavings, nextBoxVal);
        }
      }
    } else if (event.target.id === "autoout") {
      for (let a in tempAuto) {
        if (tempAuto[a][0] === id) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;

          tempAuto[a] = [
            tempAuto[a][0],
            tempAuto[a][1],
            tempAuto[a][2],
            parseFloat(boxstr),
            tempAuto[a][4],
            tempAuto[a][5],
          ];
        }
      }
    } else if (event.target.id === "autoin") {
      for (let a in tempAuto) {
        if (tempAuto[a][0] === id) {
          const arr = [...val];
          const filterArr = [];
          const boxstr = modifyNum(arr, filterArr);
          const str = boxstr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          event.target.value = "¥" + str;

          tempAuto[a] = [
            tempAuto[a][0],
            tempAuto[a][1],
            tempAuto[a][2],
            tempAuto[a][3],
            parseFloat(boxstr),
            tempAuto[a][5],
          ];
        }
      }
    }
    // Calculating SPENT in boxvalue
    calculateSpentandSetBV(nextBoxVal, nextTransaction);
    setSavings(tempSavings);
    setTransaction(nextTransaction);
    setAutotrans(tempAuto);
  }

  function handleCatName(event, ind, id) {
    const nextBox = boxvalue.slice();
    for (let i = 0; i < nextBox.length; i++) {
      if (nextBox[i][0] === id) {
        nextBox[i] = [
          id,
          event.target.value,
          nextBox[i][2],
          nextBox[i][3],
          nextBox[i][4],
        ];
      }
    }
    setBoxvalue(nextBox);
  }

  function handleCatOption(event, index, id, which) {
    const tempTransaction = transaction.slice();
    const tempAuto = autoTrans.slice();
    if (which === "trans") {
      tempTransaction[index] = [
        tempTransaction[index][0],
        tempTransaction[index][1],
        tempTransaction[index][2],
        event.target.value,
        tempTransaction[index][4],
        tempTransaction[index][5],
      ];
      setTransaction(tempTransaction);
    } else {
      tempAuto[index] = [
        tempAuto[index][0],
        tempAuto[index][1],
        event.target.value,
        tempAuto[index][3],
        tempAuto[index][4],
        tempAuto[index][5],
      ];
      setAutotrans(tempAuto);
    }
  }

  function newRow() {
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random() * 100);
    const ranNum2 = Math.floor(Math.random() * 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)];
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)];
    const newId = ranNum + ranLet + ranNum2 + ranLet2;
    const newArr = [newId, "", "", "", 0, 0];
    setTransaction([...transaction, newArr]);
  }

  function newSavings() {
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random() * 100);
    const ranNum2 = Math.floor(Math.random() * 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)];
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)];
    const newId = ranNum + ranLet + ranNum2 + ranLet2;
    const date = new Date();
    const day = date.getDate();
    console.log(day);
    const newArr = [newId, "", 0, 0, "savings", date];
    setSavings([...savings, newArr]);
  }

  function transName(data, index, id) {
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      tempTrans[index][0],
      data.target.value,
      tempTrans[index][2],
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5],
    ];
    setTransaction(tempTrans);
  }

  function handleDate(data, index, id) {
    console.log(data.target.value);
    const tempTrans = transaction.slice();
    tempTrans[index] = [
      tempTrans[index][0],
      tempTrans[index][1],
      data.target.value,
      tempTrans[index][3],
      tempTrans[index][4],
      tempTrans[index][5],
    ];
    setTransaction(tempTrans);
  }

  function handleNewCat() {
    const date = new Date();
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random() * 100);
    const ranNum2 = Math.floor(Math.random() * 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)];
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)];
    const idVal = ranNum + ranLet + ranNum2 + ranLet2;
    setBoxvalue([...boxvalue, [idVal, "", 0, 0, date]]);
  }

  function handleDelete(val, index, id) {
    const tempBox = boxvalue.slice();
    const tempTrans = transaction.slice();
    const tempSavings = savings.slice();
    const tempAuto = autoTrans.slice();

    for (let t in tempTrans) {
      if (tempTrans[t][0] === id) {
        console.log("Deleting trans...");

        //Set the spent value minus whatever was deleted
        for (let x in tempBox) {
          if (tempBox[x][1] === tempTrans[t][3]) {
            const newspent = tempTrans[t][4];
            const newincome = tempTrans[t][5];
            const boxspent = tempBox[x][3];
            const newspentbox = newincome - newspent + boxspent;
            tempBox[x] = [
              tempBox[x][0],
              tempBox[x][1],
              tempBox[x][2],
              newspentbox,
              tempBox[x][4],
            ];
          }
        }
        const deleteItem = tempTrans.slice(t, t + 1);
        tempTrans.splice(t, 1);
        if (!tempTrans[0]) {
          tempTrans[0] = ["123abc", "", "", "", 0, 0];
        }

        setDeletebool([true, deleteItem]);
        setTransaction(tempTrans);
      }
    }
    for (let s in tempSavings) {
      if (tempSavings[s][0] === id) {
        console.log("deleting savings");
        const deleteItem = tempSavings.slice(s, s + 1);
        tempSavings.splice(s, 1);
        const date = new Date();
        const day = date.getDate();
        if (!tempSavings[0]) {
          tempSavings[0] = ["kljasdf", "", 0, 0, "savings", date];
        }
        calculateTotal(tempSavings, tempBox);
        setDeletebool([true, deleteItem]);
        setSavings(tempSavings);
      }
    }
    for (let i in tempBox) {
      if (tempBox[i][0] === id) {
        console.log("Deleting cats...");
        const deleteItem = tempBox.slice(i, i + 1);
        tempBox.splice(i, 1);

        if (!tempBox[0]) {
          tempBox[0] = ["asjkldfklasdh", "", 0, 0, date];
        }
        calculateTotal(tempSavings, tempBox);
        setDeletebool([true, deleteItem]);
        setBoxvalue(tempBox);
      }
    }
    for (let i in tempAuto) {
      if (tempAuto[i][0] === id) {
        console.log("Deleting autotransaction...");
        const deleteItem = tempAuto.slice(i, i + 1);
        tempAuto.splice(i, 1);

        if (!tempAuto[0]) {
          tempAuto[0] = ["xyz321", "", "", 0, 0, "aaa"];
        }
        setDeletebool([true, deleteItem]);
        setAutotrans(tempAuto);
      }
    }
  }

  function handleSavingsName(val, index, id) {
    console.log("handleSavingsName", index);
    const tempSavings = savings.slice();
    tempSavings[index] = [
      tempSavings[index][0],
      val.target.value,
      tempSavings[index][2],
      tempSavings[index][3],
      tempSavings[index][4],
      tempSavings[index][5],
    ];
    setSavings(tempSavings);
  }

  function saveAuto(event, data, index) {
    const tempAuto = autoTrans.slice();
    console.log(event.target.value);
    for (let i in tempAuto) {
      if (tempAuto[i][0] === data[0]) {
        tempAuto[i] = [
          tempAuto[i][0],
          event.target.value,
          tempAuto[i][2],
          tempAuto[i][3],
          tempAuto[i][4],
          tempAuto[i][5],
        ];
      }
    }

    setAutotrans(tempAuto);
  }

  function addNewAuto(data) {
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random() * 100);
    const ranNum2 = Math.floor(Math.random() * 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)];
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)];
    const newId = ranNum + ranLet + ranNum2 + ranLet2;

    let ddd = new Date(data.adate);
    const ddate = ddd.toString(); // Fri Dec 22 2022
    const day = ddate.slice(8, 10) //Fri Dec 2 2220

    const today = new Date();
    const totoday = today.toString();
    const monthday = totoday.slice(0, 7)
    const year = totoday.slice(10, 15)
    ddd = monthday + " " + day + " " + year;
    const newdate = new Date(ddd);

    const newArr = [
      newId,
      "AUTO",  //NEED THIS BECAUSE THIS IS A TRANSACTION
      newdate,
      data.acategory,
      data.aexpense,
      data.aincome
    ];

    return newArr;
  }

  function newAuto() {
    const abc = "abcdefghijklmnopqrstuvwxyz!#$%";
    const ranNum = Math.floor(Math.random() * 100);
    const ranNum2 = Math.floor(Math.random() * 100);
    const ranLet = abc[Math.floor(Math.random() * abc.length)];
    const ranLet2 = abc[Math.floor(Math.random() * abc.length)];
    const newId = ranNum + ranLet + ranNum2 + ranLet2;

    const newArr = [
      newId,
      "",
      "",
      0,
      0,
      "aaa",
    ];

    setAutotrans([...autoTrans, newArr])
  }


  function handleSave(stuff, index, data) {
    console.log("handleSAVE", data);
    const tempTrans = transaction.slice();
    //my payday is the 20th
    let checky = true;
    for (let i in tempTrans) {
      const payday = calculatePayperiod(tempTrans[i][2]);

      if (payday && tempTrans[i][3] === data[2]) {
        checky = false;
        console.log("checky false now");
        break;
      }
    }
    if (checky) {
      console.log("save button checky");
      const newdate = new Date(data[1]);
      const ddata = {
        _id: data[0],
        adate: newdate,
        acategory: data[2],
        aexpense: data[3],
        aincome: data[4],
        aaa: data[5],
      };
      setTransaction([...transaction, addNewAuto(ddata)]);
    }
  }

  function showAuto() {
    setToggleAuto(!toggleAuto);
  }

  const handlelogSubmit = async (event) => {
    // GET REQUEST FOR LOGIN
    event.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passcode }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("LOGIN SUCCESS?", data);

      if (data.success) {
        setToggleLock(false);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  function sort() {
    let t = transaction.slice();
    const tt = t.sort((a, b) => {return new Date(a[2]) - new Date(b[2]) });
    console.log("T", tt);
    setTransaction(tt);
  }



return (
  <div className="App">
    {toggleLock && (
      <div className="lock" id="loginDiv" onSubmit={handlelogSubmit}>
        <form id="loginForm" action="/login" method="post">
          <h1>PASSCODE</h1>
          <input
            type="password"
            id="passcode"
            name="passcode"
            className="pass"
            onChange={(e) => setPasscode(e.target.value)}
          />{" "}
          <br /> <br />
          <input className="submitbutton" type="submit" value="submit" />
        </form>
      </div>
    )}
    {!toggleLock && (
      <div className="title-container">
        <h1 className="dateTitle">
          {(() => {
            const date = new Date();
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            const month = date.getMonth();
            const year = date.getFullYear();

            return "Budget of " + months[month] + " " + year;
          })()}
        </h1>
      </div>
    )}
    {!toggleLock && (
      <div className="total-amount" id="total">
        <Totals tots={total} transaction={transaction} budget={boxvalue} />
      </div>
    )}
    {!toggleLock && (
      <div className="auto-container">
        <button onClick={showAuto}>Auto Transactions</button>
        {toggleAuto && (
          <div className="autoTransaction">
            <div className="new-savings">
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="newbutton"
                onClick={newAuto}
              />
              <h4 className="faTitle">Auto Transactions</h4>
            </div>
            {autoTrans.map((value, index) => (
              <AutoRow
                data={value}
                index={index}
                autotransData={autoTrans}
                boxvalue={boxvalue}
                handleCatOption={handleCatOption}
                saveAuto={(x, y, z) => saveAuto(x, y, z)}
                inputCallback={(x, y, z) => handleInput(x, y, z)}
                nameCallback={(x, y, z) => transName(x, y, z)}
                handleDate={(x, y, z) => handleDate(x, y, z)}
                handleDelete={handleDelete}
                handleSave={(x, y, z) => handleSave(x, y, z)}
              />
            ))}
          </div>
        )}
      </div>
    )}
    {!toggleLock && (
      <div className="budget-container">
        <div className="newcat">
          <NewBox title="New Category" handleClick={handleNewCat} />
        </div>
        <div className="budget-titles">
          <p>Category</p>
          <p>Budgeted</p>
          <p>Remaining</p>
        </div>
        <div className="budget">
          {boxvalue.map((value, index) => (
            <Budget
              value={value}
              index={index}
              handleDelete={handleDelete}
              handleCatName={(x, y, z) => handleCatName(x, y, z)}
              handleInput={(x, y, z) => handleInput(x, y, z)}
              box={boxvalue}
              tran = {transaction}
            />
          ))}
        </div>
      </div>
    )}
    {!toggleLock && (
      <div className="savings-container">
        <div className="new-savings">
          <FontAwesomeIcon
            icon={faSquarePlus}
            className="newbutton"
            onClick={newSavings}
          />
          <h4 className="faTitle">Savings</h4>
        </div>
        <div className="budget-titles">
          <p>Savings Name</p>
          <p>Budgeted</p>
          <p>Total</p>
        </div>
        <div className="savings">
          {savings.map((value, index) => (
            <Savings
              data={value}
              index={index}
              handleDelete={handleDelete}
              savingsCallback={(x, y, z) => handleInput(x, y, z)}
              savingsname={(x, y, z) => handleSavingsName(x, y, z)}
              sav={savings}
            />
          ))}
        </div>
      </div>
    )}
    {!toggleLock && (
      <div className="transaction-container">
        <div className="new-savings">
          <FontAwesomeIcon
            icon={faSquarePlus}
            className="newbutton"
            onClick={newRow}
          />
          <h4 className="faTitle">Transactions</h4>
        </div>
        <div className="transaction-titles">
          <p className="titlebutton" onClick={()=>{sort()}}>Date</p>
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
              tran={transaction}
              boxvalue={boxvalue}
              handleCatOption={handleCatOption}
              inputCallback={(x, y, z) => handleInput(x, y, z)}
              nameCallback={(x, y, z) => transName(x, y, z)}
              handleDate={(x, y, z) => handleDate(x, y, z)}
              handleDelete={handleDelete}
              key={index}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
}
