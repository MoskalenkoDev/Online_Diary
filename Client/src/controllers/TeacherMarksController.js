import MarksService from "../services/MarksService";

export async function get_marks(class_id, start_date, end_date) {
    try {
        let response = await MarksService.get_marks(class_id, start_date, end_date); // можливо в респонсі прийде відповідь з записами видалених учнів, тоді подивимось як то сортувати будемо
        return response.data;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
    }
}

export async function get_deleted_students(students_id_arr) {
    try {
        let response = await MarksService.get_deleted_students(students_id_arr); // можливо в респонсі прийде відповідь з записами видалених учнів, тоді подивимось як то сортувати будемо
        return response.data;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
    }
}

export async function saveOrEditMarks(markArr, subject, date, class_id) {

    const marksForSave = {
        marksMainInfo : markArr,
        subject,
        date,
        class_id
    } 

    try {
        let response = await MarksService.saveOrEditMarks(marksForSave); // можливо в респонсі прийде відповідь з записами видалених учнів, тоді подивимось як то сортувати будемо
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
    }
}