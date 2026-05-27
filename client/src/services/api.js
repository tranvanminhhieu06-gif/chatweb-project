import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api' // Thay bằng URL Render khi deploy
});

export default API;