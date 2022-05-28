import axios from "axios";
import {logout} from "../controllers/AuthController";
import jwtDecode from 'jwt-decode';
import AuthService from "../services/AuthService";
import {change_is_logged, change_is_filled_profile, change_user_type} from '../Redux/Actions/action_signup';
import { dispatch } from "../Redux/store";

export const API_URL = 'http://localhost:3001';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use( (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

$api.interceptors.response.use( (config) => {
    return config;
}, async (err) => {
    const originalRequest = err.config;
    const userType = originalRequest.url.split('/')[1];
    if(err.response.status == 401 && err.config) { // && !err.config._isRetry
        try {
            const response = await AuthService.refresh(userType);

            localStorage.setItem("token", response.data.accessToken);
            let decodedInfo = jwtDecode(response.data.accessToken);

            dispatch(change_is_logged(true));
            dispatch(change_is_filled_profile(decodedInfo.isFilledProfile));
            dispatch(change_user_type(decodedInfo.userType));

            return $api.request(originalRequest);
        }
        catch(e){
            await logout(userType)(dispatch); // if we don't have accessToken and refreshToken we have to log out
        }
    }
    throw err;
});

export default $api;