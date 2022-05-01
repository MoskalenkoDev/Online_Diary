import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';

import { edit_class, delete_class, get_classes_info } from '../../../../controllers/TeacherHomeworkController';


export const TeacherEditClassPopup = ({
    state,
    school_subjects,
    new_class_title,
    edit_obj_id,
    homework_popup_active_type,
    onHidePopup,
    onPopupClassTitleChange,
    onPopupSchoolSubjectsChange,
    timer, 
    li_creator
}) =>
{
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            popupHeader: "Редагування",
            classTitle : "Назва класу",
            requiredField: "*Обов'язкове поле",
            subjectField: "Предмети (через кому)",
            warningTitle: "Поля не мають бути пустими!",
            warningEditTitle : "Не вдалося відредагувати клас",
            errorTitle: "Не вдалося видалити клас!",
            saveChangesBtn: "Зберегти",
            deleteClassBtn: "Видалити клас"
        },
        ru:
        {
            popupHeader: "Редактирование",
            classTitle : "Название класса",
            requiredField: "*Обязательное поле",
            subjectField: "Предметы (через кому)",
            warningTitle: "Все поля обязательные к заполнению!",
            warningEditTitle : "Не удалось отредактировать класс",
            errorTitle: "Не удалось удалить класс!",
            saveChangesBtn: "Сохранить",
            deleteClassBtn: "Удалить класс"
        },
        en: 
        {
            popupHeader: "Editing",
            classTitle : "Class name",
            requiredField: "*Required field",
            subjectField: "Subjects (through the coma)",
            warningTitle: "All fields are required!",
            warningEditTitle : "Failed to edit class",
            errorTitle: "Failed to delete class!",
            saveChangesBtn: "Save",
            deleteClassBtn: "Delete class",
        }
    };

    let onSaveChanges = async() =>
    {
        let final_school_subject_arr = school_subjects.split(',').map((subj) => { // фильтруем нашу строку предметов и превращаем ее в массив
            let sub = subj.trim();
            return sub.charAt(0).toUpperCase() + sub.slice(1);
        }).filter(subj => {if(subj != 0) return subj;});

        if(new_class_title === "" || final_school_subject_arr.length === 0) // проверяем не пустые ли обязательные поля в попапе
        {   
            window.clearTimeout(timer.current);
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
            state.dispatch(ActionCreators.change_homework_warning_title(langObj[lang].warningTitle));
            timer.current = window.setTimeout(()=> {state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""))},4000);
        }
        else 
        {
            await edit_class(edit_obj_id, new_class_title, final_school_subject_arr); 
            await get_classes_info(li_creator);
            onHidePopup();
        }

    }

    let onDeleteClass = async() =>
    {
        await delete_class(edit_obj_id);
        await get_classes_info(li_creator);
        onHidePopup();
    }

    return(
        <div className= {"homework_popup edit_popup " + homework_popup_active_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className = "close_popup_btn" onClick ={onHidePopup}></button>
            </div>
            
            <div className="homework_popup_content">

                <div className="homework_popup_input_block">

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].classTitle}</span>
                            <span className = "important_field">{langObj[lang].requiredField}</span>
                        </div> 
                        <input type="text" onChange ={onPopupClassTitleChange} value= {new_class_title}/>
                    </div>
                    
                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].subjectField}</span>
                            <span className = "important_field">{langObj[lang].requiredField}</span>
                        </div> 
                        <input type="text" onChange= {onPopupSchoolSubjectsChange} value = {school_subjects}/>
                    </div>

                </div>

                <span className= {"popup_warning_span " + state.popup_warning_class}>{state.homework_warning_title}</span>
                <div className="homework_popup_buttons_wrapper">
                    <button className= {"homework_popup_delete_class_btn blue_btn"} onClick = {onDeleteClass}>{langObj[lang].deleteClassBtn}</button>
                    <button className= {"homework_popup_add_class_btn blue_btn"} onClick = {onSaveChanges}>{langObj[lang].saveChangesBtn}</button>
                </div>

            </div>

        </div>
    )
}