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
        // window.addEventListener('resize', (e) => {console.log(e)});
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
            state.dispatch(ActionCreators.cleanup_homework_li_list("homework_accepted_teachers_li_list"));
        }, 250);

    }

    let onTeacherShowPopup = () => {
        if (state.isFilledProfile) {
            state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
            setHomework_popup_active_type("homework_students_editor");
        }
        else alert(langObj[lang].alertWarningTitle);
    }

    const onWeekDaysListClisk = (e) => {
        let isOpen = !e?.nativeEvent?.path[4]?.className.includes("open_drop_down") && e?.nativeEvent?.path[2]?.className === "drop_down_with_title_content_wrapper";
        if(e.nativeEvent.path[0].className !== "drop_down_with_title_title" || isOpen) return;
        let elem = e.nativeEvent.path[1]; // the clicked element
        let children_height = e.nativeEvent.path[1].children[1].children[0].offsetHeight;
        let new_children_height = e.nativeEvent.path[1].children[1].offsetHeight > 0 ? "0px" : `${children_height}px`;

        if(!e.nativeEvent.target.parentNode.className.includes("open_drop_down") && new_children_height === "0px") return;

        elem.children[1].style.height = new_children_height; // it is assign the height of inner content
        if(e?.nativeEvent?.path[2]?.className === "drop_down_with_title_content_wrapper") {
            let main_parent = e.nativeEvent.path[3];
            let new_parent_height = +main_parent.style.height.replace("px","") + (new_children_height === "0px" ? -children_height : children_height);
            main_parent.style.height = `${new_parent_height}px`;
        }  // this is our wrapper we are styling
        
        elem.className = elem.className.includes("open_drop_down") ?
            elem.className.replace("open_drop_down", "") :
            elem.className + "open_drop_down";
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

            <div className="homework_week_days_list_wrapper">

                <ul className="homework_week_days_list" onClick={onWeekDaysListClisk}>

                    <li className='drop_down_with_title '>
                        <span className='drop_down_with_title_title'>Понеділок</span>

                        <div className="drop_down_with_title_padding_wrapper">
                            <ul className="drop_down_with_title_content_wrapper">

                                <li className='drop_down_with_title '>
                                    <span className='drop_down_with_title_title'>Хімія</span>

                                    <div className="drop_down_with_title_padding_wrapper">
                                        <div className='homework_task_wpapper'>
                                            <span>Домашня робота : вправа 133 сторінка 56-57, зробити якомога більше вправ та скинути на пошту мені.</span>
                                        </div>
                                    </div>

                                </li>

                                <li className='drop_down_with_title '>
                                    <span className='drop_down_with_title_title'>English</span>
                                    <div className="drop_down_with_title_padding_wrapper">
                                        <div className='homework_task_wpapper'>
                                            <span>Домашня робота : вправа 133 сторінка 56-57, зробити якомога більше вправ та скинути на пошту мені.</span>
                                        </div>
                                    </div>


                                </li>

                            </ul>
                        </div>

                    </li>

                    <li className='drop_down_with_title '>
                        <span className='drop_down_with_title_title'>Понеділок</span>

                        <div className="drop_down_with_title_padding_wrapper">
                            <ul className="drop_down_with_title_content_wrapper">

                                <li className='drop_down_with_title '>
                                    <span className='drop_down_with_title_title'>Хімія</span>

                                    <div className="drop_down_with_title_padding_wrapper">
                                        <div className='homework_task_wpapper'>
                                            <span>Домашня робота : вправа 133 сторінка 56-57, зробити якомога більше вправ та скинути на пошту мені.</span>
                                        </div>
                                    </div>

                                </li>

                                <li className='drop_down_with_title '>
                                    <span className='drop_down_with_title_title'>English</span>
                                    <div className="drop_down_with_title_padding_wrapper">
                                        <div className='homework_task_wpapper'>
                                            <span>Домашня робота : вправа 133 сторінка 56-57, зробити якомога більше вправ та скинути на пошту мені.</span>
                                        </div>
                                    </div>


                                </li>

                            </ul>
                        </div>

                    </li>

                </ul>

            </div>

        </div>
    );
}