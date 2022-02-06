var formidable = require('formidable');
var fs = require('fs');


/*This method just takes an uploaded file and stores them in the imagefileserver folder.*/
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