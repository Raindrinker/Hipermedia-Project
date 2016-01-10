function YoutubeApi(token) {
  this.token = token;
  var BASE_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=";
  var END_URL = "&type=video&key=" + token;

  this.searchVideo = function(query, callback) {

    var encoded = encodeURI(query);
    $.ajax({
      url: BASE_URL + encoded + END_URL,
      dataType: "json",
      success: function(data) {
        var items = data.items;
        if (items.length > 0) {
          console.log("Title of video returned: " + (items[0].snippet.title));
          callback(data.items[0].id.videoId);
        } else {
          callback("");
        }
      }
    })
  }

  this.prepareVideos = function(songs, callback) {
    this.prepareVideosIm(songs, [], 0, callback, this.searchVideo);
  }

  this.prepareVideosIm = function(songs, toReturn, index, callback, searchFunction) {

    if (toReturn.length < songs.length) {
      var query = (songs[index].artistName + " - " + songs[index].songName);
      this.searchVideo(query, function(id) {
        var song = songs[index];
        song.videoId = id;
        toReturn.push(song);
        this.prepareVideosIm(songs, toReturn, index + 1, callback);
      }.bind(this));
    } else {
      callback(toReturn);
    }

  }

}
