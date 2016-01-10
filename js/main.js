$.material.init()

var YOUTUBE_TOKEN = "AIzaSyDdIfOVzbu7Ri68LVtTBzKOrOHOnG-TZOU";
var ECHONEST_TOKEN = "NWZX9JCXADVAIYPJD";

var dbm = new DatabaseManager();

var renderer = new Renderer();
var api = new SpotifyWebApi();
var echonestClient = new EchoNestClient(ECHONEST_TOKEN, api);

var youtubeApi = new YoutubeApi(YOUTUBE_TOKEN);
var youtubeMP3Api = new YoutubeMP3();
var musicManager = new MusicManager(youtubeMP3Api);

var app = new BetaPlayerApp(api, renderer, dbm, echonestClient, youtubeApi, musicManager);
app.init();

$("#search_form").submit(function(event) {
  event.preventDefault();
  var query = $("#searcharea").val();
  app.getSongsArtistsAlbumsFromName(query, 12);
});

$("#nav-favourites").click(function() {
  app.showFavourites();
});

$("#nav-recommendations").click(function() {
  app.showRecommendations();
});
