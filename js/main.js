var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null);

$("#searchbutton").click(function(event){
  var query = $("#searcharea").val();
  app.getSongsArtistsAlbumsFromName(query, 12, function(songs, artists, albums){

    // Grab the template script
    var songsScript = $("#songs-template").html();
    var artistsScript = $("#artists-template").html();
    var albumsScript = $("#albums-template").html();


    var songsElement = {
      "song": songs
    };

    var artistsElement = {
      "artist": artists
    };

    var albumsElement = {
      "album": albums
    };

    // Compile the template
    var artistsTemplate = Handlebars.compile(artistsScript);
    var songsTemplate = Handlebars.compile(songsScript);
    var albumsTemplate = Handlebars.compile(albumsScript);


    var compiledArtists = artistsTemplate(artistsElement);
    var compiledAlbums = albumsTemplate(albumsElement);
    var compiledSongs = songsTemplate(songsElement);

    $(".base").empty();
    if(artists.length > 0){
        $(".base").append(compiledArtists);
    }
    if(albums.length > 0){
        $(".base").append(compiledAlbums);
    }
    if(songs.length > 0){
        $(".base").append(compiledSongs);
    }

  });
});
