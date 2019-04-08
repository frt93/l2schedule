import axios from 'axios';
import cookies from 'js-cookie';

const token = cookies.get('x-access-token');
if (token) setAuthToken(token);
else resetAuthToken();

export function setAuthToken(token) {
  axios.defaults.headers.common['x-access-token'] = token;
}
export function resetAuthToken() {
  delete axios.defaults.headers.common['x-access-token'];
}
