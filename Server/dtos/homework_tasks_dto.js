

module.exports = class HomeworkTasks {

    _id;    
    date;
    subject;
    homework;


    constructor(homework){
        this._id = homework._id;
        this.date = homework.date;
        this.subject = homework.school_subject;
        this.homework = homework.task;
    }

}