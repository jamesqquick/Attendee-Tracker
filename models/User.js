const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const UserSchema = new mongoose.Schema({
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

    isAdmin: { type: Boolean, default: false }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.PRIVATE_KEY);
    return token;
};

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(3)
            .max(255)
            .required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
