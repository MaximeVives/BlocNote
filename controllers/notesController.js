let Notes = require('../models/Notes');
let SubNote = require('../models/SubNote');


async function getNotes(req, res) {
    let notes = null
    try {
        notes = await Notes.find({user_id: req.user._id}).sort({date: -1});
    }catch (e) {
        return res.status(400).json({
            message: 'Note not found',
            success: false
        })
    }

    if (notes === null || notes.length === 0) {
        return res.status(200).send({message: 'There is no note', success: false});
    }

    return res.status(200).send({
        success: true,
        message: 'Notes found',
        notes: notes
    });

}

async function getNote(req, res){
    let {id_note} = req.body;
    if (!id_note) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        })
    }
    let note = null
    try{
        note = await Notes.findOne({_id: id_note});
    }catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }
    return res.status(200).send({
        success: true,
        message: "Note found",
        note: note
    });
}

async function getSubNote(req, res){
    let {id_sub_note} = req.body;
    if (!id_sub_note) {
        return res.status(400).json({
            success: false,
            message: 'Subnote not found'
        })
    }
    let subnote = null
    try {
        subnote = await SubNote.findOne({_id: id_sub_note});
    }catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Subnote not found'
        })
    }
    return res.status(200).send({
        success: true,
        message: 'Subnote found',
        subnote: subnote
    });
}


async function createNote(req, res){
    let sub = null
    try {
        sub = new SubNote({
            content: req.body.content || '',
        });
        await sub.save();
    }catch (e) {
        console.log(e)
        return res.status(400).json({
            success: false,
            message: "Can't create a new note"
        })
    }

    if (sub === null) {
        return res.status(400).json({
            success: false,
            message: "Can't create a new note"
        })
    }

    let note = new Notes({
        title: req.body.title || "Default title",
        user_id: req.user._id,
        list_Notes: [sub._id]
    });


    try {
        await note.save();
    }catch (e) {
        console.log(e)
        return res.status(400).json({
            success: false,
            message: 'Note not saved'
        })
    }

    return res.status(200).send({
        success: true,
        message: 'Note created',
        note: note
    });
}

async function createSubNote(req, res){
    let {id_note, content} = req.body;
    if (!id_note || !content) {
        return res.status(400).json({
            success: false,
            message: 'Complete all fields'
        })
    }
    let note = null
    try {
        note = await Notes.findOne({_id: id_note});
    }catch (e) {
        return res.status(402).json({
            success: false,
            message: 'Note not found'
        })
    }

    let sub = new SubNote({
        content: content,
    });
    note.list_Notes.push(sub._id);
    note.updated_at = Date.now();
    sub.updated_at = Date.now();
    try {
        await sub.save();
        await note.save();
    }catch (e) {
        return res.status(403).json({
            success: false,
            message: 'Subnote not saved'
        })
    }
    return res.status(200).send({
        success: true,
        message: 'Subnote created',
        subnote: sub
    });
}

async function updateSubNote(req, res){
    let {id_sub_note, id_note, title, content} = req.body;
    if (!id_sub_note) {
        return res.status(400).json({
            success: false,
            message: 'Id note not found'
        })
    }
    if (!title && !content) {
        return res.status(400).json({
            success: false,
            message: 'Complete all fields'
        })
    }
    let note = null;
    let subnote = null;
    try {
        subnote = await SubNote.findOne({_id: id_sub_note});
        note = await Notes.findOne({_id: id_note});
    }catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Note or Subnote id'
        })
    }


    if (!subnote) {
        return res.status(400).json({
            success: false,
            message: 'Subnote not found'
        })
    }

    if (!note) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }

    if (title) {
        note.title = title;
    }
    if (content) {
        subnote.content = content;
    }
    subnote.updated_at = Date.now();
    note.updated_at = Date.now();

    try {
        await subnote.save();
        await note.save();
    }catch (e) {
        console.log(e)
        return res.status(400).json({
            success: false,
            message: 'Note not saved'
        })
    }
    return res.status(200).send({
        success: true,
        message: 'Subnote updated',
        subnote: subnote
    });
}

async function updateNote(req, res){
    let {id_note, title} = req.body;
    if (!id_note) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Complete all fields'
        })
    }
    let note = null;
    try {
        note = await Notes.findOne({_id: id_note});
    }catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }

    note.title = title;
    note.updated_at = Date.now();
    note.save();

    return res.status(200).send({
        success: true,
        message: 'Note updated',
        note: note
    });
}

async function deleteNote(req, res){
    let {id_note} = req.body;
    if (!id_note) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }
    let note = null;
    try {
        note = await Notes.findOne({_id: id_note});
    }
    catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Note not found'
        })
    }
    for(let i = 0; i < note.list_Notes.length; i++){
        let sub = await SubNote.findOne({_id: note.list_Notes[i]});
        sub.remove();
    }
    note.remove();
    return res.status(200).send({
        success: true,
        message: 'Note deleted'
    });

    // Notes.deleteOne({_id: id_note}, function (err) {
    //     if (err) {
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Note not deleted'
    //         })
    //     }
    //     return res.status(200).send({
    //         success: true,
    //         message: 'Note deleted'
    //     });
    // });
}

async function deleteSubNote(req, res){
    let {id_sub_note} = req.body;
    if (!id_sub_note) {
        return res.status(400).json({
            success: false,
            message: 'Subnote not found'
        })
    }
    SubNote.deleteOne({_id: id_sub_note}, function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Subnote not deleted'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Subnote deleted'
        });
    });
}

module.exports = {
    getNotes,
    getNote,
    getSubNote,
    createNote,
    createSubNote,
    updateSubNote,
    updateNote,
    deleteNote,
    deleteSubNote
}
