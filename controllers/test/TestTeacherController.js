var supertest = require('supertest');
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
var uuid = require('uuid');
var app = require('../../app.js');

// global.app = app;
global.uuid = uuid;
global.expect = chai.expect;
global.app = supertest(app);

describe('API Routes', function() {
    // This function will run before every test to clear database
    beforeEach(function(done) {
        console.log("beforeEach function");
        done();
    });

    describe('GET /tasks', function() {
        it('returns a list of common student', function(done) {
            chai.request(app).get('/api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com')
                .end(function(err, res) {
                    // depends on how many the test data in the database
                    expect(res.body.result).to.have.lengthOf(1);
                    done(err);
                });
        });
    });

    describe('POST /api/register', function(){
        it('register a list of students under one teacher', function(done) {
            chai.request(app).get('/api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com')
                .end(function(err, res) {
                    // depends on how many the test data in the database
                    expect(res.body.result).to.have.lengthOf(1);
                    done(err);
                });
        });
    })

    // // Testing the save task expecting status 201 of success
    // describe('POST /tasks', function() {
    //     it('saves a new task', function(done) {
    //         app.post('/tasks')
    //             .send({
    //                 title: 'run',
    //                 done: false
    //             })
    //             .expect(201)
    //             .end(function(err, res) {
    //                 done(err);
    //             });
    //     });
    // });
    //
    // // Here it'll be tested two behaviors when try to find a task by id
    // describe('GET /tasks/:id', function() {
    //     // Testing how to find a task by id
    //     it('returns a task by id', function(done) {
    //         var task = app.db('tasks').first();
    //         app.get('/tasks/' + task.id)
    //             .expect(200)
    //             .end(function(err, res) {
    //                 expect(res.body).to.eql(task);
    //                 done(err);
    //             });
    //     });
    //
    //     // Testing the status 404 for task not found
    //     it('returns status 404 when id is not found', function(done) {
    //         var task = {
    //             id: 'fakeId'
    //         }
    //         app.get('/tasks/' + task.id)
    //             .expect(404)
    //             .end(function(err, res) {
    //                 done(err);
    //             });
    //     });
    // });
    //
    // // Testing how to update a task expecting status 201 of success
    // describe('PUT /tasks/:id', function() {
    //     it('updates a task', function(done) {
    //         var task = app.db('tasks').first();
    //         app.put('/tasks/' + task.id)
    //             .send({
    //                 title: 'travel',
    //                 done: false
    //             })
    //             .expect(201)
    //             .end(function(err, res) {
    //                 done(err);
    //             });
    //     });
    // });
    //
    // // Testing how to delete a task expecting status 201 of success
    // describe('DELETE /tasks/:id', function() {
    //     it('removes a task', function(done) {
    //         var task = app.db('tasks').first();
    //         app.put('/tasks/' + task.id)
    //             .expect(201)
    //             .end(function(err, res) {
    //                 done(err);
    //             });
    //     });
    // });
});