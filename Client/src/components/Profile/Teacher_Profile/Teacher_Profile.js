import React, { useRef} from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions';
import {Image_Picker} from '../Image_Picker/Image_Picker';
import {WrappedLanguages} from '../../Languages/Languages';
import Axios from 'axios';

export const Teacher_Profile = ({input_data}) =>
{
    let lang = input_data.lang.language;
    let langObj =
    {
        ua:
        {
            requiredField: "*Обов'язкове поле",
            warningTitleRequired: "Ви не заповнили обов'язкові поля!",
            errorTitle: "Щось пішло не так",
            successChanges : "Зміни успішно збережені",
            exit : "Вихід",
            firstname: "Ім'я",
            surname:"Фамілія",
            patronymic :"По батькові",
            subjects: "Предмет викладання",
            school : "Назва школи",
            phone: "Номер телефону",
            save: "Зберегти зміни"
        },
        ru:
        {
            requiredField: "*Обязательное поле",
            warningTitleRequired: "Вы не заполнили обязательные поля!",
            errorTitle: "Что-то пошло не так",
            successChanges : "Изменения успешно сохранены",
            exit : "Выход",
            firstname: "Имя",
            surname:"Фамилия",
            patronymic :"Отчество",
            subjects: "Предмет преподавания",
            school : "Название школы",
            phone: "Номер телефона",
            save: "Сохранить изменения"
        },
        en: 
        {
            requiredField: "*Required field",
            warningTitleRequired: "You need to fill in the required fields!",
            errorTitle: "Something went wrong",
            successChanges : "Changes saved successfully",
            exit : "Log out",
            firstname: "Name",
            surname:"Surname",
            patronymic :"Patronymic",
            subjects: "School subjects",
            school : "School",
            phone: "Phone number",
            save: "Save changes"
        }
    };

    let onChange_input_fields = (which_input,value) =>
    {
        switch(which_input)
        {
            case 'name_input' : {input_data.dispatch(ActionCreators.change_input_data_name(value));break;}
            case 'surname_input' : {input_data.dispatch(ActionCreators.change_input_data_surname(value));break;}
            case 'lastName_input' : {input_data.dispatch(ActionCreators.change_input_data_lastName(value));break;}
            case 'school_input' : {input_data.dispatch(ActionCreators.change_input_data_school(value));break;}
            case 'school_subject_input' : {input_data.dispatch(ActionCreators.change_input_data_school_subject(value));break;}
            case 'phone_input' : {input_data.dispatch(ActionCreators.change_input_data_phone_numbers(value));break;}
        }
    }

    let timer = useRef(null);
    let show_save_popup = (title) =>
    {
        clearTimeout(timer.current);
        input_data.dispatch(ActionCreators.change_profile_save_popup_class("active_save_profile_popup_title"));
        input_data.dispatch(ActionCreators.change_profile_save_popup_title(title));
        timer.current = window.setTimeout(() =>
        {
            input_data.dispatch(ActionCreators.change_profile_save_popup_class(""));
        }, 3000);
    }

    let onSaveInputData = () =>
    {
        let {name,surname,lastName,school,school_subject} = input_data;
        if(name == "" || surname == "" || lastName == "" || school == "" || school_subject == "") 
        {
            show_save_popup(langObj[lang].warningTitleRequired);
            return;
        }
        try
        {
            Axios.post("http://localhost:3001/teacher/diary_menu/profile/save_input_data",
            { 
                email : window.localStorage.getItem("userToken"),
                img_src : input_data.img_src,
                name,
                surname,
                lastName,
                school,
                school_subject,
                phoneNumbers : input_data.phoneNumbers
            }).then((response) =>
            {
                show_save_popup(langObj[lang].successChanges);
            });
        }
        catch(e)
        {
            show_save_popup(langObj[lang].errorTitle);
        }
    }

    let onLogOut = () =>
    {
      window.localStorage.removeItem('userToken');
      window.localStorage.removeItem('status');
      input_data.dispatch(ActionCreators.change_redirect_logout());
    }
    
    let popup_span_color = input_data.save_popup_span_title === langObj[lang].successChanges ? "" : " red_color";
    return (
        <div className="profile_wrapper">
            <WrappedLanguages/>
            <button className = "profile_wrapper_exit_btn blue_btn" onClick = {onLogOut}>{langObj[lang].exit}</button>
            <div className="profile_data">

                <Image_Picker input_data = {input_data}/>

                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].firstname}</span>
                        <span className = "important_field">{langObj[lang].requiredField}</span>
                    </div> 
                    <input type="text" onChange = {(e) => {onChange_input_fields("name_input",e.target.value)}} value = {input_data.name}/>
                </div>

                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].surname}</span>
                        <span className = "important_field">{langObj[lang].requiredField}</span>
                    </div> 
                    <input type="text" onChange = {(e) => {onChange_input_fields("surname_input",e.target.value)}} value = {input_data.surname}/>
                </div>

                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].patronymic}</span>
                        <span className = "important_field">{langObj[lang].requiredField}</span>
                    </div> 
                    <input type="text" onChange = {(e) => {onChange_input_fields("lastName_input",e.target.value)}} value = {input_data.lastName}/>
                </div>
                
                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].subjects}</span>
                        <span className = "important_field">{langObj[lang].requiredField}</span>
                    </div> 
                    <input type="text" onChange = {(e) => {onChange_input_fields("school_subject_input",e.target.value)}} value = {input_data.school_subject}/>
                </div>

                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].school}</span>
                        <span className = "important_field">{langObj[lang].requiredField}</span>
                    </div> 
                    <input type="text" onChange = {(e) => {onChange_input_fields("school_input",e.target.value)}} value = {input_data.school}/>
                </div>

                <div className="profile_data_fields_block">
                    <div className="profile_data_span_wrapper">
                        <span>{langObj[lang].phone}</span>
                    </div> 
                    <textarea 
                            name="phone_field" id="phone_field" cols="50" rows="5" 
                            onChange = {(e) => {onChange_input_fields("phone_input", e.target.value)}} 
                            value = {input_data.phoneNumbers}>
                    </textarea>
                </div>
                <div className="profile_data_save_popup_title">
                    <span className = {input_data.save_popup_span_class + popup_span_color}>{input_data.save_popup_span_title}</span>
                </div>
                <button className = "profile_data_save_btn blue_btn" onClick = {onSaveInputData}>{langObj[lang].save}</button>

            </div>
        </div>
    );
}