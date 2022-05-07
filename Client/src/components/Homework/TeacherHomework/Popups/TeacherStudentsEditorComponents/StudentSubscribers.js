import { useEffect, useState, useRef } from 'react';
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import {get_student_subscribers, kick_student} from '../../../../../controllers/TeacherHomeworkController';

export const StudentSubscribers = ({ state, class_id , lang, prevActiveMenuItem}) => {

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

    let currentListLength = useRef();

    const onKickStudent = async (student_id) => {
        const isKicked = await kick_student(student_id, class_id);
        if (isKicked) {
            state.dispatch(ActionCreators.delete_homework_students_in_class_li_list_item(student_id));
            if(currentListLength.current === 1) setIsEmptyListClass('visible');
        } 
    }

    let li_creator = (studentsInfoList) => {

        let our_li_components = studentsInfoList.map(({img_src, name, surname, lastName, phoneNumbers, student_id}, index) => {
            return (
                <li className="compact_user_card " key={student_id}>

                    <div className="compact_user_card_inner_content_wrapper">

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
                                        
                    </div>

                </li>
            );
        })
        state.dispatch(ActionCreators.change_homework_students_in_class_li_list(our_li_components));
    }

    const [isEmptyListClass, setIsEmptyListClass] = useState("");

    useEffect(() => {
        state.dispatch(ActionCreators.clean_homework_teachers_li_lists());
    }, [class_id]);

    useEffect(async () => {
        if(state.homework_popup_active_menu_item == "active_popup_menu_students_list" && class_id) {
            let studentsInfoList = await get_student_subscribers(class_id);
            li_creator(studentsInfoList);
            studentsInfoList.length? setIsEmptyListClass('') : setIsEmptyListClass('visible');
        }

        if(
            state.homework_popup_active_menu_item !== "active_popup_menu_students_list" && 
            prevActiveMenuItem.current === "active_popup_menu_students_list"
        ) {
            setIsEmptyListClass('');
            state.dispatch(ActionCreators.cleanup_homework_li_list("homework_students_in_class_li_list"));
        }
        prevActiveMenuItem.current = state.homework_popup_active_menu_item;
    },[state.homework_popup_active_menu_item, class_id]); // we use class_id because after refresh page our class_id is empty and we will get error

    useEffect(() => {
        currentListLength.current = state.homework_students_in_class_li_list.filter(li => !li.props.className.split(" ").includes("deleted")).length;
    },[state.homework_students_in_class_li_list]);

    return (
        <div className={"homework_popup_menu_item_content_student_subscribers " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_compact_cards_wrapper">
                {state.homework_students_in_class_li_list}
                <span className={"empty_list_message " + isEmptyListClass }>{langObj[lang].EmptyTeachersList}</span>
            </ul>

        </div>
    );

}