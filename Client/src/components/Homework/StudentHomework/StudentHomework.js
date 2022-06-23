import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions_homework';
import { WeekPicker } from '../../Calendars/WeekPicker/WeekPicker';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

import { StudentTeachersEditor } from './Popups/StudentTeachersEditor';
import { get_homework_tasks } from '../../../controllers/StudentHomeworkController';
import { WeekLiList } from '../WeekLiList';
import { SubjectLiList } from '../SubjectLiList';

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

    const [week_list, setWeek_list] = useState([]); // зберігаються лішки дз

    const [homework_popup_active_type, setHomework_popup_active_type] = useState("homework_add_class_popup");

    useEffect(() => {
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_teachers_list")); // Ставим активным первый пункт меню
    }, []);

    const getHomeworks = async (start_date, end_date) => {
        const homeworkInfofromDB = await get_homework_tasks(start_date, end_date);
        let newReceivedHomeworkInfo = [...homeworkInfofromDB]; // напевно тому , що тут воно додає. Все зрозуміло, просто робимо вибірку по старій схемі
        state.dispatch(ActionCreators.change_homework_student_homework_info(newReceivedHomeworkInfo));
    }

    useEffect(() => {
        return () => { // я хочу щоб коли мінялася дата, то списки закривалися. Бажано без анімації
            setWeek_list([]);
        }
    }, [start_date])

    let isfirstTime = useRef(true);

    useEffect(() => {
        
        if(week_list.length) return; 
        if(state.homework_student_homework_info.length && isfirstTime.current && start_date) {
            createDropDownLiList(state.homework_student_homework_info);
            isfirstTime.current = false;
        }
        else if(start_date && !isfirstTime.current) {
            createDropDownLiList(state.homework_student_homework_info);
        }
    }, [start_date, state.homework_student_homework_info, week_list])

    const createSubjectsList = (weekHomeworks) => {
        let subjectsList = [];
        weekHomeworks.forEach((record) => {
            subjectsList.push(
                <SubjectLiList
                    subjectTitle = {record.subject}
                    key = {record._id}
                    innerContent = {<span>{record.homework}</span>}
                />
            );
        });
        return subjectsList;
    };

    const createDropDownLiList = (receivedHomeworkInfo) => {
        let weekLiList = [];
        hoveredDays.forEach((hoveredDay, index) => {
            let weekHomeworks = receivedHomeworkInfo.filter((homeworkDay) => moment(hoveredDay).isSame(moment(homeworkDay.date), 'day')); // якщо isSame працює лише на день, 
            //не враховуючи місяць та рік, то зробимо перевірку як ото було з isHighlighted().
            let subjectList = createSubjectsList(weekHomeworks);
            weekLiList.push((
                <WeekLiList
                    isContainSubjects = {subjectList.length}
                    weekTitle = {langObj[lang].weekDays[index]}
                    innerContent = {subjectList}
                    key = {langObj[lang].weekDays[index]}
                />
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

    let changeStartAndEndDate = (newDatesArr) => {
        state.dispatch(ActionCreators.change_homework_student_start_and_end_date(newDatesArr));
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
                    getDataFromDB={getHomeworks}
                    startAndEndDate = {state.homework_student_start_and_end_date}
                    changeStartAndEndDate = {changeStartAndEndDate}
                    lang={lang}
                />
            </div>

            <div className="homework_week_days_list_wrapper">

                <ul className="homework_week_days_list">
                    {week_list}
                </ul>

            </div>

        </div>
    );
}

