let express = require('express');
let router = express.Router();
let notesController = require('../controllers/notesController');
let notesMiddleware = require('../controllers/middlewares/notesMiddleware');

/* GET all notes*/
router.get('/notes', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.getNotes]);


/*GET, CREATE, UPDATE a note*/
router.get('/note', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.getNote]);
router.post('/note', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.createNote]);
router.put('/note', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.updateNote]);
router.delete('/note', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.deleteNote]);

router.get("/subnote", [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.getSubNote]);
router.post("/subnote", [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.createSubNote]);
router.put('/subnote', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.updateSubNote]);
router.delete('/subnote', [notesMiddleware.VerifyToken, notesMiddleware.GetUser, notesController.deleteSubNote]);



module.exports = router;