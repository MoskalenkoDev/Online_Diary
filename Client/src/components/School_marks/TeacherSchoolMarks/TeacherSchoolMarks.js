import React, { useEffect, useRef, useState } from 'react';
import * as ActionCreators from '../../../Redux/Actions/action_school_marks';
import { get_classes_info, get_student_subscribers } from '../../../controllers/TeacherHomeworkController';
import { AddMarksPopup } from './Popups/AddMarksPopup';

export const TeacherSchoolMarks = ({ state }) => {
    let lang = state.lang.language;
    let langObj =
    {
        ua:
        {
            yourClasses: "Ваші класи",
        },
        ru:
        {
            yourClasses: "Ваши классы",
        },
        en:
        {
            yourClasses: "Your classes",
        }
    }

    const [school_marks_popup_class, setSchool_marks_popup_class] = useState(""); // school_marks_active
    const [school_marks_popup_type, setSchool_marks_popup_type] = useState(""); // school_marks_add_marks_popup
    const [current_class_id, setCurrent_class_id] = useState("");
    const [school_subjects, setSchool_subjects] = useState(""); // пока что строка, но при отправке на бек мы превратим ее в массив

    const timer = useRef();
    let onHidePopup = () =>
    {
        window.clearTimeout(timer.current);
        setSchool_marks_popup_class("");
        setTimeout(() => {
            setCurrent_class_id("");
            setSchool_marks_popup_type("");
        },250);
    }

    const onCalculateBtnClick = (class_id) => {
        console.log(class_id);
    }

    const onAddMarksBtnClick = async (class_info) => {
        setSchool_subjects(class_info.school_subjects);
        setCurrent_class_id(class_info._id);
        setSchool_marks_popup_class("school_marks_active");
        setSchool_marks_popup_type("school_marks_add_marks_popup");
    }

    let li_creator = (li_mass) => {
        // console.log(li_mass);
        let our_li_components = li_mass.map((new_class_obj, index) => {
            return (
                <li key={index}>
                    <span>{new_class_obj.title}</span>
                    <div className="homework_li_buttons">
                        <button className="homework_grey_btn school_marks_calculate_btn" onClick={() => onCalculateBtnClick(new_class_obj._id)}></button>
                        <button className="homework_grey_btn homework_li_add_homework_btn" onClick={() => onAddMarksBtnClick(new_class_obj)}></button>
                    </div>
                </li>
            )
        });
        state.dispatch(ActionCreators.school_marks_change_class_list(our_li_components));
    }

    // нажавши на кнопку виставити оцінки нам буде вибір дня, предмета та показано список унів.
    // виставити оцінки можна лише за останні два місяці. Переглядати ж оцінки можна за будь-який день. 
    // зберігатися будуть лише ті записи, де є опис або оцінка. Якщо опис прибрали, або оцінку і ці два поля пусті то запис видаляється з бд.
    // Оцінки можна виставляти хоч скільки хочеш в одне поле, головне розділити їх комою
    // Усі оцінки старші за два місяці можна буде лише переглядати, но редагувати ні
    // Якщо запис з видалем учнем не присутній, то показувати його не будемо.
    // В календарі та випадаючому списку підсвічуватись не буде нічого, окрім видалених предметів. (Будуть ото в червоній рамочці, но жовтим виділятись нічого не буде)

    // Отож, яким чином розумно розбивати отримані дані?
    // 1. Ми спочатку висвічуємо список з учнів, які точно є в класі, проте з сірими інпутами, щоб ми не могли вводити дані туди.
    // 2. Як тільки ми вибираємо предмет та дату, то інпути заповнюються даними.
    // 3. Якщо ми включили день, який старше 2х місяців то всі інпути залишаються сірими, проте з даними.
    // 4. Якщо ми обрали видалений предмет, то змінювати або добавляти оцінки ми не можемо. Все буде сірим.
    // 5. В списку видалені учні завжди будуть з сірими полями.
    // 6. Якщо вибираємо видалений предмет, то доступні будуть лише поля виділені жовтим кольором в календарі

    // Реалізація : 
    // 1. Спочатку ми отримаємо список учнів, які зареєстровані в класі на даний момент. (отримаємо їхні айдішніки,фотографію профілю та ПІБ)
    // 2. Ці дані ми збережемо в окремому полі в редаксі. Далі при виборі даних з бд за період ми знаходимо запис класу, та зберігаємо в змінній айдішніки студентів.
    // 3. Якщо хоча б один запис із знайдених матиме айдішнік користувача, якого нема в списку учнів класу, то ми знаходимо цього користувача в загальній базі і повертаємо окремим
    // полем у відповіді його запис разом зі даними по оцінкам.
    // 4. Зберігаємо дані в редакс, а знайденого користувача з усіма його даними додаємо в окремий список видалених унчів. При формуванні списку учнів він буде в останніх рядах


    // короче судячи з всього випадаючий список адекватно працює. Календар теж працювати буде адекватно. ДАЛІ БЛЯДЬ ТО ШО А????
    // ну треба мабуть уже виводити список учнів. Моди поки що юзати ніякі напевно не буду. Просто вивести список учнів, а вже потім зберігати записи. а виводити оті записи то вже потім
    // треба придумати спосіб для зберігання даних. До прикладу, коли перемикаємось на якийсь день в стейт prevMarks добавляються записи з оцінками, описами та айдішніками студентів.
    // як тільки ми змінюємо якесь поле то добавляємо в список changedMarks опис, оцінку та айдішнік учня. Коли нажимаємо на зберегти то вже з цього списку ми порівнюємо записи з 
    // prevMarks та перевіряємо чи точно щось змінилось. Якщо да, то формується фінальний список і відправляється на збереження в бд. Попап закривається.
    // Питання як позначати синім відредагований список. Думаю треба робити окремий компонент з оцими учнями та їхніми полями.

    useEffect(() => {
        get_classes_info(li_creator); // in my opinion it is correct
    }, []);


    return (
        <div className="homework_wrapper school_marks_wrapper">

            <div className="homework_header">
                <span>{langObj[lang].yourClasses}</span>
            </div>

            <div className={"homework_popup_wrapper " + school_marks_popup_class}>

                {school_marks_popup_type === "school_marks_add_marks_popup" && <AddMarksPopup
                    onHidePopup={onHidePopup}
                    lang={lang}
                    school_marks_popup_type={school_marks_popup_type} 
                    school_subjects={school_subjects}
                    class_id={current_class_id}
                    timer={timer}
                    // showSuccessMessage={showSuccessMessage}
                />}
            </div>

            <div className="homework_class_list_block">
                <ul className="homework_class_list">
                    {state.school_marks_class_list}
                </ul>
            </div>

        </div>
    );
}