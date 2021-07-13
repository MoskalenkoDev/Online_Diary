import React, {useEffect ,useRef} from 'react';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';


export const StudentTeachersEditor = ({state,onHidePopup}) =>
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
            searchTeacherTitle: "Пошук",
            sendBtnTitle : "Відправити",
            joinDescription: "Вставте посилання...",
        },
        ru:
        {
            popupHeader: "Учителя",
            menuTeachers: "Учителя",
            menuRequests : "Запросы",
            menuJoin : "Добавить",
            searchTeacherTitle: "Поиск",
            sendBtnTitle : "Отправить",
            joinDescription: "Вставьте ссылку...",
        },
        en: 
        {
            popupHeader: "Teachers",
            menuTeachers: "Teachers",
            menuRequests : "Requests",
            menuJoin : "Add",
            searchTeacherTitle: "Search",
            sendBtnTitle : "Send",
            joinDescription: "Enter a link...",
        }
    };

    let timer_copy_popup = useRef(null);

    let onCopyInviteLink = () =>
    {
        window.clearTimeout(timer_copy_popup.current);
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
                    <li className = {"homework_popup_teachers_menu_teacher_list "} onClick = {() => onMenuItemClick("active_popup_menu_teachers_list")}>{langObj[lang].menuTeachers}</li>
                    <li className = {"homework_popup_teachers_menu_requests_list "} onClick = {() => onMenuItemClick("active_popup_menu_teachers_requests_list")}>{langObj[lang].menuRequests}</li>
                    <li className = {"homework_popup_teachers_menu_join"} onClick = {() => onMenuItemClick("active_popup_menu_teachers_join")}>{langObj[lang].menuJoin}</li>
                </nav>
                <div className="homework_popup_menu_item_content">

                    <div className = {"homework_popup_menu_item_content_join " + state.homework_popup_active_menu_item}>

                        <div className="homework_popup_menu_item_content_join_inner_content">

                            <div className="homework_popup_menu_item_content_join_input_wrapper">
                                <input type="text" placeholder = {langObj[lang].joinDescription}/>
                                <button className = "blue_btn homework_popup_btn">{langObj[lang].searchTeacherTitle}</button>
                            </div>

                        </div>

                        <div className="homework_popup_menu_item_content_teacher_card ">
                            <div className="homework_popup_menu_item_content_teacher_card_img_wrapper">
                                <img src= 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDIFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMS44OCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wTU09J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8nPgogIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnN0b2NrOjlmODU2NzNjLTEyZDEtNDkwZS05ODZmLWIwNDFiM2Q2MzczODwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjFhYzVkYTFjLTM5ODQtNGVhNy05YTFiLWYyNzMzOTk4YTkyODwveG1wTU06SW5zdGFuY2VJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMXIiQiHiQcHh8e/9sAQwEFBQUHBgcOCAgOHhQRFB4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e/8AAEQgBaAFoAwERAAIRAQMRAf/EABwAAQACAwEBAQAAAAAAAAAAAAAFBgEDBAcCCP/EADsQAQABAwICBQgJBAIDAAAAAAABAgMEBREVIQYxQVSTEiJVYXGRktETJEJScoGhscEUIzNi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' alt="not found" />
                            </div>
                            <div className="homework_popup_menu_item_content_teacher_card_info_block">
                                <span className = "teacher_fio">Стукало Анатолий Михайлович</span>
                                <span className = "teacher_school">Школа : Центральненська ЗОШ 1-3ст</span>
                                <span className = "teacher_school">Предметы - Биология,Химия</span>
                            </div>
                            <button className = " green_btn homework_popup_btn request_btn">{langObj[lang].sendBtnTitle}</button>
                        </div>

                    </div>



                </div>
            </div>

        </div>
    );
}