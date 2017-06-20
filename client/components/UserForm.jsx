import React from 'react';
import {addUser} from '../reducers/users';
import {connect} from 'react-redux';

const UserForm = (props) => {
  const submitHandler = (e) => {
    e.preventDefault();
    props.addName(e.target.elements.name.value);
    e.target.elements.name.value = '';
  }
  return (<form onSubmit={submitHandler}>
    <p>
      <label htmlFor="name">Name</label>
      <input type="text" name="name"/>
    </p>
  </form>);
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  addName(name){
    dispatch(addUser(name));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(UserForm);