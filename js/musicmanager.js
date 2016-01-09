function MusicManager(youtubeMP3Api) {

  this.youtubeMP3Api = youtubeMP3Api;

  var EVENT_TIME = 200;

  var appReference = null;

  var currentAudio = null;
  var currentQueue = null;
  var currentIndex = 0;

  var currentVolume = 0.5;
  var intervalId = -1;

  this.setAppReference = function(app) {
    appReference = app;
  }

  this.stop = function() {

  }

  this.getCurrentAudio = function() {
    return currentAudio;
  }

  this.pause = function() {
    if (currentAudio != null) {
      currentAudio.pause();
    }
  }

  this.play = function() {
    if (currentAudio != null) {
      currentAudio.play();
    }
  }

  var publishProgress = function() {
    if (currentAudio != null) {
      var current = currentAudio.currentTime;
      var duration = currentAudio.duration;
      var progress = (current / duration) * 100;
      //console.log("CURRENT: "+current +" | DURATION: "+duration);
      appReference.updateProgress(progress);
    }
  }

  var createAudioFromLink = function(link) {

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

    //$(".origin").append(audio);
    currentAudio = audio;
    audio.onloadeddata = function(e) {
        if (e.target.duration == 20.038821) {
          audio.pause();
          currentAudio = null;
          console.log("NOS PILLO LA MAFIA");
          createAudioFromLink(link);
        } else {
          audio.volume = currentVolume;
          audio.onended = function() {
            onSongEnded();
          }
        }
      }
      //console.log(audio);
    audio.play();
  }

  var onSongEnded = function() {
    clearInterval(intervalId);
    if (currentIndex == currentQueue.length) {
      appReference.onPlayEnded();
    } else {
      playNext();
    }
  }

  var playSong = function(song) {
    if (currentAudio != null) {
      currentAudio.pause();
      currentAudio = null;
      clearInterval(intervalId);
    }

    var videoId = song.videoId;

    var link = youtubeMP3Api.getTrackForStream(videoId);
    //console.log("LINK FOR STREAM: "+link);

    createAudioFromLink(link);
    appReference.showPlaySong(song);
    setInterval(function() {
      publishProgress();
    }, EVENT_TIME);
  }

  var playNext = function() {
    if (currentIndex < currentQueue.length) {
      console.log("PLAYING");
      console.log(currentQueue[currentIndex]);
      playSong(currentQueue[currentIndex]);
      currentIndex++;
    } else {
      if(currentAudio != null){
        currentAudio.pause();
        currentAudio = null;
        currentIndex = 0;
        currentQueue = [];
      }
      appReference.onPlayEnded();
    }
  }

  this.playSongs = function(songs) {
    console.log("SONGS");
    console.log(songs);
    currentQueue = songs;
    currentIndex = 0;

    playNext();
  }

  this.setSongProgress = function(progress) {
    if (currentAudio != null) {
      var newProgress = currentAudio.duration * progress / 100;
      currentAudio.currentTime = newProgress;
    }
  }

  this.forward = function() {
    playNext();
  }

  this.back = function() {
    if (currentAudio != null) {

      var current = currentAudio.currentTime;

      // currentIndex == 1 means that we are playing the first song
      if (current > 20 || currentIndex == 1) {
        currentAudio.currentTime = 0;
      } else if (current < 20 && currentIndex > 1) {
        currentIndex = (currentIndex - 2);
        playNext();
      }
    }
  }

  this.setVolume = function(volume) {
    if (currentAudio != null) {
      var newVolume = volume / 100;
      currentAudio.volume = newVolume;
      currentVolume = newVolume;
    }
  }
}
