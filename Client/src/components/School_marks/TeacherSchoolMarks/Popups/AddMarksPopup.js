import React, { useEffect, useRef, useState } from 'react';
import "react-dates/lib/css/_datepicker.css";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import { DropDownSubjectsList } from '../../../DropDownSubjectsList/DropDownSubjectsList';
import { get_student_subscribers } from '../../../../controllers/TeacherHomeworkController';
import { SignleDayPicker } from '../../../Calendars/SingleDayPicker/SingleDayPicker';
import { StudentCardAddMark } from '../StudentCardAddMark';
import {get_marks,get_deleted_students, saveOrEditMarks} from '../../../../controllers/TeacherMarksController';

export const AddMarksPopup = ({ lang, class_id, school_marks_popup_type, onHidePopup, school_subjects, showSuccessMessage}) => {
    let langObj =
    {
        ua: {
            popupHeader: "Додавання домашнього завдання",
            warningTitleDateAndSubject: "Дата та предмет мають бути обрані!",
            warningTitleNoChanges: "Ви не внесли ніяких змін!",
            addHomeworkBtnTitle: "Зберегти",
            successAddedMessage: "Зміни успішно внесені",
        },
        ru: {
            popupHeader: "Добавление домашнего задания",
            warningTitleDateAndSubject: "Дата и предмет должны быть выбраны!",
            warningTitleNoChanges: "Вы не внесли никаких изменений!",
            addHomeworkBtnTitle: "Сохранить",
            successAddedMessage: "Изменения успешно внесены",
        },
        en: {
            popupHeader: "Adding homework",
            warningTitleDateAndSubject: "Date and subject must be chosen!",
            warningTitleNoChanges: "You haven't changed anything!",
            addHomeworkBtnTitle: "Save",
            successAddedMessage: "Marks successfuly changed",
        }
    }

    const [actualStudentsInClass, setActualStudentsInClass] = useState([]);
    const [deletedStudentsInClass, setDeletedStudentsInClass] = useState([]);

    const [marksInfoFromDB, setMarksInfoFromDB] = useState([]);
    const [chosen_subject, setChosen_subject] = useState(null);
    const [date, setDate] = useState(null);
    const [studentCards, setStudentCards] = useState([]);
    const [editedCards, setEditedCards] = useState([]);
    const [popup_warning_class, setPopup_warning_class] = useState(""); // homework_popup_warning_active
    const [popup_warning_title, setPopup_warning_title] = useState("...");

    let timer = useRef();

    const showWarning = () => {
        window.clearTimeout(timer.current);
        setPopup_warning_class("homework_popup_warning_active");
        timer.current = window.setTimeout(() => {setPopup_warning_class("")}, 4000);
    } 

    const getActualStudentsInClass = async () => {
        const studentsInfo = await get_student_subscribers(class_id);
        setActualStudentsInClass(studentsInfo);
    }

    const getDeletedStudentsInClass = async(new_marks) => {
        let deleted_user_ids = [];
        new_marks.forEach(record => {
            let found_actual_id = actualStudentsInClass.filter(student => (student.student_id === record.student_id));  
            let found_deleted_id = deletedStudentsInClass.filter(student => (student.student_id === record.student_id));
            let found_in_deleted_users_arr = deleted_user_ids.includes(record.student_id);
            if (!found_actual_id.length && !found_deleted_id.length && !found_in_deleted_users_arr) deleted_user_ids.push(record.student_id);
        });
        if(deleted_user_ids.length) {
            const deletedStudents = await get_deleted_students(deleted_user_ids);
            setDeletedStudentsInClass([...deletedStudentsInClass, ...deletedStudents]);            
        };
    }
    const newMarks = useRef([]);
    const getRecordsFromDB = async (start_date, end_date) => {
        const marks = await get_marks(class_id, start_date, end_date);
        setMarksInfoFromDB([...marksInfoFromDB, ...marks]);
        newMarks.current = marks;
    }

    const compareDate = (firstDate, secondDate) => {
        if(typeof firstDate === 'string') firstDate = moment(firstDate);
        if(typeof secondDate === 'string') secondDate = moment(secondDate);
        return moment(firstDate).isSame(secondDate, 'date');
    }

    const onSaveClick = async () => {
        if(!date || !chosen_subject) {showWarning(); setPopup_warning_title(langObj[lang].warningTitleDateAndSubject)} 
        else if(!editedCards.length) {showWarning(); setPopup_warning_title(langObj[lang].warningTitleNoChanges)}
        else {
            await saveOrEditMarks(editedCards,chosen_subject,date,class_id);
            onHidePopup();
            showSuccessMessage(langObj[lang].successAddedMessage);
        }
    }

    const onDateChange = (new_date) => {
        setDate(new_date);
    }

    const createCards = (img_src,name,surname,lastName, description = "", mark = "", isBlocked = true, student_id = "", isStudentDeleted = false) => {
        
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
                isStudentDeleted = {isStudentDeleted}
                setEditedCards = {setEditedCards}
                student_id = {student_id}
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
                    if(compareDate(record.date,date) && record.subject === chosen_subject) {
                        let studentFromRecord = actualStudentsInfo.find((student) => student.student_id === record.student_id);
                        if(!studentFromRecord) studentFromRecord = deletedStudentsInfo.find((student) => student.student_id === record.student_id);
                        let card = createCards(
                            studentFromRecord.img_src,
                            studentFromRecord.name,
                            studentFromRecord.surname,
                            studentFromRecord.lastName,
                            record.description,
                            record.marks.join(","));

                        ourStudentCards.push(card);
                    }
                })
            } 
            else {

                let currentDayRecords = recordsFromDB.filter((record) => (compareDate(record.date,date) && record.subject === chosen_subject ));
                
                actualStudentsInfo.forEach((student) => {

                    let record = currentDayRecords.find((record) => (student.student_id === record.student_id));

                    let card = createCards(
                        student.img_src,
                        student.name,
                        student.surname,
                        student.lastName,
                        record?.description || "",
                        record?.marks.join(",") || "",
                        false, 
                        student.student_id );

                    ourStudentCards.push(card);
                });

                if(currentDayRecords.length) deletedStudentsInfo.forEach((deletedStudent) => {
                    let record = currentDayRecords.find((record) => (deletedStudent.student_id === record.student_id));
                    if(record) {
                        let card = createCards(
                            deletedStudent.img_src,
                            deletedStudent.name,
                            deletedStudent.surname,
                            deletedStudent.lastName,
                            record.description,
                            record.marks.join(","),
                            true,
                            deletedStudent.student_id,
                            true);
    
                        ourStudentCards.push(card);
                    }
                });

            } 
        }

        setStudentCards(ourStudentCards);
    }

    useEffect(() => {
        if (class_id) {
            getActualStudentsInClass(); 
        }

    }, [class_id])

    useEffect(() => {
        if((actualStudentsInClass.length || deletedStudentsInClass.length)) {
            createStudentCards(actualStudentsInClass,deletedStudentsInClass, marksInfoFromDB);
        }
        if((!date || !chosen_subject) && editedCards.length) setEditedCards([]);
    }, [actualStudentsInClass, deletedStudentsInClass, date, chosen_subject]); // maybe we need to add dataFromDB too

    useEffect(()=> {
        if(marksInfoFromDB.length && actualStudentsInClass.length) getDeletedStudentsInClass(newMarks.current);
    },[marksInfoFromDB,actualStudentsInClass]);
    
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
                            compareDate={compareDate}
                        />

                    </div>

                    <div className="marks_popup_students_list_wrapper">
                        <ul className="marks_popup_students_list">
                            {studentCards}
                        </ul>
                    </div>
                </div>
                
                <span className={"popup_warning_span " + popup_warning_class}>{popup_warning_title}</span>

                <div className="homework_popup_buttons_wrapper">
                    {
                        <button style={{ marginLeft: "auto"}} className={"blue_btn homework_peaky_btn"} onClick={onSaveClick}>
                            {langObj[lang].addHomeworkBtnTitle}
                        </button>
                    }
                </div>

            </div>

        </div>
    );
}