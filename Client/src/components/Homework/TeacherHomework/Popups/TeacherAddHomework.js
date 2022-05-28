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
    const [homeworkText, setHomeworkText] = useState("");
    const [receivedHomeworkInfo,setReceivedHomeworkInfo] = useState([]);
    const [isOpenWarningPopup, setIsOpenWarningPopup] = useState(false);
    const selected_li = useRef();


    const homeworkInfofromDB = [
        {
            date : '10.05.2022',
            subject: 'Хімія',
            homework: "Сторінка 152, вправа 240-245"
        },
        {
            date : '10.05.2022',
            subject: 'Фізкультура',
            homework: "Сторінка 152, вправа 240-245"
        },
        {
            date : '27.05.2022',
            subject: 'Хімія',
            homework: "Сторінка 152, вправа 240-245"
        }, 
        {
            date : '27.05.2022',
            subject: 'Астрологія',
            homework: "Сторінка 152, вправа 240-245"
        }
    ]

    const onChooseSubject = (e) => {
        if (selected_li.current) selected_li.current.className = selected_li.current.className.replace(" selected_li", "") ;
        e.target.className += " selected_li";
        setChosen_subject(e.target.innerText);
        setIs_active_drop_down(false);
        selected_li.current = e.target;
    }

    let createDeletedLiList = (deletedSubjects, isDeletedAndHighlighted = false) => {

        const deleted_li_list = deletedSubjects.map((item, index) => {

            return (<li key={"deleted_"+ index} className = {"deleted_subject " + (isDeletedAndHighlighted? "highlighted" : "")}>{item.subject}</li>)
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

    // тепер будемо підсвічувати ті предмети, що співпадають з днем, але тільки для наявних
    const createLiList = () => { // мені треба щоб якщо є вибраний день, то воно підсвічувало лішки жовтим. Якщо день не вибрано - не підсвічувало.

        let our_li_list = [];
        let deletedSubjects = [];

        if(homeworkInfofromDB.length) { // визначили видалені предмети, які мають попасти в список
            homeworkInfofromDB.forEach(item => {
               if(!deletedSubjects.some(val => val.subject === item.subject) && !school_subjects.includes(item.subject)) deletedSubjects.push(item);
            }) 
        }
        if(date) {
            let formatDate = moment(date).format('DD.MM.YYYY');
            let homeworkOnDayArr = homeworkInfofromDB.filter(item => (item.date === formatDate)); // вибирає всі записи, які мають конкретний день.
            let deletedHighlightedSubjects = homeworkOnDayArr.filter(val => deletedSubjects.some(item => (item.subject === val.subject) ));
            our_li_list.push(...createLiveLiList(homeworkOnDayArr)); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedHighlightedSubjects, true)); // добавляю видалені предмети

        }
        else {
            // якщо день не вибраний, то мені просто потрібно створити список лішок, який складатиметься з school_subjects та homeworkInfofromDB (видалені). 
            // Видалені підсвітити червоним навколо.
            our_li_list.push(...createLiveLiList()); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedSubjects)); // добавляю видалені предмети
        }
        setSubjects_li_list(our_li_list);
    }

    let onSmthClick = (e) => {
        if(e.target.className !== "selected_li" && is_active_drop_down) {
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
                if (selected_li.current) {
                    selected_li.current.className = "";
                    selected_li.current = null;
                }
            }
        }

    }, [current_class_id]);

    useEffect(() => {
        if(current_class_id) createLiList();
    },[date,current_class_id])

    const outsideRangeSelector = (day) => {
        let diff = moment(day).diff(moment(), 'M');
        if (diff < -2) return true;
        return false;
    }

    const isDayHighlighted = CalendarDate => {
        let isHighlighted = false;
        homeworkInfofromDB.forEach(({date}) => {
            date = moment(date, 'DD.MM.YYYY');
            const isDayOfMonthMatch = date.date() === CalendarDate.date();
            const isMonthMatch = date.month() === CalendarDate.month();
            const isYearMatch = date.year() === CalendarDate.year();
            if (isDayOfMonthMatch && isMonthMatch && isYearMatch) {
                isHighlighted = true;
            }
        });
        return isHighlighted;
    };

    const onDateChange = (date) => {
        if(date && isDayHighlighted(date) && chosen_subject) {
            alert("STICK YOUR FINGER IN MY ASS");
            setFocusedInput(false);
        }
        else setDate(date);
    }

    const onHomeworkTextChange = (e) => {
        setHomeworkText(e.target.value);
    }

    const onSubmitCopyAndChangeDay = () => {
        navigator.clipboard.writeText(homeworkText);
        setHomeworkText("NEW TEXT");
        onHideWarningPopup();
    } 

    const onShowWarningPopup = () => {
        setIsOpenWarningPopup(true);
    }

    const onHideWarningPopup = () => {
        setIsOpenWarningPopup(false);
    }

    // console.log(moment(homeworkDays[0]).format('DD.MM.YYYY'))
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
                            // isDayBlocked = {(day) => true}                                                      // block all days, but only from availibles 
                            hideKeyboardShortcutsPanel

                        />

                    </div>

                    <div className="homework_popup_create_homework_message">
                        <textarea placeholder={langObj[lang].homeworkInputPlaceholder} onChange = {onHomeworkTextChange} value = {homeworkText}></textarea>
                    </div>

                </div>

                {/* <div className={"homework_popup_wrapper " + state.homework_popup_class}>
                    <TeacherAddHomeworkWarningCopyHomeworkText 
                        homeworkDate = {date}
                        homeworkSubject = {chosen_subject}
                        onHidePopup = {onHideWarningPopup}
                        onSubmitCopyAndChangeDay = {onSubmitCopyAndChangeDay}
                    />
                </div> */}

                <span className={"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>

                <div className="homework_popup_buttons_wrapper">
                    <button className={"gray_btn blue_btn homework_peaky_btn"}>{langObj[lang].editBtnTitle}</button>
                    <button className={"blue_btn homework_peaky_btn"} >{langObj[lang].addHomeworkBtnTitle}</button>
                </div>

            </div>

        </div>
    );

}