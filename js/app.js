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
function BetaPlayerApp(spotifyClient, renderer, dbm) {

  // Save the received parameters
  this.spotifyClient = spotifyClient;
  this.renderer = renderer;
  this.dbm = dbm;

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


          $(".square").map(function(index, item) {
                    $(item).click(function(event) {

                      console.log("CLICKED: " + item.dataset.groupid);

                      $(".base").empty();

                      /*
                        JSON PER L'ALBERT:
                          {
                              "groupId": 12345,
                              "artistName": "Queen",
                              "imgRoute": "rutaImgQueen",
                              "biography": "Vida y milagros",
                              "topSongs":[
                                        {
                                          "songId":12345,
                                          "songName":"NomCanço",
                                          "albumName":"NomAlbum",
                                          "imgRoute":"rutaCanço"
                                        },
                                        {
                                          "songId":12345,
                                          "songName":"NomCanço",
                                          "albumName":"NomAlbum",
                                          "imgRoute":"rutaCanço"
                                        }
                                      ]
                                      "albums":[
                                                {
                                                  "albumId":12345,
                                                  "albumName":"NomAlbum",
                                                  "imgRoute":"rutaAlbum"
                                                },
                                                {
                                                  "albumId":12345,
                                                  "albumName":"NomAlbum",
                                                  "imgRoute":"rutaAlbum"
                                                }
                                              ]
                          }
                      */

                      var artistMainAreaScript = $("#artist-main-template").html();
                      /*var artistMainAreaTemplate = Handlebars.compile(artistMainAreaScript;);
                      var artistMainAreaElement = {
                        "artist": artist
                      };
                      var compiledArtistMainArea = artistMainAreaTemplate(artistMainAreaElement);
                      $(".base").append(compiledArtistMainArea);*/
                      $(".base").append(artistMainAreaScript);

                      var sliderHeight = "100px";
                      $('.panel-biography').each(function() {
                          var current = $(this);
                          current.attr("box_h", current.height());
                        }

                      );

                      $(".panel-biography").css("height", sliderHeight);
                      $(".toggle-biography").html('<a href="#">click</a>');
                      $(".toggle-biography a").click(function() {
                        openSlider()
                      })

                      /*if (artist.topSongs.length > 0) {
                          $(".base").append(compiledSongs);
                      }*/

                      /*if (artist.albums.length > 0) {
                          $(".base").append(compiledAlbums);
                      }*/

                    });
                  });


        }.bind(this));
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
  }
}
