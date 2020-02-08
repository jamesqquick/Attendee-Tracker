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
        type: String,
        required: true
    },
    attendees: {
        type: [
            {
                name: String,
                email: String,
                _id: { type: String, required: false },
                picture: String
            }
        ]
    }
});

module.exports = mongoose.model('Event', eventSchema);
