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
import { StudentCardAddMark } from '../StudentCardAddMark';
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
    const [studentCards, setStudentCards] = useState([]);

    const fakeDataFromDB = [
        {
            student_id: "62690381a146a6275007b405",
            school_subject: "Фізика", 
            marks: ["12", "11+"],
            description: "Завдання виконано тупо чотко", 
            date: moment().add(1, 'day')
        }
    ];

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

    const createCards = (img_src,name,surname,lastName, description = "", mark = "", isBlocked = true) => {
        return (
            <StudentCardAddMark
                img_src = {img_src}
                name = {name}
                surname = {surname}
                lastName = {lastName}
                description = {description}
                mark = {mark}
                isBlocked = {isBlocked}
                key = {name+surname+lastName}
            />
        )
    }

    const createStudentCards = (actualStudentsInfo, deletedStudentsInfo ,recordsFromDB) => {
        let ourStudentCards = [];
        
        if(!date || !chosen_subject) {
            actualStudentsInfo.forEach((student)=> {
                ourStudentCards.push(createCards(student.img_src,student.name, student.surname, student.lastName));
            });
        }
        else if(date && chosen_subject) {
            let dateDifference = moment(date).startOf("M").diff(moment().startOf('M'), 'M');
            if(dateDifference <= -2 || !school_subjects.includes(chosen_subject)) {
                recordsFromDB.forEach((record)=> {
                    if(moment(record.date).isSame(date, 'date') && record.school_subject === chosen_subject) {
                        let studentFromRecord = actualStudentsInfo.find((student) => student.student_id === record.student_id);
                        if(!studentFromRecord) studentFromRecord = deletedStudentsInfo.find((student) => student.student_id === record.student_id);
                        let card = createCards(
                            studentFromRecord.img_src,
                            studentFromRecord.name,
                            studentFromRecord.surname,
                            studentFromRecord.lastName,
                            record.description,
                            record.marks.join(", "));

                        ourStudentCards.push(card);
                    }
                })
            } 
            else {

                let currentDayRecords = recordsFromDB.filter((record) => (moment(record.date).isSame(date, 'date') && record.school_subject === chosen_subject ));

                actualStudentsInfo.forEach((student) => {

                    let record = currentDayRecords.find((record) => (student.student_id === record.student_id));
                    
                    let card = createCards(
                        student.img_src,
                        student.name,
                        student.surname,
                        student.lastName,
                        record?.description || "",
                        record?.marks.join(", ") || "",
                        false);

                    ourStudentCards.push(card);
                });

                deletedStudentsInfo.forEach((deletedStudent) => {
                    let record = currentDayRecords.find((record) => (deletedStudent.student_id === record.student_id));
                    
                    let card = createCards(
                        deletedStudent.img_src,
                        deletedStudent.name,
                        deletedStudent.surname,
                        deletedStudent.lastName,
                        record.description,
                        record.marks.join(", "));

                    if(record) ourStudentCards.push(card);
                });
            } 
        }

        setStudentCards(ourStudentCards);
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

    useEffect(() => {
        if((actualStudentsInClass.length || deletedStudentsInClass.length)) {
            createStudentCards(actualStudentsInClass,deletedStudentsInClass, fakeDataFromDB);
        }
    }, [actualStudentsInClass, deletedStudentsInClass, date, chosen_subject]); // maybe we need to add dataFromDB too

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
                            {studentCards}
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