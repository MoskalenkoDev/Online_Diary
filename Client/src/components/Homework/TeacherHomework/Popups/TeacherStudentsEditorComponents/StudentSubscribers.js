import { useEffect } from 'react';
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import {get_student_subscribers, kick_student} from '../../../../../controllers/TeacherHomeworkController';

export const StudentSubscribers = ({ state, class_id , lang}) => {

    let langObj = {
        ua: {
            phoneNumHeader: "Контакти",
            EmptyTeachersList: "Ви не прийняли жодного учня"
        },
        ru: {
            phoneNumHeader: "Контакты",
            EmptyTeachersList: "Вы не приняли ни одного ученика"
        },
        en: {
            phoneNumHeader: "Contacts",
            EmptyTeachersList: "You have not accepted any students"
        }
    };

    const onKickStudent = async (student_id) => {

        const isKicked = await kick_student(student_id, class_id);
        if(isKicked) state.dispatch(ActionCreators.delete_homework_students_in_class_li_list_item(student_id));

    }

    let li_creator = (studentsInfoList) => {

        let our_li_components = studentsInfoList.map(({img_src, name, surname, lastName, phoneNumbers, student_id}, index) => {
            return (
                <li className="compact_user_card" key={student_id}>

                    <div className="compact_user_card_inner_avatar_and_info_wrapper">
                        <img src={img_src} alt="not found" />
                        <div className="compact_user_card_inner_info">
                            <span className="user_fio">{surname} {name} {lastName}</span>
                            <span>{langObj[lang].phoneNumHeader} : {phoneNumbers}</span>
                        </div>
                    </div>

                    <div className="compact_user_card_buttons_wrapper">
                        <button className="homework_popup_delete_class_btn blue_btn deny_btn" onClick={() => {onKickStudent(student_id)}}></button>
                    </div>
                </li>
            );
        })
        state.dispatch(ActionCreators.change_homework_students_in_class_li_list(our_li_components));
    }

    useEffect(async () => {

        if(state.homework_popup_active_menu_item == "active_popup_menu_students_list" && class_id) {
            let studentsInfoList = await get_student_subscribers(class_id);
            li_creator(studentsInfoList);
        }
    },[state.homework_popup_active_menu_item, class_id]);


    return (
        <div className={"homework_popup_menu_item_content_student_subscribers " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_compact_cards_wrapper">
                {state.homework_students_in_class_li_list}
                <span className={"empty_list_message " + (state.homework_students_in_class_li_list.length? "" : "visible")}>{langObj[lang].EmptyTeachersList}</span>
            </ul>

        </div>
    );

}