$(function() {

    console.log("songs start");
    // Grab the template script
    var songlistScript = $("#song-template").html();

    // Compile the template
    var songlist = Handlebars.compile(songlistScript);

    // Define our data object
    var context = {
        imgRoute: 'assets/portada_test.jpg',
        groupName: 'Vetusta Morla',
        albumName: 'La Deriva',
        songlist: [
            { songNumber: '1',
            songName: 'Cuarteles de Invierno',
            artistName: 'Vetusta Morla'},
            { songNumber: '1',
            songName: 'Cuarteles de Invierno',
            artistName: 'Vetusta Morla'},
            { songNumber: '1',
            songName: 'Cuarteles de Invierno',
            artistName: 'Vetusta Morla'}
        ]
    };

    // Pass our data to the template
    var fullSonglist = songlist(context);

    console.log(fullSonglist);

    // Add the compiled html to the page
    $('.base').html(fullSonglist);
});
