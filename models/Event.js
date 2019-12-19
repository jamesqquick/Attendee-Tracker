const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    // phone: {
    //     type: String,
    //     validate: {
    //         validator: function (v) {
    //             return /\d{11}/.test(v);
    //         },
    //         message: (props) => `${props.value} is not a valid phone number!`
    //     },
    //     required: [true, 'Phone number is required']
    // },
});

module.exports = mongoose.model('Event', eventSchema);
