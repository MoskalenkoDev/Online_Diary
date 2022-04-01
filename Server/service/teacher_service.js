const class_model = require("../models/class_model");

const ApiError = require('../exceptions/api_error');

class TeacherService {

    async add_new_class(teacher_id, title, school_subjects) {

        let classModel = new class_model({teacher_id, title, school_subjects});
        await classModel.save();
    }

    async teacher_delete_class(_id) {
        let result = await class_model.deleteOne({_id});
        return result.deletedCount;
    }

    async teacher_edit_class(_id, updateObj) {
        // const record = await class_model.findById(_id);
        // if(!record) throw ApiError.BadRequest("wrond class_id");
        // console.log(record);
        await class_model.findByIdAndUpdate(_id , {$set : updateObj}, function(err, doc) {
            if(err) throw ApiError.BadRequest("wrond class_id");
        });
        // await class_model.updateOne({_id},{ $set: updateObj});
    }

    async teacher_get_classes(teacher_id) {

        let classes = await class_model.find({teacher_id});
        
        let new_arr = [];
        classes.forEach((class_obj) => 
        {
            let new_obj = {...class_obj};
            delete new_obj._doc.teacher_id;
            delete new_obj._doc.__v;
            new_arr.push(new_obj._doc);
        });
        return new_arr;                                                                    
    }

}

module.exports = new TeacherService();