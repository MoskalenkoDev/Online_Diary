import { useState, useEffect, useRef } from "react";
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import { get_sent_requests_to_teachers, delete_sent_request_to_teacher_item } from '../../../../../controllers/StudentHomeworkController';

export const SentRequestsToTeachers = ({ state, lang, prevActiveMenuItem }) => {

    let langObj = {
        ua: {
            school: "Школа",
            schoolSubjects: "Предмети",
            EmptyTeachersList: "Ви не відправляли вчителям заявок"
        },
        ru: {
            school: "Школа",
            schoolSubjects: "Предметы",
            EmptyTeachersList: "Вы не отправляли учителям заявок"
        },
        en: {
            school: "School",
            schoolSubjects: "Subjects",
            EmptyTeachersList: "You did not send requests to teachers"
        }
    }

    let currentListLength = useRef();

    let deleteTeacherFromRequestList = async (class_id) => {
        let isDeleted = await delete_sent_request_to_teacher_item(class_id);
        if (isDeleted) {
            state.dispatch(ActionCreators.delete_homework_requests_to_teachers_li_list_item(class_id));
            if (currentListLength.current === 1) setIsEmptyListClass('visible');
        }
    }

    let li_creator = (teachersInfoList) => {

        let our_li_components = teachersInfoList.map(({ img_src, name, surname, lastName, school_subjects, class_id }, index) => {
            return (
                <li className="compact_user_card " key={class_id}>

                    <div className="compact_user_card_inner_content_wrapper">
                        <div className="compact_user_card_inner_avatar_and_info_wrapper">
                            <img src={img_src} alt="not found" />
                            <div className="compact_user_card_inner_info">
                                <span className="user_fio">{surname} {name} {lastName}</span>
                                <span>{langObj[lang].schoolSubjects} - {school_subjects}</span>
                            </div>
                        </div>

                        <div className="compact_user_card_buttons_wrapper">
                            <button className="homework_popup_delete_class_btn blue_btn deny_btn" onClick={() => { deleteTeacherFromRequestList(class_id) }}></button>
                        </div>
                    </div>

                </li>
            );
        })
        state.dispatch(ActionCreators.change_homework_requests_to_teachers_li_list(our_li_components));
    }

    const [isEmptyListClass, setIsEmptyListClass] = useState("");

    useEffect(async () => {

        if (state.homework_popup_active_menu_item == "active_popup_menu_teachers_requests_list") {
            let teachersInfoList = await get_sent_requests_to_teachers();
            li_creator(teachersInfoList);
            teachersInfoList.length ? setIsEmptyListClass('') : setIsEmptyListClass('visible');
        }

        if (
            state.homework_popup_active_menu_item !== "active_popup_menu_teachers_requests_list" &&
            prevActiveMenuItem.current === "active_popup_menu_teachers_requests_list"
        ) {
            setIsEmptyListClass('');
            state.dispatch(ActionCreators.cleanup_homework_li_list("homework_requests_to_teachers_li_list"));
        }
        prevActiveMenuItem.current = state.homework_popup_active_menu_item;
    }, [state.homework_popup_active_menu_item]);

    useEffect(() => {
        currentListLength.current = state.homework_requests_to_teachers_li_list.filter(li => !li.props.className.split(" ").includes("deleted")).length;
    }, [state.homework_requests_to_teachers_li_list]);

    return (
        <div className={"homework_popup_menu_item_content_requests_to_teachers " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_compact_cards_wrapper">
                {state.homework_requests_to_teachers_li_list}
                <span className={"empty_list_message " + isEmptyListClass}>{langObj[lang].EmptyTeachersList}</span>
            </ul>

        </div>
    );
}