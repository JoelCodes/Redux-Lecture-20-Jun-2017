const { createStore, applyMiddleware } = require('redux');

const initialBalance = 304.50;

const transactions = [
  { type: 'WTH', amt: 27.25 }, 
  { type: 'DEP', amt: 231.75 }, 
  { type: 'WTH', amt: 432.00 }
];


const bankAccountReducer = (currentBalance, transaction) => {
  switch(transaction.type){
    case 'WTH':
      return currentBalance - transaction.amt;
    case 'DEP':
      return currentBalance + transaction.amt;
    default: return currentBalance;
  }
}

const loggerMiddleware = store => next => action => {
  console.log('MW', store.getState(), action);
  next(action);
}

const store = createStore(bankAccountReducer, initialBalance, applyMiddleware(loggerMiddleware));
console.log(store.getState());
let index = 0;
store.subscribe(() => {
  console.log('Subscription: ', store.getState());
})

// trigger actions
const intervalId = setInterval(function(){
  store.dispatch(transactions[index]);
  index += 1;
  if(index >= transactions.length){
    clearInterval(intervalId);
  }
}, 2000);

// const finalBalance = transactions.reduce(bankAccountReducer, initialBalance);

// console.log(finalBalance);

// let currentBalance = initialBalance;

// transactions.forEach(transaction => {
//   switch(transaction.type){
//     case 'WTH':
//       currentBalance -= transaction.amt;
//       break;
//     case 'DEP':
//       currentBalance += transaction.amt;
//       break;
//     default: break;
//   }
//   console.log('Current Balance', currentBalance);
// });