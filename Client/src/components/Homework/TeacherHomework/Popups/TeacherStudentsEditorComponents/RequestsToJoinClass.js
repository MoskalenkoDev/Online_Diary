import { useEffect , useState, useRef} from 'react';
import * as ActionCreators from '../../../../../Redux/Actions/actions_homework';
import {get_student_requests_to_join, submit_student_request_to_join, deny_student_request_to_join} from '../../../../../controllers/TeacherHomeworkController';

export const RequestsToJoinClass = ({ state, class_id , lang, prevActiveMenuItem}) => {

    let langObj = {
        ua: {
            EmptyTeachersList: "Жоден учень вам не відправляв заявки"
        },
        ru: {
            EmptyTeachersList: "Ни один ученик не отправлял вам заявки"
        },
        en: {
            EmptyTeachersList: "No students have sent you a request"
        }
    }

    let currentListLength = useRef();

    const onSubmitStudent = async (student_id) => {
        const isSubmit = await submit_student_request_to_join(student_id, class_id);
        if (isSubmit) {
            state.dispatch(ActionCreators.delete_homework_student_requests_to_join_li_list_item(student_id));
            if(currentListLength.current === 1) setIsEmptyListClass('visible');
        } 
    }

    const onDenyStudent = async (student_id) => {
        const isDeny = await deny_student_request_to_join(student_id, class_id);
        if (isDeny) {
            state.dispatch(ActionCreators.delete_homework_student_requests_to_join_li_list_item(student_id));
            if(currentListLength.current === 1) setIsEmptyListClass('visible');
        } 
    }

    let li_creator = (studentsInfoList) => {

        let our_li_components = studentsInfoList.map(({img_src, name, surname, lastName, student_id}, index) => {
            return (
                <li className="compact_user_card " key={student_id}>

                    <div className="compact_user_card_inner_content_wrapper">

                        <div className="compact_user_card_inner_avatar_and_info_wrapper">
                            <img src={img_src} alt="not found" />
                            <div className="compact_user_card_inner_info">
                                <span className="user_fio">{surname} {name} {lastName}</span>
                            </div>
                        </div>

                        <div className="compact_user_card_buttons_wrapper">
                            <button className="homework_peaky_btn blue_btn submit_btn" onClick={() => {onSubmitStudent(student_id)}} ></button>
                            <button className="homework_popup_delete_class_btn blue_btn deny_btn" onClick={() => {onDenyStudent(student_id)}}></button>
                        </div>    
                                            
                    </div>

                </li>
            );
        })
        state.dispatch(ActionCreators.change_homework_student_requests_to_join_li_list(our_li_components));
    }

    const [isEmptyListClass, setIsEmptyListClass] = useState("");

    useEffect(async () => {

        if(state.homework_popup_active_menu_item == "active_popup_menu_requests_list") {
            let studentsInfoList = await get_student_requests_to_join(class_id);
            li_creator(studentsInfoList);
            studentsInfoList.length? setIsEmptyListClass('') : setIsEmptyListClass('visible');
        }

        if(
            state.homework_popup_active_menu_item !== "active_popup_menu_requests_list" && 
            prevActiveMenuItem.current === "active_popup_menu_requests_list"
        ) {
            setIsEmptyListClass('');
            state.dispatch(ActionCreators.cleanup_homework_li_list("homework_student_requests_to_join_li_list"));
        }
        prevActiveMenuItem.current = state.homework_popup_active_menu_item;

    },[state.homework_popup_active_menu_item]);

    useEffect(() => {
        currentListLength.current = state.homework_student_requests_to_join_li_list.filter(li => !li.props.className.split(" ").includes("deleted")).length;
    },[state.homework_student_requests_to_join_li_list]);

    return (
        <div className={"homework_popup_menu_item_content_requests_to_join_class " + state.homework_popup_active_menu_item}>

            <ul className="homework_popup_menu_item_content_compact_cards_wrapper">
                {state.homework_student_requests_to_join_li_list}
                <span className={"empty_list_message " + isEmptyListClass }>{langObj[lang].EmptyTeachersList}</span>
            </ul>

        </div>
    );

}