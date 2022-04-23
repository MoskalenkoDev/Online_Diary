export const TeacherCopyInviteLink = ({state,homework_copy_invite_link_popup_class}) =>
{
    let lang = state.lang.language;
    let langObj = {
        
        ua: {
            popupTitle: "Скопійовано",
        },
        ru: {
            popupTitle: "Скопировано",
        },
        en: {
            popupTitle: "Copied",
        }
    };
    
    return (
        <div className= {"copy_invite_link_popup " + homework_copy_invite_link_popup_class}>
            <div className = "copy_invite_link_popup_span_wrapper"><span>{langObj[lang].popupTitle}</span></div>
        </div>
    )
}