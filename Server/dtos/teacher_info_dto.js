

module.exports = class TeacherInfo {

    name;
    surname;
    lastName;
    school;
    phoneNumbers;
    img_src;
    school_subjects;
    class_id;
    contain_student;

    constructor(teacher, classInfo, contain_student){
        this.name = teacher.name;
        this.surname = teacher.surname;
        this.lastName = teacher.lastName;
        this.school = teacher.school;
        this.phoneNumbers = teacher.phoneNumbers;
        this.img_src = teacher.img_src;
        this.school_subjects = classInfo.school_subjects;
        this.class_id = classInfo._id;
        this.contain_student = contain_student;
    }

}