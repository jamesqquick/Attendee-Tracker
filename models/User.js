const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    // phone: {
    //     type: String,
    //     validate: {
    //         validator: function(v) {
    //             return /\d{11}/.test(v);
    //         },
    //         message: (props) => `${props.value} is not a valid phone number!`
    //     }
    // },
    //give different access rights if admin or not
    isAdmin: { type: Boolean, default: false }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, phone: this.phone, username: this.username },
        process.env.PRIVATE_KEY
    );
    return token;
};

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(3)
            .max(255)
            .required()
        // phone: Joi.string()
        //     .min(11)
        //     .max(11)
        //     .required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
