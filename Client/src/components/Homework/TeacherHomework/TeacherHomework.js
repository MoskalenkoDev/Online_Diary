import React, {useEffect ,useRef, useState} from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions_homework';
import jwtDecode from 'jwt-decode';
import {TeacherAddClassPopup} from './Popups/TeacherAddClassPopup';
import {TeacherEditClassPopup} from './Popups/TeacherEditClassPopup';
import {TeacherCopyInviteLink} from './Popups/TeacherCopyInviteLink';
import {TeacherStudentsEditor} from './Popups/TeacherStudentsEditor';

import { get_classes_info } from '../../../controllers/HomeworkController';

export const TeacherHomework = ({state}) =>
{
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            yourClasses: "Ваші класи",
            addClassBtn: "Додати клас",
            alertWarningTitle: "Спочатку заповніть дані в профілі!"
        },
        ru:
        {
            yourClasses: "Ваши классы",
            addClassBtn: "Добавить класс",
            alertWarningTitle: "Сначало заполните данные в профиле!"
        },
        en:
        {
            yourClasses: "Your classes",
            addClassBtn: "Add class",
            alertWarningTitle: "First fill in the data in the profile!"
        }
    }
    
    const [invite_link, setInvite_link] = useState(""); // ссылка, по которой студенты будут регистрироватся на преподавателей
    const [school_subjects, setSchool_subjects] = useState(""); // пока что строка, но при отправке на бек мы превратим ее в массив
    const [new_class_title, setNew_class_title] = useState("");
    const [edit_obj_id, setEdit_obj_id] = useState(""); // _id обьекта в бд который мы изменяем или удаляем
    const [homework_popup_active_type, setHomework_popup_active_type] = useState("homework_add_class_popup"); // "homework_edit_popup" , "homework_add_homework_class", "homework_students_editor"
    const [homework_copy_invite_link_popup_class, setHomework_copy_invite_link_popup_class] = useState(""); // активный класс - active_invite_copy_link_popup

    let onEditBtnClick = (li_info) =>
    {   
        let current_school_subjects = li_info.school_subjects.join();
        state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
        setHomework_popup_active_type("homework_edit_popup");
        setNew_class_title(li_info.title)
        setSchool_subjects(current_school_subjects)
        setEdit_obj_id(li_info._id)
    }

    let onCopyInviteLinkBtnClick = (invite_link) =>
    {
        state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
        setHomework_popup_active_type("homework_students_editor");
        setInvite_link(invite_link);
    }

    let li_creator = (li_mass) =>
    {
        let our_li_components = li_mass.map((new_class_obj,index)=> 
        {
            return(
                <li key = {index}>
                    <span>{new_class_obj.title}</span>
                    <div className="homework_li_buttons">
                        <button className = "homework_grey_btn homework_li_edit_homework_btn" onClick = {() => onEditBtnClick(li_mass[index])}></button>
                        <button className = "homework_grey_btn homework_li_students_homework_btn" onClick = {() => onCopyInviteLinkBtnClick(new_class_obj._id)}></button>
                        <button className = "homework_grey_btn homework_li_add_homework_btn"></button>
                    </div>
                </li>
            )
        });
        state.dispatch(ActionCreators.change_homework_classes_li_list(our_li_components));
        // setClasses_li_list(our_li_components);
    }

    useEffect(async() => 
    {
        await get_classes_info(li_creator); // in my opinion it is correct
        console.log(state)
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_students_list")); // Ставим активным первый пункт меню
    },[]);

    // useEffect(async() => {
    //     li_creator(classes_info);
    // },[classes_info])

    let timer = useRef(null);

    let onHidePopup = () =>
    {
        window.clearTimeout(timer.current);
        state.dispatch(ActionCreators.change_homework_show_popup_class(""));
        window.setTimeout(()=>
        {
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""));
            setNew_class_title("");
            setSchool_subjects("");
            if(state.homework_popup_active_menu_item !== "active_popup_menu_students_list") {
                state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_students_list"));
            }
        },250);
    }

    let onShowAddClassPopup = () =>
    {   
        if(state.isFilledProfile) {
            state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active")); 
            setHomework_popup_active_type("homework_add_class_popup");
        } 
        else alert(langObj[lang].alertWarningTitle);
    }

    let onPopupClassTitleChange = (e) =>
    {
        let title = e.target.value.trimStart();
        setNew_class_title(title)
    }
    let onPopupSchoolSubjectsChange = (e) =>
    {
        let subj_str = e.target.value.trimStart();
        setSchool_subjects(subj_str)
    }
    
    return(
        <div className="homework_wrapper">
            <div className="homework_header">
                <span>{langObj[lang].yourClasses}</span>
                <button className = "homework_add_btn blue_btn" onClick ={onShowAddClassPopup}>{langObj[lang].addClassBtn}</button>
            </div>

            <div className= {"homework_popup_wrapper " + state.homework_popup_class}>

                <TeacherAddClassPopup 
                    state = {state}
                    new_class_title = {new_class_title} 
                    school_subjects = {school_subjects}
                    homework_popup_active_type = {homework_popup_active_type}
                    onHidePopup = {onHidePopup} 
                    onPopupClassTitleChange = {onPopupClassTitleChange} 
                    onPopupSchoolSubjectsChange = {onPopupSchoolSubjectsChange} 
                    timer = {timer}
                    li_creator = {li_creator}
                />
                <TeacherEditClassPopup 
                    state = {state} 
                    school_subjects = {school_subjects}
                    new_class_title = {new_class_title} 
                    edit_obj_id = {edit_obj_id}
                    homework_popup_active_type = {homework_popup_active_type}
                    onHidePopup = {onHidePopup} 
                    onPopupClassTitleChange = {onPopupClassTitleChange} 
                    onPopupSchoolSubjectsChange = {onPopupSchoolSubjectsChange}
                    li_creator = {li_creator}
                    timer = {timer}
                />
                <TeacherStudentsEditor
                    state = {state} 
                    onHidePopup = {onHidePopup} 
                    setHomework_copy_invite_link_popup_class = {setHomework_copy_invite_link_popup_class}
                    homework_popup_active_type = {homework_popup_active_type}
                    invite_link = {invite_link}
                />
            </div>

            <div className="homework_class_list_block">
                <ul className= "homework_class_list">
                    {state.homework_classes_li_list}
                </ul>
            </div>

            <TeacherCopyInviteLink state = {state} homework_copy_invite_link_popup_class = {homework_copy_invite_link_popup_class}/>
            
        </div>  
    );
}