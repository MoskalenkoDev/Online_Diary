import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions_homework';
import { WeekPicker } from '../WeekPicker';
import "../CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

import { StudentTeachersEditor } from './Popups/StudentTeachersEditor';
import { get_homework_tasks } from '../../../controllers/StudentHomeworkController';

export const StudentHomework = ({ state }) => {
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            addTeacherBtn: "Вчителі",
            yourHomework: "Домашні завдання",
            alertWarningTitle: "Спочатку заповніть дані в профілі!",
            weekDays: [
                "Понеділок",
                "Вівторок",
                "Середа",
                "Четвер",
                "П'ятниця",
                "Субота",
                "Неділя"
            ]
        },
        ru:
        {
            addTeacherBtn: "Учителя",
            yourHomework: "Домашние задания ",
            alertWarningTitle: "Сначало заполните данные в профиле!",
            weekDays: [
                "Понедельник",
                "Вторник",
                "Среда",
                "Четверг",
                "Пятница",
                "Суббота",
                "Воскресенье"
            ]
        },
        en:
        {
            addTeacherBtn: "Teachers",
            yourHomework: "Homeworks",
            alertWarningTitle: "First fill in the data in the profile!",
            weekDays: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ]
        }
    };

    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [hoveredDays, setHoveredDays] = useState();
    const [receivedHomeworkInfo, setReceivedHomeworkInfo] = useState([]);
    const [week_list, setWeek_list] = useState([]);

    const [homework_popup_active_type, setHomework_popup_active_type] = useState("homework_add_class_popup");

    useEffect(() => {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_teachers_list")); // Ставим активным первый пункт меню
        // window.addEventListener('resize', (e) => {console.log(e)});
    }, []);

    const getHomeworks = async (start_date, end_date) => {
        const homeworkInfofromDB = await get_homework_tasks(start_date, end_date);
        let newReceivedHomeworkInfo = [...receivedHomeworkInfo, ...homeworkInfofromDB];
        setReceivedHomeworkInfo(newReceivedHomeworkInfo);
        createDropDownLiList(newReceivedHomeworkInfo);
    }

    useEffect(async () => {
        if (start_date) {
            await getHomeworks(start_date, end_date);
        }
    }, [start_date])

    const createSubjectsList = (weekHomeworks) => {
        let subjectsList = [];
        weekHomeworks.forEach((record) => {
            subjectsList.push(
                <li className='drop_down_with_title '>
                    <span className='drop_down_with_title_title'>{record.subject}</span>

                    <div className="drop_down_with_title_padding_wrapper">
                        <div className='homework_task_wpapper'>
                            <span>{record.homework}</span>
                        </div>
                    </div>

                </li>
            );
        });
        return subjectsList;
    };

    const createDropDownLiList = (receivedHomeworkInfo) => {
        let weekLiList = [];
        hoveredDays.forEach((hoveredDay, index) => {
            let weekHomeworks = receivedHomeworkInfo.filter((homeworkDay) => moment(hoveredDay).isSame(moment(homeworkDay.date), 'day')); // якщо isSame працює лише на день, 
            //не враховуючи місяць та рік, то зробимо перевірку як ото було з isHighlighted().
            console.log(weekHomeworks);
            weekLiList.push((
                <li className='drop_down_with_title '>
                    <span className='drop_down_with_title_title'>{langObj[lang].weekDays[index]}</span>

                    <div className="drop_down_with_title_padding_wrapper">
                        <ul className="drop_down_with_title_content_wrapper">
                            {createSubjectsList(weekHomeworks)}
                        </ul>
                    </div>

                </li>
            ));
        });
        setWeek_list(weekLiList);
    }

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
        if (e.nativeEvent.path[0].className !== "drop_down_with_title_title" || isOpen) return;
        let elem = e.nativeEvent.path[1]; // the clicked element
        let children_height = e.nativeEvent.path[1].children[1].children[0].offsetHeight;
        let new_children_height = e.nativeEvent.path[1].children[1].offsetHeight > 0 ? "0px" : `${children_height}px`;

        if (!e.nativeEvent.target.parentNode.className.includes("open_drop_down") && new_children_height === "0px") return;

        elem.children[1].style.height = new_children_height; // it is assign the height of inner content
        if (e?.nativeEvent?.path[2]?.className === "drop_down_with_title_content_wrapper") {
            let main_parent = e.nativeEvent.path[3];
            let new_parent_height = +main_parent.style.height.replace("px", "") + (new_children_height === "0px" ? -children_height : children_height);
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

            <div id='date_picker_wrapper' className='date_picker_long_input'>
                <WeekPicker
                    start_date={start_date}
                    setStartDate={setStartDate}
                    end_date={end_date}
                    setEndDate={setEndDate}
                    hoveredDays={hoveredDays}
                    setHoveredDays={setHoveredDays}
                    lang={lang}
                />
            </div>

            <div className="homework_week_days_list_wrapper">

                <ul className="homework_week_days_list" onClick={onWeekDaysListClisk}>
                    {week_list}
                </ul>

            </div>

        </div>
    );
}