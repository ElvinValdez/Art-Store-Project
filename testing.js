const otherFile2 = require( __dirname + '/db_connection.js');
var otherFile = require( __dirname + '/loginbackend.js');

const connection = otherFile2.getDBConnection();
// otherFile.signin( connection, "bobbysandwich", "IamtheMary", function( err, result ){
//     if(err){
//         throw err;
//     }
//     console.log( result[0].username );
// });

otherFile.signin( "bobbysandwich", "IamtheMary", function( err, result ){
    if(err){
        throw err;
    }
    console.log( result[0].username );
    console.log( result.length );
});




const gallerybakend = require( __dirname + '/gallerybackend.js');

gallerybakend.getAllItems( function(err, results){
    console.log( results[0].image_location );
});