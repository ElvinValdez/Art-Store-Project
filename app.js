/*Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
    Simple project from school to create a working webstore*/
const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");

var formidable = require('formidable');  //used to gain access to uploaded files
var fs = require('fs');                  //used to perform file operations


const app = express();


app.use(bodyParser.urlencoded({ extended: true })); //allows the use of bodyparser
// app.set( "view engine", "ejs" ); //allows the use of ejs files. They must be in the views folder

/*Static files, like css and image files, can now be stored in the public folder. 
Node.js will look for any js, css, or image files in these folders. Basically static files*/
app.use( express.static("public") );
app.set( "view engine", "ejs" ); //allows the use of ejs files. They must be in the views folder




app.get( "/", function(req, res){
    res.redirect("/login");
});



//------------------------------------
// Route for Login Page
//------------------------------------

/*When login is pressed, Make a connection to database, call the getSpecifiedUser procedure.
If results array is 0, then the user does not exist, alert the user of this. Else, record the 
username and id and then redirect to gallerypage*/

app.get("/login", function(req, res){
    //When the user first comes to this page, log them out
    const loginbakend = require( __dirname + '/public/js/loginbackend.js');  
    loginbakend.logout(); //logs out user in case they did not sign out

    res.render("login");
});

app.post("/login", function(req, res){
    //get the username and password from the form
    const usern = req.body.usernfield;
    const passw = req.body.passwfield;

    /*Use the signin method from the loginbackend.js file to try signing in the user*/
    const loginbakend = require( __dirname + '/public/js/loginbackend.js');

    loginbakend.signin( usern, passw, function(err, result){
        if(err){ throw err; } //catch any errors, if they exist

        //If there is a result, that means that the specified user exists. Store their id and username in node localStorage
        if( result.length > 0 ){
            loginbakend.setCurrentUser( result[0].id, result[0].username );
            res.redirect("/gallery");

        }else{ //If there are no results, tell the user that something is wrong and go back to the loginpage
            res.send("<script>alert('Username or Password is incorrect'); window.location.href = '/login'; </script>");
        }
    });

});//end of login post




//------------------------------------
// Route for Signup Page
//------------------------------------

app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    const usern = req.body.usernfield;
    const pass1 = req.body.passwfield;
    const pass2 = req.body.passwfield2;

    //if passwords do not match, tell user and redirect back to signup page
    if( pass1 != pass2 ){
        res.send("<script>alert('The passwords do not match!'); window.location.href = '/signup'; </script>");

    }else{
        /*Use the signup method from the loginbackend.js file to signup the user*/
        const loginbakend = require( __dirname + '/public/js/loginbackend.js');
        loginbakend.signup( usern, pass1, function(err, result){
            if(err){ throw err } //catch any errors if they exist
            res.send("<script>alert('Sign Up Successful. Redirecting to login screen'); window.location.href = '/login'; </script>");
        });
    }

});//end of post method




//------------------------------------
// Routes for Gallery Page
//------------------------------------

/*The Gallery page should show the list of art stored in the database along with simple
information about the art like its creator, price...etc*/
app.get("/gallery", function(req, res){
    const gallerybakend = require( __dirname + '/public/js/gallerybackend.js'); //now you can use objects in gallerybackend.js file
    gallerybakend.getAllItems( function(err, results){
        res.render( "gallery", {itemList: results} );
    });

});



app.get("/addedToCart/:i_id", function( req, res ){
    //Dont let the user add to cart if they are not logged in.
    const loginbakend = require( __dirname + '/public/js/loginbackend.js' ); //now you can use objects in loginbakend.js file
    const gallerybakend = require( __dirname + '/public/js/gallerybackend.js'); //now you can use objects in gallerybackend.js file

    if( loginbakend.getCurrentUserId() === "-99" ){ //user is not logged in, redirect to login
        res.redirect("/login");
    }else{
        gallerybakend.addToCart( loginbakend.getCurrentUsername(), req.params.i_id, function(err, result){
            if(err){throw err};

            res.redirect("/viewsingleart/"+req.params.i_id );

        } );

    }
});


//------------------------------------
// Routes for View Art Page
//------------------------------------

app.get("/viewsingleart/:i_id", function(req, res){
    const gallerybakend = require( __dirname + '/public/js/gallerybackend.js');
    gallerybakend.getSpecificItem( req.params.i_id, function( err, result ){
        if( err ){ throw err; } //Take care of errors

        res.render( "viewart", {imageName: result[0].item_name, 
                                imageLocation: result[0].image_location,
                                imageAuthor: result[0].seller,
                                imagePrice: result[0].price,
                                imageDescription: result[0].item_description } );

    });

    // res.render( "viewart", {} );

    // res.send( "You number is: " + req.params.i_id );

});




//------------------------------------
// Routes for the Upload Art Pages
//------------------------------------

app.get("/uploadartinfo", function(req, res){
    //Dont let the user enter this page if they are not logged in.
    const loginbakend = require( __dirname + '/public/js/loginbackend.js' );

    if( loginbakend.getCurrentUserId() === "-99" ){ //user is not logged in, redirect to login
        res.redirect("/login");
    }else{
        res.render("uploadartinfo"); 
    }
});

app.post( "/uploadartinfo", function(req, res){
    /*Get the description, price, image_name and then redirect to 
    '/uploadartpicture' so user can upload their art picture*/
    const description = req.body.description;
    const price = req.body.price;
    const image_name = req.body.name;

    res.redirect( "/uploadartpicture/"+description+"-"+price+"-"+image_name );

});


app.get( "/uploadartpicture/:desc-:price-:name", function(req, res){
    res.render("uploadartpicture", {des: req.params.desc, pric: req.params.price, name: req.params.name} );
});


app.post("/uploadartpicture/:desc-:price-:name", function(req, res){
    const gallerybakend = require( __dirname + '/public/js/gallerybackend.js' );
    const loginbakend = require( __dirname + '/public/js/loginbackend.js' );
    const uploadFile = require( __dirname + '/public/js/uploadfile.js');

    //upload the file to imagefileserver
    uploadFile.uploadImage( req, (new formidable.IncomingForm()), __dirname, loginbakend.getCurrentUserId(), function(err, picName){
        if( err ){ throw err; } //handle any errors/exceptions

        //Save the image information in the database
        gallerybakend.addNewItem( req.params.name, req.params.desc, parseInt( req.params.price ), 
                                loginbakend.getCurrentUsername(), picName, function(err, result){
            if( err ){ throw err; }

            console.log("Successfully saved image information");
        });


        res.redirect("/gallery");
    });
});







//Listen on port 3000
app.listen(3000, function(){
    console.log("Server listening on port 3000");
});