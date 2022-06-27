import { useEffect, useRef, useState } from 'react';

export const DropDownSubjectsList = ({lang, school_subjects, infoFromDB, date, setChosen_subject, chosen_subject, compareDate}) => {

    let langObj =
    {
        ua: {
            subjectsBtnTitle: "Предмет",
        },
        ru: {
            subjectsBtnTitle: "Предмет",
        },
        en: {
            subjectsBtnTitle: "Subject",
        }
    }

    const [is_active_drop_down, setIs_active_drop_down] = useState(false); // active_drop_down
    const [subjects_li_list, setSubjects_li_list] = useState([]);

    let selected_li = useRef(null);
    const onChooseSubject = (e) => {
        if(e.target.innerText === chosen_subject) {setIs_active_drop_down(false); return;} // якщо нажали на одну і ту ж лішку то нічо не робиться
        if (selected_li.current) selected_li.current.className = selected_li.current.className.replace(" selected_li", "") ; 
        e.target.className += " selected_li";  // просто вибирає предмет і відповідає за зміну активної лішки 
        setChosen_subject(e.target.innerText);
        setIs_active_drop_down(false);
        selected_li.current = e.target;
    }

    let onSmthClick = () => {
        if(is_active_drop_down) {
            setIs_active_drop_down(false);
        }
    }

    let createDeletedLiList = (deletedSubjects, isDeletedAndHighlighted = false) => {

        const deleted_li_list = deletedSubjects.map((subject, index) => {

            return (<li key={"deleted_"+ index} className = {"deleted_subject " + (isDeletedAndHighlighted? "highlighted" : "") + (chosen_subject === subject? " selected_li": "")}>{subject}</li>)
        })
        return deleted_li_list;
    }

    let createLiveLiList = (highlightedSubjects = []) => { // ми будемо підсвічувати предмет коли є хоча б один запис на вибраний день по цьому предмету
        let our_li_list;
        if (school_subjects) { // просто створює список зі звичайних предметів
            our_li_list = school_subjects.map((subject, index) => {
                let isSubjectHighlighted = highlightedSubjects.some(val => val.subject === subject);
                return (<li key={index} className = {(isSubjectHighlighted? "highlighted" : "") + (chosen_subject === subject? " selected_li": "") }>{subject}</li>)
            })
        }
        return our_li_list;
    }

    const createLiList = (infoFromDB) => { 

        let our_li_list = [];
        let deletedSubjects = []; // містить лише предмети

        if(infoFromDB.length) { // визначили видалені предмети, які мають попасти в список
            infoFromDB.forEach(item => {
               if(!deletedSubjects.some(subject => subject === item.subject) && !school_subjects.includes(item.subject)) deletedSubjects.push(item.subject);
            }) 
        }
        
        if(date) {
            let homeworkOnDayArr = infoFromDB.filter(item => (compareDate(item.date, date))); // вибирає всі записи, які мають конкретний день.
            let deletedHighlightedSubjects = [];
            homeworkOnDayArr.forEach(val => { 
                if(deletedSubjects.some(subject => (subject === val.subject) && !deletedHighlightedSubjects.includes(subject))) {
                    deletedHighlightedSubjects.push(val.subject)
                } 
            });
            our_li_list.push(...createLiveLiList(homeworkOnDayArr)); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedHighlightedSubjects, true)); // добавляю видалені предмети
        }
        else {
            our_li_list.push(...createLiveLiList()); // добавляю спочатку звичайні предмети
            our_li_list.push(...createDeletedLiList(deletedSubjects)); // добавляю видалені предмети
        }
        setSubjects_li_list(our_li_list);
    }

    useEffect(()=> {
        window.addEventListener("click", onSmthClick);
        return () => { window.removeEventListener("click", onSmthClick); }
    },[is_active_drop_down])

    useEffect(()=> {
        createLiList(infoFromDB);
    },[date,infoFromDB])

    return (
        <div className={"subject_drop_down " + (is_active_drop_down ? "active_drop_down" : "")}>

            <button className='subject_drop_down_btn' onClick={() => setIs_active_drop_down(!is_active_drop_down)}>
                <span className='subject_drop_down_header_selected'>{chosen_subject || langObj[lang].subjectsBtnTitle}</span>
            </button>

            <ul className='drop_down_li_list' onClick={(e) => onChooseSubject(e)}>
                {subjects_li_list}
            </ul>

        </div>
    );
}