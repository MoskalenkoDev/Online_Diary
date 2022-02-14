import AuthService from "../services/AuthService";
import * as actionCreators from "../Redux/Actions/actions";

let timer;
let showTime = 4000;

const langObj = 
{
  ua: {
      popupActivateMailTitle : "Активуйте аккаунт по email",
      popupWarningEmail : "Неправильний формат пошти!",
      popupWarningPassword: "Пароль повинен бути не меньше 6-ти символів!",
      popupWarningExistUser : "Користувач з такою поштою вже зареєстрований!",
      popupWarningMailerFail: "Відправка листа з активацією не вдалася!",
      popupWarningUnexpected: "Щось пішло не так..."
  },
  ru: {
      popupActivateMailTitle : "Активируйте аккаунт по email",
      popupWarningEmail : "Неправильный формат почты!",
      popupWarningPassword: "Пароль должен быть не меньше 6-ти символов!",
      popupWarningExistUser : "Пользователь с такой почтой уже зарегистрирован!",
      popupWarningMailerFail: "Отправка письма с активацией не удалось!",
      popupWarningUnexpected: "Что-то пошло не так..."
  },
  en: {
      popupActivateMailTitle : "Activate account by email",
      popupWarningEmail : "Incorrect email format!",
      popupWarningPassword: "Password must be at least 6 characters!",
      popupWarningExistUser : "User with this email is already registred!",
      popupWarningMailerFail: "Failed to send activation letter!",
      popupWarningUnexpected: "Something went wrong..."
  }
}

export function registration(whoLog, email, password, lang){
    
    return async(dispatch) => {

        try {
            await AuthService.registration(whoLog, email, password);
            dispatch(actionCreators.change_popup_title(langObj[lang].popupActivateMailTitle));
        }
        catch(e) {

            switch(e.response.status) {
    
                case 400 : {
                    e.response.data.errors[0].param == "email" ? 
                    dispatch(actionCreators.change_popup_title(langObj[lang].popupWarningEmail)) : 
                    dispatch(actionCreators.change_popup_title(langObj[lang].popupWarningPassword));
                    break;
                }
    
                case 401: {
                    dispatch(actionCreators.change_popup_title(langObj[lang].popupWarningExistUser));
                    break;
                }
    
                case 502 : {
                    dispatch(actionCreators.change_popup_title(langObj[lang].popupWarningMailerFail));
                    break;
                }
    
                case 500 : {
                    dispatch(actionCreators.change_popup_title(langObj[lang].popupWarningUnexpected));
                    break;
                }
            }
            
        }
        clearTimeout(timer);
        dispatch(actionCreators.change_show_popup(true));
        timer = setTimeout(() => { dispatch(actionCreators.change_show_popup(false)); }, showTime);
    }

}
