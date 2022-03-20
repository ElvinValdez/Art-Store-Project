/*Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
This file is used to do the backend operations for the gallery page*/

const mysql = require("mysql");
const db_file = require( __dirname + '/db_connection.js');


/*This method is used to get a list of all items from the db*/
exports.getAllItems = function( callback ){
    const connection = db_file.getDBConnection(); //get a object to connect to the database

    //Make the connection to the database
    connection.connect(function(err) {
        if (err) { //print error if any connection error happens
          return console.error('error: ' + err.message);
        }
    
        //Select Some data from the database
        connection.query( "SELECT * FROM items", function(error, result, fields){
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


/*This method is used to add a new item*/
exports.addNewItem = function( i_name, i_description, i_price, i_seller, i_imageName, callback ){
  const connection = db_file.getDBConnection(); //get a object to connect to the database

  //Make the connection to the database
  connection.connect(function(err) {
      if (err) { //print error if any connection error happens
        return console.error('error: ' + err.message);
      }
  
      //Select Some data from the database
      connection.query( "CALL addNewItem(?, ?, ?, ?, ?)",[i_name, i_description, i_price, i_seller, i_imageName], function(error, result, fields){
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




/*This method is used to get a specific item from the database*/
exports.getSpecificItem = function( item_i, callback ){
  const connection = db_file.getDBConnection(); //get a object to connect to the database

  //Make the connection to the database
  connection.connect(function(err) {
      if (err) { //print error if any connection error happens
        return console.error('error: ' + err.message);
      }
  
      //Select Some data from the database
      connection.query( "SELECT * FROM items WHERE item_id = ?", [item_i], function(error, result, fields){
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




/*This method is used to add a new item*/
exports.addToCart = function( buyer, item_id, callback ){
  const connection = db_file.getDBConnection(); //get a object to connect to the database

  //Make the connection to the database
  connection.connect(function(err) {
      if (err) { //print error if any connection error happens
        return console.error('error: ' + err.message);
      }
  
      //Select Some data from the database
      connection.query( "CALL addToCart(?, ?)",[buyer, item_id], function(error, result, fields){
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