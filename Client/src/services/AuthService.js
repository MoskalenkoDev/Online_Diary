import $api from "../http/axios_instance";
import axios from "axios";
export default class AuthService {
 
    static async registration(userType,email, password) {
        return $api.post(`/${userType}/signup`, {email, password});
    }

    static async login(userType,email, password) {
        return $api.post(`/${userType}/login`, {email, password});
    }

    static async logout(userType) {
        return $api.post(`/${userType}/logout`);
    }

    static async refresh(userType) {
        return axios.get(`/${userType}/refresh`, {withCredentials: true});
    }

}