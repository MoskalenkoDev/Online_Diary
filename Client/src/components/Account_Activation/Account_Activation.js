import React, { Fragment, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useParams, Redirect } from 'react-router-dom';
import { dispatch } from '../../Redux/store'
import { change_is_logged, change_is_filled_profile, change_user_type } from '../../Redux/Actions/action_signup'
import './Account_Activation.scss';

import { WrappedLanguages } from '../Languages/Languages';

const langObj = {
  ua: {
    successActivation: "Аккаунт успішно активовано!",
    successLeftTime: "Ви будете перенаправлені в кабінет через ",
    failActivation: "Посилання на активацію недійсне!",
    failLeftTime: "Ви будете перенаправлені на сторінку реєстрації через ",
    seconds: " сек"
  },
  ru: {
    successActivation: "Аккаунт успешно активировано!",
    successLeftTime: "Вы будете перенаправлены в личный кабинет через ",
    failActivation: "Ссылка на активацию недействительная!",
    failLeftTime: "Вы будете перенаправлены на страницу регистрации через ",
    seconds: " сек"
  },
  en: {
    successActivation: "Account successfully activated!",
    successLeftTime: "You will redirect to profile in ",
    failActivation: "Activation link is invalid",
    failLeftTime: "You will be redirected to the registration page in ",
    seconds: " s"
  }
}

export const Account_Activation = ({ lang }) => {

  const { accessToken } = useParams();

  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (accessToken.length) { // maybe i should change redux state
      try {
        let decodedInfo = jwtDecode(accessToken);
        if (!decodedInfo.hasOwnProperty('isFilledProfile') || !decodedInfo.hasOwnProperty('userType')) throw new Error();

        localStorage.setItem("token", accessToken);
        dispatch(change_is_filled_profile(decodedInfo.isFilledProfile));
        dispatch(change_user_type(decodedInfo.userType));
        dispatch(change_is_logged(true));
        setIsSuccess(true);
      }
      catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, [])

  setTimeout(() => {
    setTimer(timer - 1)
  }, 1000);

  if(timer <= 0) {
    if(isSuccess) return (<Redirect to={"/diary_menu/profile"}/>) 
    else return (<Redirect to={"/signup"}/>)
  } 
  return (
    <div className="account_activated_wrapper">
      <WrappedLanguages />
      <div className="account_activated">
        <span className='header'>{isSuccess ? langObj[lang].successActivation : langObj[lang].failActivation}</span>
        <span>{(isSuccess ? langObj[lang].successLeftTime : langObj[lang].failLeftTime) + timer + langObj[lang].seconds}</span>
      </div>
    </div>
  );
};

