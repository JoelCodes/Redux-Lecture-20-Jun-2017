# Redux

## Why Learn Redux?

* Useful in other JS contexts, and with a lot of other environments
* Testable
* Teaches you a lot of other skills

## Redux Fundamentals

### Event Driven Architecture

The core idea of redux is an event driven architecture.  You create a *Store*, and then actions are dispatched to the store.  The state is not changed directly by the outside applications: the outside apps can only dispatch actions, and the state changes in very specific ways.

The core idea of Redux centers around three components:

* **State** - The current state representation
* **Actions** - Events in your system
* **Reducers** - Functions that define what the new state should be, given the current state and a new action.

In the example of the bank account, you start the bank account with a balance of $0.00.  Then actions come in.  Those actions may be any of the following:

* **Deposits** -> add the amount
* **Withdrawal** -> subtract the amount
* **Interest** -> add the amount * balance

You can imagine the following events:

|Type|Amount|Balance|
|---|---|---|
|Deposit|$700.00|$700.00|
|Withdrawal|$20.00|$680.00|
|Interest|1%| $686.80|
|Withdrawal|$10|$676.80|

In this example the state is the current balance, and the actions are the deposits, withdrawals and interest.  What would the reducer look like?  It needs to:

* Take in the old balance and the current transaction as params
* Return a new balance
* Be a pure function, which means
	* No changing outside state or mutating parameters
	* No randomness (either from `Math.random` or `new Date()`)
	* Just take in parameters and return a result.

```js
function bankAccountReducer(balance, transaction){
  switch(transaction.type){
    case 'DEPOSIT': 
    	return balance + transaction.amount;
    case 'WITHDRAWAL':
    	return balance - transaction.amount;
    case 'INTEREST':
    	return balance * (1 + transaction.amount);
    // If we don't know what to do, we just return the original state.
    default: return balance;
  }
}
```
With these three pillars, you can build a Redux app easily.

```js
const {createStore} = require('redux');
const initialBalance = 0.00;
const bankStore = createStore(bankAccountReducer, initialBalance);

bankStore.subscribe(() => {
  console.log('Current Balance', bankStore.getState());
});

setTimeout(function(){
  bankStore.dispatch({type: 'DEPOSIT', amount: 100.00});
}, 2000);
```

When some process dispatches changes to the `bankStore`, the subscription will fire.  So now we have a difference between the code that's listening to the store and the code that's sending changes.

### Middleware

There is one last part of Redux to consider: middleware.  If you remember middleware in ExpressJS, it stepped in before the HTTP request made it to the routes and would perform some action like decorate the request or maybe end the response.

```js
app.use(cookieSession({ secret: 'FLUFFY_BUNNY' });

// Decorate the request
app.use((req, res, next) => {
  req.user = userDB.get(req.session.user_id);
  next();
});

// Cancel the response
app.use('/urls', (req, res, next) => {
  if(req.user === undefined){
    res.sendStatus(401);
  } else {
  	next();
  }
});
```

Middleware in redux is similar in nature.  It follows the pattern of a function that takes the store (the redux app), then returns a function that takes the `next` function, then returns a function that takes the `action` and does something.  Confusing?  Just remember the following recipe:

```js
const myMiddleware = (store) => (next) => (action) => {
  // Do Stuff
  next(action);
};
```

The `next(action);` line tells the middleware to move on.  If I don't call it, it won't send the next action.  Here's a simple logger:

```js
const logger = (store) => (next) => (action) => {
  console.log(store.getState(), action);
  next(action);
}
```

Now, let's say I want some asynchrony.  I want a middleware that will listen if I send a `FETCH_USERS` action, but I don't want it to send that action on.

```js
const fetchUsersMiddleware = (store) => (next) => (action) => {
  if(action.type === 'FETCH_USERS'){
  } else {
	 next(action);
  }
}
```

What I want it to do is send a new action, `FETCH_USERS_PENDING`.  Then, I want it to make an AJAX request.  If that AJAX request succeeds, I'll then dispatch a `FETCH_USERS_SUCCESS` action with the users, but if it fails, I'll dispatch a `FETCH_USERS_FAILURE` action with the error.

```js
const fetchUsersMiddleware = (store) => (next) => (action) => {
  if(action.type === 'FETCH_USERS'){
    store.dispatch({type: 'FETCH_USERS_PENDING'});
    fetch('/api/users/')
      .then(response => {
	     store.dispatch({
	       type: 'FETCH_USERS_SUCCESS', 
	       users: response.data
	     });
	   })
      .catch(response => {
        store.dispatch({
          type: 'FETCH_USERS_FAILURE',
          error: response.error
        });
      });
  } else {
	 next(action);
  }
}
```

Now if I want to trigger this, I can just call `store.dispatch({type: 'FETCH_USERS'})`, and that sets the whole thing in motion.

## React-Redux

Redux is often linked with React because it was developed to deal with React's lack of opinionation about how you should write your app. They don't need to be used together, but if you are going to, there are some setup things.  `react-redux` is an entire library that has two big useful pieces: the `Provider` component, and the `connect` function.

### `Provider`

The `Provider` component wraps around the highest level component that is part of your React App.  Here is an example `index.jsx`:

```js
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { usersReducer, usersMiddleware, fetchUsersAction } from './reducers/users';
import App from './App.jsx';

const store = createStore(usersReducer, applyMiddleware(usersMiddleware));

// Maybe send an initial action to trigger middleware
store.dispatch(fetchUsersAction);

const root = document.getElementById('react-root');
render(<Provider store={store}>
    <App/>
  </Provider>, root);

```

Fair amount of boilerplate, but it gets the job done.


### `connect(mapStateToProps, [mapDispatchToProps])(Component)`

This will kinda change the way that we write our components.  In the regular model, we might need some components to be classes that extend `React.Component`, and some that can be pure, stateless functions.  Now we can write all of our components as pure stateless functions!  Here's an example.  If our `UserList` component is taking its data directly from the `users` data member of the state, then we can write this component assuming that it will take `users` as a prop.

```js
import React from 'react';

const UserList = (props) => {
  const userListItems = props.users.map(user => (<li>{user.name}</li>));
  return (<li>{userListItems}</li>);
}

export default UserList;
```

Then, we bring in `connect`.  This can take one function and optionally a second: the first takes items off of the current store state and returns an object describing certain props.

```js
const mapStateToProps = (state) => {
  return {
    users: state.users
  };
}
```

The second accepts this store's `dispatch` function as a parameter and returns props that trigger dispatch actions.

```js
const mapDispatchToProps = (dispatch) => {
  return {
    addUser(name){
      dispatch({type: 'ADD_USER', name });
    }
  };
};
```

These are then applied to the `connect` function, returning a new higher-order component.

```js
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
```

Now, this wrapped component can be imported with no worry about its props.

I've included a link