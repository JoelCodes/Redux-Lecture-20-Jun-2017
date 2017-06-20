import React from 'react';
// import {getUsers, addUser} from '../services/users';
import UserList from './UserList.jsx';
import UserForm from './UserForm.jsx';
import { addUser } from '../reducers/users';
import {connect} from 'react-redux';

// class App extends React.Component{
//   constructor(props){
//     super(props);
//     this.state = {loading: true};
//   }
//   componentDidMount(){
//     getUsers().then(users => {
//       this.setState({loading: false, users});
//     })
//   }
//   addName(name){
//     this.setState({loading: true});
//     addUser(name).then(user => {
//       this.setState({
//         loading: false, 
//         users: this.state.users.concat([user]),
//       });
//     })
//   }
//   render(){
//     if(this.state.loading) return (<h1>Loading...</h1>);
//     return (<div>
//       <UserList users={this.state.users}/>
//       <UserForm addName={(name) => this.addName(name)}/>
//       </div>);
//   }
// }

const App = (props) => {
    if(props.loading) return (<h1>Loading...</h1>);
    return (<div>
      <UserList/>
      <UserForm/>
      </div>);
};

const mapStateToProps = ({loading}) => ({loading});

export default connect(mapStateToProps)(App);