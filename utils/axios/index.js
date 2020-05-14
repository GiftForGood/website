import axios from 'axios';
const headers = { Accept: 'application/json', 'Access-Control-Allow-Origin': '*' };
const params = { format: 'json' };

const client = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 20000,
  withCredentials: true,
  headers,
  params,
});

export default client;
