import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions_homework';
import Axios from 'axios';
import { StudentTeachersEditor } from './Popups/StudentTeachersEditor';

export const StudentHomework = ({ state }) => {
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            addTeacherBtn: "Вчителі",
            yourHomework: "Домашні завдання",
            alertWarningTitle: "Спочатку заповніть дані в профілі!"
        },
        ru:
        {
            addTeacherBtn: "Учителя",
            yourHomework: "Домашние задания ",
            alertWarningTitle: "Сначало заполните данные в профиле!"
        },
        en:
        {
            addTeacherBtn: "Teachers",
            yourHomework: "Homeworks",
            alertWarningTitle: "First fill in the data in the profile!"
        }
    };


    const [homework_popup_active_type, setHomework_popup_active_type] = useState("homework_add_class_popup");

    useEffect(() => {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_teachers_list")); // Ставим активным первый пункт меню
    }, []);

    let timer = useRef(null);
    let onHidePopup = () => {
        window.clearTimeout(timer.current);
        state.dispatch(ActionCreators.change_homework_show_popup_class(""));
        window.setTimeout(() => {
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""));
            if (state.homework_popup_active_menu_item !== "active_popup_menu_teachers_list") {
                state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_teachers_list"));
            }
        }, 250);

    }

    let onTeacherShowPopup = () => {
        if (state.isFilledProfile) {
            state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
            setHomework_popup_active_type("homework_students_editor");
        }
        else alert(langObj[lang].alertWarningTitle);
    }

    return (
        <div className="homework_wrapper">

            <div className="homework_header">
                <span>{langObj[lang].yourHomework}</span>
                <button className="homework_add_btn blue_btn" onClick={onTeacherShowPopup}>{langObj[lang].addTeacherBtn}</button>
            </div>

            <div className={"homework_popup_wrapper " + state.homework_popup_class}>
                <StudentTeachersEditor
                    state={state}
                    onHidePopup={onHidePopup}
                    homework_popup_active_type={homework_popup_active_type}
                />
            </div>

        </div>
    );
}