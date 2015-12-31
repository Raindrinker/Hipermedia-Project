function EchoNestClient(token){
  this.token = token;

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

  this.getIdForName = function(name, callback){
    var url = BASE_URL + "/artist/search?api_key="+this.token+"&name="+name;

    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function(data){
        var artists = data.response.artists;
        if(artists.length > 0){
          callback(artists[0].id)
        } else {
          callback("");
        }
      }
    });
  }




}
