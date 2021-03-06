import React, { useRef } from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions';
import { Image_Picker } from '../Image_Picker/Image_Picker';
import { WrappedLanguages } from '../../Languages/Languages';
import { profile_get_data, profile_put_data, showPopup } from '../../../controllers/ProfileController';
import { logout } from '../../../controllers/AuthController';
import Axios from 'axios';

export const Teacher_Profile = ({ input_data }) => {
    let lang = input_data.lang.language;

    let langObj =
    {
        ua:
        {
            requiredField: "*Обов'язкове поле",
            warningTitleRequired: "Ви не заповнили обов'язкові поля!",
            errorTitle: "Щось пішло не так",
            successChanges: "Зміни успішно збережені",
            exit: "Вихід",
            firstname: "Ім'я",
            surname: "Фамілія",
            patronymic: "По батькові",
            school: "Назва школи",
            phone: "Номер телефону",
            save: "Зберегти зміни"
        },
        ru:
        {
            requiredField: "*Обязательное поле",
            warningTitleRequired: "Вы не заполнили обязательные поля!",
            errorTitle: "Что-то пошло не так",
            successChanges: "Изменения успешно сохранены",
            exit: "Выход",
            firstname: "Имя",
            surname: "Фамилия",
            patronymic: "Отчество",
            school: "Название школы",
            phone: "Номер телефона",
            save: "Сохранить изменения"
        },
        en:
        {
            requiredField: "*Required field",
            warningTitleRequired: "You need to fill in the required fields!",
            errorTitle: "Something went wrong",
            successChanges: "Changes saved successfully",
            exit: "Log out",
            firstname: "Name",
            surname: "Surname",
            patronymic: "Patronymic",
            school: "School",
            phone: "Phone number",
            save: "Save changes"
        }
    };

    let onChange_input_fields = (which_input, value) => {
        switch (which_input) {
            case 'name_input': { input_data.dispatch(ActionCreators.change_input_data_name(value)); break; }
            case 'surname_input': { input_data.dispatch(ActionCreators.change_input_data_surname(value)); break; }
            case 'lastName_input': { input_data.dispatch(ActionCreators.change_input_data_lastName(value)); break; }
            case 'school_input': { input_data.dispatch(ActionCreators.change_input_data_school(value)); break; }
            case 'phone_input': { input_data.dispatch(ActionCreators.change_input_data_phone_numbers(value)); break; }
        }
    }

    let onSaveInputData = async () => {

        let { name, surname, lastName, school } = input_data;

        if (name.length && surname.length && lastName.length && school.length) {
            let changedDataObj = {
                img_src: input_data.img_src,
                name,
                surname,
                lastName,
                school,
                phoneNumbers: input_data.phoneNumbers
            }
            await profile_put_data(changedDataObj, input_data.userType)(input_data.dispatch);
        }
        else showPopup(input_data.dispatch, langObj[lang].warningTitleRequired, false);
    }

    let onLogOut = async () => {
        await logout("teacher")(input_data.dispatch);
    }

    let popup_span_color = input_data.save_popup_span_title === langObj[lang].successChanges ? "" : " red_color";
    return (
        <div className="profile_wrapper">
            <WrappedLanguages />
            <button className="profile_wrapper_exit_btn blue_btn" onClick={onLogOut}>{langObj[lang].exit}</button>
            <div className="profile_data">

                <Image_Picker input_data={input_data} />

                <div className="profile_data_fields_blocks_wrapper">

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].firstname}</span>
                            <span className="important_field">{langObj[lang].requiredField}</span>
                        </div>
                        <input type="text" onChange={(e) => { onChange_input_fields("name_input", e.target.value) }} value={input_data.name} />
                    </div>

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].surname}</span>
                            <span className="important_field">{langObj[lang].requiredField}</span>
                        </div>
                        <input type="text" onChange={(e) => { onChange_input_fields("surname_input", e.target.value) }} value={input_data.surname} />
                    </div>

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].patronymic}</span>
                            <span className="important_field">{langObj[lang].requiredField}</span>
                        </div>
                        <input type="text" onChange={(e) => { onChange_input_fields("lastName_input", e.target.value) }} value={input_data.lastName} />
                    </div>

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].school}</span>
                            <span className="important_field">{langObj[lang].requiredField}</span>
                        </div>
                        <input type="text" onChange={(e) => { onChange_input_fields("school_input", e.target.value) }} value={input_data.school} />
                    </div>

                    <div className="profile_data_fields_block">
                        <div className="profile_data_span_wrapper">
                            <span>{langObj[lang].phone}</span>
                        </div>
                        <textarea
                            name="phone_field" id="phone_field" cols="50" rows="5"
                            onChange={(e) => { onChange_input_fields("phone_input", e.target.value) }}
                            value={input_data.phoneNumbers}>
                        </textarea>
                    </div>
                    
                </div>

                <div className="profile_data_save_popup_title">
                    <span className={input_data.save_popup_span_class + popup_span_color}>{input_data.save_popup_span_title}</span>
                </div>
                <button className="profile_data_save_btn blue_btn" onClick={onSaveInputData}>{langObj[lang].save}</button>

            </div>
        </div>
    );
}