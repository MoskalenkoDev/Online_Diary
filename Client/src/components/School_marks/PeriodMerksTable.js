import React, { useEffect, useRef, useState, Fragment } from 'react';

export const PeriodMarksTable = ({ lang, studentRecords }) => {

    let langObj =
    {
        ua: {
            marksTypeHeader: "Оцінка",
            CountHeader: "Кількість",
        },
        ru: {
            marksTypeHeader: "Оценка",
            CountHeader: "Количество",
        },
        en: {
            marksTypeHeader: "Mark",
            CountHeader: "Count",
        }
    };

    const [content, setContent] = useState([]);

    const calculateMarks = () => {
        let newMarksTrList = [];
        let marksArr = [];
        let settedMarksArr = [];
        studentRecords.forEach(record => {
            marksArr.push(...record.marks);
        });
        
        settedMarksArr = new Set(marksArr);
        for (let mark of settedMarksArr) {
            newMarksTrList.push(
                <tr key={mark}>
                    <td>{mark}</td>
                    <td className='marks_field'>{marksArr.filter(record_mark => record_mark === mark).length}</td>
                </tr>
            );
        }
        setContent(newMarksTrList);
    }

    useEffect(() => {
        calculateMarks();
        return () => setContent([]);
    }, [studentRecords])

    return (
        <table className='marks_table'>
            <thead>
                <tr>
                    <th>{langObj[lang].marksTypeHeader}</th>
                    <th>{langObj[lang].CountHeader}</th>
                </tr>
            </thead>
            <tbody>
                {content}
            </tbody>
        </table>
    );

}