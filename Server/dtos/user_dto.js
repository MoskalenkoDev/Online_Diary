module.exports = class userDto {

    email;
    id;
    isFilledProfile;

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isFilledProfile = model.isFilledProfile;
    }

}

