import React, { useEffect, useRef, useState, Fragment } from 'react';
import * as ActionCreators from '../../Redux/Actions/actions_homework';
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker } from "react-dates";
import "./CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

export const WeekPicker = ({ start_date, setStartDate, end_date, setEndDate, hoveredDays, setHoveredDays, getDataFromDB, startAndEndDate, changeStartAndEndDate ,lang }) => {

    const langObj = {
        ua: {
            dataTitle: "Дата",
            prevWeek: "Минулий тиждень",
            thisWeek: "Поточний тиждень",
            nextWeek: "Наступний тиждень",
        },
        ru: {
            dataTitle: "Дата",
            prevWeek: "Прошлая неделя",
            thisWeek: "Текущая неделя",
            nextWeek: "Следующая неделя"
        },
        en: {
            dataTitle: "Date",
            prevWeek: "Рrеviou🇸 ᴡее𝗄",
            thisWeek: "Currеnt ᴡее𝗄", // T𝗁i🇸 ᴡее𝗄
            nextWeek: "Νехt ᴡее𝗄"
        }
    };

    const currentMoment = moment();

    const [focusedInput, setFocusedInput] = useState(null);
    const calculatedStartMounth = useRef(0); // our start week number position from which we have got data from DB
    const calculatedEndMounth = useRef(0); // our end week number position from which we have got data from DB
    const currentOpenMounth = useRef(0);

    const isDayHighlighted = date => {
        let isHighlighted = false;
        hoveredDays.forEach(hoveredDay => {
            const isDayOfMonthMatch = hoveredDay.date() === date.date();
            const isMonthMatch = hoveredDay.month() === date.month();
            const isYearMatch = hoveredDay.year() === date.year();
            if (isDayOfMonthMatch && isMonthMatch && isYearMatch) {
                isHighlighted = true;
            }
        });
        return isHighlighted;
    };

    const calculateActiveWeek = date => {
        const mon = date.clone().startOf("isoweek");
        const tue = mon.clone().add(1, "d");
        const wed = mon.clone().add(2, "d");
        const thu = mon.clone().add(3, "d");
        const fri = mon.clone().add(4, "d");
        const sat = mon.clone().add(5, "d");
        const sun = mon.clone().add(6, "d");
        return [mon, tue, wed, thu, fri, sat, sun];
    };

    const onDateHovered = (date) => {
        setHoveredDays(
            calculateActiveWeek(date)
        );
    };

    const renderCalendarDay = date => {
        const dayClasses = [
            "CalendarDay",
            "CalendarDay__default",
            "CalendarDay_1",
            "CalendarDay__default_2"
        ].join(" ");

        let style = {
            width: "30px",
            height: "29px",
        };
        if (date.day) {
            const dayOfMonth = date.day.date();
            const isHighlighted = isDayHighlighted(date.day);
            style = {
                width: "30px",
                height: "29px",
                backgroundColor: isHighlighted ? "#42a5f5" : "white",
                color: isHighlighted ? "white" : "black"
            };
            return (
                <td
                    style={style}
                    className={dayClasses}
                    onClick={() => onDateChange(date.day)}
                    onMouseEnter={() => onDateHovered(date.day)}
                    key = {date.day.format("DD.MM.YYYY")}
                >
                    {dayOfMonth}
                </td>
            );
        } else {
            return <td style={style} className={dayClasses} />;
        }
    };

    useEffect(() => {
        onDateHovered(currentMoment);
        let startDate = currentMoment.clone().startOf("isoweek");
        setStartDate(startDate);
        let endDate = currentMoment.clone().endOf("isoweek");
        setEndDate(endDate);
        
        if(!startAndEndDate[0]) {
            calculatedStartMounth.current = -2;
            calculatedEndMounth.current = 2;

            let startCalcDay = moment().startOf('M').subtract(2,'M');
            let endCalcDay = moment().startOf('M').add(2, 'M').endOf('M');
    
            getDataFromDB(startCalcDay, endCalcDay);
        }
        else {
            calculatedStartMounth.current = startAndEndDate[0];
            calculatedEndMounth.current = startAndEndDate[1];
        }  

        return () => {
            changeStartAndEndDate([calculatedStartMounth.current, calculatedEndMounth.current]);
        }
        
    }, []);

    useEffect(()=> {
        if(start_date) {
            let start_diff = start_date.clone().startOf('M').diff(currentMoment.clone().startOf('M'), 'M');
            let end_diff = end_date.clone().endOf('M').diff(currentMoment.clone().endOf('M'), 'M');
            if(start_diff < 0 ) {
                currentOpenMounth.current = start_diff;
                if(start_diff -1 === calculatedStartMounth.current) onPrevMonthClick(false);
            } 
            else if(end_diff > 0) {
                currentOpenMounth.current = end_diff;
                if(end_diff + 1 === calculatedEndMounth.current) onNextMonthClick(false);
            }
        }
    },[start_date])

    let onDateChange = (new_date) => {
        let startDate = new_date.clone().startOf("isoweek");
        setStartDate(startDate);
        let endDate = new_date.clone().endOf("isoWeek");
        setEndDate(endDate);
        setFocusedInput(false);
    }

    // як не крути ми не по тижням будемо витягувати дані, а по місяцям. Отже будемо не тижні рахувати а місяці. І відносно них вже витягувати дані.

    const onPrevWeekClick = () => {

        let newStartDate = moment(start_date).clone().subtract(1, 'week');
        setStartDate(newStartDate);
        setEndDate(moment(end_date).clone().subtract(1, 'week'));
        onDateHovered(newStartDate);
    }

    const onNextWeekClick = () => {

        let newStartDate = moment(start_date).clone().add(1, 'week');
        setStartDate(newStartDate);
        setEndDate(moment(end_date).clone().add(1, 'week'));
        onDateHovered(newStartDate);
    }

    let onNextMonthClick = async (isChange) => {
        if(isChange) currentOpenMounth.current += 1;
        if (calculatedEndMounth.current === currentOpenMounth.current + 1) {
            let old_end_date = currentMoment.clone().startOf('M').add(calculatedEndMounth.current + 1, 'M');
            let new_end_date = old_end_date.clone().add(2, 'M').endOf('M');
            getDataFromDB(old_end_date, new_end_date);
            calculatedEndMounth.current += 3;
        }

    }

    let onPrevMonthClick = async (isChange) => {
        if(isChange) currentOpenMounth.current -= 1;
        if (calculatedStartMounth.current === currentOpenMounth.current - 1) {
            let old_start_date = currentMoment.clone().startOf('M').subtract(-(calculatedStartMounth.current - 1), 'M').endOf('M'); // 31
            let new_start_date = currentMoment.clone().startOf('M').subtract(-(calculatedStartMounth.current - 3), 'M');
            await getDataFromDB(new_start_date, old_start_date);
            calculatedStartMounth.current -= 3;
        }
    }

    const onFocusChange = ({ focused }) => {
        setFocusedInput(focused);
        let start_diff = start_date.clone().startOf('M').diff(currentMoment.clone().startOf('M'), 'M');
        let end_diff = end_date.clone().endOf('M').diff(currentMoment.clone().endOf('M'), 'M');
        if(start_diff < 0 ) currentOpenMounth.current = start_diff; 
        else if(end_diff > 0) currentOpenMounth.current = end_diff;
    }

    const onCloseDatePicker = () => {
        onDateHovered(start_date);
    }

    const displayFormat = () => {
        const displayDateFormat = `${moment(start_date).format("DD.MM.YYYY")} - ${moment(end_date).format("DD.MM.YYYY")}`;
        let momentStartDay = moment(start_date).clone();
        let momentCurrentIsoWeek = currentMoment.startOf('isoWeek');
        if (momentStartDay.isSame(momentCurrentIsoWeek, 'day')) return langObj[lang].thisWeek;
        else if (momentStartDay.isSame(momentCurrentIsoWeek.clone().subtract(1, 'week'))) return langObj[lang].prevWeek;
        else if (momentStartDay.isSame(momentCurrentIsoWeek.clone().add(1, 'week'))) return langObj[lang].nextWeek;
        return displayDateFormat;
    }

    moment.locale(lang === "ua" ? "uk" : lang);

    return (
        <Fragment>
            <button className='date_picker_prev_week_btn light_gray_btn' onClick={onPrevWeekClick}></button>
            <SingleDatePicker
                small
                date={start_date} // momentPropTypes.momentObj or null
                onDateChange={onDateChange} // PropTypes.func.isRequired
                focused={focusedInput} // PropTypes.bool
                onFocusChange={onFocusChange} // PropTypes.func.isRequired
                firstDayOfWeek={1}
                // showDefaultInputIcon
                numberOfMonths={1}
                daySize={30}
                anchorDirection="left"
                isOutsideRange={() => false}
                placeholder={langObj[lang].dataTitle}
                // isDayHighlighted={isDayHighlighted}
                displayFormat={displayFormat}
                // dayAriaLabelFormat = "string"
                readOnly
                enableOutsideDays
                // isDayHighlighted={(d) => d.isSame(new Date(), "day")}
                renderCalendarDay={renderCalendarDay}
                onNextMonthClick={onNextMonthClick}
                onPrevMonthClick={onPrevMonthClick}
                onClose={onCloseDatePicker}
                // monthFormat = "MMMM YYYY"
                // showClearDate   
                // initialVisibleMonth={() => moment().subtract(2, 'months')}                          // start showing from adjusted month 
                // isDayBlocked = {(day) => !isDayHighlighted(day)}                                                      // block all days, but only from availibles 
                hideKeyboardShortcutsPanel

            />
            <button className='date_picker_next_week_btn light_gray_btn' onClick={onNextWeekClick}></button>
        </Fragment>
    );
}