const express = require('express');

const router = express.Router();
const noteModel = require('../routes/NoteRoutes.js');

// Create a new Note
router.post('/notes', (req, res) => {
    // Validate request
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required fields."
        });
    }

    // Create a new note using the Note model
    const note = new noteModel({
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    });

    // Save the note to the database
    note.save()
        .then(data => {
            res.status(201).json(data); // Respond with the saved note
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "An error occurred while creating the note."
            });
        });
});

// Retrieve all Notes
router.get('/notes', (req, res) => {
    noteModel.find()
        .then(notes => {
            res.status(200).json(notes); // Respond with the retrieved notes
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "An error occurred while retrieving notes."
            });
        });
});

// Retrieve a Single Note with noteId
router.get('/notes/:noteId', (req, res) => {
    noteModel.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(200).json(note); // Respond with the retrieved note
        })
        .catch(error => {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });
});

// Update a Note with noteId
router.put('/notes/:noteId', (req, res) => {
    // Validate request
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required fields."
        });
    }

    noteModel.findByIdAndUpdate(req.params.noteId, {
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(200).json(note); // Respond with the updated note
        })
        .catch(error => {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
});

// Delete a Note with noteId
router.delete('/notes/:noteId', (req, res) => {
    noteModel.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(200).json({ message: "Note deleted successfully" });
        })
        .catch(error => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
});

module.exports = router;
