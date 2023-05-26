// @ts-nocheck
import fs from "fs";
import prompt from "prompt";

//Getting filename from user
prompt.start();
const { filename } = await prompt.get("filename");

//Reading File
const path = `./${filename}`;
const inputData = fs.readFileSync(path, { encoding: "utf-8" });
const input = JSON.parse(inputData);

//Model class to store expense and revenue together
class Data {
  constructor(expense, revenue) {
    this.expense = expense;
    this.revenue = revenue;
  }
}

// A Map to store Date -> expense and revenue
const ds = new Map();

input.expenseData.forEach((it) => {
  const val = ds.get(it.startDate);

  if (val) {
    val.expense += it.amount;
  } else {
    ds.set(it.startDate, new Data(it.amount, 0));
  }
});

input.revenueData.forEach((it) => {
  const val = ds.get(it.startDate);

  if (val) {
    val.revenue += it.amount;
  } else {
    ds.set(it.startDate, new Data(0, it.amount));
  }
});

//Get all, lowest and highest date
let dates = Array.from(ds.keys()).sort();
let lowestDate = new Date(dates[0]);
let highestDate = new Date(dates[dates.length - 1]);

//Get missing dates
const allDates = [];
for (let i = lowestDate; i <= highestDate; i.setMonth(i.getMonth() + 1)) {
  allDates.push(i.toISOString());
}

//Output
const output = { balance: [] };

allDates.forEach((d) => {
  const val = ds.get(d);
  if (val) {
    output.balance.push({
      amount: val.revenue - val.expense,
      startDate: d,
    });
  } else {
    output.balance.push({
      amount: 0,
      startDate: d,
    });
  }
});

console.log(output);

fs.writeFileSync("./output.json", JSON.stringify(output));
