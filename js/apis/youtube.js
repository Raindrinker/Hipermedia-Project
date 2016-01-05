function YoutubeApi(token){
  this.token = token;
  var BASE_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=";
  var END_URL = "&type=video&key="+token;

  this.searchVideo = function(query, callback){

    var encoded = encodeURI(query);

    $.ajax({
      url: BASE_URL + encoded + END_URL,
      dataType: "json",
      success: function(data){
        var items = data.items;
        if(items.length > 0){
          console.log("Title of video returned: "+(items[0].snippet.title));
          callback(data.items[0].id.videoId);
        } else {
          callback("");
        }
      }
    })
  }

}
