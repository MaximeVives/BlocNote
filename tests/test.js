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
        });
    });
});





