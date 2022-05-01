import React, {useEffect , useRef, useState} from 'react';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import { AddTeacherCard } from './StudentTeachersEditorComponents/AddTeacherCard';

export const StudentTeachersEditor = ({state,onHidePopup, homework_popup_active_type}) =>
{
    let lang = state.lang.language;
    

    let langObj =
    {
        ua:
        {
            popupHeader: "Вчителі",
            menuTeachers: "Вчителі",
            menuRequests : "Запити",
            menuJoin : "Додати",
        },
        ru:
        {
            popupHeader: "Учителя",
            menuTeachers: "Учителя",
            menuRequests : "Запросы",
            menuJoin : "Добавить",
        },
        en: 
        {
            popupHeader: "Teachers",
            menuTeachers: "Teachers",
            menuRequests : "Requests",
            menuJoin : "Add",
        }
    };

    let onMenuItemClick = (active_class) => {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item(active_class));
    }

    return (
        <div className= {"homework_popup teachers_and_students_editor_popup " + homework_popup_active_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className = "close_popup_btn" onClick ={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">
                <nav className = {"homework_popup_menu "  + state.homework_popup_active_menu_item}>
                    <li className = {"homework_popup_teachers_menu_teacher_list "} onClick = {() => onMenuItemClick("active_popup_menu_teachers_list")}>{langObj[lang].menuTeachers}</li>
                    <li className = {"homework_popup_teachers_menu_requests_list "} onClick = {() => onMenuItemClick("active_popup_menu_teachers_requests_list")}>{langObj[lang].menuRequests}</li>
                    <li className = {"homework_popup_teachers_menu_join"} onClick = {() => onMenuItemClick("active_popup_menu_teachers_join")}>{langObj[lang].menuJoin}</li>
                </nav>
                <div className="homework_popup_menu_item_content">

                    <AddTeacherCard state = {state} lang = {lang}/>



                </div>
            </div>

        </div>
    );
}