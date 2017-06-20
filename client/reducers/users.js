const {getUsers, addUser} = require('../services/users');

function usersReducer(state = {loading: true, users: []}, action){
  switch(action.type){
    case 'FETCH_USERS_SUCCESS':
      return {
        loading: false,
        users: action.payload
      };
    case 'ADD_USER_PENDING':
      return {
        loading: true,
        users: state.users
      };
    case 'ADD_USER_SUCCESS':
      return{
        loading: false,
        users: state.users.concat([action.payload])
      };
  }
  return state;
}

const usersMiddleware = store => next => action => {
  switch(action.type){
    case 'FETCH_USER':
      getUsers().then(users => {
        store.dispatch({type: 'FETCH_USERS_SUCCESS', payload: users});
      });
      break;
    case 'ADD_USER':
      store.dispatch({type: 'ADD_USER_PENDING'});
      addUser(action.name).then(user => {
        store.dispatch({type: 'ADD_USER_SUCCESS', payload: user});
      });
    default: next(action);
  }
}
module.exports = {
  usersReducer,
  usersMiddleware,
  fetchUser(){
    return {type: 'FETCH_USER'};
  },
  addUser(name){
    return {type: 'ADD_USER', name};
  }
};