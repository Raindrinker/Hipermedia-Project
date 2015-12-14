var YOUTUBE_TOKEN = "AIzaSyDdIfOVzbu7Ri68LVtTBzKOrOHOnG-TZOU";



var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null);

var youtubeApi = new YoutubeApi(YOUTUBE_TOKEN);
var youtubeMP3Api = new YoutubeMP3();

$("#search_form").submit(function(event){
  event.preventDefault();
  var query = $("#searcharea").val();
  youtubeApi.searchVideo(query, function(videoId){
      youtubeMP3Api.getTrackForVideo(videoId, function(link){
        console.log("LINK: "+link);
      });
  });
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

        $(".content-overlay").css("opacity", "0");
        $(".content-overlay").css("pointer-events", "none");
        setTimeout(function() {
            $(".base").empty();
            if (artists.length > 0) {
                $(".base").append(compiledArtists);
            }
            if (albums.length > 0) {
                $(".base").append(compiledAlbums);
            }
            if (songs.length > 0) {
                $(".base").append(compiledSongs);
            }
            setTimeout(function() {
                $(".content-overlay").css("opacity", "1");
                $(".content-overlay").css("pointer-events", "all");
            }, 250);
        }, 250);

  });
});
