import React, { useEffect, useRef, useState } from 'react';
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "../../../Homework/CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import * as ActionCreators from '../../../../Redux/Actions/action_school_marks';
import { DropDownSubjectsList } from '../../../DropDownSubjectsList/DropDownSubjectsList';
import { get_student_subscribers } from '../../../../controllers/TeacherHomeworkController';
import { SignleDayPicker } from '../../../Calendars/SingleDayPicker/SingleDayPicker';
import defaultImg from '../../../Profile/default_user_image.js';

export const AddMarksPopup = ({ lang, class_id, school_marks_popup_type, onHidePopup, school_subjects, }) => {
    let langObj =
    {
        ua: {
            popupHeader: "Додавання домашнього завдання",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не мають бути пустими!",
            addHomeworkBtnTitle: "Зберегти",
            successAddedMessage: "Завдання додано",
        },
        ru: {
            popupHeader: "Добавление домашнего задания",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не должны быть пустыми!",
            addHomeworkBtnTitle: "Сохранить",
            successAddedMessage: "Задание добавлено",
        },
        en: {
            popupHeader: "Adding homework",
            subjectsBtnTitle: "Subject",
            warningTitle: "All fields must be filled!",
            addHomeworkBtnTitle: "Save",
            successAddedMessage: "Homework added",
        }
    }

    const [actualStudentsInClass, setActualStudentsInClass] = useState([]);
    const [deletedStudentsInClass, setDeletedStudentsInClass] = useState([]);

    const [marksInfoFromDB, setMarksInfoFromDB] = useState([]);
    const [chosen_subject, setChosen_subject] = useState(null);
    const [date, setDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);

    let getActualStudentsInClass = async () => {
        const studentsInfo = await get_student_subscribers(class_id);
        setActualStudentsInClass(studentsInfo);
    }

    const getRecordsFromDB = async (start_date, end_date) => {
        console.log(start_date, end_date);
    }

    const compareDate = (firstDate, secondDate) => {
        return moment(firstDate).isSame(secondDate, 'date');
    }

    const onSaveClick = () => {
        console.log("Saving data");
    }

    const onDateChange = (new_date) => {
        setDate(new_date);
    }

    useEffect(() => {
        if (class_id) {
            getActualStudentsInClass(); // ми отримали студентів зареєстрованих в класі
            // тепер нам потрібно отримати всі записи по усім предметам цього класу за вибраний період
        }

        return () => {
            console.log("Cleanup");
        }
    }, [class_id])

    return (
        <div className={"homework_popup add_school_marks " + school_marks_popup_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className="close_popup_btn" onClick={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">

                <div className="homework_popup_input_block">

                    <div className="homework_popup_data_wrapper">

                        <DropDownSubjectsList
                            lang={lang}
                            school_subjects={school_subjects}
                            infoFromDB={marksInfoFromDB}
                            date={date}
                            setChosen_subject={setChosen_subject}
                            chosen_subject={chosen_subject}
                            compareDate={compareDate}
                        />

                        <SignleDayPicker
                            date={date}
                            lang={lang}
                            id = {"school_marks_add_mark_date_picker"}
                            onDateChange = {onDateChange}
                            getRecordsFromDB = {getRecordsFromDB}
                            receivedRecordsFromDB= {marksInfoFromDB}
                            chosen_subject={chosen_subject}
                            school_subjects= {school_subjects}
                            class_id = {class_id}
                        />

                    </div>

                    <div className="marks_popup_students_list_wrapper">
                        <ul className="marks_popup_students_list">

                            <li className='marks_popup_students_list_student_record blocked_record'>

                                <div className="marks_popup_student_record_img_wrapper">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className="marks_popup_student_record_inner_content_wrapper">
                                    <span className='user_fio'>Москаленко Микола</span>

                                    <div className="marks_popup_student_record_name_and_description_wrapper">
                                        <input type="text" placeholder='description' className='marks_popup_student_record_desc_input' />
                                        <input type="text" placeholder='mark' className='marks_popup_student_record_mark_input' />
                                    </div>

                                </div>
                            </li>

                            <li className='marks_popup_students_list_student_record'>

                                <div className="marks_popup_student_record_img_wrapper">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className="marks_popup_student_record_inner_content_wrapper">
                                    <span className='user_fio'>Москаленко Микола</span>

                                    <div className="marks_popup_student_record_name_and_description_wrapper">
                                        <input type="text" placeholder='description' className='marks_popup_student_record_desc_input' />
                                        <input type="text" placeholder='mark' className='marks_popup_student_record_mark_input' />
                                    </div>

                                </div>
                            </li>

                            <li className='marks_popup_students_list_student_record'>

                                <div className="marks_popup_student_record_img_wrapper">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className="marks_popup_student_record_inner_content_wrapper">
                                    <span className='user_fio'>Москаленко Микола</span>

                                    <div className="marks_popup_student_record_name_and_description_wrapper">
                                        <input type="text" placeholder='description' className='marks_popup_student_record_desc_input' />
                                        <input type="text" placeholder='mark' className='marks_popup_student_record_mark_input' />
                                    </div>

                                </div>
                            </li>

                            <li className='marks_popup_students_list_student_record'>

                                <div className="marks_popup_student_record_img_wrapper">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className="marks_popup_student_record_inner_content_wrapper">
                                    <span className='user_fio'>Москаленко Микола</span>

                                    <div className="marks_popup_student_record_name_and_description_wrapper">
                                        <input type="text" placeholder='description' className='marks_popup_student_record_desc_input' />
                                        <input type="text" placeholder='mark' className='marks_popup_student_record_mark_input' />
                                    </div>

                                </div>
                            </li>

                            <li className='marks_popup_students_list_student_record'>

                                <div className="marks_popup_student_record_img_wrapper">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className="marks_popup_student_record_inner_content_wrapper">
                                    <span className='user_fio'>Москаленко Микола</span>

                                    <div className="marks_popup_student_record_name_and_description_wrapper">
                                        <input type="text" placeholder='description' className='marks_popup_student_record_desc_input' />
                                        <input type="text" placeholder='mark' className='marks_popup_student_record_mark_input' />
                                    </div>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 
                    <span className={"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>
                */}

                <div className="homework_popup_buttons_wrapper">
                    {
                        <button style={{ marginLeft: "auto", marginTop: "15px" }} className={"blue_btn homework_peaky_btn"} onClick={onSaveClick}>
                            {langObj[lang].addHomeworkBtnTitle}
                        </button>
                    }
                </div>

            </div>

        </div>
    );
}