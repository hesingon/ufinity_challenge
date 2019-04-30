var supertest = require('supertest');
var chaiAsPromised = require('chai-as-promised');
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.use(chaiAsPromised);
var uuid = require('uuid');
var app = require('../app.js');
const db = require('../db');
const { intersection, isSameSet } = require('../db/queryHelpers');

// global.app = app;
global.uuid = uuid;
global.expect = chai.expect;
global.app = supertest(app);

describe('Test Ufinity Challenge API Routes', function () {
    // This function will run before every test to clear database
    beforeEach(function (done) {
        console.log("beforeEach function");
        done();
    });

    describe('GET /commonstudents', function () {
        it('returns a list of common student', function (done) {
            const teacherList = [
                "teacherken@gmail.com",
                "teacherjoe@gmail.com"
            ];
            var urlQuery = '/api/commonstudents?';
            teacherList.forEach((teacher) => {
                urlQuery = urlQuery.concat("teacher=" + teacher + "&");
            });
            chai.request(app).get(urlQuery)
                .end(function (err, res) {
                    // depends on how many the test data in the database
                    expect(res.status).to.be.equal(200);

                    var queryList = [];
                    teacherList.forEach((teacher) => {
                        queryList.push(db.query(`SELECT student FROM registration WHERE teacher="${teacher}"`))
                    });

                    var finalSet, areValuesConsistent;

                    var studentGroups = [];
                    Promise.all(queryList)
                        .then((results => {
                            results.forEach(studentGroup => {
                                    let studentsUnderATeacher = new Set();
                                    studentGroup.forEach(item => {
                                            studentsUnderATeacher.add(item.student)
                                        }
                                    );
                                    studentGroups.push(studentsUnderATeacher)
                                }
                            )
                        }))
                        .then(() => {
                            console.log("start");
                            finalSet = studentGroups[0];
                            for (var i = 1; i < studentGroups.length; i++) {
                                finalSet = intersection(finalSet, studentGroups[i])
                            }
                        })
                        .then(() => {
                            let returnedSet = new Set(res.body.students);
                            expect(isSameSet(finalSet, returnedSet)).to.be.true;
                            done();
                        })
                        .catch(err => done(err));

                });
        });
    });

    describe('POST /api/register', function () {
        it('register a list of students under one teacher', function (done) {
            const requestData = {
                "teacher": "T_A@gmail.com",
                "students": [
                    "S_A@example.com",
                    "S_B@example.com"
                ]
            };

            let queryChecklist = [];
            chai.request(app).post('/api/register')
                .send(requestData)
                .end(function (err, res) {
                    // Check status code is 204
                    expect(res.status).to.equal(204);

                    // Check Teacher, student added exists in the registration table
                    for (var i = 0; i < requestData.students.length; i++) {
                        queryChecklist.push(db.query(`SELECT * FROM registration WHERE teacher="${requestData.teacher}"
                            AND student="${requestData.students[i]}"`)
                        )
                    }

                    Promise.all(queryChecklist)
                        .then(values => {
                            let recordedStudents = 0;
                            for (let result of values) {
                                if (result.length > 0) recordedStudents++;
                            }
                            expect(recordedStudents).to.equal(requestData.students.length);
                            done();
                        })
                        .catch(err => {
                            if (err) done(err)
                        })

                });
        });
    });

    describe('POST /api/suspend', function () {
        it('suspend a student', function (done) {
            const requestData = {
                "student": "studenthenna@example.com"
            };

            chai.request(app).post('/api/suspend')
                .send(requestData)
                .end(function (err, res) {
                    // Check status code is 204
                    expect(res.status).to.equal(204);

                    db.query(`SELECT * FROM students WHERE email="${requestData.student}"`)
                        .then(result => {
                            expect(result[0]['isSuspended']).to.equal('TRUE');
                            done(err);
                        }).catch(err => {
                        if (err) done(err)
                    })

                })
        });
    });

    describe('POST /api/retrievefornotifications', function () {
        it('Check eligible notificiation recipients', function (done) {
            const requestData = {
                "teacher": "teacherken@gmail.com",
                "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
            };

            const notification = requestData["notification"];
            const regex = /@[\w@.]+/g;
            const mentions = notification.match(regex);
            mentions.forEach((value, index) => {
                mentions[index] = mentions[index].substring(1);
            });
            var queryChecklist = [];

            chai.request(app).post('/api/retrievefornotifications')
                .send(requestData)
                .end(function (err, res) {
                    // Check status code is 204
                    expect(res.status).to.equal(200);

                    var recipients = res.body['recipients'];
                    for (var i = 0; i < recipients.length; i++) {
                        queryChecklist.push(db.query(`SELECT * FROM registration WHERE teacher="${requestData.teacher}"
                            AND student="${recipients[i]}"`));
                        queryChecklist.push(db.query(`SELECT * FROM students WHERE email="${recipients[i]}"
                            AND isSuspended="FALSE"`));
                    }

                    Promise.all(queryChecklist)
                        .then(values => {
                            let eligibleStudents = 0;
                            for (let result of values) {
                                if (result.length > 0)
                                    eligibleStudents++;
                            }
                            expect(eligibleStudents).to.equal((recipients.length - mentions.length) * 2);
                            done();
                        })
                        .catch(err => {
                            if (err) done(err)
                        })
                })
        });
    })

});