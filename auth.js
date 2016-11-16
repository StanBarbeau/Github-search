// isolation and execution

(function(){
	
	// ---- initialisation ----
	// console.log("Init auth started!");
	
	// -- Var creation & fields getters --
	
	var auth_form = $("#auth-form");
	var error_well = $('#error-well');
	
	
	// -- Functions declaration --
	
	function authRequest( form )
	{
		// e.preventDefault();
		var client_id = "a1ad36918037ecba6bb5";
		var client_secret = "dd26e8729e5a993af013d3a9550576c5c7c79c19";
		
		if (getUrlParameter("code"))
		{
			console.log(getUrlParameter('code'));
			$(form).submit(function (e){e.preventDefault;});
			var code = getUrlParameter("code");
			$.ajax({
				method: "post",
				url: "https://github.com/login/oauth/access_token",
				Accept: "application/vnd.github.v3+json",
				dataType: "json",
				data: {
					"client_id": client_id,
					"client_secret": client_secret,
					"code": code,
					"state": "test",
				},
			});
		} 
		else 
		{
			var input_id = $("<input></input>").attr("value", client_id).attr("type", "hidden").attr("name", "client_id");
			var input_state = $("<input></input>").attr("value", "test").attr("type", "hidden").attr("name", "state");

			$(input_id).appendTo(form);
			$(form).submit();
		}
		
	}
	
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	
	// ---- Main Code ----
	
	// -- Event loader --
	
	
	// -- Add code --

	authRequest(auth_form);
})();