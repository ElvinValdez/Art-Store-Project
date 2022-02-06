/*Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
This file is used to perform the backend operations for the login and signup*/

const mysql = require("mysql");
const db_file = require( __dirname + '/db_connection.js');


/*This method is used to authenticate users that try to signin*/
exports.signin = function(username, password, callback ){
    const connection = db_file.getDBConnection(); //get a object to connect to the database

    //Make the connection to the database
    connection.connect(function(err) {
        if (err) { //print error if any connection error happens
          return console.error('error: ' + err.message);
        }
    
        //Select Some data from the database
        connection.query( "SELECT id, username FROM users LEFT JOIN userpasswords ON ( users.id = userpasswords.user_id ) WHERE "+
        "users.username = ? AND userpasswords.passwd = encryptPassword( ? )", [username, password], function(error, result, fields){
          if(error){
            throw error;
          }
          
          //console.log( result );
          callback(null, result); //pass the result back to the callback function
    
        });
    
        //Log that the connection was successful and end the connection
        console.log('Connected to the MySQL server.');
        connection.end(function(err) {
            if (err) {
              return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
          });
    });
};


/*This method is used to signup new users*/
exports.signup = function(username, password, callback ){
  const connection = db_file.getDBConnection(); //get a object to connect to the database

  //Make the connection to the database
  connection.connect(function(err) {
      if (err) { //print error if any connection error happens
        return console.error('error: ' + err.message);
      }
  
      //Enter new user into the database
      connection.query( "CALL createNewUser( ? , ?)", [username, password], function(error, result, fields){
        if(error){
          throw error;
        }
        
        //console.log( result );
        callback(null, result); //pass the result back to the callback function
  
      });
  
      //Log that the connection was successful and end the connection
      console.log('Connected to the MySQL server.');
      connection.end(function(err) {
          if (err) {
            return console.log('error:' + err.message);
          }
          console.log('Close the database connection.');
        });
  });
};


/*Use to set who is currently using*/
exports.setCurrentUser = function( id, username ){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');  //Allows the use of localStorage

  localStorage.setItem("id", id);
  localStorage.setItem("username", username);

};

/*Use to clear current user*/
exports.logout = function(){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');  //Allows the use of localStorage

  localStorage.setItem("id", '-99');
  localStorage.setItem("username", '-99');

};


/*Use to get current user id*/
exports.getCurrentUserId = function(){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');  //Allows the use of localStorage

  return localStorage.getItem("id");

};


/*Use to get current user username*/
exports.getCurrentUsername = function(){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');  //Allows the use of localStorage

  return localStorage.getItem("username");

};