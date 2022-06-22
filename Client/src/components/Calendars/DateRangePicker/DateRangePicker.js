import { useEffect, useRef, useState } from 'react';
import "../CalendarStyles.scss";
import { DateRangePicker as ReactDatesDateRangePicker } from "react-dates";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';
import "react-dates/lib/css/_datepicker.css";

export const DateRangePicker = ({
    lang,
    startDate,
    endDate,
    onDatesChange,
    getRecordsFromDB,
    class_id
}) => {

    let langObj =
    {
        ua: {
            startDateTitle: "Початкова",
            endDateTitle : "Кінцева"
        },
        ru: {
            startDateTitle: "Начальная",
            endDateTitle : "Конечная"
        },
        en: {
            startDateTitle: "Start Date",
            endDateTitle : "End Date"
        }
    }

    const [focusedInput, setFocusedInput] = useState(null);
    const [start_date, setStart_date] = useState(0);
    const [end_date, setEnd_date] = useState(0);
    // потрібно реалізувати те саме що і на інших календарях : 
    // 1. спершу на 2 місяці отримувати інфу, а потім кожні 3 місяці

    const currentOpenMonthCounter = useRef(0);

    const onCalendarClose = (new_start_date) => {
        if(!new_start_date.date) currentOpenMonthCounter.current = 0; 
        else {
            currentOpenMonthCounter.current = moment(new_start_date.date).startOf('M').diff(moment().startOf('M'), 'M');
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
        <ReactDatesDateRangePicker
            small
            onDatesChange={onDatesChange}
            startDate={startDate}
            endDate={endDate}
            startDatePlaceholderText = {langObj[lang].startDateTitle}
            endDatePlaceholderText = {langObj[lang].endDateTitle}
            focusedInput={focusedInput} // PropTypes.bool
            onFocusChange={focused => setFocusedInput(focused)} // PropTypes.func.isRequired
            endDateId="122"
            startDateId='123'
            isOutsideRange={() => (false)}
            daySize={30}
            readOnly
            onNextMonthClick={onNextMonthClick}
            onPrevMonthClick = {onPrevMonthClick}
            onClose = {onCalendarClose}
            firstDayOfWeek={lang === "en" ? 0 : 1}
            numberOfMonths={1}
            hideKeyboardShortcutsPanel
            anchorDirection='right'
            showClearDates
        />
    );
}