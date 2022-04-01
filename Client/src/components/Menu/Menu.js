import React,{Component} from 'react';
import { Route , NavLink, Redirect , Link} from 'react-router-dom';
import './Menu.scss';

import profile_pic from '../../images/user.png';
import homework_pic from '../../images/homework.png';
import school_marks_pic from '../../images/exam.png';

export default class Menu extends Component
{
  
  langObj =
  {
    ua : 
    {
      profile: "Профіль",
      homework: "Домашня работа",
      grades: "Оцінки"
    },
    ru : 
    {
      profile: "Профиль",
      homework: "Домашняя работа",
      grades: "Оценки"
    },
    en :
    {
      profile: "Profile",
      homework: "Homework",
      grades: "Grades"
    }
  }
  render() 
  {  
    let lang = this.props.lang.language;
    // if(!localStorage.getItem('token')) return ( <Redirect from = "/diary_menu/profile" to = "/signup"/>);
    return(
      <div className = "menu_wrapper">
      
        <nav className = "main_nav">
          <NavLink to = "/diary_menu/profile" activeClassName = {'active_menu_item'}><div className="a_inner_wrapper"><img src={profile_pic} alt="Профиль"/><span>{this.langObj[lang].profile}</span></div></NavLink>
          <NavLink to = "/diary_menu/homework" activeClassName = {'active_menu_item'}><div className="a_inner_wrapper"><img src={homework_pic} alt="Домашняя работа"/> <span>{this.langObj[lang].homework}</span></div></NavLink>
          <NavLink to = "/diary_menu/marks" activeClassName = {'active_menu_item'}><div className="a_inner_wrapper"><img src={school_marks_pic} alt="Оценки"/> <span>{this.langObj[lang].grades}</span></div></NavLink>
        </nav>
        
      </div>
    );  
  };
  
};

