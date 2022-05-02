import { useState, useEffect } from "react";
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import { get_sent_requests_to_teachers } from '../../../../../controllers/StudentHomeworkController';
import avatar from '../../../../Profile/default_user_image';

export const SentOrAcceptedTeacherCard = ({ state, lang }) => {

    let langObj = {
        ua: {
            school: "Школа",
            schoolSubjects: "Предмети",
        },
        ru: {
            school: "Школа",
            schoolSubjects: "Предметы",
        },
        en: {
            school: "School",
            schoolSubjects: "Subjects",
        }
    }

    const [name, setName] = useState("Микола"); // в редакс
    const [surname, setSurname] = useState("Москаленко"); // в редакс
    const [lastName, setLastName] = useState("Васильович"); // в редакс
    const [schoolSubjects, setSchoolSubjects] = useState("Хімія, фізика"); // в редакс
    const [teacherAvatar, setTeacherAvatar] = useState(""); // в редакс
    const [classId, setClassId] = useState(""); // в редакс

    useEffect(async() => {
        let teachersList = await get_sent_requests_to_teachers();
    },[]);

    return (
        <div className={"homework_popup_menu_item_content_requests_to_teachers " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_requests_to_teacher_cards_list">

                <li className="compact_teacher_card">

                    <div className="compact_teacher_card_inner_avatar_and_info_wrapper">
                        <img src={avatar} alt="not found" />
                        <div className="compact_teacher_card_inner_info">
                            <span className="teacher_fio">{surname} {name} {lastName}</span>
                            <span className="teacher_school">{langObj[lang].schoolSubjects} - {schoolSubjects}</span>
                        </div>
                    </div>

                    <div className="compact_teacher_card_buttons_wrapper">
                        <button className="homework_popup_delete_class_btn blue_btn deny_btn"></button>
                    </div>
                </li>


            </ul>

        </div>
    );
}