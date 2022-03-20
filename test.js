const gallery = require( __dirname + '/public/js/gallerybackend.js' );

gallery.getSpecificItem( 6, function(err, result){
    console.log( result[0].item_name );

});