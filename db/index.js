const {dbuser, dbpassword, host} = require('./config');

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: dbuser,
    password: dbpassword
});

con.connect(function(err) {
    if (err) {
        console.log("Darius: Oops looks like MySQL is not connected successfully. Try running this in SQL console:");
        console.log("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';");
        throw err;
    }
    console.log("Connected to MySQL Database with username " + dbuser);
});


module.exports = {
    query: (text, params) => client.query(text, params)
};