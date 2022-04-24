import HomeworkService from "../services/HomeworkService";
import * as actionCreators from "../Redux/Actions/actions";

let timer;
let showTime = 4000;

const langObj =
{
    ua: {
        successChanges: "Зміни успішно збережені",
        popupWarningUnexpected: "Щось пішло не так..."
    },
    ru: {
        successChanges: "Изменения успешно сохранены",
        popupWarningUnexpected: "Что-то пошло не так..."
    },
    en: {
        successChanges: "Changes saved successfully",
        popupWarningUnexpected: "Something went wrong..."
    }
}

// export const showPopup = ( dispatch, popupTitle , isSuccess) => {
//     clearTimeout(timer);
//     dispatch(actionCreators.change_profile_save_popup_title(popupTitle));
//     dispatch(actionCreators.change_profile_save_popup_class("active_save_profile_popup_title " + !isSuccess ? "red_color" : ""));
//     timer = setTimeout(() => { dispatch(actionCreators.change_profile_save_popup_class("")); }, showTime);
// }

export async function get_classes_info(li_creator) {
    // const lang = localStorage.getItem('language');
    try {
        let response = await HomeworkService.get_classes_info();
        li_creator(response.data);
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                // showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                break;
            }
        }
    }
}

export async function add_new_class(title, school_subjects) {

    // const lang = localStorage.getItem('language');
    try {
        await HomeworkService.add_new_class(title, school_subjects);
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                // showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                break;
            }
        }
    }

}

export async function edit_class(class_id, title, school_subjects) {
    // const lang = localStorage.getItem('language');

    try {
        await HomeworkService.edit_class(class_id, title, school_subjects);
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                // showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                break;
            }
        }
    }
}


export async function delete_class(class_id) {
    // const lang = localStorage.getItem('language');

    try {
        await HomeworkService.delete_class(class_id);
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                // showPopup(dispatch, langObj[lang].popupWarningUnexpected, false);
                break;
            }
        }
    }
}