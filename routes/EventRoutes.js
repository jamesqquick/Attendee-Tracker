const routes = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const { checkJwt } = require('../middleware/auth');

routes.post('/', checkJwt, async (req, res) => {
    //console.log(req.user);
    const user = req.user.sub;
    console.log(req.body);
    //console.log(res.json(req.body));

    const body = req.body;
    const event = new Event({ ...req.body, user });
    console.log(event);
    try {
        await event.save();
        return res.send(event);
    } catch (err) {
        console.error(err.message);
        return res.status(400).send({ msg: 'Failed to save event' }); //TODO: return specific mongodb message
    }
});

routes.get('/', async (req, res) => {
    //TODO: search based on user query in query param
    try {
        const events = await Event.find(); //TODO: limit to 20
        return res.send(events);
    } catch (err) {
        console.error(err);
        return res.status(400).send({ msg: 'Failed to get event' });
    }
});

routes.get('/myEvents', checkJwt, async (req, res) => {
    const user = req.user.sub;
    try {
        const events = await Event.find({ user });
        return res.send(events);
    } catch (err) {
        return res.status(400).send({ msg: 'Failed to get event' });
    }
});

routes.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        return res.send(event);
    } catch (err) {
        return res.status(400).send({ msg: 'Failed to get event' });
    }
});

routes.put('/:id', async (req, res) => {
    const event = req.body;
    const id = req.params.id;

    try {
        const eventBefore = await Event.findById(id);
        const userId = req.uer.sub;
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

routes.post('/:id/rsvp', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send({
            msg: 'Invalid request. Email and Name are required'
        });
    }

    try {
        const eventId = req.params.id;
        const eventBefore = await Event.findById(eventId);
        const newAttendee = { name, email };
        eventBefore.attendees.push(newAttendee);
        console.log(eventBefore);
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            eventBefore,
            {
                new: true
            }
        );
        return res.send(updatedEvent);
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            msg: 'Failed to update event'
        });
    }
});

routes.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const event = await Event.findById(id);
        const userId = req.uer.sub;
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
