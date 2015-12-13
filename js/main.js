var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null);

$("#searchbutton").click(function(event){
  var query = $("#searcharea").val();
  app.getSongsArtistsAlbumsFromName(query, 5, function(songs, artists, albums){

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

    var compiledSongs = songsTemplate(songsElement);
    var compiledArtists = artistsTemplate(artistsElement);
    var compiledAlbums = albumsTemplate(albumsElement);

    $(".base").append(compiledArtists);
    $(".base").append(compiledAlbums);
    $(".base").append(compiledSongs);

  });
});
