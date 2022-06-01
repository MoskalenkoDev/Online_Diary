import React, {useEffect ,useRef} from 'react';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';
import {TeacherCopyClassInviteLink} from './TeacherStudentsEditorComponents/TeacherCopyClassInviteLink';
import {RequestsToJoinClass} from './TeacherStudentsEditorComponents/RequestsToJoinClass';
import {StudentSubscribers} from './TeacherStudentsEditorComponents/StudentSubscribers';

export const TeacherStudentsEditor= ({state,invite_link,homework_popup_active_type,onHidePopup,showSuccessMessage}) =>
{
    let lang = state.lang.language;
    let langObj = {
        ua: {
            popupHeader: "Студенти",
            menuStudents: "Студенти",
            menuRequests : "Запити",
            menuInvite : "Посилання",
        },
        ru: {
            popupHeader: "Студенты",
            menuStudents: "Студенты",
            menuRequests : "Запросы",
            menuInvite : "Ссылка",
        },
        en: {
            popupHeader: "Students",
            menuStudents: "Students",
            menuRequests : "Requests",
            menuInvite : "Invite link",
        }
    };

    let onMenuItemClick = (active_class) => {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item(active_class));
    }

    let prevActiveMenuItem = useRef();

    return (
        <div className= {"homework_popup teachers_and_students_editor_popup " + homework_popup_active_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className = "close_popup_btn" onClick ={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">
                <nav className = {"homework_popup_menu "  + state.homework_popup_active_menu_item}>
                    <li className = {"homework_popup_students_menu_students_list "} onClick = {() => onMenuItemClick("active_popup_menu_students_list")}>{langObj[lang].menuStudents}</li>
                    <li className = {"homework_popup_students_menu_requests_list "} onClick = {() => onMenuItemClick("active_popup_menu_requests_list")}>{langObj[lang].menuRequests}</li>
                    <li className = {"homework_popup_students_menu_invite_link "} onClick = {() => onMenuItemClick("active_popup_menu_invite_link")}>{langObj[lang].menuInvite}</li>
                </nav>
                
                <div className="homework_popup_menu_item_content">

                    <TeacherCopyClassInviteLink 
                        state = {state} 
                        invite_link = {invite_link} 
                        showSuccessMessage = {showSuccessMessage}
                    />

                    <RequestsToJoinClass state = {state} class_id = {invite_link} lang = {lang} prevActiveMenuItem = {prevActiveMenuItem}/>

                    <StudentSubscribers state = {state} class_id = {invite_link} lang = {lang} prevActiveMenuItem = {prevActiveMenuItem}/>

                </div>
            </div>

        </div>
    );
}