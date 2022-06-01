export const TeacherSuccessMessagePopup = ({state,teacher_success_message_popup_class, message_text}) => {    
    
    return (
        <div className= {"copy_invite_link_popup " + teacher_success_message_popup_class}>
            <div className = "copy_invite_link_popup_span_wrapper"><span>{message_text}</span></div>
        </div>
    )
}