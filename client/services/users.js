const users = [
  {name: 'Joel'}, {name: 'Don'}, {name: 'David'}
  ];

const delay = () => new Promise(res => setTimeout(res, 1000));
const getUsers = () => delay()
  .then(() => users.slice());

const addUser = (name) => {
  const newUser = {name};
  users.push(newUser);
  return delay()
    .then(() => newUser);
}
export {getUsers, addUser};