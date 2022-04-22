import AuthService from "../services/AuthService";
import * as actionCreators from "../Redux/Actions/actions";
import jwtDecode from 'jwt-decode';
import { change_is_logged, change_is_filled_profile, change_user_type } from '../Redux/Actions/action_signup';
let timer;
let showTime = 4000;
let showActivateMailPopupTime = 7000;

const langObj = 
{
  ua: {
      popupActivateMailTitle : "Активуйте аккаунт по email!",
      popupWarningEmailFormat : "Неправильний формат пошти!",
      popupWarningEmailUnconfirmed: "Активуйте акаунт за посиланням відправленим на вашу пошту",
      popupWarningUnregisteredUser: "Користувач з такою поштою не зареєстрований!",
      popupWarningIncorrectPassword: "Невірний пароль!",
      popupWarningPassword: "Пароль повинен бути не меньше 6-ти символів!",
      popupWarningExistUser : "Користувач з такою поштою вже зареєстрований!",
      popupWarningMailerFail: "Відправка листа з активацією не вдалася!",
      popupWarningUnexpected: "Щось пішло не так..."
  },
  ru: {
      popupActivateMailTitle : "Активируйте аккаунт по email!",
      popupWarningEmailFormat : "Неправильный формат почты!",
      popupWarningEmailUnconfirmed: "Активируйте аккаунт по ссылке отправленой на вашу почту",
      popupWarningUnregisteredUser: "Пользователь с такой почтой не зарегистрирован!",
      popupWarningIncorrectPassword: "Неверный пароль!",
      popupWarningPassword: "Пароль должен быть не меньше 6-ти символов!",
      popupWarningExistUser : "Пользователь с такой почтой уже зарегистрирован!",
      popupWarningMailerFail: "Отправка письма с активацией не удалось!",
      popupWarningUnexpected: "Что-то пошло не так..."
  },
  en: {
      popupActivateMailTitle : "Activate account by email!",
      popupWarningEmailFormat : "Incorrect email format!",
      popupWarningEmailUnconfirmed: "Activate account by link sended on your email",
      popupWarningUnregisteredUser: "User with this email is not registered!",
      popupWarningIncorrectPassword: "Incorrect password!",
      popupWarningPassword: "Password must be at least 6 characters!",
      popupWarningExistUser : "User with this email is already registred!",
      popupWarningMailerFail: "Failed to send activation letter!",
      popupWarningUnexpected: "Something went wrong..."
  }
}

export const showPopup = ( setState, popupTitle , isSuccess, time = showTime) => {
    clearTimeout(timer);
    setState({popupTitle});
    setState({warning_title_class: isSuccess? "success" : "warning"});
    setState({show_popup: true});
    timer = setTimeout(() => { setState({show_popup: false}) }, time);
}

export function registration(whoLog, email, password, lang){
    
    return async(setState) => {

        try {
            await AuthService.registration(whoLog, email, password);
            showPopup(setState, langObj[lang].popupActivateMailTitle, true , showActivateMailPopupTime);
        }
        catch(e) {
            console.log(e);
            switch(e.response.status) {
    
                case 400 : {
                    if(e.response.data.message == "already registered user") {
                        showPopup(setState, langObj[lang].popupWarningExistUser, false);
                        break;
                    }
                    e.response.data.errors[0].param == "email" ? 
                    showPopup(setState, langObj[lang].popupWarningEmailFormat , false) :
                    showPopup(setState, langObj[lang].popupWarningPassword); 
                    break;
                }
    
                case 502 : {
                    showPopup(setState, langObj[lang].popupWarningMailerFail, false);
                    break;
                }
    
                case 500 : {
                    showPopup(setState, langObj[lang].popupWarningUnexpected, false);
                    break;
                }
            }
            
        }
    }

}

export function login(whoLog, email, password, lang) {

    return async(setState, dispatch) => {

        try {
           let response = await AuthService.login(whoLog, email, password);
           localStorage.setItem("token",response.data.accessToken);

           let decodedInfo = jwtDecode(response.data.accessToken);
           dispatch(change_is_filled_profile(decodedInfo.isFilledProfile));
           dispatch(change_user_type(decodedInfo.userType));
           dispatch(change_is_logged(true));
        }
        catch(e) {
            switch(e.response.data.message) {

                case "unregistered user" : {
                    showPopup(setState, langObj[lang].popupWarningUnregisteredUser, false);
                    break;
                }

                case "unconfirmed email" : {
                    showPopup(setState, langObj[lang].popupWarningEmailUnconfirmed, false);
                    break;
                }

                case "incorrect password" : {
                    showPopup(setState, langObj[lang].popupWarningIncorrectPassword, false);
                    break;
                }

                default: {
                    showPopup(setState, langObj[lang].popupWarningUnexpected, false);
                }
            }
        }
    }

}

export function logout(userType) {

    return async(dispatch) => {

        try {
            localStorage.removeItem("token");

            dispatch(change_is_logged(false)); // no matter if we can log out in the server side (since we  have already removed the token from localstorage )
            dispatch(change_is_filled_profile(false));
            dispatch(change_user_type(""));
            
            await AuthService.logout(userType);
        }   
        catch(e) {
            console.log("куда-то рефреш токен пропал, но мы его с куки удалили, так что ничего страшного");
        }  
    }

}