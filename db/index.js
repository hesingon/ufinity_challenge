const config = require('./config');
const mysql = require('mysql');


// Note that it doesn’t open the connection yet.
// The connection is automatically opened when the first query is executed.
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) {
                    return reject( err );
                }
                resolve(rows);
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

// var con = mysql.createConnection(config);
//
// con.connect(function(err) {
//     if (err) {
//         console.log("Darius: Oops looks like MySQL is not connected successfully. Try running this in SQL console:");
//         console.log("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';");
//         throw err;
//     }
//     console.log("Connected to MySQL Database with username " + dbuser);
// });


module.exports = new Database(config);
