import * as ActionCreators from '../Redux/Actions/actions_homework'
import HomeworkService from "../services/HomeworkService";

let timer;
let showTime = 4000;

let langObj = {
    ua: {
        warningIncorrectLink: "Невірний код посилання!",
        warningUnexpected: "Щось пішло не так..."
    },
    ru: {
        warningIncorrectLink: "Неверный код ссылки!",
        warningUnexpected: "Что-то пошло не так..."
    },
    en: {
        warningIncorrectLink: "Wrong link code!",
        warningUnexpected: "Something went wrong..."
    }
}

export const showWarning = ( dispatch, title) => {
    clearTimeout(timer);
    dispatch(ActionCreators.change_homework_popup_warning_title_class("homework_popup_warning_active"));
    dispatch(ActionCreators.change_homework_warning_title(title));
    timer = setTimeout(() => { dispatch(ActionCreators.change_homework_popup_warning_title_class("")); }, showTime);
}

export async function search_teacher_by_id(_id, dispatch, lang) {

    try {

        const teacherInfo = await HomeworkService.search_teacher_by_id(_id);
        return teacherInfo.data;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                showWarning(dispatch, langObj[lang].warningUnexpected);
                break;
            }

            case 400: {
                showWarning(dispatch, langObj[lang].warningIncorrectLink);
                break;
            }
        }
    }

}

export async function send_subscription_request(class_id, dispatch, lang) {

    try {
        await HomeworkService.send_subscription_request(class_id);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                showWarning(dispatch, langObj[lang].warningUnexpected);
                break;
            }

            case 400: {
                showWarning(dispatch, langObj[lang].warningUnexpected);
                break;
            }
        }

        return false;
    }

}