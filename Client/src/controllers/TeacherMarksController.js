import MarksService from "../services/MarksService";

export async function get_marks(class_id, start_date, end_date) {
    try {
        let response = await MarksService.get_marks(class_id, start_date, end_date); // можливо в респонсі прийде відповідь з записами видалених учнів, тоді подивимось як то сортувати будемо
        return response;
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
        return response;
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

// export async function saveOrEditMark(markArr) {

//     let markArrTemplate = {
//         student_id: "62690381a146a6275007b405",
//         subject: "Фізика", 
//         marks: ["12", "11+"],
//         description: "Завдання виконано тупо чотко", 
//         date: moment().add(1, 'day')
//     } 

//     try {
//         let response = await MarksService.saveOrEditMark(markArr); // можливо в респонсі прийде відповідь з записами видалених учнів, тоді подивимось як то сортувати будемо
//         return response;
//     }
//     catch (e) {

//         switch (e.response.status) {
//             case 500: {
//                 console.log(e.response)
//                 break;
//             }
//         }
//     }
// }