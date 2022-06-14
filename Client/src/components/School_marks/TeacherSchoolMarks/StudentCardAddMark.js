import React, { useEffect, useRef, useState } from 'react';

export const StudentCardAddMark = ({img_src, name, surname, lastName, description, mark, isBlocked}) => {

    const [editMark, setEditMark] = useState(mark);
    const [editDescription, setEditDescription] = useState(description);
    const [isEdited, setIsEdited] = useState(false);

    const onChangeDesk = (e) => {
        setEditDescription(e.target.value);
    }

    const onChangeMark = (e) => {
        setEditMark(e.target.value);
    }

    useEffect(()=> {
        if(editMark !== mark || editDescription !== description) {if(!isEdited) setIsEdited(true);} 
        else setIsEdited(false);
    }, [editMark, editDescription]);

    useEffect(()=> {
        if(isBlocked) { 
            setEditDescription((description));
            setEditMark(mark);
            setIsEdited(false);
        } 
    }, [isBlocked]);

    return (
        <li className={'marks_popup_students_list_student_record ' + (isBlocked? "blocked_record " : "") + (isEdited? "edited_record" : "")}>

            <div className="marks_popup_student_record_img_wrapper">
                <img src={img_src} alt="" />
            </div>
            <div className="marks_popup_student_record_inner_content_wrapper">
                <span className='user_fio'>{surname + " " + name + " " + lastName}</span>

                <div className="marks_popup_student_record_name_and_description_wrapper">
                    <input 
                        type="text" 
                        placeholder='description' 
                        className='marks_popup_student_record_desc_input' 
                        value={editDescription} 
                        onChange = {onChangeDesk} 
                        readOnly = {isBlocked}
                    />
                    <input 
                        type="text" 
                        placeholder='mark' 
                        className='marks_popup_student_record_mark_input' 
                        value={editMark} 
                        onChange = {onChangeMark} 
                        readOnly = {isBlocked}
                    />
                </div>

            </div>

        </li>
    );
}