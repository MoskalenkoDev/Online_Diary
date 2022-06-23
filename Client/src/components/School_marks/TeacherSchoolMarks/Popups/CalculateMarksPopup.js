import React, { useEffect, useRef, useState } from 'react';
import "react-dates/lib/css/_datepicker.css";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import { DropDownSubjectsList } from '../../../DropDownSubjectsList/DropDownSubjectsList';
import { StudentMarksPeriodDropDownList } from '../../StudentMarksPeriodDropDownList';
import { get_student_subscribers } from '../../../../controllers/TeacherHomeworkController';
import { DateRangePicker } from '../../../Calendars/DateRangePicker/DateRangePicker';
import { get_marks, get_deleted_students } from '../../../../controllers/TeacherMarksController';

export const CalculateMarksPopup = ({ lang, class_id, school_marks_popup_type, onHidePopup, school_subjects }) => {
    let langObj =
    {
        ua: {
            popupHeader: "Підрахунок оцінок",
            warningTitleDateAndSubject: "Дата та предмет мають бути обрані!",
            calculateMarksBtnTitle: "Підрахувати",
        },
        ru: {
            popupHeader: "Подсчет оценок",
            warningTitleDateAndSubject: "Дата и предмет должны быть выбраны!",
            calculateMarksBtnTitle: "Подсчитать",
        },
        en: {
            popupHeader: "Calculation of marks",
            warningTitleDateAndSubject: "Date and subject must be chosen!",
            calculateMarksBtnTitle: "Calculate",
        }
    }

    const [actualStudentsInClass, setActualStudentsInClass] = useState([]);
    const [deletedStudentsInClass, setDeletedStudentsInClass] = useState([]);

    const [marksInfoFromDB, setMarksInfoFromDB] = useState([]);
    const [chosen_subject, setChosen_subject] = useState(null);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [studentCards, setStudentCards] = useState([]);

    const getActualStudentsInClass = async () => {
        const studentsInfo = await get_student_subscribers(class_id);
        setActualStudentsInClass(studentsInfo);
    }

    const getDeletedStudentsInClass = async (new_marks) => {  
        let deleted_user_ids = [];
        new_marks.forEach(record => {
            let found_actual_id = actualStudentsInClass.filter(student => (student.student_id === record.student_id));
            let found_deleted_id = deletedStudentsInClass.filter(student => (student.student_id === record.student_id));
            let found_in_deleted_users_arr = deleted_user_ids.includes(record.student_id);
            if (!found_actual_id.length && !found_deleted_id.length && !found_in_deleted_users_arr) deleted_user_ids.push(record.student_id);
        });
        if (deleted_user_ids.length) {
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

    const checkIsDayInPeriod = (record_date) => {
        return moment(record_date).isBetween(startDate, endDate);
    }

    const onDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    const createCards = (name, surname, lastName, studentRecords = [], student_id = "", isStudentDeleted = false) => {
        
        return (
            <StudentMarksPeriodDropDownList
                name = {name}
                surname = {surname}
                lastName = {lastName}
                studentRecords = {studentRecords}
                key = {name + surname + lastName}
                student_id = {student_id}
                isStudentDeleted = {isStudentDeleted}
                lang = {lang}
            />
        )
    }

    const createStudentCards = (actualStudentsInfo, deletedStudentsInfo, recordsFromDB) => {
        let ourStudentCards = [];
        if (!startDate || !endDate || !chosen_subject) {
            actualStudentsInfo.forEach((student) => {
                ourStudentCards.push(createCards(student.name, student.surname, student.lastName));
            });
        }
        else if (startDate && endDate && chosen_subject) {

            let recordsInPeriod = recordsFromDB.filter((record) => (checkIsDayInPeriod(record.date) && record.subject === chosen_subject));

            actualStudentsInfo.forEach((student) => {

                let studentRecords = recordsInPeriod.filter((record) => (student.student_id === record.student_id && record.marks.length));
            
                let card = createCards(
                    student.name,
                    student.surname,
                    student.lastName,
                    studentRecords,
                    student.student_id);

                ourStudentCards.push(card);
            });

            if (recordsInPeriod.length) deletedStudentsInfo.forEach((deletedStudent) => {
                let studentRecords = recordsInPeriod.filter((record) => (deletedStudent.student_id === record.student_id));

                if (studentRecords.length) {
                    let card = createCards(
                        deletedStudent.name,
                        deletedStudent.surname,
                        deletedStudent.lastName,
                        studentRecords,
                        deletedStudent.student_id,
                        true);

                    ourStudentCards.push(card);
                }
            });
        }
        setStudentCards(ourStudentCards);
    }

    useEffect(() => {
        if (class_id) {
            getActualStudentsInClass(); 
        }

    }, [class_id])

    useEffect(() => {
        if ((actualStudentsInClass.length || deletedStudentsInClass.length)) {
            createStudentCards(actualStudentsInClass, deletedStudentsInClass, marksInfoFromDB);
        }
    }, [actualStudentsInClass, deletedStudentsInClass, startDate, endDate, chosen_subject]); // maybe we need to add dataFromDB too

    useEffect(() => {
        if (marksInfoFromDB.length && actualStudentsInClass.length) getDeletedStudentsInClass(newMarks.current);
    }, [marksInfoFromDB, actualStudentsInClass]);
 
    return (
        <div className={"homework_popup calculate_school_marks " + school_marks_popup_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className="close_popup_btn" onClick={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">

                <div className="homework_popup_input_block" id='calculateMarksPopupInputBlock'>

                    <div className="homework_popup_data_wrapper">

                        <DropDownSubjectsList
                            lang={lang}
                            school_subjects={school_subjects}
                            infoFromDB={marksInfoFromDB}
                            setChosen_subject={setChosen_subject}
                            chosen_subject={chosen_subject}
                        />

                        <DateRangePicker
                            lang={lang}
                            startDate={startDate}
                            endDate={endDate}
                            onDatesChange={onDatesChange}
                            getRecordsFromDB={getRecordsFromDB}
                            class_id={class_id}
                        />

                    </div>

                    <div className="marks_popup_students_list_wrapper">
                        <ul className="homework_week_days_list">
                            {studentCards}
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
}