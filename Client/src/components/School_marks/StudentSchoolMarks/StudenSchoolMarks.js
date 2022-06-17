import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/action_school_marks';
import moment from 'moment';

import { WeekPicker } from '../../Homework/WeekPicker';
import { WeekLiList } from '../../Homework/WeekLiList';
import { SubjectLiList } from '../../Homework/SubjectLiList';
import {student_get_marks} from '../../../controllers/TeacherMarksController';
export const StudentSchoolMarks = ({state}) => {

    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            yourMarks: "Оцінки",
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
            yourMarks: "Оценки",
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
            yourMarks: "Marks",
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

    // const getHomeworks = async (start_date, end_date) => {
    //     const homeworkInfofromDB = await get_homework_tasks(start_date, end_date);
    //     let newReceivedHomeworkInfo = [...homeworkInfofromDB]; // напевно тому , що тут воно додає. Все зрозуміло, просто робимо вибірку по старій схемі
    //     state.dispatch(ActionCreators.change_homework_student_homework_info(newReceivedHomeworkInfo));
    // }

    const getMarks = async(start_date, end_date) => {
        const marksInfo = await student_get_marks(start_date, end_date);
        console.log(marksInfo);
    }
    useEffect(() => {
        return () => { // я хочу щоб коли мінялася дата, то списки закривалися. Бажано без анімації
            setWeek_list([]);
        }
    }, [start_date])

    let isfirstTime = useRef(true);

    useEffect(() => {
        
        if(week_list.length) return; 
        if(state.school_marks_student_marks_info.length && isfirstTime.current && start_date) {
            createDropDownLiList(state.school_marks_student_marks_info);
            isfirstTime.current = false;
        }
        else if(start_date && !isfirstTime.current) {
            createDropDownLiList(state.school_marks_student_marks_info);
        }
    }, [start_date, state.school_marks_student_marks_info, week_list])

    const createMarksList = (weekMarks) => {
        let marksList = [];
        weekMarks.forEach((record) => {
            marksList.push(
                <SubjectLiList
                    subjectTitle = {record.subject}
                    key = {record._id}
                    homework = {record.marks}
                />
            );
        });
        return marksList;
    };

    const createDropDownLiList = (receivedMarksInfo) => {
        let weekLiList = [];
        hoveredDays.forEach((hoveredDay, index) => {
            let weekMarks = receivedMarksInfo.filter((homeworkDay) => moment(hoveredDay).isSame(moment(homeworkDay.date), 'day')); // якщо isSame працює лише на день, 
            //не враховуючи місяць та рік, то зробимо перевірку як ото було з isHighlighted().
            let marksList = createMarksList(weekMarks);
            weekLiList.push((
                <WeekLiList
                    isContainSubjects = {marksList.length}
                    weekTitle = {langObj[lang].weekDays[index]}
                    innerContent = {marksList}
                    key = {langObj[lang].weekDays[index]}
                />
            ));
        });
        setWeek_list(weekLiList);
    }

    let changeStartAndEndDate = (newDatesArr) => {
        state.dispatch(ActionCreators.school_marks_change_student_start_and_end_date(newDatesArr));
    }

    return (
        <div className="homework_wrapper">

            <div className="homework_header">
                <span>{langObj[lang].yourMarks}</span>
            </div>

            <div id='school_marks_date_picker_wrapper' className='date_picker_long_input'> {/**/}
                <WeekPicker
                    start_date={start_date}
                    setStartDate={setStartDate}
                    end_date={end_date}
                    setEndDate={setEndDate}
                    hoveredDays={hoveredDays}
                    setHoveredDays={setHoveredDays}
                    getDataFromDB={getMarks}
                    startAndEndDate = {state.school_marks_student_start_and_end_date}
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