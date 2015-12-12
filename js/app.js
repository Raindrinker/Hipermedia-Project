$.material.init();

var form = $("#group_name_form");
var input_group_name = $("#input_group_name");
var resultP = $("#group_id_p");

/*var api = new MusicBrainzApi();

form.submit(function(event) {
	event.preventDefault();

	var group = input_group_name.val();
	console.log("GROUP: "+group);

	api.askGroupId(group, function(id, gid){
		resultP.text("ID: "+id+" | GID: "+gid);
	});

});*/

function BetaPlayerApp(spotifyClient, renderer){

		this.spotifyClient = spotifyClient;
		this.renderer = renderer;

		this.requestGroupAlbums = function(groupName, callback){

				this.spotifyClient.searchArtists(groupName, {limit: 10}, function(err, data){
					if(err) console.error(err);
					var artistId = data.artists.items[0].id;
					console.log("ID: "+artistId);

					this.spotifyClient.getArtistAlbums(artistId, {limit: 10}, function(error, data){
						if(err) console.error(error);
						callback(data.items);
					});
				}.bind(this));

		}

		this.getArtistTopTracksFromName = function(artistName, numTracks, callback){
			this.spotifyClient.searchArtists(artistName, {limit: 10}, function(err, data){
				if(err) console.log(err);
				var artistId = data.artists.items[0].id;
				var artistImage = data.artists.items[0].images[0].url;
				this.getArtistTopTracksFromId(artistId, numTracks, function(tracks){
					var tracksFormatted = tracks.map(function(track){
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

		this.getArtistTopTracksFromId = function(artistId, numTracks, callback){
			this.spotifyClient.getArtistTopTracks(artistId, "ES",{ limit: numTracks}, function(error, data){
				if(error) console.log(error);
				callback(data.tracks);

			});
		}

		this.getSongsFromName = function(name, numResults, callback){
			this.spotifyClient.searchTracks(name, {limit: numResults}, function(err, data){
				if(err) console.log(err);
				var items = data.tracks.items;
				var tracksFormatted = items.map(function(track){
					return {
						song: {
							song_name: track.name,
							duration: track.duration_ms,
							song_id: track.id,
						},
						artist: {
							artist_name: track.artists[0].name,
							artist_id: track.artists[0].id,
						},
						album: {
							album_name: track.album.name,
							album_id: track.album.id,
							album_cover: track.album.images[0].url
						}
					}
				});

				callback(tracksFormatted);
			});
		}

		this.getArtistsFromName = function(name, numResults, callback){
			this.spotifyClient.searchArtists(name, {limit: numResults}, function(err, data){
				if(err) console.log(err);
				var artists = data.artists.items;
				var artistsFormatted = artists.map(function(artist){
					return {
						imgRoute: artist.images[0].url,
						artistName: artist.name,
						groupId: artist.id
					}
				});
				callback(artistsFormatted);
			});
		}

		this.getAlbumsFromName = function(name, numResults, callback){
			this.spotifyClient.searchAlbums(name, {limit: numResults}, function(err, data){
				if(err) console.log(error);
				var albums = data.albums.items;

				var albumIds = albums.map(function(album){
					return album.id
				});

				this.spotifyClient.getAlbums(albumIds, {}, function(error, albumsFull){

					if(error) console.log(error);

					var realAlbums = albumsFull.albums;
					var albumsFormatted = realAlbums.map(function(album){
						// TODO: Intentar estructurar en objectes?
				    return {
							imgRoute: album.images[0].url,
							albumName: album.name,
							albumId: album.id,
							artistName: album.artists[0].name,
							groupId: album.artists[0].id
						}
					});
					callback(albumsFormatted);
				});

			}.bind(this));
		}

		this.getSongsArtistsAlbumsFromName = function(query, numResults, callback){
			this.getSongsFromName(query, numResults, function(songs){
				this.getArtistsFromName(query, numResults, function(artists){
					this.getAlbumsFromName(query, numResults, function(albums){
						callback(songs, artists, albums);
					});
				}.bind(this));
			}.bind(this));
		}
}

var api = new SpotifyWebApi();

var app = new BetaPlayerApp(api, null);


form.submit(function(event){
	event.preventDefault();
	var group = input_group_name.val();
	console.log("GROUP: "+group);
	/*app.requestGroupAlbums(group, function(items){
		var objectList = items.map(function(item){
			return {
				albumName: item.name,
				groupName: group,
				imgRoute: item.images[0].url
			}
		});

	  console.log(objectList);
	}.bind(this));*/
	/*app.getArtistTopTracksFromName(group, 5, function(data){
		console.log(data);
	});*/
	app.getSongsArtistsAlbumsFromName(group, 5, function(songs, artists, albums){
			console.log("SONGS");
			console.log(songs);
			console.log("ARTISTS")
			console.log(artists);
			console.log("ALBUMS")
			console.log(albums);
	});
});
