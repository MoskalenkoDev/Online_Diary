import {useRef} from 'react';

export const TeacherCopyClassInviteLink = ({state, invite_link, setHomework_copy_invite_link_popup_class}) => {

    let lang = state.lang.language;
    let langObj = {
        ua: {
            copyBtnText: "Копіювати",
            inviteLinkDescription: "Це посилання для реєстрації на ваш курс. Відправте його своїм учням.",
        },
        ru: {
            copyBtnText: "Копировать",
            inviteLinkDescription: "Это ссылка для регистрации на ваш курс.Скиньте ее своим ученикам.",
        },
        en: {
            copyBtnText: "Copy",
            inviteLinkDescription: "This is a link to an invitation to your course.Send this to your students.",
        }
    }

    let timer_copy_popup = useRef(null);

    let onCopyInviteLink = () => {
        window.clearTimeout(timer_copy_popup.current);
        navigator.clipboard.writeText(invite_link);
        setHomework_copy_invite_link_popup_class("active_invite_copy_link_popup");
        timer_copy_popup.current = setTimeout(() => {
            setHomework_copy_invite_link_popup_class("");
        },2000);
    }

    return(
        <div className = {"homework_popup_menu_item_content_invite_link " + state.homework_popup_active_menu_item}>

            <div className="homework_popup_menu_item_content_invite_link_inner_content">

                <div className="homework_popup_menu_item_content_invite_link_input_wrapper">
                    <input type="text" value = {invite_link} readOnly/>
                    <button className = "blue_btn homework_popup_btn" onClick = {onCopyInviteLink}>{langObj[lang].copyBtnText}</button>
                </div>
                <span>{langObj[lang].inviteLinkDescription}</span>

            </div>

        </div>
    );
}