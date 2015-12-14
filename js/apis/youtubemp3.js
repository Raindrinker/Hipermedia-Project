/*function YoutubeMP3(){

  var CORS = "http://cors.io/?u=";

  var getEncodedUrl = function(url){
    return CORS + encodeURI(url);
  }

  var BASE_URL = "http://www.youtubeinmp3.com/fetch/?format=text&video=http://www.youtube.com/watch?v=";
  var regex = /Link: (http.*)/g;

  this.getTrackForVideo = function(videoId, callback){

    var encodedUrl = getEncodedUrl(BASE_URL + videoId);
    console.log("ENCODED: "+encodedUrl);

    $.ajax({
      url: encodedUrl,
      dataType: "text",
      success: function(data, textStatus){
        console.log("RESPONSE: "+data);
        console.log("TEXTSTATUS: "+textStatus);
        var match = regex.exec(data);
        var link = match[0];
        console.log("MATCH:");
        console.log(match);
        console.log("LINK:");
        console.log(link);
        callback(link);
      }
    });
  }

}*/

function YoutubeMP3(){
  var CORS = "http://cors.io/?u=";

  var getEncodedUrl = function(url){
    return CORS + encodeURIComponent(url);
  }
  var BASE_URL = "http://www.s.ytapi.com/?vid=";
  var MIDDLE_URL = "&itag=18&exp=";
  var FINAL_URL = "&user=ytapi.com&pass=1234567";

  this.getTrackForVideo = function(videoId, callback){
    var timestamp = Math.round(Date.now() / 1000) + 3600;

    var url = BASE_URL + videoId + MIDDLE_URL + timestamp + FINAL_URL;

    var originUrl = getEncodedUrl(url);
    console.log("NORMAL: "+url);
    console.log("ORIGIN: "+originUrl);

    $.ajax({
      url: originUrl,
      method: "GET",
      dataType: "html",
      context: this,
      success: function(data){
        console.log("SUCCESS. DATA");
        var link = $(data).find("#link").val();
        //console.log("LINK: "+link);
        var hash = link.split("&s=")[1];
        var mp3URL = "http://s.ytapi.com/api/"+videoId+"/18/"+timestamp+"/ytapi.com/"+hash+"/";
        callback(mp3URL);
      }
    });
  }

}
