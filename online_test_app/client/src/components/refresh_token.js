import axios from 'axios';


let refresh_token = () => {
    axios.post('/api/user/token', {
    refresh_token: localStorage.getItem('refresh_token'),
    username: localStorage.getItem('username')
  })
  .then((response) => {
    localStorage.setItem('access_token', response.data.access_token);
    console.log(response);
  })
  .catch((error) => {
    window.location = '/signin';
  });
}


export default refresh_token;