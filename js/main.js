var YOUTUBE_TOKEN = "AIzaSyDdIfOVzbu7Ri68LVtTBzKOrOHOnG-TZOU";
var dbm = new DatabaseManager();


var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null, dbm);

var youtubeApi = new YoutubeApi(YOUTUBE_TOKEN);
var youtubeMP3Api = new YoutubeMP3();

$("#search_form").submit(function(event) {
  event.preventDefault();
  var query = $("#searcharea").val();

  youtubeApi.searchVideo(query, function(videoId){

      function createAudioFromLink(link){

        var source = document.createElement("source");
        source.setAttribute("src", link);
        source.setAttribute("type", "audio/mpeg");

        var a = document.createElement("a");
        a.setAttribute("href", link);

        var audio = document.createElement("audio");
        $(audio).attr("id", "myaudio");
        $(audio).attr('controls', '');
        audio.appendChild(source);
        audio.appendChild(a);

        $(".origin").append(audio);
        audio.onloadeddata = function(e){
          if(e.target.duration == 20.038821){
            audio.pause();
            $(audio).remove();
            console.log("NOS PILLO LA MAFIA");
            createAudioFromLink(link);
          }
        }
        audio.play();
      }

      var link = youtubeMP3Api.getTrackForStream(videoId);
      console.log("LINK_FROM_MAIN: "+link);

      createAudioFromLink(link);

  });

  app.getSongsArtistsAlbumsFromName(query, 12, function(songs, artists, albums) {
      console.log("artists");
      console.log(artists);
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


        $('.fav').click(function(){
            var icon = this.childNodes[1];
            if($(icon).hasClass("glyphicon-star")){
                $(icon).removeClass("glyphicon-star");
                $(icon).addClass("glyphicon-star-empty");
                dbm.deleteFav(this.dataset.type, this.dataset.favid);
            }else{
                $(icon).removeClass("glyphicon-star-empty");
                $(icon).addClass("glyphicon-star");
                dbm.addFav(this.dataset.type, this.dataset.favid);
            }
        });


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
