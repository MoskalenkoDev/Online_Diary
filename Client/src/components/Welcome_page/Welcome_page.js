import React,{Component} from 'react';
import "./Welcome_page.scss";
import book from "../../images/book2.png";
import {Link} from 'react-router-dom';
import {WrappedLanguages} from '../Languages/Languages';
export default class Welcome_page extends Component
{
  langObj = {

    ua: {
      whatIsItTitle :"Що таке онлайн щоденник?",
      whatIsItAbout : `Онлайн щоденник - це зручний спосіб контролю своїх оцінок і домашнього завдання.\n`+
                      `Вчителі можуть додавати домашнє завдання своїм класам, ставити оцінки учням і підраховувати річні оцінки.\n`+
                      `А учні - зручно дізнаватися домашнє завдання і переглядати свої оцінки.\n`,
      login_btn_title : "Вхід"
    },
    ru: {
      whatIsItTitle : "Что такое онлайн дневник?",
      whatIsItAbout : `Онлайн дневник - это удобный способ контроля своих оценок и домашнего задания.\n` +
                      `Учителя могут добавлять домашнее задание своим классам, ставить оценки ученикам и подсчитывать годовые оценки.\n` +
                      `А ученики -  удобно узнавать домашнее задание и просматривать свои оценки.\n`,
      login_btn_title : "Вход"
    },
    en: {
      whatIsItTitle : "What is an online diary?",
      whatIsItAbout: `An online diary is a convenient way to keep track of your grades and homework.\n` +
                     `Teachers can add homework to their classes, grade students, and calculate annual grades.\n` +
                     `And for students it is convenient to get info about their grades and homework.`,
      login_btn_title : "Sign in"
    }
  };

  render() 
  {  
    let lang = this.props.lang.language;
    return(
      <div className = "welcome_wrapper">
        <Link to = "/signup"><button id = "login_btn" className = "linkTo_btn">{this.langObj[lang].login_btn_title}</button></Link>
        <WrappedLanguages/>
        <div className="welcome_body">
          
          <div className="welcome_whatIsIt">
            <h1>{this.langObj[lang].whatIsItTitle}</h1>
            <p>
              {this.langObj[lang].whatIsItAbout}
            </p>
          </div>
          
          <img src= {book} alt="" id = "dairy"/>
        </div>
      </div>
    );  
  };
  
};