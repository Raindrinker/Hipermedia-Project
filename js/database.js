function DatabaseManager() {

  var db;
  db = openDatabase('favourites', '1.0', 'user favourite music', 2 * 1024 * 1024);
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE fav_artists (id unique, image, name)');
    tx.executeSql('CREATE TABLE fav_albums (id unique, image, name, groupid, groupname)');
    tx.executeSql('CREATE TABLE fav_songs (id unique, image, name, groupid, groupname, albumid, albumname)');
    tx.executeSql('CREATE TABLE playlists (id INTEGER PRIMARY KEY ASC, name)');
    tx.executeSql('CREATE TABLE playlist_has_song (playlistid, songid, songname, image, groupid, groupname, albumid, albumname)');
  });

  console.log("database created");

  var addFavArtist = function(fav) {
    var groupid = fav.favid,
      image = fav.image,
      name = fav.name;
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO fav_artists (id, image, name) VALUES (?, ?, ?)', [groupid, image, name]);
    });
  };

  var addFavAlbum = function(fav) {
    var albumid = fav.favid,
      image = fav.image,
      name = fav.name,
      groupid = fav.groupid,
      groupname = fav.groupname;
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO fav_albums (id, image, name, groupid, groupname) VALUES (?, ?, ?, ?, ?)', [albumid, image, name, groupid, groupname]);
    });
  };

  var addFavSong = function(fav) {
    var songid = fav.favid,
      image = fav.image,
      name = fav.name,
      groupid = fav.groupid,
      groupname = fav.groupname,
      albumid = fav.albumid,
      albumname = fav.albumname;
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO fav_songs (id, image, name, groupid, groupname, albumid, albumname) VALUES (?, ?, ?, ?, ?, ?, ?)', [songid, image, name, groupid, groupname, albumid, albumname]);
    });
  };

  this.addFav = function(fav) {
    var type = fav.type;

    if (type == "artist") {
      addFavArtist(fav.content);
    } else if (type == "song") {
      addFavSong(fav.content);
    } else if (type == "album") {
      addFavAlbum(fav.content);
    }
  }

  this.createPlaylistWithName = function(name, callback) {
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO playlists (name) VALUES (?)', [name]);
      callback();
    })
  }

  this.getAllPlaylists = function(callback) {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM playlists', [], function(tx, results) {
        var rows = [];
        var len = results.rows.length;
        for (i = 0; i < len; i++) {
          rows.push(results.rows.item(i));
        }
        callback(rows);
      });
    });
  }

  this.getAllSongsFromPlaylist = function(playlistId, callback) {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM playlist_has_song WHERE playlistid = ?', [playlistId], function(tx, results) {
        var rows = [];
        var len = results.rows.length;
        for (i = 0; i < len; i++) {
          rows.push(results.rows.item(i));
        }
        callback(rows);
      });
    });
  }

  this.addSongToPlaylist = function(playlistid, fav) {
    var songid = fav.favid,
      image = fav.imgRoute,
      name = fav.songName,
      groupid = fav.groupId,
      groupname = fav.artistName,
      albumid = fav.albumId,
      albumname = fav.albumName;
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO playlist_has_song (playlistid, songid, image, songname, groupid, groupname, albumid, albumname) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [playlistid, songid, image, name, groupid, groupname, albumid, albumname]);
    });
  }

  var deleteFavArtist = function(groupid) {
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM fav_artists WHERE id=(?)', [groupid]);
    });
  };

  var deleteFavAlbum = function(albumid) {
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM fav_albums WHERE id=(?)', [albumid]);
    });
  };

  var deleteFavSong = function(songid) {
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM fav_songs WHERE id=(?)', [songid]);
    });
  };

  this.deleteFav = function(type, id) {
    if (type == "artist") {
      deleteFavArtist(id);
    } else if (type == "album") {
      deleteFavAlbum(id);
    } else if (type == "song") {
      deleteFavSong(id);
    }
  }

  var tableContains = function(tablename, id, callback) {
    db.transaction(function(tx) {
      query = 'SELECT * FROM ' + tablename + ' WHERE id="' + id + '"';
      tx.executeSql(query, [], function(tx, results) {

        var len = results.rows.length;
        callback(len == 1);
      });
    });
  };

  this.isFavArtist = function(groupid, callback) {
    tableContains("fav_artists", groupid, callback);
  }

  this.isFavAlbum = function(albumid, callback) {
    tableContains("fav_albums", albumid, callback);
  }

  this.isFavSong = function(songid, callback) {
    tableContains("fav_songs", songid, callback);
  }

  var tableContainsList = function(tablename, list, callback) {
    tableContainsListIm(tablename, list, 0, callback);
  }

  var tableContainsListIm = function(tablename, list, i, callback) {
    if (i < list.length) {
      tableContains(tablename, list[i].id, function(isFavourite) {
        list[i].fav = isFavourite;
        tableContainsListIm(tablename, list, i + 1, callback, self);
      });
    } else {
      callback(list);
    }
  }

  this.markFavArtists = function(artistlist, callback) {
    tableContainsList("fav_artists", artistlist, callback);
  }

  this.markFavAlbums = function(albumlist, callback) {
    tableContainsList("fav_albums", albumlist, callback);
  }

  this.markFavSongs = function(songlist, callback) {
    tableContainsList("fav_songs", songlist, callback);
  }

  var getContent = function(tablename, orderindex, callback) {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM ' + tablename + ' ORDER BY ' + orderindex, [], function(tx, results) {
        var rows = [];
        var len = results.rows.length;
        for (i = 0; i < len; i++) {
          rows.push(results.rows.item(i));
        }
        callback(rows);
      });
    });
  };

  var getFavArtists = function(callback) {
    getContent("fav_artists", 3, callback);
  }

  var getFavAlbums = function(callback) {
    getContent("fav_albums", 5, callback);
  }

  var getFavSongs = function(callback) {
    getContent("fav_songs", 5, callback);
  }

  this.getAllFavs = function(callback) {
    getFavArtists(function(artists) {

      var artistsFormatted = artists.map(function(artist) {
        return {
          artistName: artist.name,
          imgRoute: artist.image,
          id: artist.id,
          fav: true
        }
      });

      getFavAlbums(function(albums) {

        var albumsFormatted = albums.map(function(album) {
          return {
            id: album.id,
            imgRoute: album.image,
            albumName: album.name,
            groupId: album.groupid,
            artistName: album.groupname,
            fav: true
          }
        });

        getFavSongs(function(songs) {

          var songsFormatted = songs.map(function(song) {
            return {
              id: song.id,
              imgRoute: song.image,
              songName: song.name,
              groupId: song.groupid,
              artistName: song.groupname,
              albumId: song.albumid,
              albumName: song.albumname,
              fav: true
            }
          });
          callback(artistsFormatted, albumsFormatted, songsFormatted);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  this.clean = function() {
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM fav_artists');
      tx.executeSql('DELETE FROM fav_albums');
      tx.executeSql('DELETE FROM fav_songs');
    });
  }
}
