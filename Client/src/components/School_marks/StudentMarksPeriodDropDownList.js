import React, { useEffect, useRef, useState, Fragment } from 'react';
import { PeriodMarksTable } from './PeriodMerksTable';

export const StudentMarksPeriodDropDownList = ({ name, surname, lastName, studentRecords, isStudentDeleted, lang, student_id }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [dayHeight, setDayHeight] = useState(0);
    const currentHeight = useRef(0);
    const dropDownContentRef = useRef();

    const onDropDownClick = () => {
        dropDownContentRef.current.parentNode.style.transitionDuration = "0.4s";
        setIsOpen(!isOpen);
        let nextHeight = isOpen ? 0 : dropDownContentRef.current.clientHeight;
        currentHeight.current = nextHeight;
        setDayHeight(nextHeight);
    }

    const resizeCalcHeight = () => {
        let contentHeight = dropDownContentRef.current.clientHeight;
        if (contentHeight !== currentHeight.current && isOpen) {
            setDayHeight(contentHeight);
            currentHeight.current = contentHeight;
        }
    }

    useEffect(() => {
        return () => {
            setIsOpen(false);
            setDayHeight(0);
            if (dropDownContentRef?.current?.parentNode) dropDownContentRef.current.parentNode.style.transitionDuration = "0s";
        }
    }, [studentRecords])

    useEffect(() => {
        window.addEventListener('resize', resizeCalcHeight);
        return () => {
            window.removeEventListener('resize', resizeCalcHeight);
        }
    }, [isOpen]);

    return (
        <li className={'drop_down_with_title ' + (studentRecords.length ? "" : "no_homework ") + (isOpen ? "open_drop_down " : "") + (isStudentDeleted ? "deleted_user" : "")} >
            <span className='drop_down_with_title_title' onClick={onDropDownClick}>{`${name} ${surname} ${lastName}`}</span>
            <div className="drop_down_with_title_padding_wrapper" style={{ height: `${dayHeight}px` }}>
                <ul className="drop_down_with_title_content_wrapper" ref={dropDownContentRef}>
                    <PeriodMarksTable lang={lang} studentRecords={studentRecords} key={student_id} />
                </ul>
            </div>
        </li>
    );

}