/*Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
This file is used to make a connection to the database*/
const mysql = require("mysql");


//This method is used to get a connection object to the database. It then returns that connection object. 
exports.getDBConnection = function(){
    const connection = mysql.createConnection({
        host: 'localhost',
        database: 'artstore',
        user: 'root',
        password: '(The300sheep)'
    });

    return connection;
};