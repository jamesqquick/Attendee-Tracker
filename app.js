const express = require('express');
const app = express();
require('./models/Event');
require('dotenv').config();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.group('DB is connected');
        }
    }
);

const eventRoutes = require('./routes/EventRoutes');
app.use('/api/events', eventRoutes);

const port = process.env.port || 3500;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
