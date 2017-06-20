function createStore(reducer, initialState){
  let state = initialState;
  const listeners = [];
  return {
    getState(){
      return state;
    },
    dispatch(action){
      // Middleware goes here
      state = reducer(state, action);
      listeners.forEach(cb => cb());
    },
    subscribe(cb){
      listeners.push(cb);
    }
  }
}

module.exports = {
  createStore
};