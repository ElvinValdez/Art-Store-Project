/*approvalBackend

Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
This file is used to do the backend operations for the Approval page*/

const mysql = require("mysql");
const db_file = require( __dirname + '/db_connection.js');



/*This method is used change the status of a certain item from the database to true if approved, false if otherwise.
item_i -> The id of the item to be approved
callback -> Function to be called which holds the necessary steps to be done afterwards.*/
exports.itemApproved = function( item_i, callback ){
    const connection = db_file.getDBConnection(); //get a object to connect to the database
  
    //Make the connection to the database
    connection.connect(function(err) {
        if (err) { //print error if any connection error happens
          return console.error('error: ' + err.message);
        }
    
        //Select Some data from the database
        connection.query( "CALL approveItem( ? )", [item_i], function(error, result, fields){
          if(error){
            throw error;
          }
          
          console.log( result );
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



  /*This method is called when an item waiting for approval is rejected
  item_i -> The id of the item to be rejected. 
  callback -> Function to be called which holds the necessary steps to be done afterwards*/
exports.itemRejected = function( item_i, callback ){
    const connection = db_file.getDBConnection(); //get a object to connect to the database
  
    //Make the connection to the database
    connection.connect(function(err) {
        if (err) { //print error if any connection error happens
          return console.error('error: ' + err.message);
        }
    
        //Select Some data from the database
        connection.query( "CALL deleteItem( ? )", [item_i], function(error, result, fields){
          if(error){
            throw error;
          }
          
          console.log( result );
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