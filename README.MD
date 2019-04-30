
### Setting up
run `npm install` to install all necessary dependencies. <br>

To start the backend server, make sure that MySQL is configured. `/schema.sql` 
provides the sql codes to create the tables. Edit the configurations at
 `db/config.js` for connecting to MySQL. Then run `npm start`. <br>

To test backend, run `npm test`.


## Notes

##### 1. As a teacher, I want to register one or more students to a specified teacher.
Preconditions:
1. teacher must already exist. If teacher does not exist, it will be created.

tests
1. Compare database for before and after.
2. Verify the new entry is displayed.

##### 2. As a teacher, I want to retrieve a list of students common to a given list of teachers 
Preconditions: all teachers exist, if not send 406 (not acceptable)
tests:
1. query the database multiple times, put them into sets and find intersection to check if the result printed is correct.

#### 3. As a teacher, I want to suspend a specified student.
preconditions: 
The student is listed. If not, print "Student not Found", and send 406 (not acceptable)
If the student is already suspended, can inform the teacher so.
tests:
1. when student is not found
2. when student is found.

#### 4. As a teacher, I want to retrieve a list of students who can receive a given notification.
test:
1. join the query result and those mentioned together and check if they belong to either group

default error code/message: 400 Bad Request