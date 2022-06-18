import React, { useEffect, useRef, useState, Fragment } from 'react';

export const MarkTable = ({ description, marks, lang }) => {

    let langObj =
    {
        ua: {
            descriptionHeader: "Коментар",
            marksHeader: "Оцінки"
        },
        ru: {
            descriptionHeader: "Комментарий",
            marksHeader: "Оценки"
        },
        en: {
            descriptionHeader: "Comment",
            marksHeader: "Marks"
        }
    };

    return (

        <table className='marks_table'>
            <thead>
                <tr>
                    <th>{langObj[lang].descriptionHeader}</th>
                    <th>{langObj[lang].marksHeader}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{description}</td>
                    <td className='marks_field'>{marks.join(", ")}</td>
                </tr>
            </tbody>
        </table>
    );

}