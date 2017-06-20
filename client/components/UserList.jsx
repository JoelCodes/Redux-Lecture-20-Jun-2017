import React from 'react';
import {connect} from 'react-redux';

const UserList = (props) => {
  const userLis = props.users.map(user => (<li>{user.name}</li>));
  return (<ul>{userLis}</ul>);
};

const mapStateToProps = ({users}) => ({users});

export default connect(mapStateToProps)(UserList);