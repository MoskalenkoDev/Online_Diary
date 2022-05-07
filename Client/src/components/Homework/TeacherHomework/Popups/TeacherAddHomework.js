import { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../../Redux/Actions/actions_homework';

export const TeacherAddHomework = ({ state, onHidePopup, homework_popup_active_type }) => {


    let lang = state.lang.language;
    let langObj =
    {
        ua: {
            popupHeader: "Додавання домашнього завдання",
            dataTitle: "Оберіть дату",
            requiredField: "*Обов'язкове поле",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не мають бути пустими!",
            addHomeworkBtnTitle: "Зберегти",
            editBtnTitle: "Редагувати",
            denyBtnTitle: "Відміна",
            deleteHomeworkBtnTitle: "Видалити запис",
            homeworkInputPlaceholder: "Введіть домашнє завдання"
        },
        ru: {
            popupHeader: "Добавление домашнего задания",
            dataTitle: "Выберите дату",
            requiredField: "*Обязательное поле",
            subjectsBtnTitle: "Предмет",
            warningTitle: "Поля не должны быть пустыми!",
            addHomeworkBtnTitle: "Сохранить",
            editBtnTitle: "Редактировать",
            denyBtnTitle: "Отменить",
            deleteHomeworkBtnTitle: "Видалити запис",
            homeworkInputPlaceholder: "Введіть домашнє завдання"
        },
        en: {
            popupHeader: "Додавання домашнього завдання",
            dataTitle: "Оберіть дату",
            requiredField: "*Required field",
            subjectsBtnTitle: "Предмет",
            warningTitle: "All fields must be filled!",
            addHomeworkBtnTitle: "Save",
            editBtnTitle: "Edit",
            denyBtnTitle: "Cancel",
            deleteHomeworkBtnTitle: "Видалити запис",
            homeworkInputPlaceholder: "Введіть домашнє завдання"
        }
    };

    return (
        <div className={"homework_popup add_homework_popup " + homework_popup_active_type}>

            <div className="popup_header">
                <span>{langObj[lang].popupHeader}</span>
                <button className="close_popup_btn" onClick={onHidePopup}></button>
            </div>

            <div className="homework_popup_content">

                <div className="homework_popup_input_block">

                    <div className="homework_popup_data_wrapper">

                        <div className="homework_choose_data">

                            <div className="subject_drop_down">

                                <button className='subject_drop_down_btn'>
                                    <span className='subject_drop_down_header_selected'>Виберіть предмет</span>
                                </button>

                                <ul className='drop_down_li_list '>
                                    <li>Хімія</li>
                                    <li>Фізика</li>
                                    <li>Математика</li>
                                </ul>

                            </div> 

                            <span className='homework_choose_data_title'>{langObj[lang].subjectsBtnTitle}</span>
                        </div>

                        <div className="homework_choose_data">
                            <input type="date" />
                            <span className='homework_choose_data_title'>{langObj[lang].dataTitle}</span>
                        </div>
                    </div>

                    <div className="homework_popup_create_homework_message">
                        <textarea placeholder='Текст домашнього завдання...'></textarea>
                    </div>

                </div>

                <span className={"popup_warning_span " + state.popup_warning_class}>{langObj[lang].warningTitle}</span>

                <div className="homework_popup_buttons_wrapper">
                    <button className={"gray_btn blue_btn homework_peaky_btn"}>{langObj[lang].editBtnTitle}</button>
                    <button className={"blue_btn homework_peaky_btn"} >{langObj[lang].addHomeworkBtnTitle}</button>
                </div>

            </div>

        </div>
    );

}