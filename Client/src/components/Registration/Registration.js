import React,{Component} from 'react';
import './Registration.scss';
import logo from "../../images/logo2.png";
import Axios from 'axios';
import {Link ,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {WrappedLanguages} from '../Languages/Languages';
import * as actionCreators from '../../Redux/Actions/actions';
const md5 = require('md5');

class  Registration extends Component
{
  
  langObj = 
  {
    ua: 
    {
      backBtn: "Назад",
      singInBtn : "Вхід",
      regBtn : "Реєстрація",
      student : "Учень",
      teacher : "Вчитель",
      email : "Пошта",
      password : "Пароль",
      popupTitleEmail : "Неправильно введений логін або пароль!",
      popupTitlePassword : "Користувач під таким логіном вже зареєстрований!",
      popupWarningTitle : "Логін та пароль повинні бути не меньше 5-ти символів!",
      submitBtnLogin : "Увійти",
      subitBtnReg : "Зареєструватися"
    },
    ru:
    {
      backBtn: "Назад",
      singInBtn : "Вход",
      regBtn : "Регистрация",
      student : "Ученик",
      teacher : "Учитель",
      email : "Почта",
      password : "Пароль",
      popupTitleEmail : "Логин или пароль введен неверно!",
      popupTitlePassword : "Пользователь под таким логином уже зарегистрирован!",
      popupWarningTitle : "Логин и пароль должны быть не меньше 5-ти символов!",
      submitBtnLogin : "Войти",
      subitBtnReg : "Зарегистрироваться"
    },
    en:
    {
      backBtn : "back",
      singInBtn : "Sign in",
      regBtn : "Sign up",
      student : "Student",
      teacher : "Teacher",
      email : "Email",
      password : "Password",
      popupTitleEmail : "Incorrect email or password!",
      popupTitlePassword : "This username is already taken!",
      popupWarningTitle : "Email and password must be at least 5 characters!",
      submitBtnLogin : "Sign in",
      subitBtnReg : "Sign up"
    }
  }

  onBtn_click = (whatChecked) =>
  {
    this.props.dispatch(actionCreators.change_what_checked(whatChecked));
  }

  onEmailChanging = (e) =>
  {
    if(!e.target.value.includes(" ")) this.props.dispatch(actionCreators.change_email(e.target.value)); // here we block the email with spaces
  }

  onPasswordChanging = (e) =>
  {
    if(!e.target.value.includes(" "))  this.props.dispatch(actionCreators.change_password(e.target.value)); // here we block the password with spaces
  }

  componentDidUpdate = (prevProps) =>
  {
    if(this.props.redirect === true && prevProps.redirect != true)
    {
      localStorage.setItem("userToken", md5(this.props.email) );
      localStorage.setItem("status", this.props.whoLog);
      this.props.dispatch(actionCreators.change_redirect(false)); // тут надо перезатирать значения потому что это редакс
    }
  }

  timer; // timestamp for clearTimeout()

  login = (lang) => // if our login details is correct we gain access
  {
    
    let hashedPass = md5(this.props.password);
    Axios.post(`http://localhost:3001/${this.props.whoLog}/login`,
    {
      email : this.props.email,
      password :  hashedPass
    })
    .then((response) =>
    {
      if(response.status === 200)
      {
        this.props.dispatch(actionCreators.change_redirect(true)); 
      }
      else 
      {
        clearTimeout(this.timer);
        this.props.dispatch(actionCreators.change_popup_title(this.langObj[lang].popupTitleEmail));// if incorrect we report about it our popupTitle in the state
        this.props.dispatch(actionCreators.change_show_popup(true));
        this.timer = setTimeout(() =>
        {
          this.props.dispatch(actionCreators.change_show_popup(false));
        }, 4000);
      }
       
    })
  }

  registration = (lang) => // if our signup details is correct we gain access
  {
    
    let hashedPass = md5(this.props.password);
    Axios.post(`http://localhost:3001/${this.props.whoLog}/signup`,
    {
      email : this.props.email,
      password : hashedPass,
    })
    .then((response) =>
    {
      if(response.status === 200)
      {
        this.props.dispatch(actionCreators.change_redirect(true)); 
      }
      else 
      {
        clearTimeout(this.timer);
        this.props.dispatch(actionCreators.change_popup_title(this.langObj[lang].popupTitlePassword)); // if incorrect we report about it our popupTitle in the state
        this.props.dispatch(actionCreators.change_show_popup(true));
        this.timer = setTimeout(() =>
        {
          this.props.dispatch(actionCreators.change_show_popup(false));
        }, 4000);
      } 
    })
  }

  regOrLog = (lang) =>
  {
    if( !(this.props.email.length < 5 || this.props.password.length < 5)) this.props.what_checked === "login"? this.login(lang) : this.registration(lang);
    else 
    {
      clearTimeout(this.timer);
      this.props.dispatch(actionCreators.change_popup_title(this.langObj[lang].popupWarningTitle));
      this.props.dispatch(actionCreators.change_show_popup(true));
      this.timer = setTimeout(() =>
      {
        this.props.dispatch(actionCreators.change_show_popup(false));
      }, 4000);
    }
  }

  switcherClass = (who) =>
  {
    return who === this.props.whoLog ? "active_switcher" : "";
  }

  render() 
  {       
    let lang = this.props.lang.language;
    if(localStorage.getItem('userToken'))
    {
      return (<Redirect to = "/diary_menu/profile" />)
    }
    const headline = this.props.what_checked === "login" ? this.langObj[lang].submitBtnLogin : this.langObj[lang].subitBtnReg;

    let popupClass = this.props.show_popup ? "active" : "off";

    const isLog =  this.props.what_checked === "login" ? "active" : "";
    const isReg =  this.props.what_checked === "registration" ? "active" : "";
    
    return(
      <div className="reg_wrapper">
         <Link to = "/"><button id = "back_btn" className = "linkTo_btn">{this.langObj[lang].backBtn}</button></Link>
         <WrappedLanguages/>
          <div className = "reg_container">

            <img src={logo} id= "logo" alt=""/>
            <div className="regOrLogin_buttons">
              <button id = "login" className= {isLog} onClick = {() => this.onBtn_click("login")}>{this.langObj[lang].singInBtn}</button>
              <button id = "reg" className= {isReg} onClick = {() => this.onBtn_click("registration")} >{this.langObj[lang].regBtn}</button>
            </div>

            <div className="switchers_block">

              <div className = {"switcher " + this.switcherClass("student")} onClick = {() => this.props.dispatch(actionCreators.change_who_log("student"))}>
                <div className="spandot_wrapper">
                    <div className="dot"></div>
                    <span>{this.langObj[lang].student}</span>
                </div>
              </div>

              <div className = {"switcher " + this.switcherClass("teacher")} onClick = {() => this.props.dispatch(actionCreators.change_who_log("teacher"))}>
                <div className="spandot_wrapper">
                  <div className="dot"></div>
                  <span>{this.langObj[lang].teacher}</span>
                </div>
              </div>

            </div>

            <div className="form">

              <div className="input_wrapper">
                <input type="text" name="username" placeholder={this.langObj[lang].email} onChange = {this.onEmailChanging} value = {this.props.email}></input>
                <input type="password" name="password" placeholder={this.langObj[lang].password} onChange = {this.onPasswordChanging} value = {this.props.password}></input>
              </div>
              <div className="span_wrapper"><span className = {popupClass}>{this.props.popupTitle}</span></div>
              <button  id = "submit_btn" onClick = {() => this.regOrLog(lang)}>{headline}</button>

            </div>

          </div>

      </div>

    );  
  };
  
};

const mapStateToProps = (state) => // кладет стейт в качестве пропса в наш компонент (который мы законектили)
{
  return{...state.registrationState}
}

export const WrappedRegistration = connect(mapStateToProps)(Registration);