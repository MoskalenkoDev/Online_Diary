import { useEffect, useRef, useState } from 'react';

export const TeacherAddHomeworkWarningCopyHomeworkText = ({ homeworkDate , homeworkSubject, onHidePopup, onSubmitCopyAndChangeDay }) => {

    return (
        

            <div className={"homework_popup warning_copy_homework_popup"}>

                <div className="popup_header">
                    <span>Конфлікт</span>
                    <button className="close_popup_btn" onClick={onHidePopup}></button>
                </div>

                <div className="homework_popup_content">

                    <div className="homework_popup_input_block">
                        <span>На {homeworkDate} по предмету {homeworkSubject} вже задно домашнє завдання.</span>
                        <span>Бажаєте переглянути цей запис?</span>
                        <span>(Текст домашного завдання буде скопійовано в буфер обміну)</span>
                    </div>

                    <div className="homework_popup_buttons_wrapper">
                        <button className={"homework_popup_delete_class_btn blue_btn"} onClick={onHidePopup}>Відмінити</button>
                        <button className={"homework_peaky_btn blue_btn"} onClick={onSubmitCopyAndChangeDay}>Переглянути</button>
                    </div>

                </div>

            </div>

        

    );
}