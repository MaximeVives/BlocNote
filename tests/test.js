// Generate Unit test for api
const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Note = require('../models/Notes');
const SubNote = require('../models/SubNote');
const chai = require('chai');
// const bcrypt = require('bcrypt');

const expect = chai.expect;

let token;
let note;
const user = "628824ff1837f63d11c182af";

// TODO: Generate unit test for checking bad id in request


describe('Test for api', () => {
    before(async () => {
        await User.deleteMany({});
        await Note.deleteMany({});
        await SubNote.deleteMany({});
    });

    describe("Test for user", () => {
        describe("Test for register", () => {
            it("Should return success for register", async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345678',
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.token).to.not.equal(null);
                token = response.body.token;

            });
            it("Should return fail for register (bad email structure)", async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'hastagmaxime',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Please enter a valid email');
            });
            it("Should return fail for register (bad password length)", async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Password must be at least 8 characters long');
            });
            it('should return fail for register (user already exist)', async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('User already exists');
                expect(response.body.success).to.equal(false);
            });
            it('should return fail for register (missing password)', async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'hastagmaxime@gmail.com'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
            it('should return fail for register (missing email)', async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
        });
        describe("Test for login", () => {
            it("Should return success for login", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: "12345678",
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.token).to.equal(token);
            });
            it("Should return fail for login (bad email structure)", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        email: 'hastagmaxime',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Please enter a valid email');
            });
            it("Should return fail for login (bad email address)", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        email: 'maxime.vives@viacesi.fr',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('User not found');
            });
            it("Should return fail for login (bad password)", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Incorrect password');
            });
            it("Should return fail for login (missing password)", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        email: 'hastagmaxime@gmail.com'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
            it("Should return fail for login (missing email)", async () => {
                const response = await request(app)
                    .get('/auth/login')
                    .send({
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
        });
        describe("Test for reset token", () => {
            it("Should return success for reset token", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.token).to.not.equal(null);
                token = response.body.token;
            });
            it("Should return fail for reset token (bad email structure)", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        email: 'hastagmaxime',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Please enter a valid email');
            });
            it("Should return fail for reset token (bad email address)", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        email: 'maxime.vives@viacesi.fr',
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('User not found');
            });
            it("Should return fail for reset token (bad password)", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        email: 'hastagmaxime@gmail.com',
                        password: '12345'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Incorrect password');
            });
            it("Should return fail for reset token (missing password)", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        email: 'hastagmaxime@gmail.com'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
            it("Should return fail for reset token (missing email)", async () => {
                const response = await request(app)
                    .get('/auth/reset')
                    .send({
                        password: '12345678'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.message).to.equal('Please enter all fields');
                expect(response.body.success).to.equal(false);
            });
        });
        describe("Test for long lived token", () => {
            it("Should return success for long lived token", async () => {
                const response = await request(app)
                    .put('/auth/long_token')
                    .send({
                        token: token
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.token).to.not.equal(null);
                token = response.body.token;
            });
            it("Should return fail for long lived token (bad token)", async () => {
                const response = await request(app)
                    .put('/auth/long_token')
                    .send({
                        token: 'bad_token'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Invalid token');
            });
        });
    });

    describe("Test for notes", () => {
        describe("Test for create note", () => {
            it('Should create a note', async () => {
                const response = await request(app)
                    .post('/notes/note')
                    .set('Authorization', token)
                    .send({
                        title: 'test',
                        content: 'test'
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Note created');
                note = response.body.note._id;
            });
            it('Should return fail to create note (no token)', async () => {
                const response = await request(app)
                    .post('/notes/note')
                    .send({
                        title: 'test',
                        content: 'test'
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it('Should return fail to create note (invalid format token)', async () => {
                const response = await request(app)
                    .post('/notes/note')
                    .set('Authorization', token + "bad_token")
                    .send({
                        title: 'test',
                        content: 'test'
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Invalid format token');
            });

        });
        // Get All, Get, post, put and delete
        describe("Test to get all notes", () => {
            it("Should return success to get all notes", async () => {
                const response = await request(app)
                    .get('/notes/notes')
                    .set('Authorization', token);
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Notes found');
                expect(response.body.notes).to.not.equal(null);
            });
            it("Should return fail to get all notes (No authorization)", async () => {
                const response = await request(app)
                    .get('/notes/notes');
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
        });
        describe("Test to get a note", () => {
            it("Should return success to get a note", async () => {
                const response = await request(app)
                    .get('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: note
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Note found');
            });
            it("Should return fail to get a note (No authorization)", async () => {
                const response = await request(app)
                    .get('/notes/note')
                    .send({
                        id_note: note
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to get a note (No id)", async () => {
                const response = await request(app)
                    .get('/notes/note')
                    .set('Authorization', token);
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Please enter all fields');
            });
            it("Should return fail to get a note (Bad id)", async () => {
                const response = await request(app)
                    .get('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: "note"
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Note not found');
            });
        });
        describe("Test to update a note", () => {
            it("Should return success to update a note", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: note,
                        title: 'test_update',
                        content: 'test_update'
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Note updated');
                expect(response.body.note.title).to.equal('test_update');
            });
            it("Should return fail to update a note (No authorization)", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .send({
                        id_note: note,
                        title: 'test_update',
                        content: 'test_update'
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to update a note (No id)", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .set('Authorization', token)
                    .send({
                        title: 'test_update',
                        content: 'test_update'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Note not found');
            });
            it("Should return fail to update a note (Bad id)", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: "note",
                        title: 'test_update',
                        content: 'test_update'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Note not found');
            });
            it("Should return fail to update a note (No title)", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: note,
                        content: 'test_update'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Complete all fields');
            });
            it("Should return success to update a note (No content)", async () => {
                const response = await request(app)
                    .put('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: note,
                        title: 'test_update'
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Note updated');
                expect(response.body.note.title).to.equal('test_update');
            });
        });
        describe("Test to delete a note", () => {
            it("Should return success to delete a note", async () => {
                const response = await request(app)
                    .delete('/notes/note')
                    .set('Authorization', token)
                    .send({
                        id_note: note
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Note deleted');
            });
            it("Should return fail to delete a note (No authorization)", async () => {
                const response = await request(app)
                    .delete('/notes/note')
                    .send({
                        id_note: note
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to delete a note (No id)", async () => {
                const response = await request(app)
                    .delete('/notes/note')
                    .set('Authorization', token);
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Note not found');
            });
        });
    });

    describe("Test for subnotes", () => {
        let note;
        let subnote;
        beforeEach(async () => {
            note = await Note.create({
                title: 'test_note',
                content: 'test_note',
                user_id: user
            })
        });
        afterEach(async () => {
            await Note.deleteOne({
                where: {
                    id_note: note._id
                }
            });
        });
        describe("Test to create a subnote", () => {
            it("Should return success to create a subnote", async () => {
                const response = await request(app)
                    .post('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_note: note,
                        content: 'test_subnote'
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Subnote created');
                subnote = response.body.subnote;
                // expect(response.body.subnote.title).to.equal('test_subnote');
            });
            it("Should return fail to create a subnote (No authorization)", async () => {
                const response = await request(app)
                    .post('/notes/subnote')
                    .send({
                        id_note: note,
                        content: 'test_subnote'
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to create a subnote (No id)", async () => {
                const response = await request(app)
                    .post('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        content: 'test_subnote'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Complete all fields');
            });
            it("Should return success to create a subnote (No content)", async () => {
                const response = await request(app)
                    .post('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_note: note
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Complete all fields');
            });
        });
        describe("Test to get a subnote", () => {
            it("Should return success to get a subnote", async () => {
                const response = await request(app)
                    .get('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Subnote found');
            });
            it("Should return fail to get a subnote (No authorization)", async () => {
                const response = await request(app)
                    .get('/notes/subnote')
                    .send({
                        id_sub_note: subnote._id
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to get a subnote (No id)", async () => {
                const response = await request(app)
                    .get('/notes/subnote')
                    .set('Authorization', token);
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Subnote not found');
            });
            it("Should return fail to get a subnote (Invalid id)", async () => {
                const response = await request(app)
                    .get('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: 'invalid_id'
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Subnote not found');
            });
        });
        describe("Test to update a subnote", () => {
            it("Should return success to update a subnote", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id,
                        content: 'test_update',
                        id_note: note._id,
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Subnote updated');
                expect(response.body.subnote.content).to.equal('test_update');
            });
            it("Should return fail to update a subnote (No authorization)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .send({
                        id_sub_note: subnote._id,
                        content: 'test_update',
                        id_note: note._id,
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(403);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('No token provided');
            });
            it("Should return fail to update a subnote (Bad id_sub_note)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: 'invalid_id',
                        content: 'test_update',
                        id_note: note._id,
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Invalid Note or Subnote id');
            });

            it("Should return fail to update a subnote (Bad id_note)", async () => {
               const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id,
                        content: 'test_update',
                        id_note: 'invalid_id',
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Invalid Note or Subnote id');
            });

            it("Should return fail to update a subnote (No id)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        content: 'test_update',
                        id_note: note._id,
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Id note not found');
            });
            it("Should return fail to update a subnote (No content)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id,
                        id_note: note._id,
                        title: "test_update"
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Subnote updated');
            });
            it("Should return fail to update a subnote (No title)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id,
                        content: 'test_update',
                        id_note: note._id
                    });
                expect(response.statusCode).to.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.message).to.equal('Subnote updated');
            });
            it("Should return fail to update a subnote (No content + no title)", async () => {
                const response = await request(app)
                    .put('/notes/subnote')
                    .set('Authorization', token)
                    .send({
                        id_sub_note: subnote._id,
                        id_note: note._id
                    });
                expect(response.statusCode).to.equal(400);
                expect(response.body.success).to.equal(false);
                expect(response.body.message).to.equal('Complete all fields');
            })
        });
        describe("Test to delete a subnote", () => {

        });
    });
});





