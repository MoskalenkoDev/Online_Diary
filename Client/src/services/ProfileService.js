import $api from "../http/axios_instance";

export default class ProfileService {
 
    static async profile_get_data(userType) {
        return $api.get(`/${userType}/diary_menu/profile`);
    }

    static async profile_put_data(userType, changedData) {
        return $api.post(`/${userType}/diary_menu/profile/save_input_data`, {...changedData});
    }

}