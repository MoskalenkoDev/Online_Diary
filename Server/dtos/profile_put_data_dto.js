

module.exports = class ProfilePutDataDto {

    #ifExisted = (modelVar, name) =>{
        if(modelVar) this[name] = modelVar;
    }

    constructor(userType,model) {

        this.#ifExisted(model.img_src, "img_src");
        this.#ifExisted(model.name, "name");
        this.#ifExisted(model.surname, "surname");
        this.#ifExisted(model.lastName, "lastName");
        this.#ifExisted(model.phoneNumbers, "phoneNumbers");
        this.isFilledProfile = true;

        if(userType === "teacher") {
            this.#ifExisted(model.school_subject, "school_subject");
            this.#ifExisted(model.school, "school");
        }
    }

}