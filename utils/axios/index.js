import axios from 'axios';
import { BASE_URL } from '../constants/siteUrl';

const headers = { Accept: 'application/json', 'Access-Control-Allow-Origin': '*' };
const params = { format: 'json' };

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers,
  params,
});

export default client;
