CREATE TABLE IF NOT EXISTS teachers (
    email VARCHAR(50),
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS students (
    email VARCHAR(50),
    isSuspended VARCHAR(5) DEFAULT "FALSE",
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS registration (
    student VARCHAR(50),
    teacher VARCHAR(50),
    FOREIGN KEY (student) REFERENCES students(email)
        ON DELETE CASCADE,
    FOREIGN KEY (teacher) REFERENCES teachers(email)
        ON DELETE CASCADE,
    PRIMARY KEY (student, teacher)
);

SELECT *
FROM registration
WHERE teacher="teacherken@gmail.com" AND
    (SELECT isSuspended
     FROM students WHERE email=registration.student
     ) <> "TRUE";

INSERT INTO teachers (email) VALUES ("teacherjoe@gmail.com");
