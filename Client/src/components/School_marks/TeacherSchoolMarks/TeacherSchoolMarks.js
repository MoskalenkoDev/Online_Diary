import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/action_school_marks';
import { get_classes_info, get_student_subscribers } from '../../../controllers/TeacherHomeworkController';
import { AddMarksPopup } from './Popups/AddMarksPopup';
import { TeacherSuccessMessagePopup } from '../../Homework/TeacherHomework/Popups/TeacherSuccessMessagePopup';

export const TeacherSchoolMarks = ({ state }) => {
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            yourClasses: "Ваші класи",
        },
        ru:
        {
            yourClasses: "Ваши классы",
        },
        en:
        {
            yourClasses: "Your classes",
        }
    }

    const [school_marks_popup_class, setSchool_marks_popup_class] = useState(""); // school_marks_active
    const [school_marks_popup_type, setSchool_marks_popup_type] = useState(""); // school_marks_add_marks_popup
    const [current_class_id, setCurrent_class_id] = useState("");
    const [school_subjects, setSchool_subjects] = useState(""); // пока что строка, но при отправке на бек мы превратим ее в массив

    const [teacher_success_message_popup_class, setTeacher_success_message_popup_class] = useState(""); // активный класс - active_invite_copy_link_popup
    const [teacher_success_message_popup_message_text, setTeacher_success_message_popup_message_text] = useState();

    const timer = useRef();
    let onHidePopup = () =>
    {
        window.clearTimeout(timer.current);
        setSchool_marks_popup_class("");
        setTimeout(() => {
            setCurrent_class_id("");
            setSchool_marks_popup_type("");
        },250);
    }

    const onCalculateBtnClick = (class_info) => {
        console.log(class_info);
    }

    const onAddMarksBtnClick = async (class_info) => {
        setSchool_subjects(class_info.school_subjects);
        setCurrent_class_id(class_info._id);
        setSchool_marks_popup_class("school_marks_active");
        setSchool_marks_popup_type("school_marks_add_marks_popup");
    }

    let li_creator = (li_mass) => {
        let our_li_components = li_mass.map((new_class_obj, index) => {
            return (
                <li key={index}>
                    <span>{new_class_obj.title}</span>
                    <div className="homework_li_buttons">
                        <button className="homework_grey_btn school_marks_calculate_btn" onClick={() => onCalculateBtnClick(new_class_obj)}></button>
                        <button className="homework_grey_btn homework_li_add_homework_btn" onClick={() => onAddMarksBtnClick(new_class_obj)}></button>
                    </div>
                </li>
            )
        });
        state.dispatch(ActionCreators.school_marks_change_class_list(our_li_components));
    }

    let timer_copy_popup = useRef(null);
    let showSuccessMessage = (message) => {
        clearTimeout(timer_copy_popup.current);
        setTeacher_success_message_popup_message_text(message);
        setTeacher_success_message_popup_class("active_invite_copy_link_popup");
        timer_copy_popup.current = setTimeout(() => {
            setTeacher_success_message_popup_class("");
        },2000);
    }

    useEffect(() => {
        get_classes_info(li_creator); // in my opinion it is correct
    }, []);


    return (
        <div className="homework_wrapper school_marks_wrapper">

            <div className="homework_header">
                <span>{langObj[lang].yourClasses}</span>
            </div>

            <div className={"homework_popup_wrapper " + school_marks_popup_class}>

                {school_marks_popup_type === "school_marks_add_marks_popup" && <AddMarksPopup
                    onHidePopup={onHidePopup}
                    lang={lang}
                    school_marks_popup_type={school_marks_popup_type} 
                    school_subjects={school_subjects}
                    class_id={current_class_id}
                    timer={timer}
                    showSuccessMessage={showSuccessMessage}
                />}
            </div>

            <div className="homework_class_list_block">
                <ul className="homework_class_list">
                    {state.school_marks_class_list}
                </ul>
            </div>

            <TeacherSuccessMessagePopup 
                teacher_success_message_popup_class = {teacher_success_message_popup_class} 
                message_text = {teacher_success_message_popup_message_text}
            />

        </div>
    );
}