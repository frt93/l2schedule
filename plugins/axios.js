import * as axios from 'axios';
import cookies from 'js-cookie';
import { setAuthToken, resetAuthToken } from './auth';

let options = {};
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
}

const token = cookies.get('x-access-token');
if (token) setAuthToken(token);
else resetAuthToken();

export default axios.create(options);
