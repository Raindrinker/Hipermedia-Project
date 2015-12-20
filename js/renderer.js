/**
 * This function defines an object that will be responsible for all the UI
 * rendering actions, such as paint the albums, artists and songs.
 */
function Renderer() {

  // Grab the template script
  var songsScript = $("#songs-template").html();
  var artistsScript = $("#artists-template").html();
  var albumsScript = $("#albums-template").html();

  // Precompile Handlebars templates
  var artistsTemplate = Handlebars.compile(artistsScript);
  var songsTemplate = Handlebars.compile(songsScript);
  var albumsTemplate = Handlebars.compile(albumsScript);

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
   * It needs 1 parameter:
   *  - artists: Array of artists to be rendered
   */
  var renderArtists = function(artists) {
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

  /**
   * Function that enables the favorite buttons and assigns the action
   * It does not need any parameter
   */
  this.enableFavoritable = function() {

    $(".fav").off('click').on('click', function(elem) {

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
        this.appReference.addFav(element.dataset.type, element.dataset.favid);
      }
    }.bind(this));
  }

  this.hide = function(callback) {
    $(".content-overlay").css("opacity", "0");
    $(".content-overlay").css("pointer-events", "none")
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
      renderArtists(artists);
      renderAlbums(albums);
      renderSongs(songs);

      // Make the fancy animation to reveal
      this.reveal();

      // Enable the favorite buttons
      this.enableFavoritable();
    }.bind(this));
  }
}
