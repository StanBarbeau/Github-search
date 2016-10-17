// isolation and execution

(function(){
	
	// ---- initialisation ----
	// console.log("Init auth started!");
	
	// -- Var creation & fields getters --
	
	var auth_form = $("#auth-form");
	var auth_field = $("#auth-field");
	var error_well = $('#error-well');
	
	// -- Functions declaration --
	
	function authRequest(e)
	{
		e.preventDefault();
		$.ajax({
			url: "https://api.github.com/user",
			accepts: {
				githubType: "application/vnd.github.v3+json",
			},
			dataType:"json",
			data : {username : $(auth_field).val()},
			type: "GET",
			headers:{Accept: "application/vnd.github.v3+json"},
			success: console.log("it works !"),
			error: function(jqXHR, textStatus, errorThrown){
				// alert('server error !');
			
				$(error_well).show();
				$(error_well).html(errorThrown + ", " + JSON.parse(jqXHR.responseText).message);
				console.log(jqXHR);
			}
		});
	}
	
	
	// ---- Main Code ----
	
	// -- Event loader --
	
	$(auth_form).submit(authRequest);
	
	// -- Add code --
	
})();