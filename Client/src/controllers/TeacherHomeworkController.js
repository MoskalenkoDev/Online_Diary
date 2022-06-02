import HomeworkService from "../services/HomeworkService";
import * as actionCreators from "../Redux/Actions/actions";



export async function get_classes_info(li_creator) {
    try {
        let response = await HomeworkService.get_classes_info();
        li_creator(response.data);
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

export async function add_new_class(title, school_subjects) {

    try {
        await HomeworkService.add_new_class(title, school_subjects);
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

export async function edit_class(class_id, title, school_subjects) {

    try {
        await HomeworkService.edit_class(class_id, title, school_subjects);
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

export async function delete_class(class_id) {

    try {
        await HomeworkService.delete_class(class_id);
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

export async function get_student_requests_to_join(class_id) {

    try {
        let studentsInfoList = await HomeworkService.get_student_requests_to_join(class_id);
        return studentsInfoList.data;
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

export async function submit_student_request_to_join(student_id, class_id) {

    try {
        await HomeworkService.submit_student_request_to_join(student_id, class_id);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}

export async function deny_student_request_to_join(student_id, class_id) {

    try {
        await HomeworkService.deny_student_request_to_join(student_id, class_id);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}

export async function get_student_subscribers(class_id) {

    try {
        let studentsInfoList = await HomeworkService.get_student_subscribers(class_id);
        return studentsInfoList.data;
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

export async function kick_student(student_id, class_id) {

    try {
        await HomeworkService.kick_student(student_id, class_id);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}

export async function get_homework_tasks(class_id, start_date, end_date) {

    try {
        // потрібна початкова дата та кінцева дата вибірки. Допустимо це буде від нинішнього місяця +- місяць.
        // як тільки ми листаючи календар приближаємося на +- тиждень до границі то треба повторити запит  
        // В учня ми будемо передавати лише дати, нехай по токену найде профіль і там отримає усі класи
        // Для вчителя ж потрібен конкретний клас і дати
        let tasks = await HomeworkService.get_teacher_homework_tasks(class_id, start_date, end_date);
        return tasks;
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

export async function add_homework(class_id, subject, homeworkText, date) {

    try {
        console.log(class_id, subject, homeworkText, date);
        await HomeworkService.add_homework(class_id, subject, homeworkText, date);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}

export async function edit_homework(record_id ,subject, homeworkText, date) {

    try {
        await HomeworkService.edit_homework(record_id, subject, homeworkText, date);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}

export async function delete_homework(record_id) {

    try {
        await HomeworkService.delete_homework(record_id);
        return true;
    }
    catch (e) {

        switch (e.response.status) {
            case 500: {
                console.log(e.response)
                break;
            }
        }
        return false;
    }
}