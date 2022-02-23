import AuthService from "../services/AuthService";
import ProfileService from "../services/ProfileService";
import * as actionCreators from "../Redux/Actions/actions";

let timer;
let showTime = 4000;

const langObj = 
{
  ua: {
      successChanges : "Зміни успішно збережені",
      popupWarningUnexpected: "Щось пішло не так..."
  },
  ru: {
      successChanges : "Изменения успешно сохранены",
      popupWarningUnexpected: "Что-то пошло не так..."
  },
  en: {
      successChanges : "Changes saved successfully",
      popupWarningUnexpected: "Something went wrong..."
  }
}

export const showPopup = ( dispatch, popupTitle , isSuccess) => {
    clearTimeout(timer);
    dispatch(actionCreators.change_profile_save_popup_title(popupTitle));
    dispatch(actionCreators.change_profile_save_popup_class("active_save_profile_popup_title " + !isSuccess ? "red_color" : ""));
    timer = setTimeout(() => { dispatch(actionCreators.change_profile_save_popup_class("")); }, showTime);
}

export function profile_get_data() {
    
    return async(dispatch) => {

        const userType = localStorage.getItem("userType");
        const lang = localStorage.getItem('language');

        try {
            let response = await ProfileService.profile_get_data(userType);
            dispatch(actionCreators.change_input_data_all({...response.data}));
        }
        catch(e) {

            switch(e.response.status) {
                case 500 : {
                    showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                    break;
                }
            }
        }
    }

}

export function profile_put_data(changedData) {

    const userType = localStorage.getItem("userType");
    const lang = localStorage.getItem('language');
    
    return async(dispatch) => {

        try {
           await ProfileService.profile_put_data(userType, changedData);
           showPopup(dispatch, langObj[lang].successChanges, true);
        }
        catch(e) {
            switch(e.response.status) {
                case 500 : {
                    showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                    break;
                }

                case 400 : {
                    try {
                        await AuthService.refresh(userType);
                        showPopup(dispatch, langObj[lang].successChanges, true);  
                        break;   
                    }
                    catch(err) {throw err;} 
                }
            }
        }
    }

}
