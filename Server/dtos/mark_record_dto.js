

module.exports = class MarkRecord {

    record_id;
    student_id;   
    subject;
    marks;
    description; 
    date;

    constructor(markRecord){
        this.student_id = markRecord.student_id;
        this.subject = markRecord.school_subject;
        this.marks = markRecord.marks;
        this.description = markRecord.description;
        this.date = markRecord.date;
        this.record_id = markRecord._id;
    }

}