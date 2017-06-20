const {expect} = require('chai');
const {usersReducer} = require('../client/reducers/users');
describe('UsersReducer', () => {
  it('has an initial state of an empty array', () => {
    expect(usersReducer(undefined, {})).to.deep.eq({loading: true, users: []});
  });
  describe('{ type: FETCH_USERS_SUCCESS, payload: [users] }', () => {
    it('loads the new users, replacing old ones', () => {
      const lastState = {loading: true, users: [{name: 'Derrell'}] };
      const action = {type: 'FETCH_USERS_SUCCESS', payload: [{name: 'Ervin'}]};
      expect(usersReducer(lastState, action)).to.deep.eq({loading: false, users: action.payload});
    });
  });
  describe('{type: ADD_USER_PENDING}', () => {
    it('should set loading to true', () => {
      const lastState = {loading: false, users: [{name: 'Derrell'}] };    
      const action = {type: 'ADD_USER_PENDING'};
      expect(usersReducer(lastState, action)).to.deep.eq({loading: true, users: lastState.users});
    });
  });
  describe('{type: ADD_USER_SUCCESS, payload: user}', () => {
    it('should set loading to true', () => {
      const lastState = {loading: true, users: [{name: 'Derrell'}] };    
      const action = {type: 'ADD_USER_SUCCESS', payload: {name: 'Erica'}};
      expect(usersReducer(lastState, action)).to.deep.eq({loading: false, users: lastState.users.concat([action.payload])});
    });
  });

});