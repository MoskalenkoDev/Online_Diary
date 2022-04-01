import React, {useEffect ,useRef} from 'react';
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
    
    let onEditBtnClick = (li_info) =>
    {
        let current_school_subjects = li_info.school_subjects.join();
        state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
        state.dispatch(ActionCreators.change_homework_popup_type("homework_edit_popup"));
        state.dispatch(ActionCreators.change_homework_popup_class_title(li_info.title));
        state.dispatch(ActionCreators.change_homework_popup_school_subjects(current_school_subjects));
        state.dispatch(ActionCreators.change_homework_edit_obj_id(li_info._id));
    }

    let onCopyInviteLinkBtnClick = (invite_link) =>
    {
        state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active"));
        state.dispatch(ActionCreators.change_homework_popup_type("homework_students_editor"));
        state.dispatch(ActionCreators.change_homework_invite_link(invite_link));
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
    }

    useEffect(async() => 
    {
        let classes_info = await get_classes_info()(state.dispatch); // in my opinion it is correct
        if(classes_info.length != 0) li_creator(classes_info);
        state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_students_list")); // Ставим активным первый пункт меню
    },[]);

    let timer = useRef(null);

    let onHidePopup = () =>
    {
        window.clearTimeout(timer.current);
        state.dispatch(ActionCreators.change_homework_show_popup_class(""));
        window.setTimeout(()=>
        {
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""));
            state.dispatch(ActionCreators.change_homework_popup_clear_inputs());         // ???
            if(state.homework_popup_active_menu_item !== "active_popup_menu_students_list") {
                state.dispatch(ActionCreators.change_homework_popup_active_menu_item("active_popup_menu_students_list"));
            }
        },250);
    }

    let onShowAddClassPopup = () =>
    {   
        if(jwtDecode(window.localStorage.getItem("token")).isFilledProfile)
        {
            state.dispatch(ActionCreators.change_homework_show_popup_class("homework_popup_active")); 
            state.dispatch(ActionCreators.change_homework_popup_type("homework_add_class_popup")); 
        } 
        else alert(langObj[lang].alertWarningTitle);
    }

    let onPopupClassTitleChange = (e) =>
    {
        let title = e.target.value.trimStart();
        state.dispatch(ActionCreators.change_homework_popup_class_title(title));
    }
    let onPopupSchoolSubjectsChange = (e) =>
    {
        let subj_str = e.target.value.trimStart();
        state.dispatch(ActionCreators.change_homework_popup_school_subjects(subj_str));
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
                    onHidePopup = {onHidePopup} 
                    onPopupClassTitleChange = {onPopupClassTitleChange} 
                    onPopupSchoolSubjectsChange = {onPopupSchoolSubjectsChange} 
                    get_classes_info= {get_classes_info}
                    timer = {timer}
                />
                <TeacherEditClassPopup 
                    state = {state} 
                    onHidePopup = {onHidePopup} 
                    onPopupClassTitleChange = {onPopupClassTitleChange} 
                    onPopupSchoolSubjectsChange = {onPopupSchoolSubjectsChange}
                    get_classes_info = {get_classes_info}
                    timer = {timer}
                />
                <TeacherStudentsEditor
                    state = {state} 
                    onHidePopup = {onHidePopup} 
                />
            </div>

            <div className="homework_class_list_block">
                <ul className= "homework_class_list">
                    {state.classes_li_list}
                </ul>
            </div>

            <TeacherCopyInviteLink state = {state}/>
            
        </div>  
    );
}