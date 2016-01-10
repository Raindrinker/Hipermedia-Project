function YoutubeMP3() {

  /**
   * Function that, given a youtube link id, returns the URL
   * to the audio stream of the song.
   * It needs 1 parameter:
   * - linkId: Youtube id of the video to be streamed
   */
  this.getTrackForStream = function(linkId) {

    // Get the expiration time, calculated by the actual timestamp + 1 hour
    var timestamp = Math.round(Date.now() / 1000) + 3600;

    // Generate the signature in plain text
    var concatenation = linkId + "18" + timestamp + "ytapi.com1234567";

    // Calculate the actual signature by MD5
    var temp = md5(concatenation);

    // Concatenate the full URL
    var url = "http://s.ytapi.com/api/" + linkId + "/18/" + timestamp + "/ytapi.com/" + temp + "/";
    return url;
  }

}
