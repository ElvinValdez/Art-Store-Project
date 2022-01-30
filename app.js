/*Authors: Amimul Bhuiyan, Rachid Sassine, Elvin Valdez
    Simple project from school to create a working webstore*/
const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");

// const LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');  //Allows the use of localStorage

const app = express();


app.use(bodyParser.urlencoded({ extended: true })); //allows the use of bodyparser
app.set( "view engine", "ejs" ); //allows the use of ejs files. They must be in the views folder

/*Static files, like css and image files, can now be stored in the public folder. 
Node.js will look for any js, css, or image files in these folders. Basically static files*/
app.use( express.static("public") );




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
            res.send("You logged in! Username: " + usern + "  password: " + passw);

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


//------------------------------------
// Routes for View Single Art Page
//------------------------------------

app.get("/viewsingleart/:i_id", function(req, res){
    res.send( "The id is: "+req.params.i_id );
});



//Listen on port 3000
app.listen(3000, function(){
    console.log("Server listening on port 3000");
});