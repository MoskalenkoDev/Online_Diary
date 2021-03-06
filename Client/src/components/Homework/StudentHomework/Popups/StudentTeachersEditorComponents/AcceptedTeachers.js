import { useState, useEffect , useRef} from "react";
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import {get_accepted_teachers, unsubscribe_from_teacher} from '../../../../../controllers/StudentHomeworkController';

export const AcceptedTeachers = ({ state, lang, prevActiveMenuItem }) => {

    let langObj = {
        ua: {
            schoolSubjects: "Предмети",
            phoneNumHeader: "Контакти",
            EmptyTeachersList: "Жоден вчитель не прийняв вашої заявки"
        },
        ru: {
            schoolSubjects: "Предметы",
            phoneNumHeader: "Контакты",
            EmptyTeachersList: "Ни один учитель не принял заявки"
        },
        en: {
            schoolSubjects: "Subjects",
            phoneNumHeader: "Contacts",
            EmptyTeachersList: "No teacher has accepted your request"
        }
    }


    let currentListLength = useRef();

    let unsubscribeTeacherFromAcceptedList = async (class_id) => {
        let isUnsubsribed = await unsubscribe_from_teacher(class_id);
        if (isUnsubsribed) {
            state.dispatch(ActionCreators.delete_homework_accepted_teachers_li_list_item(class_id));
            if(currentListLength.current === 1) setIsEmptyListClass('visible');
        } 
    }

    let li_creator = (teachersInfoList) => {

        let our_li_components = teachersInfoList.map(({img_src, name, surname, lastName, school_subjects, phoneNumbers, class_id}, index) => {
            return (
                <li className="compact_user_card " key={class_id}>

                    <div className="compact_user_card_inner_content_wrapper">
                        <div className="compact_user_card_inner_avatar_and_info_wrapper">
                            <img src={img_src} alt="not found" />
                            <div className="compact_user_card_inner_info">
                                <span className="user_fio">{surname} {name} {lastName}</span>
                                <span>{langObj[lang].schoolSubjects} - {school_subjects}</span>
                                <span>{langObj[lang].phoneNumHeader} : {phoneNumbers}</span>
                            </div>
                        </div>

                        <div className="compact_user_card_buttons_wrapper">
                            <button className="homework_popup_delete_class_btn blue_btn deny_btn" onClick={()=> {unsubscribeTeacherFromAcceptedList(class_id)}}></button>
                        </div>
                    </div>

                </li>
            );
        })
        state.dispatch(ActionCreators.change_homework_accepted_teachers_li_list(our_li_components));
    }
    const [isEmptyListClass, setIsEmptyListClass] = useState("");

    useEffect(async() => {
        if(state.homework_popup_active_menu_item == "active_popup_menu_teachers_list") {
            let teachersInfoList = await get_accepted_teachers();
            li_creator(teachersInfoList);
            teachersInfoList.length? setIsEmptyListClass('') : setIsEmptyListClass('visible');
        }

        if(
            state.homework_popup_active_menu_item !== "active_popup_menu_teachers_list" && 
            prevActiveMenuItem.current === "active_popup_menu_teachers_list"
        ) {
            setIsEmptyListClass('');
            state.dispatch(ActionCreators.cleanup_homework_li_list("homework_accepted_teachers_li_list"));
        }
        prevActiveMenuItem.current = state.homework_popup_active_menu_item;

    },[state.homework_popup_active_menu_item]);

    useEffect(() => {
        currentListLength.current = state.homework_accepted_teachers_li_list.filter(li => !li.props.className.split(" ").includes("deleted")).length;
    },[state.homework_accepted_teachers_li_list]);

    return (
        <div className={"homework_popup_menu_item_content_accepted_teachers " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_compact_cards_wrapper">
                {state.homework_accepted_teachers_li_list}
                <span className={"empty_list_message " + isEmptyListClass }>{langObj[lang].EmptyTeachersList}</span>
            </ul>

        </div>
    );
}