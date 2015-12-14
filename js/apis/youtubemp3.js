function YoutubeMP3(){

  var BASE_URL = "http://www.youtubeinmp3.com/fetch/?format=JSON&video=http://www.youtube.com/watch?v=";

  this.getTrackForVideo = function(videoId, callback){
    $.ajax({
      url: BASE_URL + videoId,
      dataType: "jsonp",
      success: function(data){
        callback(data.link);
      }
    });
  }

}
