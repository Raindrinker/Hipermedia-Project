function YoutubeMP3(){

  var CORS = "http://cors.io/?u=";

  var getEncodedUrl = function(url){
    return CORS + encodeURI(url);
  }

  var BASE_URL = "http://www.youtubeinmp3.com/fetch/?format=text&video=http://www.youtube.com/watch?v=";
  var regex = /Link: (http.*)/g;

  this.getTrackForVideo = function(videoId, callback){

    /*var encodedUrl = getEncodedUrl(BASE_URL + videoId);

    $.ajax({
      url: encodedUrl,
      dataType: "text",
      success: function(data){
        console.log("RESPONSE: "+data);
        var match = regex.exec(data);
        var link = match[0];
        console.log("MATCH:");
        console.log(match);
        console.log("LINK:");
        console.log(link);
        callback(link);
      }
    });*/
  }

}
