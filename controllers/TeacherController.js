const db = require('../db');
const {commonStudentQueryBuilder, noSpace} = require('../db/queryHelpers');
const {sendErrorResponse, sendErrorMessageResponse} = require('./ReponseHelpers');

const showTeachers = async (req, res) => {

    await db.query("SELECT * FROM teachers")
        .then(result => {
            console.log(result);
            res.status(200);
            res.send(result);
        }).catch((error) => {
            console.log(error);
            sendErrorResponse(res, error)
        });
};

//todo: some students are already registered
const registerStudent = async (req, res) => {
    const teacherEmail = noSpace(req.body["teacher"]);
    let queryList = [];

    await db.query(`SELECT * FROM teachers WHERE email="${teacherEmail}"`)
        .then(result => {
            if (result.length < 1) {
                sendErrorMessageResponse(res, 406, "Teacher not found");
            } else
                for (var student of req.body["students"]) {
                    queryList.push(db.query(`INSERT INTO students (email) VALUES ("${student}")`));
                    queryList.push(db.query(`INSERT INTO 
                        registration (student, teacher) 
                        VALUES ("${student}", "${req.body["teacher"]}")`));
                }
        });

    Promise.all(queryList)
        .then(results => {
            console.log('all done.', results);
            res.send({status: `${req.body["students"].length} students successfully added.`})
        }).catch(error => sendErrorResponse(res, error));

};

const commonStudents = async (req, res) => {
    const teacherList = req.query["teacher"];
    const query = commonStudentQueryBuilder(teacherList);
    console.log(query);
    // var query = `SELECT students FROM registration WHERE teacher="teacherken@gmail.com"`;

    await db.query(query)
        .then(result => {
            console.log(result);
            res.status(200);
            res.send(result);
        }).catch((error) => {
            console.log(error);
            sendErrorResponse(res, error)
        });

};

//todo: corner cases: student may not exist
const suspendAStudent = async (req, res) => {
    const studentEmail = noSpace(req.body["student"]);

    await db.query(`UPDATE students SET isSuspended="TRUE" WHERE email="${studentEmail}";`)
        .then(result => {
            console.log(result);
            res.sendStatus(204);
        }).catch((error) => {
            console.log(error);
            sendErrorResponse(res, error)
        });

};

const NotificationRecipients = async (req, res) => {
    const notification = noSpace(req.body["notification"]);
    const teacherEmail = noSpace(req.body["teacher"]);
    const regex = /@[\w@.]+/g;
    const mentions = notification.match(regex);
    mentions.forEach((value, index) => {
        mentions[index] = mentions[index].substring(1);
    });
    const query = `
            SELECT student
            FROM registration
            WHERE teacher="${teacherEmail}" AND
                (SELECT isSuspended
                 FROM students
                 WHERE email=registration.student
                 ) <> "TRUE";`;
    let recipients = [];

    await db.query(query)
        .then(result => {
            console.log(result);
            result.forEach((value) => {
                recipients.push(value['student'])
            });
            res.send({recipients: recipients.concat(mentions)});
        }).catch((error) => {
            console.log(error);
            sendErrorResponse(res, error)
        });
};

module.exports = {
    showTeachers,
    registerStudent,
    suspendAStudent,
    NotificationRecipients,
    commonStudents
};