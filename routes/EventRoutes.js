const routes = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const { checkJwt } = require('../middleware/auth');
const testData = require('../testData');
routes.post('/', checkJwt, async (req, res) => {
    const user = req.user.sub;
    const event = new Event({ ...req.body, user });
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
        const events = await Event.find()
            .sort({ date: -1 })
            .limit(10); //TODO: limit to 20
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
        const userId = req.user.sub;
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

routes.post('/:id/rsvp/:userId', checkJwt, async (req, res) => {
    const isGoing = req.query.going;
    console.log('Is going: ', isGoing);
    const { name, email, picture } = req.body;
    const userId = req.params.userId;
    console.log(req.params.userId);
    const loggedInUserId = req.user.sub;

    if (!name || !email) {
        return res.status(400).send({
            msg: 'Invalid request. Email and Name are required'
        });
    }

    if (loggedInUserId !== userId) {
        console.error(
            `Unauthorized user: ${loggedInUserId} trying to update for ${userId}`
        );
        return res.status(401).send({
            msg: 'Unauthorized'
        });
    }

    try {
        const eventId = req.params.id;
        const eventBefore = await Event.findById(eventId);
        const newAttendee = { name, email, _id: loggedInUserId, picture };
        if (isGoing === 'true') {
            eventBefore.attendees.push(newAttendee);
        } else {
            for (let i = 0; i < eventBefore.attendees.length; i++) {
                const registeredAttendee = eventBefore.attendees[i];
                if (registeredAttendee._id === loggedInUserId) {
                    eventBefore.attendees.splice(i, 1);
                    break;
                }
            }
        }
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

routes.post('/seed', async (req, res) => {
    console.log(testData);
    try {
        await Event.deleteMany({});

        for (let i = 0; i < testData.length; i++) {
            const testEvent = new Event(testData[i]);
            await testEvent.save();
        }
        return res.send({ msg: 'Successfully seeded' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            msg: 'Failed to seed db'
        });
    }
});

module.exports = routes;
