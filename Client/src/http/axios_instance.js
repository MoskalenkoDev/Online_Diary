import axios from "axios";
import {logout} from "../controllers/AuthController";
import { useDispatch } from "react-redux";

export const API_URL = 'http://localhost:3001';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

axios.interceptors.response.use((config) => console.log("config , === ", config));

$api.interceptors.request.use( (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

$api.interceptors.response.use( (config) => {
    return config;
}, async (err) => {
    const originalRequest = err.config;
    const userType = originalRequest.url.split('/')[1];
    // if(err.response.status == 404) logout(userType)(useDispatch());
    if(err.response.status == 401 && err.config) { // && !err.config._isRetry
        // originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/${userType}/refresh`, {withCredentials: true});
            localStorage.setItem("token", response.data.accessToken);
            return $api.request(originalRequest);
        }
        catch(e){
            logout(userType)(useDispatch()); // if we don't have accessToken and refreshToken we have to log out
            console.log("Сюда я тоже попал, хотя не должен был")
        }
    }
    throw err;
});

export default $api;