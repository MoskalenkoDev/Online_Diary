

module.exports = class StudentInfo {

    name;
    surname;
    lastName;
    phoneNumbers;
    img_src;
    student_id;

    constructor(student){
        this.name = student.name;
        this.surname = student.surname;
        this.lastName = student.lastName;
        this.phoneNumbers = student.phoneNumbers;
        this.img_src = student.img_src;
        this.student_id = student._id;
    }

}