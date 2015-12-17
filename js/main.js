var YOUTUBE_TOKEN = "AIzaSyDdIfOVzbu7Ri68LVtTBzKOrOHOnG-TZOU";



var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null);

var youtubeApi = new YoutubeApi(YOUTUBE_TOKEN);
var youtubeMP3Api = new YoutubeMP3();

$("#search_form").submit(function(event) {
  event.preventDefault();
  var query = $("#searcharea").val();

  /* TO BE IMPLEMENTED EN FUTURAS ITERACIONES
  youtubeApi.searchVideo(query, function(videoId){
      youtubeMP3Api.getTrackForVideo(videoId, function(link){
        console.log("LINK: "+link);
      });
  });*/

  app.getSongsArtistsAlbumsFromName(query, 12, function(songs, artists, albums) {

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

    //Afegim el listener per tots els elements amb class="square":

    $(".content-overlay").css("opacity", "0");
    $(".content-overlay").css("pointer-events", "none");
    setTimeout(function() {
      $(".base").empty();
      if (artists.length > 0) {
        $(".base").append(compiledArtists);

        $(".square").map(function(index, item) {
          $(item).click(function(event) {

            console.log("CLICKED: " + item.dataset.groupid);

            $(".base").empty();

            /*
              JSON PER L'ALBERT:

                {
                    "groupId": 12345,
                    "artistName": "Queen",
                    "imgRoute": "rutaImgQueen",
                    "biography": "Vida y milagros",
                    "topSongs":[
                              {
                                "songId":12345,
                                "songName":"NomCanço",
                                "albumName":"NomAlbum",
                                "imgRoute":"rutaCanço"
                              },
                              {
                                "songId":12345,
                                "songName":"NomCanço",
                                "albumName":"NomAlbum",
                                "imgRoute":"rutaCanço"
                              }
                            ]
                            "albums":[
                                      {
                                        "albumId":12345,
                                        "albumName":"NomAlbum",
                                        "imgRoute":"rutaAlbum"
                                      },
                                      {
                                        "albumId":12345,
                                        "albumName":"NomAlbum",
                                        "imgRoute":"rutaAlbum"
                                      }
                                    ]
                }
            */

            var artistMainAreaScript = $("#artist-main-template").html();
            /*var artistMainAreaTemplate = Handlebars.compile(artistMainAreaScript;);
            var artistMainAreaElement = {
              "artist": artist
            };
            var compiledArtistMainArea = artistMainAreaTemplate(artistMainAreaElement);

            $(".base").append(compiledArtistMainArea);*/
            $(".base").append(artistMainAreaScript);

            var sliderHeight = "100px";
            $('.panel-biography').each(function() {
                var current = $(this);
                current.attr("box_h", current.height());
              }

            );

            $(".panel-biography").css("height", sliderHeight);
            $(".toggle-biography").html('<a href="#">click</a>');
            $(".toggle-biography a").click(function() {
              openSlider()
            })

            /*if (artist.topSongs.length > 0) {
                $(".base").append(compiledSongs);
            }*/

            /*if (artist.albums.length > 0) {
                $(".base").append(compiledAlbums);
            }*/

          });
        });
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

function openSlider(){
    var open_height = $(".panel-biography").attr("box_h") + "px";
    $(".panel-biography").animate({"height": open_height}, {duration: "slow" });
    $(".toggle-biography").html('<a href="#">close</a>');
    $(".toggle-biography a").click(function() { closeSlider() })
}

function closeSlider(){
    var sliderHeight = "100px";
    $(".panel-biography").animate({"height": sliderHeight}, {duration: "slow" });
    $(".toggle-biography").html('<a href="#">click</a>');
    $(".toggle-biography a").click(function() { openSlider() })
}
