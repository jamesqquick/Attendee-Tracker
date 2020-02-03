const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true },
    () => {
        console.group('DB is connected');
    }
);

require('./models/Event');
require('./models/User');

const eventRoutes = require('./routes/EventRoutes');
const userRoutes = require('./routes/UserRoutes');
app.use('/api/events', eventRoutes);
app.use('/api/user', userRoutes);

const port = process.env.port || 3500;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
