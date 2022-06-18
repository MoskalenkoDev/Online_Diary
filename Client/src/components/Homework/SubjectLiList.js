import React, { useEffect, useRef, useState, Fragment } from 'react';

export const SubjectLiList = ({ subjectTitle, innerContent,  onChildResize }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [subjectHeight, setSubjectHeight] = useState(0);
    const currentHeight = useRef(0);
    const dropDownContentRef = useRef();

    const onDropDownClick = () => {
        setIsOpen(!isOpen);
        let childHeight =  dropDownContentRef.current.clientHeight;
        let nextHeight = isOpen ? 0 : childHeight;
        setSubjectHeight(nextHeight);
        currentHeight.current = nextHeight;
        onChildResize(nextHeight || -childHeight);
    }

    const resizeCalcHeight = () => {
        // if(isOpen) dropDownContentRef.current.parentElement.style.transitionDuration = "0s";
        let childHeight =  dropDownContentRef.current.clientHeight;
        if(currentHeight.current !== childHeight && isOpen) {
            setSubjectHeight(childHeight);
            currentHeight.current = childHeight;
            onChildResize(childHeight - subjectHeight);
        }
    }

    useEffect(() => {
        window.addEventListener('resize',resizeCalcHeight);
        return () => {
            window.removeEventListener('resize',resizeCalcHeight);
        }
    }, [isOpen]);

    return (
        <li className={'drop_down_with_title ' + (isOpen? "open_drop_down" : "")} >
            <span className='drop_down_with_title_title' onClick = {onDropDownClick}>{subjectTitle}</span>

            <div className="drop_down_with_title_padding_wrapper" style={{height: `${subjectHeight}px`}} >
                <div className='homework_task_wpapper' ref = {dropDownContentRef}>
                    {innerContent}
                </div>
            </div>

        </li>
    );

}