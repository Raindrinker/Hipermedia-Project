function MusicManager(youtubeMP3Api){

  this.youtubeMP3Api = youtubeMP3Api;

  var currentAudio = null;
  var currentQueue = null;
  var currentIndex = 0;

  this.stop = function(){

  }

  this.pause = function(){
    if(currentAudio != null){
      currentAudio.pause();
    }
  }

  this.play = function(){
    if(currentAudio != null){
      currentAudio.play();
    }
  }

  var createAudioFromLink = function(link){

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
    audio.onloadeddata = function(e){
      if(e.target.duration == 20.038821){
        audio.pause();
        currentAudio = null;
        console.log("NOS PILLO LA MAFIA");
        createAudioFromLink(link);
      }
    }
    console.log(audio);
    audio.play();
  }

  var playSong = function(song){
    if(currentAudio != null){
      currentAudio.pause();
      currentAudio = null;
    }

    var videoId = song.videoId;

    var link = youtubeMP3Api.getTrackForStream(videoId);
    console.log("LINK FOR STREAM: "+link);

    createAudioFromLink(link);
  }

  var playNext = function(){
    if(currentIndex < currentQueue.length){
      console.log("PLAYING");
      console.log(currentQueue[currentIndex]);
      playSong(currentQueue[currentIndex]);
      currentIndex++;
    } else {
      console.log("LENGTH: "+(currentQueue.length));
      console.log("INDEX: "+currentIndex);
    }
  }

  this.playSongs = function(songs){
    console.log("SONGS");
    console.log(songs);
    currentQueue = songs;
    currentIndex = 0;

    playNext();
  }
}
