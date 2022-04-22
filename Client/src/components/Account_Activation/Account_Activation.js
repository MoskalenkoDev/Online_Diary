import React from 'react';
import jwtDecode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import {dispatch} from '../../Redux/store'
import { change_is_logged, change_is_filled_profile, change_user_type } from '../../Redux/Actions/action_signup'
import './Account_Activation.scss';

const langObj = {
  ua: {
    successActivation: "Аккаунт успішно активовано!"
  },
  ru: {
    successActivation: "Аккаунт успешно активировано!"
  },
  en: {
    successActivation: "Account successfully activated!"
  }
}

export const Account_Activation = ({ lang }) => {

  const { accessToken } = useParams();

  if (accessToken.length) { // maybe i should change redux state
    localStorage.setItem("token", accessToken);
    let decodedInfo = jwtDecode(accessToken);
    dispatch(change_is_filled_profile(decodedInfo.isFilledProfile));
    dispatch(change_user_type(decodedInfo.userType));
    dispatch(change_is_logged(true));
  }

  return (
    <div className="account_activated">
      <span>{langObj[lang].successActivation}</span>
    </div>
  );

};

