import {useRef} from 'react';

export const TeacherCopyClassInviteLink = ({state, invite_link, showSuccessMessage}) => {

    let lang = state.lang.language;
    let langObj = {
        ua: {
            copyBtnText: "Копіювати",
            inviteLinkDescription: "Це посилання для реєстрації на ваш курс. Відправте його своїм учням.",
            popupTitleCopied: "Скопійовано"
        },
        ru: {
            copyBtnText: "Копировать",
            inviteLinkDescription: "Это ссылка для регистрации на ваш курс.Скиньте ее своим ученикам.",
            popupTitleCopied: "Скопировано"
        },
        en: {
            copyBtnText: "Copy",
            inviteLinkDescription: "This is a link to an invitation to your course.Send this to your students.",
            popupTitleCopied: "Copied"
        }
    }

    let onCopyInviteLink = () => {
        navigator.clipboard.writeText(invite_link);
        showSuccessMessage(langObj[lang].popupTitleCopied)
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