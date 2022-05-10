import { useEffect, useRef, useState } from 'react';
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "../../CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk'

import * as ActionCreators from '../../../../Redux/Actions/actions_homework';

export const TeacherAddHomework = ({ state, onHidePopup, homework_popup_active_type, school_subjects, current_class_id }) => {


    let lang = state.lang.language;
    let langObj =
    {
        ua: {
            popupHeader: "Додавання домашнього завдання",
            dataTitle: "Дата",
            requiredField: "*Обов'язкове поле",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не мають бути пустими!",
            addHomeworkBtnTitle: "Зберегти",
            editBtnTitle: "Редагувати",
            denyBtnTitle: "Відміна",
            deleteHomeworkBtnTitle: "Видалити запис",
            homeworkInputPlaceholder: "Введіть домашнє завдання..."
        },
        ru: {
            popupHeader: "Добавление домашнего задания",
            dataTitle: "Дата",
            requiredField: "*Обязательное поле",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не должны быть пустыми!",
            addHomeworkBtnTitle: "Сохранить",
            editBtnTitle: "Редактировать",
            denyBtnTitle: "Отменить",
            deleteHomeworkBtnTitle: "Удалить запись",
            homeworkInputPlaceholder: "Введите домашнее задание..."
        },
        en: {
            popupHeader: "Adding homework",
            dataTitle: "Date",
            requiredField: "*Required field",
            subjectsBtnTitle: "Subject",
            warningTitle: "All fields must be filled!",
            addHomeworkBtnTitle: "Save",
            editBtnTitle: "Edit",
            denyBtnTitle: "Cancel",
            deleteHomeworkBtnTitle: "Delete",
            homeworkInputPlaceholder: "Enter homework text..."
        }
    };

    const [is_active_drop_down, setIs_active_drop_down] = useState(false); // active_drop_down
    const [subjects_li_list, setSubjects_li_list] = useState([]);
    const [chosen_subject, setChosen_subject] = useState(null);
    const [date, setDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const selected_li = useRef();

    const onChooseSubject = (e) => {
        if (selected_li.current) selected_li.current.className = "";
        e.target.className = "selected_li";
        setChosen_subject(e.target.innerText);
        setIs_active_drop_down("");
        selected_li.current = e.target;
    }

    useEffect(() => {
        if (school_subjects) {
            const our_li_list = school_subjects.map((subject, index) => {
                return (<li key={index}>{subject}</li>)
            })
            setSubjects_li_list(our_li_list);
        }
        return () => {
            setIs_active_drop_down(false);
            setSubjects_li_list([]);
            setChosen_subject(null);
            if (selected_li.current) {
                selected_li.current.className = "";
                selected_li.current = null;
            }
        }
    }, [current_class_id]);



    const outsideRangeSelector = (day) => {
        let diff = moment(day).diff(moment(), 'M');
        if (diff < -2) return true;
        return false;
    }

    const homeworkDays = ['10.05.2022', '06.05.2022', '01.05.2022'];

    // const isDayHighlighted = date => {
    //     let isHighlighted = false;
    //     homeworkDays.forEach(hoveredDay => {
    //         moment(hoveredDay);
    //         const isDayOfMonthMatch = hoveredDay.date() === date.date();
    //         const isMonthMatch = hoveredDay.month() === date.month();
    //         const isYearMatch = hoveredDay.year() === date.year();
    //         if (isDayOfMonthMatch && isMonthMatch && isYearMatch) {
    //             isHighlighted = true;
    //         }
    //     });
    //     return isHighlighted;
    // };

    moment.locale(lang === "ua" ? "uk" : lang);
    // console.log(moment('10.05.2022', 'YYYY-MM-DD').toDate());
    return (
        <div className={"homework_popup add_homework_popup " + homework_popup_active_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className="close_popup_btn" onClick={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">

                <div className="homework_popup_input_block">

                    <div className="homework_popup_data_wrapper">


                        <div className={"subject_drop_down " + (is_active_drop_down ? "active_drop_down" : "")}>

                            <button className='subject_drop_down_btn' onClick={() => setIs_active_drop_down(!is_active_drop_down)}>
                                <span className='subject_drop_down_header_selected'>{chosen_subject || langObj[lang].subjectsBtnTitle}</span>
                            </button>

                            <ul className='drop_down_li_list' onClick={(e) => onChooseSubject(e)}>
                                {subjects_li_list}
                            </ul>

                        </div>

                        <SingleDatePicker
                            small
                            date={date} // momentPropTypes.momentObj or null
                            onDateChange={date => setDate(date)} // PropTypes.func.isRequired
                            focused={focusedInput} // PropTypes.bool
                            onFocusChange={({ focused }) => setFocusedInput(focused)} // PropTypes.func.isRequired
                            id="add_homework_popup_date_picker" // PropTypes.string.isRequired,
                            firstDayOfWeek={lang === "en" ? 0 : 1}
                            showDefaultInputIcon
                            numberOfMonths={1}
                            daySize={30}
                            anchorDirection="right"
                            isOutsideRange={outsideRangeSelector}
                            placeholder={langObj[lang].dataTitle}
                            // isDayHighlighted={isDayHighlighted}
                            // isDayHighlighted={(day) => {console.log(day); return true;}} 
                            // monthFormat="YYYY[年]MMMM"
                            // monthFormat = "MMMM YYYY"
                            // enableOutsideDays 
                            // showClearDate   
                            // initialVisibleMonth={() => moment().subtract(2, 'months')}                          // start showing from adjusted month 
                            // isDayBlocked = {(day) => true}                                                      // block all days, but only from availibles 
                            hideKeyboardShortcutsPanel

                        />

                    </div>

                    <div className="homework_popup_create_homework_message">
                        <textarea placeholder={langObj[lang].homeworkInputPlaceholder}></textarea>
                    </div>

                </div>

                <span className={"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>

                <div className="homework_popup_buttons_wrapper">
                    <button className={"gray_btn blue_btn homework_peaky_btn"}>{langObj[lang].editBtnTitle}</button>
                    <button className={"blue_btn homework_peaky_btn"} >{langObj[lang].addHomeworkBtnTitle}</button>
                </div>

            </div>

        </div>
    );

}