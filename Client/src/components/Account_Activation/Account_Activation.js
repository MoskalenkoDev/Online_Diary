import React from 'react';
import { useParams } from 'react-router-dom';
import './Account_Activation.scss';

const langObj = {
  ua : {
    successActivation: "Аккаунт успішно активовано!"
  },
  ru : {
    successActivation: "Аккаунт успешно активировано!"
  },
  en : {
    successActivation: "Account successfully activated!"
  }
}

export const Account_Activation = ({lang}) => {

  const {isStudent, accessToken} = useParams();

  if(isStudent.length && accessToken.length) {
    localStorage.setItem("userType", isStudent);
    localStorage.setItem("token", accessToken);
  }

  return(  
      <div className="account_activated">
          <span>{langObj[lang].successActivation}</span>
      </div>  
  );
  
};

