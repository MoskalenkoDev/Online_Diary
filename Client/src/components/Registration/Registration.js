import React,{Component} from 'react';
import './Registration.scss';
import logo from "../../images/logo2.png";
import Axios from 'axios';
import {Link ,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {WrappedLanguages} from '../Languages/Languages';
import * as actionCreators from '../../Redux/Actions/actions';

import { registration, login, showPopup } from '../../controllers/AuthController';

const langObj = {
  ua: {
    backBtn: "Назад",
    singInBtn : "Вхід",
    regBtn : "Реєстрація",
    student : "Учень",
    teacher : "Вчитель",
    email : "Пошта",
    password : "Пароль",
    popupTitleEmail : "Неправильно введений логін або пароль!",
    popupTitlePassword : "Користувач під таким логіном вже зареєстрований!",
    popupWarningEmailLettersCount : "Логін повинен бути не меньше 3-x символів!",
    popupWarningPasswordLettersCount : "Пароль повинен бути не меньше 6-ти символів!",
    submitBtnLogin : "Увійти",
    subitBtnReg : "Зареєструватися"
  },
  ru: {
    backBtn: "Назад",
    singInBtn : "Вход",
    regBtn : "Регистрация",
    student : "Ученик",
    teacher : "Учитель",
    email : "Почта",
    password : "Пароль",
    popupTitleEmail : "Логин или пароль введен неверно!",
    popupTitlePassword : "Пользователь под таким логином уже зарегистрирован!",
    popupWarningEmailLettersCount : "Логин делжен быть не меньше 3-x символов!",
    popupWarningPasswordLettersCount : "Пароль делжен быть не меньше 6-ти символов!",
    submitBtnLogin : "Войти",
    subitBtnReg : "Зарегистрироваться"
  },
  en: {
    backBtn : "back",
    singInBtn : "Sign in",
    regBtn : "Sign up",
    student : "Student",
    teacher : "Teacher",
    email : "Email",
    password : "Password",
    popupTitleEmail : "Incorrect email or password!",
    popupTitlePassword : "This username is already taken!",
    popupWarningEmailLettersCount : "Login must be at least 3 characters!",
    popupWarningPasswordLettersCount : "Password must be at least 6 characters!",
    submitBtnLogin : "Sign in",
    subitBtnReg : "Sign up"
  }
}

export default class Registration extends Component
{

  state = {
    what_checked : "login", // what is checked now                 
    whoLog : "student",                                         
    email : "",                                                 
    password: "",                                               
    redirect : false, // if true, we go to the next page        
    popupTitle : "" ,                                          
    show_popup : false,                                         
    warning_title_class: "warning" // or success 
  }

  onBtn_click = (what_checked) =>
  {
    this.setState({what_checked});
    // this.props.dispatch(actionCreators.change_what_checked(whatChecked));
  }

  onEmailChanging = (e) =>
  {
    if(!e.target.value.includes(" ")) this.setState({email: e.target.value});
    // if(!e.target.value.includes(" ")) this.props.dispatch(actionCreators.change_email(e.target.value)); // here we block the email with spaces
  }

  onPasswordChanging = (e) =>
  {
    if(!e.target.value.includes(" ")) this.setState({password: e.target.value});
    // if(!e.target.value.includes(" "))  this.props.dispatch(actionCreators.change_password(e.target.value)); // here we block the password with spaces
  }

  componentDidMount = () => {
    this.setState = this.setState.bind(this); // if i will pass this.setState as param to showPopup() we'll get Error. That's why we should bind this before
  }

  componentDidUpdate = (prevProps, prevState) =>
  {
    if(this.state.redirect === true && prevState.redirect != true)
    {
      localStorage.setItem("userType", this.state.whoLog);
      this.setState({redirect : false})
      // this.props.dispatch(actionCreators.change_redirect(false)); // тут надо перезатирать значения потому что это редакс
    }
  }

  login = async (lang) => // if our login details is correct we gain access
  {
    await login(this.state.whoLog, this.state.email, this.state.password, lang)(this.setState);
  }

  registration = async (lang) => { // if our signup details is correct we gain access
    await registration(this.state.whoLog, this.state.email, this.state.password, lang)(this.setState);
  }

  regOrLog = (lang) => {
    if(this.state.email.length < 3) showPopup(this.setState, langObj[lang].popupWarningEmailLettersCount, false);
    else if(this.state.password.length < 6) showPopup(this.setState, langObj[lang].popupWarningPasswordLettersCount, false);
    else this.state.what_checked === "login"? this.login(lang) : this.registration(lang);
  }

  switcherClass = (who) =>
  {
    return who === this.state.whoLog ? "active_switcher" : "";
  }

  render() 
  {       
    let lang = this.props.lang.language;
    if(localStorage.getItem('token'))
    {
      return (<Redirect to = "/diary_menu/profile" />)
    }
    const headline = this.state.what_checked === "login" ? langObj[lang].submitBtnLogin : langObj[lang].subitBtnReg;

    let popupClass = this.state.show_popup ? "active" : "off";

    const isLog =  this.state.what_checked === "login" ? "active" : "";
    const isReg =  this.state.what_checked === "registration" ? "active" : "";
    
    return(
      <div className="reg_wrapper">
         <Link to = "/"><button id = "back_btn" className = "linkTo_btn">{langObj[lang].backBtn}</button></Link>
         <WrappedLanguages/>
          <div className = "reg_container">

            <img src={logo} id= "logo" alt=""/>
            <div className="regOrLogin_buttons">
              <button id = "login" className= {isLog} onClick = {() => this.onBtn_click("login")}>{langObj[lang].singInBtn}</button>
              <button id = "reg" className= {isReg} onClick = {() => this.onBtn_click("registration")} >{langObj[lang].regBtn}</button>
            </div>

            <div className="switchers_block">

              <div className = {"switcher " + this.switcherClass("student")} onClick = {() => this.setState({whoLog: "student"})}>
                <div className="spandot_wrapper">
                    <div className="dot"></div>
                    <span>{langObj[lang].student}</span>
                </div>
              </div>

              <div className = {"switcher " + this.switcherClass("teacher")} onClick = {() => this.setState({whoLog: "teacher"})}>
                <div className="spandot_wrapper">
                  <div className="dot"></div>
                  <span>{langObj[lang].teacher}</span>
                </div>
              </div>

            </div>

            <div className="form">

              <div className="input_wrapper">
                <input type="text" name="username" placeholder={langObj[lang].email} onChange = {this.onEmailChanging} value = {this.state.email}></input>
                <input type="password" name="password" placeholder={langObj[lang].password} onChange = {this.onPasswordChanging} value = {this.state.password}></input>
              </div>
              <div className={"warning_span_wrapper " + this.state.warning_title_class}><span className = {popupClass}>{this.state.popupTitle}</span></div>
              <button  id = "submit_btn" onClick = {() => this.regOrLog(lang)}>{headline}</button>

            </div>

          </div>

      </div>

    );  
  };
  
};

// const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
// {
//   return{...state.registrationState}
// }

// export const WrappedRegistration = connect(mapStateToProps)(Registration);