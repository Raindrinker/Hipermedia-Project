$(function() {

    console.log("albums start");
    // Grab the template script
    var albumScript = $("#album-template").html();

    // Compile the template
    var album = Handlebars.compile(albumScript);

    // Define our data object
    var context = {
        album: [
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'},
            { imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'}
        ]
    };

    // Pass our data to the template
    var fullAlbum = album(context);

    console.log(fullAlbum);

    // Add the compiled html to the page
    $('.base').html(fullAlbum);
});
