import { useEffect, useRef, useState } from 'react';
import "../CalendarStyles.scss";
import { SingleDatePicker } from "react-dates";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import "react-dates/lib/css/_datepicker.css";

export const SignleDayPicker = ({ 
    lang, 
    date,  
    id, 
    onDateChange, 
    getRecordsFromDB, 
    receivedRecordsFromDB, 
    chosen_subject, 
    school_subjects, 
    class_id,
    compareDate
}) => {

    let langObj =
    {
        ua: {
            dataTitle: "Дата"
        },
        ru: {
            dataTitle: "Дата"
        },
        en: {
            dataTitle: "Date"
        }
    }

    const [focusedInput, setFocusedInput] = useState(null);
    const [start_date, setStart_date] = useState(0);
    const [end_date, setEnd_date] = useState(0);

    const currentOpenMonthCounter = useRef(0);

    const isDayHighlighted = (CalendarDate) => {
        let isHighlighted = false;
        if(!chosen_subject) return false; // якщо предмет не вибраний то нічо не підсвічуємо
        receivedRecordsFromDB.forEach(({date, subject}) => {
            const isDatesEquals = compareDate(date, CalendarDate);
            const isMatchSubject = chosen_subject === subject;
            if (isDatesEquals && isMatchSubject) {
                isHighlighted = true;
            }
        });
        return isHighlighted;
    };

    const outsideRangeSelector = (day) => {
        let diff = moment(day).startOf('M').diff(moment().startOf('M'), 'M');
        let isHighlighted = isDayHighlighted(day);
        // тут треба перевірити чи є вибраний предмет - та чи є він одним із видалених
        if(chosen_subject && !school_subjects.includes(chosen_subject) && !isHighlighted) return true; // якщо предмет вибраний, він є видаленим і день не підсвічений
        if (diff <= -2 && !isHighlighted) return true;
        return false;
    }

    const onCalendarClose = (new_date) => {
        if(!new_date.date) currentOpenMonthCounter.current = 0; 
        else {
            currentOpenMonthCounter.current = moment(new_date.date).startOf('M').diff(moment().startOf('M'), 'M');
        }
    }

    let onNextMonthClick = async () => {  
        currentOpenMonthCounter.current += 1;
        if(currentOpenMonthCounter.current === end_date) {
            let old_end_date = moment().startOf("M").add(end_date + 1, 'M');
            let new_end_date = moment(old_end_date).add(2, 'M').endOf('M');
            await getRecordsFromDB(old_end_date, new_end_date);
            setEnd_date(end_date + 3);
        }
    }

    let onPrevMonthClick = async () => {
        currentOpenMonthCounter.current -= 1;
        if(currentOpenMonthCounter.current === start_date) {
            let old_start_day = moment().startOf('M').subtract(-(start_date) + 1, 'M').endOf('M');
            let new_start_day = moment(old_start_day).startOf('M').subtract(2, 'M');
            await getRecordsFromDB(new_start_day, old_start_day);
            setStart_date(start_date - 3);
        }
    }

    useEffect(() => {
        if(class_id) {
            let new_start_day = moment().startOf('M').subtract(2, 'M');
            let new_end_date = moment().startOf('M').add(2, 'M').endOf('M');
            setStart_date(-2);
            setEnd_date(2);
            getRecordsFromDB(new_start_day,new_end_date);
        } 
    },[class_id])

    moment.locale(lang === "ua" ? "uk" : lang);
    return (
        <SingleDatePicker
            small
            date={date} // momentPropTypes.momentObj or null
            onDateChange={onDateChange} // PropTypes.func.isRequired
            focused={focusedInput} // PropTypes.bool
            onFocusChange={({ focused }) => setFocusedInput(focused)} // PropTypes.func.isRequired
            id= {id} // PropTypes.string.isRequired,
            firstDayOfWeek={lang === "en" ? 0 : 1}
            numberOfMonths={1}
            daySize={30}
            anchorDirection="right"
            isOutsideRange={outsideRangeSelector}
            placeholder={langObj[lang].dataTitle}
            isDayHighlighted={isDayHighlighted}
            displayFormat="DD.MM.YYYY"
            readOnly
            showClearDate
            onNextMonthClick={onNextMonthClick}
            onPrevMonthClick={onPrevMonthClick}
            onClose={onCalendarClose}
            hideKeyboardShortcutsPanel
        />
    );
}