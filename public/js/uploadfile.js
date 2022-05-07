/**uploadfile.js
 * 
 * authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
 * 
 * this file is used for operations which include uploading a file
*/
var formidable = require('formidable');
var fs = require('fs');


/*This method just takes an uploaded file and stores them in the imagefileserver folder.
req -> The request parameter which holds some image information
form -> the way that the image is being sent
directoryName -> the directory to save the image to
userid -> The id of the user that is uploading this image
callback -> Function to be called which holds the necessary steps to be done afterwards*/
exports.uploadImage = function( req, form, directoryName, userid, callback ){

    form.parse( req, function(err, fields, files){
        if(err){
            throw err;
        }

        var oldpath = files.filetoupload.filepath;
        var picName = userid + files.filetoupload.originalFilename;
        var newpath = directoryName + '/public/imagefileserver/' + picName;

        //upload the file to the imagefileserver folder
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log('File uploaded and moved!');
        });

        callback( null, picName );

    });
};


//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       var oldpath = files.filetoupload.filepath;
//       //var newpath = 'C:/Users/thegr/' + files.filetoupload.originalFilename;
//       var newpath = __dirname + '/public/imagefileserver/' + files.filetoupload.originalFilename;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         console.log('File uploaded and moved!');
//         console.log(__dirname)
//       });
//     });