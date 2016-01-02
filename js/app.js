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
function BetaPlayerApp(spotifyClient, renderer, dbm, echonestclient) {

  // Save the received parameters
  this.spotifyClient = spotifyClient;
  this.renderer = renderer;
  this.dbm = dbm;
  this.echonestclient = echonestclient;
  this.echonestclient.init();

  // Create the relation Renderer -> App, necessary for the favorite button
  this.renderer.appReference = this;

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

  this.getAlbumsFromName = function(name, numResults, callback) {
    this.spotifyClient.searchAlbums(name, {
      limit: numResults
    }, function(err, data) {
      if (err) console.log(error);
      var albums = data.albums.items;

      if (albums.length > 0) {
        var albumIds = albums.map(function(album) {
          return album.id
        });

        this.spotifyClient.getAlbums(albumIds, {}, function(error, albumsFull) {

          if (error) console.log(error);

          var realAlbums = albumsFull.albums;
          var albumsFormatted = realAlbums.map(function(album) {
            // TODO: Intentar estructurar en objectes?
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
          this.dbm.markFavAlbums(albumsFormatted, callback);
        });
      } else {
        callback([]);
      }
    }.bind(this));
  }

  this.getSongsArtistsAlbumsFromName = function(query, numResults) {
    this.getSongsFromName(query, numResults, function(songs) {
      this.getArtistsFromName(query, numResults, function(artists) {
        this.getAlbumsFromName(query, numResults, function(albums) {
          this.renderer.renderAll(artists, albums, songs);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  this.paintAlbum = function(albumId){
    this.spotifyClient.getAlbum(albumId, {}, function(err, album){
      if(err) console.log(err);
      var albumName = album.name;
      var albumImage = "http://lorempixel.com/400/400/abstract/";
      var artistName = album.artists[0].name;
      var artistId = album.artists[0].id;
      if (album.images.length > 0) {
        albumImage = album.images[0].url;
      }

      this.spotifyClient.getAlbumTracks(albumId, {}, function(error, tracks){

        if(error)console.log(error);
        console.log("TRACKS");
        console.log(tracks);
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

        var album = {
          albumName: albumName,
          artistName: artistName,
          imgRoute: albumImage,
          groupId: artistId,
          song: songs
        };

        this.renderer.renderMainAlbum(album);
      }.bind(this));
    }.bind(this));
  }

  this.paintArtist = function(artistId){
      this.spotifyClient.getArtist(artistId, {}, function(err, artistInfo){

      if(err) console.log(err);

      var artistName = artistInfo.name;
      var artistImage = "";

      if (artistInfo.images.length > 0) {
        artistImage = artistInfo.images[0].url;
      }

      this.getArtistTopTracksFromId(artistId, 10, function(tracks){
        this.spotifyClient.getArtistAlbums(artistId, {limit: 10}, function(error, data){
          if(error) console.log(error);

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

          this.dbm.markFavSongs(songs, function(marked){
            this.dbm.markFavAlbums(albums, function(albumsMarked){
              var artist = {
                imgRoute: artistImage,
                artistName: artistName,
                song: marked,
                album: albumsMarked
              }
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
      this.echonestclient.updateFavoritedSong(id, false, function(){
        console.log("DELETED FAV "+id);
      })
    }
  }


  /**
   * Function that adds an element to the database.
   * Actually it only calls the methods from the DBM.
   * This function is needed for the renderer to be able to trigger the actions.
   * It needs 2 parameters:
   *  - type: Type of the element to be added (album, song, artist)
   */
  this.addFav = function(object) {
    this.dbm.addFav(object);
    if(object.type == "song"){
      var id = object.content.favid;
      this.echonestclient.updateFavoritedSong(id, true, function(){
        console.log("UPDATED FAV "+id);
      })
    }

  }

  this.showFavourites = function(){
    this.dbm.getAllFavs(function(artists, albums, songs){
      this.renderer.renderAll(artists, albums, songs);
    });
  }
}
