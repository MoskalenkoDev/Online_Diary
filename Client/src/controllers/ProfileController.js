import AuthService from "../services/AuthService";
import ProfileService from "../services/ProfileService";
import * as actionCreators from "../Redux/Actions/actions";
import jwtDecode from "jwt-decode";
import { change_is_filled_profile } from '../Redux/Actions/action_signup';

let timer;
let showTime = 4000;

const langObj =
{
    ua: {
        successChanges: "Зміни успішно збережені",
        popupWarningUnexpected: "Щось пішло не так..."
    },
    ru: {
        successChanges: "Изменения успешно сохранены",
        popupWarningUnexpected: "Что-то пошло не так..."
    },
    en: {
        successChanges: "Changes saved successfully",
        popupWarningUnexpected: "Something went wrong..."
    }
}

export const showPopup = (dispatch, popupTitle, isSuccess) => {
    clearTimeout(timer);
    dispatch(actionCreators.change_profile_save_popup_title(popupTitle));
    dispatch(actionCreators.change_profile_save_popup_class("active_save_profile_popup_title " + (!isSuccess ? "red_color" : "")));
    timer = setTimeout(() => { dispatch(actionCreators.change_profile_save_popup_class("")); }, showTime);
}

export function profile_get_data(userType) {

    return async (dispatch) => {
        const lang = localStorage.getItem('language');
        try {
            let response = await ProfileService.profile_get_data(userType);
            dispatch(actionCreators.change_input_data_all({ ...response.data }));
        }
        catch (e) {
            switch (e.response.status) {
                case 500: {
                    showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                    break;
                }
            }
        }
    }

}

export function profile_put_data(changedData, userType) {

    const lang = localStorage.getItem('language');

    return async (dispatch) => {

        try {
            await ProfileService.profile_put_data(userType, changedData);
            showPopup(dispatch, langObj[lang].successChanges, true);
        }
        catch (e) {
            switch (e.response.status) {

                case 500: {
                    showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                    break;
                }
                case 400: {
                    try {
                        let response = await AuthService.refresh(userType); // юзаю так походу щоб воно не попало в інтерцептор та не повторило запит ще раз
                        console.log(response);
                        localStorage.setItem("token", response.data.accessToken);

                        let decodedInfo = jwtDecode(response.data.accessToken);
                        dispatch(change_is_filled_profile(decodedInfo.isFilledProfile));

                        showPopup(dispatch, langObj[lang].successChanges, true);
                        break;
                    }
                    catch (err) { throw err; }
                }
            }
        }
    }

}
