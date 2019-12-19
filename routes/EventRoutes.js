const routes = require('express').Router();
const { checkLoggedIn } = require('../middleware/Auth');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

routes.post('/', checkLoggedIn, async (req, res) => {
    const user = req.user._id;
    const event = new Event({ ...req.body, user });
    try {
        await event.save();
        return res.send(event);
    } catch (err) {
        console.error(err.message);
        return res.status(400).send({ msg: 'Failed to save event' }); //TODO: return specific mongodb message
    }
});

routes.get('/', checkLoggedIn, async (req, res) => {
    const user = req.user._id;
    try {
        const events = await Event.find({ user });
        return res.send(events);
    } catch (err) {
        console.error(err);
        return res.status(400).send({ msg: 'Failed to get event' });
    }
});

routes.get('/:id', checkLoggedIn, async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        const userId = req.user._id;

        if (event.user != userId) {
            return res.status(403).send({ msg: 'Unauthorized' });
        }

        return res.send(event);
    } catch (err) {
        return res.status(400).send({ msg: 'Failed to get event' });
    }
});

routes.put('/:id', checkLoggedIn, async (req, res) => {
    const event = req.body;
    const id = req.params.id;

    try {
        const eventBefore = await Event.findById(id);
        const userId = req.user._id;
        if (eventBefore.user != userId) {
            return res.status(403).send({
                msg: 'Unauthorized'
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, event, {
            new: true
        });
        return res.send(updatedEvent);
    } catch (err) {
        return res.status(400).send({
            msg: 'Failed to update event'
        });
    }
});

routes.delete('/:id', checkLoggedIn, async (req, res) => {
    const id = req.params.id;

    try {
        const event = await Event.findById(id);
        const userId = req.user._id;
        if (event.user != userId) {
            return res.status(403).send({ msg: 'Unauthorized' });
        }

        const deletedEvent = await Event.findByIdAndDelete(id);
        return res.send(deletedEvent);
    } catch (err) {
        return res.status(400).send({ msg: 'Failed to delete event' });
    }
});

module.exports = routes;
