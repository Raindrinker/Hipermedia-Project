/**
 * This function defines the BetaPlayerApp object, that will be the main object
 * of our application.
 * This object will need
 *
 * To be instantiated, it needs 3 components
 * - spotifyClient: Reference to a SpotifyWebApi instance
 * - renderer: Reference to a Renderer instance
 * - dbm: Reference to a DatabaseManager instance
 */
function BetaPlayerApp(spotifyClient, renderer, dbm, echonestclient, youtubeApi, musicManager) {

  // Save the received parameters
  this.spotifyClient = spotifyClient;
  this.renderer = renderer;
  this.dbm = dbm;
  this.echonestclient = echonestclient;
  this.youtubeApi = youtubeApi;
  this.musicManager = musicManager;

  this.init = function(){
    // Init the echonest client
    this.echonestclient.init();

    // Create the relation Renderer -> App, necessary for interactions
    this.renderer.appReference = this;

    // Create the relation MusicManager -> App, necessary for interactions
    this.musicManager.setAppReference(this);

    this.renderPlaylists();
  }

  this.requestGroupAlbums = function(groupName, callback) {
    this.spotifyClient.searchArtists(groupName, {
      limit: 10
    }, function(err, data) {
      if (err) console.error(err);
      var artistId = data.artists.items[0].id;
      console.log("ID: " + artistId);

      this.spotifyClient.getArtistAlbums(artistId, {
        limit: 10
      }, function(error, data) {
        if (err) console.error(error);
        callback(data.items);
      });
    }.bind(this));

  }

  this.getArtistTopTracksFromName = function(artistName, numTracks, callback) {
    this.spotifyClient.searchArtists(artistName, {
      limit: 10
    }, function(err, data) {
      if (err) console.log(err);
      var artistId = data.artists.items[0].id;
      var artistImage = data.artists.items[0].images[0].url;
      this.getArtistTopTracksFromId(artistId, numTracks, function(tracks) {
        var tracksFormatted = tracks.map(function(track) {
          return {
            song: {
              song_name: track.name,
              duration: track.duration_ms,
              song_id: track.id,
            },
            artist: {
              artist_name: track.artists[0].name,
              artist_id: track.artists[0].id,
              artist_image: artistImage
            },
            album: {
              album_name: track.album.name,
              album_id: track.album.id,
              album_cover: track.album.images[0].url
            }
          }
        });
        callback(tracksFormatted);
      }.bind(this));
    }.bind(this));
  }

  this.getArtistTopTracksFromId = function(artistId, numTracks, callback) {
    this.spotifyClient.getArtistTopTracks(artistId, "ES", {
      limit: numTracks
    }, function(error, data) {
      if (error) console.log(error);
      callback(data.tracks);
    });
  }

  this.getSongsFromName = function(name, numResults, callback) {
    this.spotifyClient.searchTracks(name, {
      limit: numResults
    }, function(err, data) {
      if (err) console.log(err);
      var items = data.tracks.items;
      var tracksFormatted = items.map(function(track) {
        return {
          imgRoute: track.album.images[0].url,
          songName: track.name,
          id: track.id,
          albumName: track.album.name,
          albumId: track.album.id,
          artistName: track.artists[0].name,
          groupId: track.artists[0].id,
          fav: false
        }
      });
      this.dbm.markFavSongs(tracksFormatted, callback);
      callback(tracksFormatted);
    });
  }

  /**
   * Function that, given a name, searches some artists in Spotify with that name
   * It needs 3 parameters:
   *  - name: Name of the artist
   *  - numResults: Maximum number of results
   *  - callback: Callback that will receive an array of artists
   */
  this.getArtistsFromName = function(name, numResults, callback) {
    this.spotifyClient.searchArtists(name, {
      limit: numResults
    }, function(err, data) {
      if (err) console.log(err);
      var artists = data.artists.items;
      if (artists.length > 0) {
        console.log(artists);
        var artistsFormatted = artists.map(function(artist) {
          var imageurl = "http://lorempixel.com/400/400/abstract/";
          if (artist.images.length > 0) {
            imageurl = artist.images[0].url;
          }
          return {
            imgRoute: imageurl,
            artistName: artist.name,
            id: artist.id,
            fav: false
          }
        });
        this.dbm.markFavArtists(artistsFormatted, callback);
      } else {
        callback([]);
      }
    });
  }

  /**
   * Function that, given a name, searches some albums in Spotify with that name
   * It needs 3 parameters:
   *  - name: Name of the album
   *  - numResults: Maximum number of results
   *  - callback: Callback that will receive an array of albums
   */
  this.getAlbumsFromName = function(name, numResults, callback) {

    // Search the albums with that name in Spotify
    this.spotifyClient.searchAlbums(name, {
      limit: numResults
    }, function(err, data) {
      if (err) console.log(error);
      var albums = data.albums.items;

      // Check if there is any album with that name (or similar)
      if (albums.length > 0) {

        // We only want the album ids, so map the album list to get an array with only the album ids
        var albumIds = albums.map(function(album) {
          return album.id
        });

        // Get the full information for all those albums
        this.spotifyClient.getAlbums(albumIds, {}, function(error, albumsFull) {

          if (error) console.log(error);

          var realAlbums = albumsFull.albums;

          // Iterate over the albums and format them in the correct way
          var albumsFormatted = realAlbums.map(function(album) {
            var imageurl = "http://lorempixel.com/400/400/abstract/";
            if (album.images.length > 0) {
              imageurl = album.images[0].url;
            }
            return {
              imgRoute: imageurl,
              albumName: album.name,
              id: album.id,
              artistName: album.artists[0].name,
              groupId: album.artists[0].id,
              fav: false
            }
          });

          // Delegate the callback on the markFavAlbums function of the DatabaseManager,
          // which will automatically return the songs with the favorite status marked.
          // It also could be done by creating yet another callback, which would receive
          // an array of albums, and just pass it to the original callback
          this.dbm.markFavAlbums(albumsFormatted, callback);
        });
      } else {
        callback([]);
      }
    }.bind(this));
  }

  /**
   * Function that, given a search term, returns all the songs, albums and artists
   * that might fit with that query.
   * It needs 2 parameters:
   *  - query: String to be searched
   *  - numResults: Number of results for each group
   */
  this.getSongsArtistsAlbumsFromName = function(query, numResults) {
    this.getSongsFromName(query, numResults, function(songs) {
      this.getArtistsFromName(query, numResults, function(artists) {
        this.getAlbumsFromName(query, numResults, function(albums) {
          this.renderer.renderAll(artists, albums, songs);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }


  /**
   * Function that, given an albumId, renders the album main page, showing its image,
   * the title, the artist name, and all the songs that the album contains, ready to
   * be favorited and/or played.
   * It needs 1 parameter:
   *  - albumId: Spotify id for the album
   */
  this.paintAlbum = function(albumId){

    // Get the album information from spotify
    this.spotifyClient.getAlbum(albumId, {}, function(err, album){
      if(err) console.log(err);

      // Get the album attributes
      var albumName = album.name;
      var albumImage = "http://lorempixel.com/400/400/abstract/";
      var artistName = album.artists[0].name;
      var artistId = album.artists[0].id;
      if (album.images.length > 0) {
        albumImage = album.images[0].url;
      }

      // Get the album tracks from Spotify
      this.spotifyClient.getAlbumTracks(albumId, {}, function(error, tracks){

        if(error)console.log(error);

        // Format the songs
        var songs = tracks.items.map(function(song){
          return {
            id: song.id,
            songId: song.id,
            songName: song.name,
            imgRoute: albumImage,
            artistName: song.artists[0].name,
            albumName: albumName,
            groupId: artistId,
            albumId: albumId
          }
        });

        // Create the album object
        var album = {
          albumName: albumName,
          artistName: artistName,
          imgRoute: albumImage,
          groupId: artistId,
          song: songs
        };

        // Render it
        this.renderer.renderMainAlbum(album);
      }.bind(this));
    }.bind(this));
  }

  /**
   * Function that, given an artistId, shows its main page, showing the group image,
   * the group's most famous songs, and their top 10 albums, all ready to be browsed,
   * favorited and/or played.
   */
  this.paintArtist = function(artistId){

    // Get the artist information from Spotify
    this.spotifyClient.getArtist(artistId, {}, function(err, artistInfo){

      if(err) console.log(err);

      // Get artist data
      var artistName = artistInfo.name;
      var artistImage = "";

      if (artistInfo.images.length > 0) {
        artistImage = artistInfo.images[0].url;
      }

      // Get the 10 most famous songs for that artist
      this.getArtistTopTracksFromId(artistId, 10, function(tracks){

        // Get the 10 most popular albums for that artist
        this.spotifyClient.getArtistAlbums(artistId, {limit: 10}, function(error, data){
          if(error) console.log(error);

          // Prepare the albums object in the correct format
          var albums = data.items.map(function(album){

            var imageurl = "http://lorempixel.com/400/400/abstract/";
            if (album.images.length > 0) {
              imageurl = album.images[0].url;
            }

            return {
              id: album.id,
              imgRoute: imageurl,
              albumId: album.id,
              groupId: artistId,
              artistName: artistName,
              albumName: album.name
            }
          });

          // Prepare the songs object in the correct format
          var songs = tracks.map(function(song){

            var imageurl = "http://lorempixel.com/400/400/abstract/";
            if (song.album.images.length > 0) {
              imageurl = song.album.images[0].url;
            }

            return {
              id: song.id,
              songId: song.id,
              songName: song.name,
              imgRoute: imageurl,
              artistName: song.artists[0].name,
              albumName: song.album.name,
              groupId: artistId,
              albumId: song.album.id
            }
          });

          // Send the songs to the DatabaseManager to calculate their fav status
          this.dbm.markFavSongs(songs, function(marked){

            // Send the albums to the DatabaseManager to calculate their fav status
            this.dbm.markFavAlbums(albums, function(albumsMarked){

              // Create the artist object
              var artist = {
                imgRoute: artistImage,
                artistName: artistName,
                song: marked,
                album: albumsMarked
              }

              // Render the artist
              this.renderer.renderMainArtist(artist);
            });
          });
        });
      }.bind(this));
    }.bind(this));
  }

  /**
   * Function that deletes an element from the database.
   * Actually it only calls the methods from the DBM.
   * This function is needed for the renderer to be able to trigger the actions.
   * It needs 2 parameters:
   *  - type: Type of the element to be deleted (album, song, artist)
   *  - id: Id of the element to be deleted
   */
  this.deleteFav = function(type, id) {
    this.dbm.deleteFav(type, id);

    if(type == "song"){
      this.echonestclient.updateFavoritedSong(id, false);
    }
  }


  /**
   * Function that adds an element to the database.
   * Actually it only calls the methods from the DBM.
   * This function is needed for the renderer to be able to trigger the actions.
   * It needs 1 parameter:
   *  - object: element to be favorited. One of its attributes must be "type" € {song, artist, album}
   */
  this.addFav = function(object) {
    this.dbm.addFav(object);
    var id = object.content.favid;
    var type = object.type;
    if(type == "song"){
      this.echonestclient.updateFavoritedSong(id, true);
    }
  }


  /**
   * Function that shows the user's favorite elements (artists, albums and songs).
   * It does not need any parameter
   */
  this.showFavourites = function(){

    // Request all the favorite elements from the DatabaseManager
    this.dbm.getAllFavs(function(artists, albums, songs){

      // Render the elements
      this.renderer.renderAll(artists, albums, songs);
    });
  }

  /**
   * Function that shows songs that the user might like based on his previous
   * actions and favorited elements.
   * IT does not need any paramter
   */
  this.showRecommendations = function(){

    // Get the related songs from the EchoNestClient
    this.echonestclient.getRelatedSongs(10, function(songs){
      // Mark the fav status for the songs
      this.dbm.markFavSongs(songs, function(markedSongs){
        // Render the songs
        this.renderer.renderRecommendedSongs(markedSongs);
      }.bind(this));
    }.bind(this));
  }

  this.showPlaySong = function(song){
    //console.log("SHOWPLAYSONG");
    //console.log(song);
    this.renderer.renderPlayingSong(song);
  }

  this.playSong = function(songObject){
    var query = songObject.artistName + " - " +songObject.songName;
    this.youtubeApi.searchVideo(query, function(videoId){
      songObject.videoId = videoId;
      if(videoId == undefined || videoId.length == 0){
        console.log("Video not found");
      } else {
        this.musicManager.playSongs([songObject]);
      }
    }.bind(this));
  }

  this.updateProgress = function(progress){
    this.renderer.renderPlayerProgress(progress);
  }

  this.onPlayEnded = function(){
    this.renderer.hidePlayer();
  }

  this.setSongProgress = function(progress){
    console.log("PROGRESS: "+progress);
    this.musicManager.setSongProgress(progress);
  }

  this.setVolume = function(volume){
    this.musicManager.setVolume(volume);
  }

  this.renderPlayButton = function(){
    this.renderer.renderPlayButton(function(){
      this.play();
    }.bind(this));
  }

  this.renderPauseButton = function(){
    this.renderer.renderPauseButton(function(){
      this.pause();
    }.bind(this));
  }

  this.pause = function(){
    this.musicManager.pause();
    this.renderer.renderPlayButton(function(){
      this.play();
    }.bind(this));
  }

  this.play = function(){
    this.musicManager.play();
    this.renderer.renderPauseButton(function(){
      this.pause();
    }.bind(this));
  }

  this.renderPlaylists = function(){
    this.dbm.getAllPlaylists(function(playlists){
      console.log("PLAYLISTS");
      console.log(playlists);
      this.renderer.renderPlaylists(playlists);
    }.bind(this));
  }

  this.createPlaylistWithName = function(name){
    this.dbm.createPlaylistWithName(name, function(){
      this.renderPlaylists();
    }.bind(this));
  }

  this.addSongToPlaylist = function(playlistId, song){
    this.dbm.addSongToPlaylist(playlistId,song);
  }

  this.onPlaylistSelected = function(playlistId){
    this.dbm.getAllSongsFromPlaylist(playlistId,function(songs){
      this.renderer.renderPlaylist(songs);
    }.bind(this));
  }


}
