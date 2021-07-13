import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';

export const TeacherEditClassPopup = ({state,onHidePopup,onPopupClassTitleChange,onPopupSchoolSubjectsChange,timer, get_classes_info}) =>
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

    let onSaveChanges = () =>
    {
        let final_school_subject_arr = state.school_subjects.split(',').map((subj) => { // фильтруем нашу строку предметов и превращаем ее в массив
            let sub = subj.trim();
            return sub.charAt(0).toUpperCase() + sub.slice(1);
        }).filter(subj => {if(subj != 0) return subj;});

        if(state.new_class_title === "" || final_school_subject_arr.length === 0) // проверяем не пустые ли обязательные поля в попапе
        {   
            window.clearTimeout(timer.current);
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
            state.dispatch(ActionCreators.change_homework_warning_title(langObj[lang].warningTitle));
            timer.current = window.setTimeout(()=> {state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""))},4000);
        }
        else 
        {
            Axios.post('http://localhost:3001/diary_menu/homework/edit_class',
            {
                _id : state.edit_obj_id,
                title : state.new_class_title,
                school_subjects : final_school_subject_arr
            }).then(response =>
            {
                if(response.status == 200){get_classes_info();onHidePopup();} 
                else
                {
                    window.clearTimeout(timer.current);
                    state.dispatch(ActionCreators.change_homework_warning_title(langObj[lang].warningEditTitle));
                    state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
                    timer.current = window.setTimeout(()=> {state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""))},4000);
                };
            });
        }

    }

    let onDeleteClass = () =>
    {
        Axios.post('http://localhost:3001/diary_menu/homework/delete_class',
        {
            _id : state.edit_obj_id
        }).then(response =>
        {
            if(response.status == 200){get_classes_info();onHidePopup();} 
            else
            {
                window.clearTimeout(timer.current);
                state.dispatch(ActionCreators.change_homework_warning_title(langObj[lang].errorTitle));
                state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
                timer.current = window.setTimeout(()=> {state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""))},4000);
            };
        });
    }

    return(
        <div className= {"homework_popup edit_popup " + state.homework_popup_active_type}>

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
                        <input type="text" onChange ={onPopupClassTitleChange} value= {state.new_class_title}/>
                    </div>
                    
                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].subjectField}</span>
                            <span className = "important_field">{langObj[lang].requiredField}</span>
                        </div> 
                        <input type="text" onChange= {onPopupSchoolSubjectsChange} value = {state.school_subjects}/>
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