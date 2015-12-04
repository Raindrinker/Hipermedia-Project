/**
  * Cliente de la API de MusicBrainz
  * No requiere ningún parámetro para inicializarse.
  * Debe crearse con new
  */

function MusicBrainzApi(){

	// URL base a partir de la cual se harán las requests
	var BASE_URL = "http://musicbrainz.org";

	/**
	  * Función que recibe una URL y la prepara para poder hacer la petición cross-domain.
	  *
	  * Esto es debido a que la API de MusicBrainz no devuelve cabeceras de origen, es
	  * necesario utilizar la web alloworigin para poder hacer cross-domain requests
	  */
	function allowOrigin(url){
		return "http://alloworigin.com/get?url=" + encodeURIComponent(url);
	}


	/**
	  * Función sirve para pedir el id de un grupo de música.
	  * Recibe dos parámetros:
	  *  - groupName: String con el nombre del grupo a buscar
	  *  - callback: Función que recibe un parámetro, el id del grupo (si no se encuentra, será "")
	  */
	this.askGroupId = function(groupName, callback){

		// Codificamos correctamente el nombre del grupo, por si hubiera algún
		// caracter extraño (como por ejemplo, un espacio)
		var groupNameEncoded = encodeURIComponent(groupName);
		
		// Preparamos el final de la URL
		var END = "/ws/js/artist?q="+groupNameEncoded+"&limit=1&page=1&fmt=json";

		// Concatenamos la URL base con el final generado
		var totalUrl = BASE_URL+END;

		// Obtenemos la URL para el Cross-Domain
		var finalUrl = allowOrigin(totalUrl);

		// Realizamos la petición
		$.ajax({
			url: finalUrl,
			dataType:'jsonp'

		}).error(function(xhr, err, status) {

			// En caso de error, log de los parámetros
			console.log(xhr)
			console.log(err)
			console.log(status);

		}).then(function(data){
			
			// Comprobamos que todo ha sido correcto
			if(data.status_code == 200){
				var content = data.contents;
				var response = JSON.parse(content);
				var element = response[0];

				var id = element.id;
				var gid = element.gid;

				console.log("ID: "+id+" | GID: "+gid);

				callback(id, gid);
			} else {
				callback("", "");
			}
		});
	};
}