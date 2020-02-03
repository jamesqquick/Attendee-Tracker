const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Attendee', attendeeSchema);
