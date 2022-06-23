import { useEffect, useRef, useState } from 'react';
import { SignleDayPicker } from '../../../Calendars/SingleDayPicker/SingleDayPicker';
import "react-dates/lib/css/_datepicker.css";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import {TeacherAddHomeworkWarningCopyHomeworkText} from './TeacherAddHomeworkWarningCopyHomeworkText';

import {add_homework,edit_homework,delete_homework,get_homework_tasks} from '../../../../controllers/TeacherHomeworkController';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';

export const TeacherAddHomework = ({ 
        state, 
        onHidePopup, 
        homework_popup_active_type, 
        school_subjects, 
        current_class_id, 
        timer, 
        showSuccessMessage
    }) => {


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
            deleteHomeworkBtnTitle: "Видалити",
            homeworkInputPlaceholder: "Введіть домашнє завдання...",
            successAddedMessage: "Завдання додано",
            successEditedMessage: "Завдання відредаговано",
            successDeletedMessage: "Завдання видалено",
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
            deleteHomeworkBtnTitle: "Удалить",
            homeworkInputPlaceholder: "Введите домашнее задание...",
            successAddedMessage: "Задание добавлено",
            successEditedMessage: "Задание отредактировано",
            successDeletedMessage: "Задание удалено",
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
            homeworkInputPlaceholder: "Enter homework text...",
            successAddedMessage: "Homework added",
            successEditedMessage: "Homework edited",
            successDeletedMessage: "Homework deleted",
        }
    };

    const [is_active_drop_down, setIs_active_drop_down] = useState(false); // active_drop_down
    const [subjects_li_list, setSubjects_li_list] = useState([]);
    const [chosen_subject, setChosen_subject] = useState(null);
    const [date, setDate] = useState(null);
    const [homeworkText, setHomeworkText] = useState("");
    const [receivedHomeworkInfo,setReceivedHomeworkInfo] = useState([]);
    const [homeworkMode, setHomeworkMode] = useState("plain_mode"); // буде три мода : звичайний мод (plain_mode), мод редагування заданої домашки (edit_mode), 
    const [isOpenWarningPopup, setIsOpenWarningPopup] = useState(false);                 // мод перегляду домашки (watch_mode)
    const [activeRecord, setActiveRecord] = useState();
    const selected_li = useRef(null);

    const getHomeworks = async (start_date, end_date) => {
        const homeworkInfofromDB = await get_homework_tasks(current_class_id, start_date, end_date);
        let newReceivedHomeworkInfo = [ ...receivedHomeworkInfo, ...homeworkInfofromDB.data];
        setReceivedHomeworkInfo(newReceivedHomeworkInfo);
    }

    let cancelChanges = useRef();
    let prevSelectedLi = useRef(); 

    const goSubjectBack = () => {
        if (selected_li.current) selected_li.current.className = selected_li.current.className.replace(" selected_li", "");
        if(prevSelectedLi.current) {
            prevSelectedLi.current.className += " selected_li";
            setChosen_subject(prevSelectedLi.current.innerHTML);
            selected_li.current = prevSelectedLi.current;
        }
        else setChosen_subject("");
    }
    
    const changeRecordWithoutPopup = (selected_li, new_date = date, subject = chosen_subject) => {
        const record = receivedHomeworkInfo.find(val => val.subject === subject && compareDate(new_date, val.date)); 
        record.selected_li = selected_li;
        setActiveRecord(record);
        setHomeworkText(record.homework);
    }

    const onChooseSubject = (e) => {
        if(e.target.innerText === chosen_subject) {setIs_active_drop_down(false); return;} // якщо нажали на одну і ту ж лішку то нічо не робиться
        if(e.target.className.includes("highlighted")) {

            if(homeworkMode === "watch_mode") {  // хочу щоб просто не виводився попап, но все спрацювало
                changeRecordWithoutPopup(e.target, date,e.target.innerText);
            }
            else if (homeworkMode === "plain_mode") {
                // я хочу перевірити чи тест пустий чи ні. Якщо пустий то переключусь спокійно. Якщо ні - то попап
                if(homeworkText) {
                    onShowWarningPopup();
                    prevSelectedLi.current = selected_li.current;
                    cancelChanges.current = () => goSubjectBack();
                }
                else {
                    setHomeworkMode("watch_mode");
                    clearTimer();
                    changeRecordWithoutPopup(e.target,date,e.target.innerText);
                }
            }

            else if(homeworkMode === "edit_mode") {
                if(homeworkText) {
                    if(!compareDate(activeRecord.date, date) || !(e.target.innerText === activeRecord.subject)) {
                        onShowWarningPopup();
                        prevSelectedLi.current = selected_li.current;
                        cancelChanges.current = () => goSubjectBack();
                    } 
                }
            }
        }
        else {
            if(homeworkMode === "watch_mode") {setHomeworkMode("plain_mode");setHomeworkText("");}
        }
        if (selected_li.current) selected_li.current.className = selected_li.current.className.replace(" selected_li", "") ; 
        e.target.className += " selected_li";  // просто вибирає предмет і відповідає за зміну активної лішки 
        setChosen_subject(e.target.innerText);
        setIs_active_drop_down(false);
        selected_li.current = e.target;
    }

    let createDeletedLiList = (deletedSubjects, isDeletedAndHighlighted = false) => {

        const deleted_li_list = deletedSubjects.map((subject, index) => {

            return (<li key={"deleted_"+ index} className = {"deleted_subject " + (isDeletedAndHighlighted? "highlighted" : "") + (chosen_subject === subject? " selected_li": "")}>{subject}</li>)
        })
        return deleted_li_list;
    }

    let createLiveLiList = (highlightedSubjects = []) => {
        let our_li_list;
        if (school_subjects) { // просто створює список зі звичайних предметів
            our_li_list = school_subjects.map((subject, index) => {
                let isSubjectHighlighted = highlightedSubjects.some(val => val.subject === subject);
                return (<li key={index} className = {(isSubjectHighlighted? "highlighted" : "") + (chosen_subject === subject? " selected_li": "") }>{subject}</li>)
            })
        }
        return our_li_list;
    }
    
    const createLiList = () => { 

        let our_li_list = [];
        let deletedSubjects = []; // містить лише предмети

        if(receivedHomeworkInfo.length) { // визначили видалені предмети, які мають попасти в список
            receivedHomeworkInfo.forEach(item => {
               if(!deletedSubjects.some(subject => subject === item.subject) && !school_subjects.includes(item.subject)) deletedSubjects.push(item.subject);
            }) 
        }
        if(date) {
            let homeworkOnDayArr = receivedHomeworkInfo.filter(item => (compareDate(item.date, date))); // вибирає всі записи, які мають конкретний день.
            let deletedHighlightedSubjects = [];
            homeworkOnDayArr.forEach(val => { if(deletedSubjects.some(subject => (subject === val.subject))) deletedHighlightedSubjects.push(val.subject)} );
            our_li_list.push(...createLiveLiList(homeworkOnDayArr)); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedHighlightedSubjects, true)); // добавляю видалені предмети
        }
        else {
            our_li_list.push(...createLiveLiList()); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedSubjects)); // добавляю видалені предмети
        }
        setSubjects_li_list(our_li_list);
    }

    let onSmthClick = (e) => {
        if(is_active_drop_down) {
            setIs_active_drop_down(false);
        }
    }

    useEffect(()=> {
        window.addEventListener("click", onSmthClick);
        return () => { window.removeEventListener("click", onSmthClick); }
    },[is_active_drop_down])

    useEffect(() => {
        return () => {
            if(current_class_id) {
                setIs_active_drop_down(false);
                setSubjects_li_list([]);
                setChosen_subject(null);
                setDate(null);
                setHomeworkText("");
                setHomeworkMode("plain_mode");
                setActiveRecord(null);
                selected_li.current = null;
                prevSelectedLi.current = null;
                cancelChanges.current = null;
                setReceivedHomeworkInfo([]);
            }
        }

    }, [current_class_id]);

    useEffect(() => {
        if(current_class_id) createLiList();
    },[receivedHomeworkInfo, date])

    const compareDate = (date, CalendarDate) => {
        if(typeof date === 'string') date = moment(date);
        if(typeof CalendarDate === 'string') CalendarDate = moment(CalendarDate);
        return moment(date).isSame(CalendarDate, 'date');
    }

    const isDayHighlighted = CalendarDate => {
        let isHighlighted = false;
        if(!chosen_subject) return false; // якщо предмет не вибраний то нічо не підсвічуємо
        receivedHomeworkInfo.forEach(({date, subject}) => {
            const isDatesEquals = compareDate(date, CalendarDate);
            const isMatchSubject = chosen_subject === subject;
            if (isDatesEquals && isMatchSubject) {
                isHighlighted = true;
            }
        });
        return isHighlighted;
    };

    const onDateChange = (new_date) => {
        
        if(date && new_date && compareDate(new_date, date)) return;
        setDate(new_date);
        if(!new_date) return;

        const isNewDateHighlighted = isDayHighlighted(new_date);
        if(homeworkMode === "watch_mode") { // тепер я можу перемикатися між заданими домашками (якщо в режимі watch_mode) і не буде висвічуватись ворнінг попап
            if(!isNewDateHighlighted) {setHomeworkMode("plain_mode");setHomeworkText("");} 
            else {
                changeRecordWithoutPopup(selected_li.current,new_date);
            }
            return;
        }
        if(homeworkMode === "plain_mode" ) {
            if(isNewDateHighlighted) {
                if(!homeworkText) {setHomeworkMode("watch_mode");changeRecordWithoutPopup(selected_li.current,new_date); clearTimer();}
                else {
                    onShowWarningPopup();
                    cancelChanges.current = () => setDate(date);
                }
            } 

        }
        else if(homeworkMode === "edit_mode") {
            if(isNewDateHighlighted) {
                if(homeworkText) {
                    if(compareDate(activeRecord.date, new_date) && chosen_subject === activeRecord.subject) return; // хочу перевірити чи збігається вибраний день та предмет з activeRecord. Якщо да, дозволити змінити без зміни режима та попапів
                    onShowWarningPopup();
                    cancelChanges.current = () => setDate(date);
                }

            } 
        }
    }

    const onHomeworkTextChange = (e) => {
        setHomeworkText(e.target.value);
    }

    const onSubmitCopyAndChangeDay = () => {
        navigator.clipboard.writeText(homeworkText);
        changeRecordWithoutPopup(selected_li.current);
        setIsOpenWarningPopup(false);
        setHomeworkMode("watch_mode");
    } 

    const onShowWarningPopup = () => {
        setIsOpenWarningPopup(true);
    }

    const onHideWarningPopup = () => {
        setIsOpenWarningPopup(false);
        cancelChanges.current();
    }

    const onSaveClick = async() => {
        if (!chosen_subject || !homeworkText.trim() || !date) { // проверяем не пустые ли обязательные поля в попапе
            window.clearTimeout(timer.current);
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
            timer.current = window.setTimeout(() => { clearTimer() }, 4000);
        }
        else {
            if(homeworkMode === "plain_mode") {
                const result = await add_homework(current_class_id,chosen_subject,homeworkText,date); 
                if(result) showSuccessMessage(langObj[lang].successAddedMessage);
                else alert("Something went wrong");
            }
            else {
                const result = await edit_homework(activeRecord._id,chosen_subject,homeworkText,date);
                if(result) showSuccessMessage(langObj[lang].successEditedMessage);
            }
            onHidePopup();
        }
        
    }

    const onDeleteClick = async () => {
        const result = await delete_homework(activeRecord._id);
        if(result) showSuccessMessage(langObj[lang].successDeletedMessage);
        onHidePopup();
    }

    const clearTimer = () => {
        window.clearTimeout(timer.current);
        state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""));
    }

    const onEditOrCancelClick = () => {
        let isEditMode = homeworkMode === "edit_mode"? true : false;
        if(isEditMode) clearTimer();
        setHomeworkMode(isEditMode ? "watch_mode": "edit_mode"); // треба якось відкотити текст, дату та назву предмета назад (думка така що коли ми попадаємо на перегляд цього предмету то в стейті зберігатиметься айдішнік)
        setHomeworkText(activeRecord.homework);     // по id ми також можемо орієнтуватися який запис конкретно ми змінюємо - просто відправляємо нові дані і айдішнік на бекенд
        setChosen_subject(activeRecord.subject);
        if (activeRecord.selected_li) selected_li.current.className = selected_li.current.className.replace(" selected_li", "") ; 
        activeRecord.selected_li.className += " selected_li";  // просто вибирає предмет і відповідає за зміну активної лішки 
        setDate(moment(activeRecord.date));
    }

    moment.locale(lang === "ua" ? "uk" : lang);
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

                        <SignleDayPicker
                            date={date}
                            lang={lang}
                            id = {"add_homework_popup_date_picker"}
                            onDateChange = {onDateChange}
                            getRecordsFromDB = {getHomeworks}
                            receivedRecordsFromDB= {receivedHomeworkInfo}
                            chosen_subject={chosen_subject}
                            school_subjects= {school_subjects}
                            class_id = {current_class_id}
                            compareDate={compareDate}
                        />
                    </div>

                    <div className="homework_popup_create_homework_message">
                        <textarea placeholder={langObj[lang].homeworkInputPlaceholder} disabled = {homeworkMode === "watch_mode" ? true : false } onChange = {onHomeworkTextChange} value = {homeworkText}></textarea>
                    </div>

                </div>

                <div className={"homework_warning_copy_popup_wrapper " + (isOpenWarningPopup? "homework_popup_active": "")}>
                    <TeacherAddHomeworkWarningCopyHomeworkText 
                        homeworkDate = {moment(date).format('DD.MM.YYYY')}
                        homeworkSubject = {chosen_subject}
                        onHidePopup = {onHideWarningPopup}
                        onSubmitCopyAndChangeDay = {onSubmitCopyAndChangeDay}
                    />
                </div>

                <span className={"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>

                <div className="homework_popup_buttons_wrapper">
                    {
                        homeworkMode !== "plain_mode" && 
                        <button style={{marginRight : "auto"}} className={"gray_btn blue_btn homework_peaky_btn"} onClick= {onEditOrCancelClick} disabled = {(moment(date).diff(moment(), 'M') <= -2)}>
                            {homeworkMode === "watch_mode" ? langObj[lang].editBtnTitle : langObj[lang].denyBtnTitle}
                        </button>
                    } 
                    {
                        homeworkMode === "edit_mode" && 
                        <button style={{margin : "0px auto"}} className={"homework_popup_delete_class_btn blue_btn homework_peaky_btn"} onClick = {onDeleteClick}>
                            {langObj[lang].deleteHomeworkBtnTitle}
                        </button>
                    }
                    {
                        homeworkMode !== "watch_mode" && 
                        <button style={{marginLeft: "auto"}} className={"blue_btn homework_peaky_btn"} onClick = {onSaveClick}>
                            {langObj[lang].addHomeworkBtnTitle}
                        </button>
                    }
                </div>

            </div>

        </div>
    );

}