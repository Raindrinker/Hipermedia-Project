$.material.init();

var form = $("#group_name_form");
var input_group_name = $("#input_group_name");
var resultP = $("#group_id_p");

var api = new MusicBrainzApi();

form.submit(function(event) {
	event.preventDefault();

	var group = input_group_name.val();
	console.log("GROUP: "+group);

	api.askGroupId(group, function(id, gid){
		resultP.text("ID: "+id+" | GID: "+gid);
	});

});