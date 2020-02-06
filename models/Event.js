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
        //not required since we will let guests register also
        type: String,
        required: false
    },
    attendees: {
        type: [
            {
                name: String,
                email: String,
                _id: { type: String, required: false }
            }
        ]
    }
});

module.exports = mongoose.model('Event', eventSchema);
