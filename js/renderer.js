/**
 * This function defines an object that will be responsible for all the UI
 * rendering actions, such as paint the albums, artists and songs.
 */
function Renderer() {

  // Grab the template script
  var songsScript = $("#songs-template").html();
  var artistsScript = $("#artists-template").html();
  var albumsScript = $("#albums-template").html();
  var artistMainScript = $("#artist-main-template").html();
  var albumMainScript = $("#album-main-template").html();
  var playerMainScript = $("#player-template").html();
  var playlistItemScript = $("#playlist-item-template").html();
  var playlistModalScript = $("#playlist-modal-template").html();
  var playlistMainScript = $("#playlist-main-template").html();

  // Precompile Handlebars templates
  var artistsTemplate = Handlebars.compile(artistsScript);
  var songsTemplate = Handlebars.compile(songsScript);
  var albumsTemplate = Handlebars.compile(albumsScript);
  var artistMainTemplate = Handlebars.compile(artistMainScript);
  var albumMainTemplate = Handlebars.compile(albumMainScript);
  var playerTemplate = Handlebars.compile(playerMainScript);
  var playlistItemTemplate = Handlebars.compile(playlistItemScript);
  var playlistModalTemplate = Handlebars.compile(playlistModalScript);
  var playlistMainTemplate = Handlebars.compile(playlistMainScript);

  var isSlidePressed = false;

  this.appReference = null;

  /**
   * Generic function that renders something
   * It needs 3 parameters:
   *  - attrName: Name of the attribute expected by the Handlebars template
   *  - array: Array of objects to be rendered by the Handlebars template
   *  - template: Reference to the compiled Handlebars template
   */
  var renderGeneric = function(attrName, array, template) {

    // Initialize an empty element (necessary for the dynamic attribute)
    var element = {};

    // Assign the attribute name and the array
    element[attrName] = array;

    // Add the rendered content if necessary
    if (array.length > 0) {
      var compiled = template(element);
      $(".base").append(compiled);
    }
  }


  /**
   * Function that renderers a list of artists.
   * It needs 2 parameters:
   *  - artists: Array of artists to be rendered
   *  - appReference: Due to scope problems, it needs a reference to the app
   */
  var renderArtists = function(artists, appReference) {
    renderGeneric("artist", artists, artistsTemplate);
  }


  /**
   * Function that renderers a list of albums.
   * It needs 1 parameter:
   *  - albums: Array of albums to be rendered
   */
  var renderAlbums = function(albums) {
    renderGeneric("album", albums, albumsTemplate);
  }


  /**
   * Function that renderers a list of songs.
   * It needs 1 parameter:
   *  - songs: Array of songs to be rendered
   */
  var renderSongs = function(songs) {
    renderGeneric("song", songs, songsTemplate);
  }

  var realRenderMainArtist = function(artist) {

    var headObject = {
      imgRoute: artist.imgRoute,
      artistName: artist.artistName
    }

    console.log("SONGS");
    console.log(artist.song);

    var compiledHead = artistMainTemplate(headObject);
    $(".base").append(compiledHead);
    renderAlbums(artist.album);
    renderSongs(artist.song);

  }

  var renderMainPlaylist = function(playlistName, songs) {

    var headObject = {
      playlistName: playlistName
    }

    console.log("PLAYLISTS");

    var compiledHead = playlistMainTemplate(headObject);
    $(".base").append(compiledHead);
    renderSongs(songs);

  }

  var realRenderMainAlbum = function(album) {
    var headObject = {
      imgRoute: album.imgRoute,
      artistName: album.artistName,
      albumName: album.albumName,
      groupId: album.groupId
    }

    var compiledHead = albumMainTemplate(headObject);
    $(".base").append(compiledHead);
    renderSongs(album.song);
  }

  this.enableLinkable = function() {
    var appReference = this.appReference;
    $(".link-artist").map(function(index, item) {
      $(item).click(function(event) {
        event.stopPropagation();
        var id = item.dataset.groupid;
        console.log("CLICKED: " + id);
        appReference.paintArtist(id);
      });
    });

    $(".link-album").map(function(index, item) {
      $(item).click(function(event) {
        event.stopPropagation();
        var id = item.dataset.albumid;
        console.log("CLICKED: " + id);
        appReference.paintAlbum(id);
      });
    });
  }

  this.enablePlayable = function() {
    $(".list-group-item.song").map(function(index, item) {
      $(item).click(function(event) {
        event.stopPropagation();
        var dataset = item.dataset;
        var artist = item.dataset.groupname;
        var song = item.dataset.name;

        var obj = {
          id: dataset.songid,
          imgRoute: dataset.image,
          songName: dataset.name,
          groupId: dataset.groupid,
          artistName: dataset.groupname,
          albumId: dataset.albumid,
          albumName: dataset.albumname
        }
        this.appReference.playSong(obj);
      }.bind(this));
    }.bind(this));
  }

  this.enableAddableToPlaylist = function(){
    $("#myModal").on("show.bs.modal", function(e) {
      $("body").addClass("test");
    });

    $(".add").click(function(event) {
      event.stopPropagation();
      var target = event.target;
      var icon = target.childNodes[1];
      if (target.tagName == "DIV") {
        icon = target;
        target = target.parentNode;
      }

      var dataset = target.dataset;

      var obj = {
        id: dataset.favid,
        imgRoute: dataset.image,
        songName: dataset.name,
        groupId: dataset.groupid,
        artistName: dataset.groupname,
        albumId: dataset.albumid,
        albumName: dataset.albumname
      }

      this.appReference.onAddSongToPlaylistClicked(function(playlists) {
        this.renderPlaylistsModal(obj, playlists);
        $("#myModal").modal();
      }.bind(this));
    }.bind(this));

    $(".delete").click(function(event) {
      event.stopPropagation();
      var target = event.target;
      var icon = target.childNodes[1];
      if (target.tagName == "DIV") {
        icon = target;
        target = target.parentNode;
      }

      var dataset = target.dataset;

      var songid = dataset.favid;
      var playlistid = dataset.playlistid;

      this.appReference.onDeleteSongFromPlaylistClicked(playlistid, songid);
      $(target).hide();
    }.bind(this));
  }

  /**
   * Function that enables the favorite buttons and assigns the action
   * It does not need any parameter
   */
  this.enableFavoritable = function() {

    $(".fav").off('click').click(function(elem) {
      elem.stopPropagation();
      // Make the initial references
      var element = elem.target;
      var icon = element.childNodes[1];

      // Check who has received the click, if the icon or the button
      // If it has been the icon (checkable by looking at the tagName),
      // make the click go to the parent (the button)
      if (element.tagName == "DIV") {
        icon = element;
        element = element.parentNode;
      }

      // Check if the current element is favorited or not by looking at
      // the icon's class.
      // Also, create the reference to the App's methods
      if ($(icon).hasClass("glyphicon-star")) {
        $(icon).removeClass("glyphicon-star");
        $(icon).addClass("glyphicon-star-empty");
        this.appReference.deleteFav(element.dataset.type, element.dataset.favid);
      } else {
        $(icon).removeClass("glyphicon-star-empty");
        $(icon).addClass("glyphicon-star");

        var type = element.dataset.type;
        var object = {
          type: type
        };

        var content = {};
        content.favid = element.dataset.favid;
        content.image = element.dataset.image;
        content.name = element.dataset.name;

        if (type == "album") {
          content.groupid = element.dataset.groupid;
          content.groupname = element.dataset.groupname;
          object.content = content;
        } else if (type == "song") {
          content.groupid = element.dataset.groupid;
          content.groupname = element.dataset.groupname;
          content.albumid = element.dataset.albumid;
          content.albumname = element.dataset.albumname;
          object.content = content;
        }

        object.content = content;
        this.appReference.addFav(object);
      }
    }.bind(this));
  }

  this.hide = function(callback) {
    $(".content-overlay").css("opacity", "0");
    $(".content-overlay").css("pointer-events", "none")
    $("body").animate({
      scrollTop: $("body").offset().top
    }, 350);
    setTimeout(function() {
      callback();
    }, 250);
  }

  this.reveal = function() {
    setTimeout(function() {
      $(".content-overlay").css("opacity", "1");
      $(".content-overlay").css("pointer-events", "all");
    }, 250);
  }

  this.clearAll = function() {
    $(".base").empty();
  }

  this.renderMainArtist = function(artist) {
    this.hide(function() {
      this.clearAll();
      realRenderMainArtist(artist);
      this.enableFavoritable();
      this.enableAddableToPlaylist();
      this.enableLinkable();
      this.enablePlayable();
      this.reveal();
    }.bind(this));
  }

  this.renderMainAlbum = function(album) {
    this.hide(function() {
      this.clearAll();
      realRenderMainAlbum(album);
      this.enableFavoritable();
      this.enableAddableToPlaylist();
      this.enableLinkable();
      this.enablePlayable();
      this.reveal();
    }.bind(this));
  }

  this.renderPlayerProgress = function(progress) {
    if (!isSlidePressed) {
      var slider = $("#slider")[0];
      slider.noUiSlider.set(progress);
    }
  }

  this.renderPlayingSong = function(song) {

    var a = $("#player");
    $(a).empty();
    var html = playerTemplate(song);
    $(a).append(html);

    var slider = $("#slider")[0];
    var sliderVolume = $("#slidervolume")[0];

    noUiSlider.create(slider, {
      start: 0,
      range: {
        'min': 0,
        'max': 100
      }
    });

    noUiSlider.create(sliderVolume, {
      start: 50,
      range: {
        'min': 0,
        'max': 100
      }
    });

    var app = this.appReference;

    slider.noUiSlider.on('change', function(a, b, c) {
      app.setSongProgress(c);
    });

    slider.noUiSlider.on('start', function() {
      isSlidePressed = true;
    });

    slider.noUiSlider.on('end', function() {
      isSlidePressed = false;
    });

    sliderVolume.noUiSlider.on('update', function(a, b, c) {
      app.setVolume(c);
    });

    a.collapse("show");

    var pauseButton = $("#playpause_button")[0];
    var forwardButton = $("#forward_button")[0];
    var backButton = $("#back_button")[0];

    $(forwardButton).click(function(){
      app.onForwardButtonClick();
    });

    $(backButton).click(function(){
      app.onBackButtonClick();
    });

    $(pauseButton).click(function() {
      app.pause();
    }.bind(this));

    this.enableLinkable();
  }

  this.renderPlayButton = function(clickCallback) {
    var button = $("#playpause_button")[0];

    if (button != null) {
      var span = $(button).find('span')[0];
      $(span).removeClass('glyphicon-pause');
      $(span).addClass('glyphicon-play');
      $(button).click(clickCallback);
    }
  }

  this.renderPauseButton = function(clickCallback) {
    var button = $("#playpause_button")[0];

    if (button != null) {
      var span = $(button).find('span')[0];
      $(span).removeClass('glyphicon-play');
      $(span).addClass('glyphicon-pause');
      $(button).click(clickCallback);
    }
  }

  /**
   * Function that renderers a list of artists, albums and songs.
   * It needs 3 parameters:
   *  - artists: Array of artists to be rendered
   *  - albums: Array of albums to be rendered
   *  - songs: Array of songs to be rendered
   */
  this.renderAll = function(artists, albums, songs) {

    // Hide the current content with a fancy animation
    this.hide(function() {

      // Once the animation has finished, clear the content
      this.clearAll();

      // Render each list
      renderArtists(artists, this.appReference);
      renderAlbums(albums);
      renderSongs(songs);

      // Make the fancy animation to reveal
      this.reveal();

      // Enable the favorite buttons
      this.enableFavoritable();
      this.enableAddableToPlaylist();
      this.enableLinkable();
      this.enablePlayable();
    }.bind(this));
  }

  this.hidePlayer = function() {
    var a = $("#player");
    a.collapse("hide");
  }

  this.renderRecommendedSongs = function(songs) {
    this.renderAll([], [], songs);
  }

  this.renderPlaylistContent = function(content, playlistName){
      console.log("renderplaylistcontent");
      // Hide the current content with a fancy animation
      this.hide(function() {

        // Once the animation has finished, clear the content
        this.clearAll();

        renderMainPlaylist(playlistName, content);

        // Make the fancy animation to reveal
        this.reveal();

        // Enable the favorite buttons
        this.enableFavoritable();
        this.enableAddableToPlaylist();
        this.enableLinkable();
        this.enablePlayable();
      }.bind(this));
  }

  this.renderPlaylists = function(playlists) {
    var showCreate = playlists.length < 8;

    var obj = {
      playlist: playlists,
      showcreate: showCreate
    }

    var list = $("#playlist_content");
    $(list).empty();
    var html = playlistItemTemplate(obj);
    $(list).append(html);

    $(list).find("#create_playlist_form").submit(function(event) {
      event.preventDefault();
      var newPlaylistName = $("#new_playlist_name").val();
      $("#new_playlist_name").val("");
      this.appReference.createPlaylistWithName(newPlaylistName);
    }.bind(this));

    $(list).find("ul#playlist_list > li.input-group").each(function(index, elem) {
      $(elem).click(function(event) {
        var id = event.target.dataset.id;
        console.log("ID: " + id);
        this.appReference.onPlaylistSelected(id);
      }.bind(this));
    }.bind(this));

    $(list).find("ul#playlist_list  button.btn-delete-playlist").each(function(index, elem){
      $(elem).click(function(event){
        event.stopPropagation();

        // Ensure which of the elements have been clicked
        var target = event.target;

        if(target.tagName == "SPAN"){
          if(target.classList.contains("glyphicon-remove")){
            target = target.parentNode.parentNode.parentNode;
          } else {
            target = target.parentNode;
          }
        } else if (target.tagName == "BUTTON"){
          target = target.parentNode.parentNode;
        }

        var id = target.dataset.id;
        console.log("ID TO DELETE: "+id);
        this.appReference.onDeletePlaylistSelected(id);
      }.bind(this));
    }.bind(this));
  }

  this.hideModal = function() {
    $("#myModal").modal('toggle');
  }

  this.renderPlaylistsModal = function(song, playlists) {
    var modalList = $("#modal_list")[0];
    var obj = {
      song: song,
      playlist: playlists
    }

    var html = playlistModalTemplate(obj);
    $(modalList).empty();
    $(modalList).append(html);

    $(modalList).find('li').each(function(index, elem) {
      $(elem).click(function(event) {
        var playlistId = elem.dataset.playlistid;
        var dataset = elem.dataset;

        var song = {
          favid: dataset.songid,
          imgRoute: dataset.image,
          songName: dataset.name,
          groupId: dataset.groupid,
          artistName: dataset.groupname,
          albumId: dataset.albumid,
          albumName: dataset.albumname
        }

        this.appReference.addSongToPlaylist(playlistId, song);
        this.hideModal();

      }.bind(this));
    }.bind(this));
  }

}
