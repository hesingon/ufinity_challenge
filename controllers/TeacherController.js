const db = require('../db');
const {commonStudentQueryBuilder, noSpace, duplicateErrorHandler} = require('../db/queryHelpers');
const {sendErrorResponse} = require('./ReponseHelpers');

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

    await db.query(`SELECT * FROM teachers WHERE email="${teacherEmail}"`)
        .then(result => {
            if (result.length < 1) {
                // sendErrorMessageResponse(res, 406, "Teacher not found");
                db.query(`INSERT INTO teachers (email) VALUES ("${teacherEmail}")`)
                console.log(`A new teacher ${teacherEmail} is created.`)
            }
        });
    let queryList = [];
    let registrationTableDuplicateCount = 0, studentTableDuplicateCount = 0;
    for (var student of req.body["students"]) {

        queryList.push(
            db.query(`INSERT INTO students (email) VALUES ("${student}")`)
                .catch(error => {
                    duplicateErrorHandler(error);
                    studentTableDuplicateCount++;
                })
                .catch(error => sendErrorResponse(res, error))
        );

        queryList.push(
            db.query(`INSERT INTO 
                        registration (student, teacher) 
                        VALUES ("${student}", "${req.body["teacher"]}")`)
                .catch(error => {
                    duplicateErrorHandler(error);
                    registrationTableDuplicateCount++;
                })
                .catch(error => sendErrorResponse(res, error))
        );
    }

    Promise.all(queryList)
        .then(() => {
            console.log(`${req.body["students"].length} students successfully processed.\n` +
            `${req.body["students"].length - studentTableDuplicateCount} students are completely new, \n` +
            `${registrationTableDuplicateCount} students already registered with this teacher, \n` +
            `while ${studentTableDuplicateCount - registrationTableDuplicateCount} are already registered with some other teachers.`);
            res.sendStatus(204);
        })
};

const commonStudents = async (req, res) => {
    const teacherList = req.query["teacher"];
    const query = commonStudentQueryBuilder(teacherList);
    console.log(query);

    await db.query(query)
        .then(result => {
            console.log(result);
            let result_array = [];
            result.forEach(item => result_array.push(item['student']));
            res.status(200);
            res.send({students:result_array});
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
    const notification = req.body["notification"];
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