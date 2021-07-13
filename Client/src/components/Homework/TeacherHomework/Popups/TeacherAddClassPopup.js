import * as ActionCreators from '../../../../Redux/Actions/actions_homework';
import Axios from 'axios';


export const TeacherAddClassPopup = ({state,onHidePopup,onPopupClassTitleChange,onPopupSchoolSubjectsChange,get_classes_info,timer}) =>
{
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            popupHeader: "Створення класу",
            classTitle : "Назва класу",
            requiredField: "*Обов'язкове поле",
            subjectField: "Предмети (через кому)",
            warningTitle: "Поля не мають бути пустими!",
            addClassTitle: "Створити клас"
        },
        ru:
        {
            popupHeader: "Создание класса",
            classTitle : "Название класса",
            requiredField: "*Обязательное поле",
            subjectField: "Предметы (через кому)",
            warningTitle: "Все поля обязательные к заполнению!",
            addClassTitle: "Создать класс"
        },
        en: 
        {
            popupHeader: "Creating a class",
            classTitle : "Class name",
            requiredField: "*Required field",
            subjectField: "Subjects (through the coma)",
            warningTitle: "All fields are required!",
            addClassTitle: "Create class"
        }
    };
    let onPopupSubmit = () =>
    {
        let final_school_subject_arr = state.school_subjects.split(',').map((subj) => { // фильтруем нашу строку предметов и превращаем ее в массив
            let sub = subj.trim();
            return sub.charAt(0).toUpperCase() + sub.slice(1);
        }).filter(subj => {if(subj != 0) return subj;});

        if(state.new_class_title === "" || final_school_subject_arr.length === 0) // проверяем не пустые ли обязательные поля в попапе
        {   
            window.clearTimeout(timer.current);
            state.dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
            timer.current = window.setTimeout(()=> {state.dispatch(ActionCreators.change_homework_popup_warning_title_class(""))},4000);
        }
        else 
        {
            try
            {
                Axios.post("http://localhost:3001/diary_menu/homework/add_new_class",
                { 
                    teacher_id : window.localStorage.getItem("userToken"),
                    title : state.new_class_title,
                    school_subjects : final_school_subject_arr
                }).then((response) =>
                {
                    onHidePopup();
                    get_classes_info();
                });
            }
            catch(e)
            {
                console.log("что-то не так");
            }
        }
    }

    return (
        <div className= {"homework_popup add_class_popup " + state.homework_popup_active_type}>

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

                <span className= {"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>
                <button className= {"homework_popup_add_class_btn blue_btn"} onClick = {onPopupSubmit}>{langObj[lang].addClassTitle}</button>

            </div>

        </div>
    );
}