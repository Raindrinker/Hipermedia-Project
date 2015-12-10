$(function() {

    // Grab the template script
    var songsScript = $("#song-template").html();

    // Compile the template
    var songs = Handlebars.compile(songsScript);

    // Define our data object
    var context = {
        song: [
            { songName: 'Cuarteles de Invierno',
            imgRoute: 'assets/portada_test.jpg',
            groupName: 'Vetusta Morla',
            albumName: 'La Deriva'}
        ]
    };

    // Pass our data to the template
    var songList = songs(context);

    // Add the compiled html to the page
    $('.base').html(songList);
});
