import React, { useEffect, useRef, useState, Fragment } from 'react';

export const WeekLiList = ({ isContainSubjects, weekTitle, innerContent }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [dayHeight, setDayHeight] = useState(0);
    const [content, setContent] = useState([]);
    const currentHeight = useRef(0);
    const dropDownContentRef = useRef();

    const onDropDownClick = () => {
        setIsOpen(!isOpen);
        dropDownContentRef.current.parentElement.style.transitionDuration = "0.4s";
        let nextHeight = isOpen ? 0 : dropDownContentRef.current.clientHeight;
        currentHeight.current = nextHeight;
        setDayHeight(nextHeight);
    }

    const onResizeChildComponent = (heightDiff) => {
        dropDownContentRef.current.parentElement.style.transitionDuration = "0.4s";
        currentHeight.current += heightDiff;
        setDayHeight((dayHeight) => dayHeight + heightDiff);
    }

    useEffect(() => {
        if (innerContent.length) {
            let newChildrens = [];
            innerContent.forEach(element => {
                let newElem = React.cloneElement(element, { onChildResize: onResizeChildComponent }, null);
                newChildrens.push(newElem);
            });
            setContent(newChildrens);
        }

    }, [innerContent]);

    const resizeCalcHeight = () => {
        if(isOpen) dropDownContentRef.current.parentElement.style.transitionDuration = "0s";
        let contentHeight = dropDownContentRef.current.clientHeight;
        if(contentHeight !== currentHeight.current && isOpen) {
            setDayHeight(contentHeight);
            currentHeight.current = contentHeight;
        }
    }

    useEffect(() => {
        window.addEventListener('resize',resizeCalcHeight);
        return () => {
            window.removeEventListener('resize',resizeCalcHeight);
        }
    }, [isOpen]);

    return (
        <li className={'drop_down_with_title ' + (isContainSubjects ? "" : "no_homework ") + (isOpen ? "open_drop_down" : "")}>
            <span className='drop_down_with_title_title' onClick={onDropDownClick}>{weekTitle}</span>
            <div className="drop_down_with_title_padding_wrapper" style={{ height: `${dayHeight}px` }}>
                <ul className="drop_down_with_title_content_wrapper" ref = {dropDownContentRef}>
                    {content}
                </ul>
            </div>
        </li>
    );

}