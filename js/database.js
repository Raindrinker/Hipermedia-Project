function DatabaseManager(){

    var db;
    db = openDatabase('favourites', '1.0', 'user favourite music', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE fav_artists (id unique)');
        tx.executeSql('CREATE TABLE fav_albums (id unique)');
        tx.executeSql('CREATE TABLE fav_songs (id unique)');
    });

    console.log("database created");

    this.addFavArtist = function(groupid){
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO fav_artists (id) VALUES (?)', [groupid]);
        });
    };

    this.addFavAlbum = function(albumid){
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO fav_albums (id) VALUES (?)', [albumid]);
        });
    };

    this.addFavSong = function(songid){
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO fav_songs (id) VALUES (?)', [songid]);
        });
    };

    var tableContains = function(tablename, id, callback){
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ? WHERE id=?', [tablename, id], function (tx, results) {
                var len = results.rows.length;
                callback(len == 1);
            });
        });
    };

    this.isFavArtist = function(groupid, callback){
        tableContains("fav_artists", groupid, callback);
    }

    this.isFavAlbum = function(albumid, callback){
        tableContains("fav_albums", albumid, callback);
    }

    this.isFavSong = function(songid, callback){
        tableContains("fav_songs", songid, callback);
    }

    var tableContainsList = function(tablename, list, callback){
        tableContainsListIm(tablename, list, 0, callback, this);
    }

    var tableContainsListIm = function(tablename, list, i, callback, self){
        console.log("tablecontainslistim i=" + i + " list.len=" + list.length);
        if(i < list.length){
            tableContains(tablename, list[i].id, function(isFavourite){
                list[i].fav = isFavourite;
                self.tableContainsListIm(tablename, list, i+1, callback, self);
            });
        }else{
            callback(list);
        }
    }

    this.markFavArtists = function(artistlist, callback){
        tableContainsList("fav_artists", artistlist, callback);
    }

    this.markFavAlbums = function(albumlist, callback){
        tableContainsList("fav_albums", albumlist, callback);
    }

    this.markFavSongs = function(songlist, callback){
        tableContainsList("fav_songs", songlist, callback);
    }

    var getContent = function(tablename, callback){
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ?', [tablename], function (tx, results) {
                var rows = [];
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    rows.push(results.rows.item(i).id);
                }
                callback(rows);
            });
        });
    };

    this.getFavArtists = function(callback){
        getContent("fav_artists", callback);
    }

    this.getFavAlbums = function(callback){
        getContent("fav_albums", callback);
    }

    this.getFavSongs = function(callback){
        getContent("fav_songs", callback);
    }

    this.clean = function(){
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM fav_artists');
            tx.executeSql('DELETE FROM fav_albums');
            tx.executeSql('DELETE FROM fav_songs');
        });
    }
}