import React, {useEffect ,useRef} from 'react';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';


export const TeacherStudentsEditor= ({state,onHidePopup}) =>
{
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            popupHeader: "Студенти",
            menuStudents: "Студенти",
            menuRequests : "Запити",
            menuInvite : "Посилання",
            inviteLinkDescription: "Це посилання для реєстрації на ваш курс. Відправте його своїм учням.",
        },
        ru:
        {
            popupHeader: "Студенты",
            menuStudents: "Студенты",
            menuRequests : "Запросы",
            menuInvite : "Ссылка",
            inviteLinkDescription: "Это ссылка для регистрации на ваш курс.Скиньте ее своим ученикам.",
        },
        en: 
        {
            popupHeader: "Students",
            menuStudents: "Students",
            menuRequests : "Requests",
            menuInvite : "Invite link",
            inviteLinkDescription: "This is a link to an invitation to your course.Send this to your students.",
        }
    };

    let timer_copy_popup = useRef(null);

    let onCopyInviteLink = () =>
    {
        window.clearTimeout(timer_copy_popup.current);
        navigator.clipboard.writeText(state.invite_link);
        state.dispatch(ActionCreators.change_homework_show_invite_link_popup_class("active_invite_copy_link_popup"));
        timer_copy_popup.current = setTimeout(() =>
        {
            state.dispatch(ActionCreators.change_homework_show_invite_link_popup_class(""));
        },2000);
    }

    let onMenuItemClick = (active_class) =>
    {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item(active_class));
    }

    return (
        <div className= {"homework_popup teachers_and_students_editor_popup " + state.homework_popup_active_type}>

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

                    <div className = {"homework_popup_menu_item_content_invite_link " + state.homework_popup_active_menu_item}>
                        <div className="homework_popup_menu_item_content_invite_link_inner_content">

                            <div className="homework_popup_menu_item_content_invite_link_input_wrapper">
                                <input type="text" value = {state.invite_link} readOnly/>
                                <button className = "homework_grey_btn invite_link_copy_btn" onClick = {onCopyInviteLink}></button>
                            </div>
                            <span>{langObj[lang].inviteLinkDescription}</span>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}