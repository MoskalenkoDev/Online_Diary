import React, { useEffect, useRef, useState, Fragment } from 'react';
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker } from "react-dates";
import "./CalendarStyles.scss";
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uk';

export const WeekPicker = ({ start_date, setStartDate, end_date, setEndDate, lang }) => {

    const langObj = {
        ua: {
            dataTitle: "Дата",
            prevWeek: "Минулий тиждень",
            thisWeek: "Цей тиждень",
            nextWeek: "Наступний тиждень",
        },
        ru: {
            dataTitle: "Дата",
            prevWeek: "Прошлая неделя",
            thisWeek: "Эта неделя",
            nextWeek: "Следующая неделя"
        },
        en: {
            dataTitle: "Date",
            prevWeek: "Previous week",
            thisWeek: "This week",
            nextWeek: "Next week"
        }
    };

    const currentMoment = moment();

    const [focusedInput, setFocusedInput] = useState(null);
    const [hoveredDays, setHoveredDays] = useState();

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
        setStartDate(currentMoment.clone().startOf("isoweek"));
        setEndDate(currentMoment.clone().endOf("isoweek"));
    }, []);

    let onDateChange = (new_date) => {
        let startDate = new_date.clone().startOf("isoweek");
        setStartDate(startDate);
        let endDate = new_date.clone().endOf("isoWeek");
        setEndDate(endDate);
    }

    const onPrevWeekClick = () => {
        let newStartDate = moment(start_date).clone().subtract(1,'week');
        setStartDate(newStartDate);
        setEndDate(moment(end_date).clone().subtract(1,'week'));
        onDateHovered(newStartDate);
    }

    const onNextWeekClick = () => {
        let newStartDate = moment(start_date).clone().add(1,'week');
        setStartDate(newStartDate);
        setEndDate(moment(end_date).clone().add(1,'week'));
        onDateHovered(newStartDate);
    }

    const onFocusChange = ({ focused }) => {
        setFocusedInput(focused);
    }

    const onCloseDatePicker = () => {
        onDateHovered(start_date);
    }

    const displayFormat = () => {
        const displayDateFormat = `${moment(start_date).format("DD.MM.YYYY")} - ${moment(end_date).format("DD.MM.YYYY")}`;
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
                // onNextMonthClick={onNextMonthClick}
                // onPrevMonthClick={onPrevMonthClick}
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