import axios from 'axios';
import { baseServerUrl } from './config.ts';

export const Axios = axios.create({
    baseURL: baseServerUrl,
});
