const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Note.find({user : req.user.id});
        res.json(notes)
    } catch (error) {
        res.status(500).send("some error occured");
    }
    
   
})

router.post('/addnote', fetchuser, [
    body("title", "enter a valid name").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
], async (req, res)=>{
    try {
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user : req.user.id
        })
        
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).send("some error occured");
    }
    
})


//updating the notes request
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    // Create a newNote object
    try {
        const newNote  = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});

    } catch (error) {
        res.status(500).send("some error occured");
    
    }
    
    })


    router.delete('/deletenote/:id', fetchuser, async (req, res) => {
        const {title, description, tag} = req.body;
    try {
        
    // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"success": "note has been deleted"});
    } catch (error) {
        res.status(500).send("some error occured");
    
    }    
    

    })
module.exports = router