const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://evaw0929:G2ADOfC1yRQvhWCz@cluster0.b7gnwus.mongodb.net/comp3123-exercise6";
const port = 8081;
const Note = require('./models/NotesModel');
const app = express();
app.use(express.json());

const noteRoutes = require('./routes/NoteRoutes.js'); // Import the routes
app.use('/', noteRoutes); // Use the routes

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to the MongoDB Atlas Server");
})
.catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note-taking application - Week06 Exercise</h1>");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});