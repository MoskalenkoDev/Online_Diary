import { useState , useEffect, useRef} from "react";
import { search_teacher_by_id , send_subscription_request} from '../../../../../controllers/StudentHomeworkController';

export const AddTeacherCard = ({ state, lang }) => {

    let langObj = {
        ua: {
            school: "Школа",
            schoolSubjects: "Предмети",
            searchTeacherTitle: "Пошук",
            searchTeacherDescription: "Вставте код посилання, який вам дав учитель для отримання доступу в клас",
            joinDescription: "Вставте посилання...",
            sendBtnTitle: "Відправити",
        },
        ru: {
            school: "Школа",
            schoolSubjects: "Предметы",
            searchTeacherTitle: "Поиск",
            searchTeacherDescription: "Вставьте код ссылки, который вам дал учитель для получения доступа в класс",
            joinDescription: "Вставьте ссылку...",
            sendBtnTitle: "Отправить",
        },
        en: {
            school: "School",
            schoolSubjects: "Subjects",
            searchTeacherTitle: "Search",
            searchTeacherDescription: "Enter the code link your teacher gave you to access the class",
            joinDescription: "Enter a link...",
            sendBtnTitle: "Send",
        }
    }

    const [addTeacherLinkState, setAddTeacherLinkState] = useState("");
    const [visibleCardClass, setVisibleCardClass] = useState(""); // visible_card
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [lastName, setLastName] = useState("");
    const [school, setSchool] = useState("");
    const [schoolSubjects, setSchoolSubjects] = useState("");
    const [teacherAvatar, setTeacherAvatar] = useState("");
    const [classId, setClassId] = useState("");
    const [isSent, setIsSent] = useState(false); // if we have already sent the subscription request to the class

    let onSearchTeacher = async () => { // будет искать нашего учителя по айдишнику
        if (addTeacherLinkState) {
            let teacherInfo = await search_teacher_by_id(addTeacherLinkState, state.dispatch, lang);
            if(teacherInfo) {
                setName(teacherInfo.name);
                setSurname(teacherInfo.surname);
                setLastName(teacherInfo.lastName);
                setSchool(teacherInfo.school);
                setSchoolSubjects(teacherInfo.school_subjects.join(', '));
                setTeacherAvatar(teacherInfo.img_src);
                setClassId(teacherInfo.class_id);
                setVisibleCardClass("visible_card ");
                setIsSent(teacherInfo.contain_student);
            }
        }
    }

    let onSendRequestToTeacher = async() => {
        let isOk = await send_subscription_request(classId, state.dispatch, lang);
        if(isOk) setIsSent(true);
    }

    let prevActiveMenuItemRef = useRef();

    useEffect(async() => {
        if(prevActiveMenuItemRef.current == "active_popup_menu_teachers_join" && state.homework_popup_active_menu_item !== "active_popup_menu_teachers_join") {
            setVisibleCardClass("");
            setAddTeacherLinkState("");
        }
        prevActiveMenuItemRef.current = state.homework_popup_active_menu_item;
    },[state.homework_popup_active_menu_item]);

    return (
        <div className={"homework_popup_menu_item_content_join " + state.homework_popup_active_menu_item}>

            <div className="homework_popup_menu_item_content_join_inner_content">

                <div className="homework_popup_menu_item_content_join_input_wrapper">
                    <input type="text" value={addTeacherLinkState} placeholder={langObj[lang].joinDescription} onChange={(e) => setAddTeacherLinkState(e.target.value)} />
                    <button className="blue_btn homework_popup_btn" onClick={onSearchTeacher}>{langObj[lang].searchTeacherTitle}</button>
                </div>
                <span className={visibleCardClass? "hidden" : ""}>{langObj[lang].searchTeacherDescription}</span>
                <span className= {"popup_warning_span " + state.popup_warning_class}>{state.homework_warning_title}</span>
            </div>

            <div className= {"homework_popup_menu_item_content_teacher_card " + visibleCardClass + (isSent? "already_sent" : "") }>
                <div className="homework_popup_menu_item_content_teacher_card_img_wrapper">
                    <img src= {teacherAvatar} alt="not found" />
                </div>
                <div className="homework_popup_menu_item_content_teacher_card_info_block">
                    <span className="user_fio">{surname} {name} {lastName}</span>
                    <span className="teacher_school">{langObj[lang].school} - {school}</span>
                    <span className="teacher_school">{langObj[lang].schoolSubjects} - {schoolSubjects}</span>
                </div>
                <button disabled = {isSent} className=" green_btn homework_popup_btn request_btn" onClick={onSendRequestToTeacher}>{langObj[lang].sendBtnTitle}</button>
                <svg className="check_mark" viewBox="-12 -14 70 70" width= "50px" height = "50px" >
                    <path d='M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504 c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0 c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z'/>
                </svg>
            </div>

        </div>

    );

};






