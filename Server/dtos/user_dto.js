module.exports = class userDto {

    email;
    id;
    isFilledProfile;
    userType;

    constructor(model, userType){
        this.email = model.email;
        this.id = model._id;
        this.isFilledProfile = model.isFilledProfile;
        this.userType = userType;
    }

}

