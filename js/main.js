var YOUTUBE_TOKEN = "AIzaSyDdIfOVzbu7Ri68LVtTBzKOrOHOnG-TZOU";
var dbm = new DatabaseManager();

var renderer = new Renderer();
var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, renderer, dbm);

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

  app.getSongsArtistsAlbumsFromName(query, 12);

});

$("#nav-favourites").click(function(){
  app.showFavourites();
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
