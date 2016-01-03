function EchoNestClient(token, spotifyClient){
  this.token = token;
  this.spotifyClient = spotifyClient;

  var CORS = "http://cors.io/?u=";
  var BASE_URL = "http://developer.echonest.com/api/v4";
  var PROFILE_ID_NAME = "ECHONEST_PROF_ID";

  var encode = function(url){
    return CORS + encodeURIComponent(url);
  }

  var getProfileId = function(){
    return localStorage.getItem(PROFILE_ID_NAME);
  }

  var setProfileId = function(id){
    localStorage.setItem(PROFILE_ID_NAME, id);
  }

  var generateTasteProfile = function(token, callback){
    console.log("TOKEN: "+token);
    $.ajax({
        url: BASE_URL +"/catalog/create",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
            "format": "json",
            "name": "hipermedia_profile",
            "api_key": token,
            "type": "song",
        },
    })
    .done(function(data, textStatus, jqXHR) {
        callback(data.response.status.id);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed. Profile not generated");
        callback("");
    });
  }

  this.updateFavoritedSong = function(songId, favorited, callback){
    var url = BASE_URL+"/tasteprofile/update";
    var tasteProfileId = getProfileId();
    var trackId = "spotify:track:"+songId;
    var dataObject = [
      {
        action: "update",
        item: {
          track_id: trackId,
          favorite: favorited
        }
      }
    ];

    var dataString = JSON.stringify(dataObject);
    var apiToken = this.token;

    jQuery.ajax({
        url: url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
            "data_type": "json",
            "id": tasteProfileId,
            "data": dataString,
            "api_key": apiToken,
            "format": "json",
        },
    })
    .done(function(data, textStatus, jqXHR) {
        console.log(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed. Could not update profile");
    });
  }

  var prepareSongs = function(songs, numResults, callback){
    prepareSongsIm(songs, [], numResults, 0, callback)
  }

  var prepareSongsIm = function(songs, formatted, numResults, index, callback){
    if(index < songs.length && formatted.length < numResults){
      var song = songs[index];
      console.log("SONG");
      console.log(song);
      var artistId = song.artist_foreign_ids[0].foreign_id.split(":")[2];
      var artistName = song.artist_name;
      var title = song.title;
      var query = artistName +" - "+title;
      spotifyClient.searchTracks(query, {limit: 10}, function(error, tracks){
        if(error)console.log(error);
        var items = tracks.tracks.items;
        var correct = null;
        var i;
        for(i = 0; i < items.length; i++){
          var item = items[i];
          if(item.artists[0].id == artistId){
            correct = item;
            break;
          }
        }

        if(correct != null){
          var imageUrl = "http://lorempixel.com/400/400/abstract/";
          if (correct.album.images.length > 0) {
            imageUrl = correct.album.images[0].url;
          }

          var element = {
            id: correct.id,
            songId: correct.id,
            songName: correct.name,
            artistName: correct.artists[0].name,
            albumName: correct.album.name,
            groupId: artistId,
            albumId: correct.album.id,
            imgRoute: imageUrl
          };

          formatted.push(element);
        }
        prepareSongsIm(songs, formatted, numResults, index+1, callback);
      });
    } else {
      callback(formatted);
    }
  }

  this.getRelatedSongs = function(numResults, callback){
    var url = BASE_URL+"/playlist/static";
    var catalogId = getProfileId();

    // Add 10 more results, so we can expect some Spotify search failures
    var body = {
      api_key: this.token,
      results: numResults + 10,
      type: "catalog-radio",
      seed_catalog: catalogId,
      adventurousness: 1.0,
      bucket: "id:spotify"
    };

    // Set cache to false, as we want different results each time
    jQuery.ajax({
      url: url,
      type: "GET",
      data: body,
      cache: false
    }).done(function(data, textStatus, jqXHR) {
        console.log(data);

        var responseCode = data.response.status.code;

        if(responseCode == 0){
          var songs = data.response.songs;
          prepareSongs(songs, numResults, callback);
        } else {
          console.log("RELATED SONGS RESPONSE NOT OK. CODE: "+responseCode);
          callback([]);
        }

    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed. NO RELATED SONGS");
        callback([]);
    });

  }

  this.init = function(){
    var profId = getProfileId();
    if(profId == null || profId == undefined || profId.length == 0){
      console.log("GENERATED PROFILE WAS NULL");
      generateTasteProfile(this.token, function(id){
        console.log("GENERATED PROFILE: "+id);
        setProfileId(id);
      }.bind(this));
    }
  }

}
