import { useEffect, useRef, useState } from 'react';
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "../../CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import {TeacherAddHomeworkWarningCopyHomeworkText} from './TeacherAddHomeworkWarningCopyHomeworkText';
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
            deleteHomeworkBtnTitle: "Видалити",
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
            deleteHomeworkBtnTitle: "Удалить",
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
    const [homeworkText, setHomeworkText] = useState("");
    const [receivedHomeworkInfo,setReceivedHomeworkInfo] = useState([]);
    const [homeworkMode, setHomeworkMode] = useState("plain_mode"); // буде три мода : звичайний мод (plain_mode), мод редагування заданої домашки (edit_mode), 
    const [isOpenWarningPopup, setIsOpenWarningPopup] = useState(false);                 // мод перегляду домашки (watch_mode)
    const [activeRecord, setActiveRecord] = useState();
    const selected_li = useRef();

    const homeworkInfofromDB = [
        {
            _id: "123456",
            date : '10.05.2022',
            subject: 'Хімія',
            homework: "Сторінка 52, вправа 140-145"
        },
        {
            _id: "234567",
            date : '10.05.2022',
            subject: 'Фізкультура',
            homework: "Сторінка 112, вправа 240-245"
        },
        {
            _id: "345678",
            date : '27.05.2022',
            subject: 'Хімія',
            homework: "Сторінка 152, вправа 540-545"
        }, 
        {
            _id: "456789",
            date : '27.05.2022',
            subject: 'Астрологія',
            homework: "Сторінка 84, прочитати все що тільки можна"
        }
    ]

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
    
    const changeRecordWithoutPopup = (new_date = date, subject = chosen_subject) => {
        const record = homeworkInfofromDB.find(val => val.subject === subject && compareDate(new_date, val.date)); 
        setActiveRecord(record);
        setHomeworkText(record.homework);
    }

    const onChooseSubject = (e) => {
        if(e.target.innerText === chosen_subject) {setIs_active_drop_down(false); return;} // якщо нажали на одну і ту ж лішку то нічо не робиться
        if(e.target.className.includes("highlighted")) {

            if(homeworkMode === "watch_mode") {  // хочу щоб просто не виводився попап, но все спрацювало
                changeRecordWithoutPopup(date,e.target.innerText);
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
                    changeRecordWithoutPopup(date,e.target.innerText);
                }
            }
            // else {
            //     if(homeworkText) {
            //         onShowWarningPopup();
            //         prevSelectedLi.current = selected_li.current;
            //         cancelChanges.current = () => goSubjectBack();
            //     }
            //     else {
            //         changeRecordWithoutPopup(date,e.target.innerText);
            //     }
            // }
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

            return (<li key={"deleted_"+ index} className = {"deleted_subject " + (isDeletedAndHighlighted? "highlighted" : "")}>{subject}</li>)
        })
        return deleted_li_list;
    }

    let createLiveLiList = (highlightedSubjects = []) => {
        let our_li_list;
        if (school_subjects) { // просто створює список зі звичайних предметів
            our_li_list = school_subjects.map((subject, index) => {
                let isSubjectHighlighted = highlightedSubjects.some(val => val.subject === subject);
                return (<li key={index} className = {isSubjectHighlighted? "highlighted" : ""}>{subject}</li>)
            })
        }
        return our_li_list;
    }

    // окей , з того що зробити треба це : 
    // 1. Заборонити вибирати дні окрім завданих видалених предметів.  ХХХ
    // 2. коли вибираю підсвічений предмет показувати попап
    // 3. коли вибираю підсвічений день, то показувати попап
    // 4. Прибрати кнопку Edit допоки не буде вибраний режим редагування
    // 5. Забороняти ввод домашки в інпут ми не будемо бо сенсу нема
    // 6. Якщо ми на сторінці заданої домашки то інпут домашки буде заблокований і буде присутня кнопка Edit. Зміна предмету або дня буде нас просто переміщати між домашками.
    //    якщо ж ми нажали на кнопку Edit то ми можемо змінювати предмет та дату та можемо зберегти зміни.
    //    В режимі перегляду завданої домашки - в нас відсутня кнопка зберегти.
    //    Поки дз, дата та інпут не будуть заповнені то в звичайному режимі при нажиманні на зберегти буде висвічуватися попередження.
    //    Якщо в режимі редагування вибрати предмет який буде конфліктувати з іншим заданим завданням - то в нас просто з'явиться той же попап. Пофіг-потім вчитель сам видалить дз
    //    Якщо ми в режимі перегляду заданої домашки і хочемо переміститися в день або предмет де також задана домашка - нам не потрібно показувати попап
    const createLiList = () => { 

        let our_li_list = [];
        let deletedSubjects = []; // містить лише предмети

        if(homeworkInfofromDB.length) { // визначили видалені предмети, які мають попасти в список
            homeworkInfofromDB.forEach(item => {
               if(!deletedSubjects.some(subject => subject === item.subject) && !school_subjects.includes(item.subject)) deletedSubjects.push(item.subject);
            }) 
        }
        if(date) {
            let formatDate = moment(date).format('DD.MM.YYYY');
            let homeworkOnDayArr = homeworkInfofromDB.filter(item => (item.date === formatDate)); // вибирає всі записи, які мають конкретний день.
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
            }
        }

    }, [current_class_id]);

    useEffect(() => {
        if(current_class_id) createLiList();
    },[date,current_class_id])

    const outsideRangeSelector = (day) => {
        let diff = moment(day).diff(moment(), 'M');
        // тут треба перевірити чи є вибраний предмет - та чи є він одним із видалених
        if(chosen_subject && !school_subjects.includes(chosen_subject) && !isDayHighlighted(day)) return true;
        if (diff < -2) return true;
        return false;
    }

    const compareDate = (date ,CalendarDate) => { 
        if(typeof date === 'string') date = moment(date, 'DD.MM.YYYY');
        if(typeof CalendarDate === 'string') CalendarDate = moment(CalendarDate, 'DD.MM.YYYY')
        const isDayOfMonthMatch = date.date() === CalendarDate.date();
        const isMonthMatch = date.month() === CalendarDate.month();
        const isYearMatch = date.year() === CalendarDate.year();
        if(isDayOfMonthMatch && isMonthMatch && isYearMatch) return true;
        return false;
    }

    const isDayHighlighted = CalendarDate => {
        let isHighlighted = false;
        if(!chosen_subject) return false; // якщо предмет не вибраний то нічо не підсвічуємо
        homeworkInfofromDB.forEach(({date, subject}) => {
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
                changeRecordWithoutPopup(new_date);
            }
            return;
        }
        if(homeworkMode === "plain_mode") {
            if(isNewDateHighlighted) {
                if(!homeworkText) {setHomeworkMode("watch_mode");changeRecordWithoutPopup(new_date);}
                else {
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
        changeRecordWithoutPopup();
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

    const onSaveClick = () => {
        homeworkMode === "plain_mode"? 
            console.log("Просто зберігаємо в бд") :
            console.log("Замінюємо старий запис новим")
        onHidePopup();
    }

    const onDeleteClick = () => {
        console.log("Видаляємо запис з бд");
        onHidePopup();
    }

    const onEditOrCancelClick = () => {
        let isEditMode = homeworkMode === "edit_mode"? true : false;
        setHomeworkMode(isEditMode ? "watch_mode": "edit_mode"); // треба якось відкотити текст, дату та назву предмета назад (думка така що коли ми попадаємо на перегляд цього предмету то в стейті зберігатиметься айдішнік)
        setHomeworkText(activeRecord.homework);     // по id ми також можемо орієнтуватися який запис конкретно ми змінюємо - просто відправляємо нові дані і айдішнік на бекенд
        setChosen_subject(activeRecord.subject);
        setDate(moment(activeRecord.date, 'DD.MM.YYYY'));
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

                        <SingleDatePicker
                            small
                            date={date} // momentPropTypes.momentObj or null
                            onDateChange={onDateChange} // PropTypes.func.isRequired
                            focused={focusedInput} // PropTypes.bool
                            onFocusChange={({ focused }) => setFocusedInput(focused)} // PropTypes.func.isRequired
                            id="add_homework_popup_date_picker" // PropTypes.string.isRequired,
                            firstDayOfWeek={lang === "en" ? 0 : 1}
                            // showDefaultInputIcon
                            numberOfMonths={1}
                            daySize={30}
                            anchorDirection="right"
                            isOutsideRange={outsideRangeSelector}
                            placeholder={langObj[lang].dataTitle}
                            isDayHighlighted={isDayHighlighted}
                            displayFormat="DD.MM.YYYY"
                            readOnly
                            showClearDate
                            // isDayHighlighted={(day) => {console.log(day); return true;}} 
                            // monthFormat="YYYY[年]MMMM"
                            // monthFormat = "MMMM YYYY"
                            // enableOutsideDays 
                            // showClearDate   
                            // initialVisibleMonth={() => moment().subtract(2, 'months')}                          // start showing from adjusted month 
                            // isDayBlocked = {(day) => !isDayHighlighted(day)}                                                      // block all days, but only from availibles 
                            hideKeyboardShortcutsPanel

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
                        <button style={{marginRight : "auto"}} className={"gray_btn blue_btn homework_peaky_btn"} onClick= {onEditOrCancelClick}>
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