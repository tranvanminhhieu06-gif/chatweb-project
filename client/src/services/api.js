import axios from 'axios';

const API = axios.create({
    baseURL: 'https://chatweb-server-hieu.onrender.com/api' // Link Render của bạn + /api
});

export default API;