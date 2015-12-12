var buildArtists = function () {

    console.log("building artists...");

    // Grab the template script
    var artistsScript = $("#artists-template").html();

    // Compile the template
    var artists = Handlebars.compile(artistsScript);

    // Define our data object
    var context = {
        artist: [
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/artista_test.jpg',
            artistName: 'Vetusta Morla',
            groupId: '69'}
        ]
    };

    // Pass our data to the template
    var artistList = artists(context);

    // Add the compiled html to the page
    $('.base').append(artistList);
};

var buildAlbums = function () {

    console.log("building albums...");

    // Grab the template script
    var albumsScript = $("#albums-template").html();

    // Compile the template
    var albums = Handlebars.compile(albumsScript);

    // Define our data object
    var context = {
        album: [
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'},
            { imgRoute: 'assets/portada_test.jpg',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69'}
        ]
    };

    // Pass our data to the template
    var albumList = albums(context);

    // Add the compiled html to the page
    $('.base').append(albumList);
};

var buildSongs = function () {

    console.log("building songs...");

    // Grab the template script
    var songsScript = $("#songs-template").html();

    // Compile the template
    var songs = Handlebars.compile(songsScript);

    // Define our data object
    var context = {
        song: [
            { imgRoute: 'assets/portada_test.jpg',
            songName: 'Golpe Maestro',
            songId: '69',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69' },
            { imgRoute: 'assets/portada_test.jpg',
            songName: 'Golpe Maestro',
            songId: '69',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69' },
            { imgRoute: 'assets/portada_test.jpg',
            songName: 'Golpe Maestro',
            songId: '69',
            albumName: 'La Deriva',
            albumId: '69',
            artistName: 'Vetusta Morla',
            groupId: '69' }
        ]
    };

    // Pass our data to the template
    var songList = songs(context);

    // Add the compiled html to the page
    $('.base').append(songList);
};

buildArtists();
buildAlbums();
buildSongs();
