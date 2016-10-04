
// On isole et on execute.
(function (){
	
	// ---- initialisation ----
	// -- Recuperation des variables --
	
	var col_result = $('#col-result');
	var table_body = $('#table_body');
	var form = $('#form-search');
	var error_well = $('#error-well');
	var data = {};
	
	// -- Declaration des fonctions --
	function projectRequest( servData, textStatus, jqXHR )
	{
		// console.log(jqXHR);
		// alert('test');
		// console.log(servData);
		data = {};
		$.each(servData, function(index, value){
			// console.log(data);
			// console.log(Object.keys(data));
			if ( $.inArray(value.commit.author.name, Object.keys(data)) > -1 ){
				// console.log(value);
				data[value.commit.author.name].code.push(value);
			} else if(value.author !== undefined && value.author !== null ) {
				// console.log(value);
				data[value.commit.author.name] = {
					"email" : value.commit.author.email,
					"link" : value.author.html_url,
					"code" : [value],
					"job" : "idk",
				};
			}
			
		});
		// console.log(data);
		// request for jobneed info.
		$.each();
		afficheData(data);
		$('#project_name').html("GitHub " + $('#search-user-input').val() + "/" + $('#search-projet-input').val()).show();
		$(error_well).hide();
		$(col_result).show();
		
	}
	
	function afficheData( givenData )
	{
		$(table_body).html("");
		$.each(givenData, function(index, value){
			// console.log(index + value);
			// console.log(value.commit.author);
			var obj = {
				'cont': {"user": index, "link":value.link},
				'mail': value.email,
				'commits': value.code.length,
				'code': value.code,
				'job': value.job,
			};
			var ligne = createLine( obj );
			// console.log(ligne);
			
			$(ligne).appendTo(table_body);
		});
	}
	
	function createLine( obj )
	{
		var ligne = $("<tr></tr>");
		$.each(Object.keys(obj), function(index, value){
			// console.log(obj[value]);
			var col = $('<th></th>').attr('name', value);
			switch(value){
				case 'cont':
					$("<a></a>").attr("href", obj[value].link).html(obj[value].user).appendTo(col);
					
				break;
				case 'code':
					$.each(obj[value], function(codeIndex, codeCommit){
						// console.log(codeCommit);
						$('<a></a>').attr("href", codeCommit.html_url).html(codeCommit.commit.message + "<br/>").appendTo(col);
					});
				break;
				default:
					$(col).html(obj[value]);
				break;
			}
			$(col).appendTo(ligne);
		});
		
		return ligne
	}
	
	// ---- MAIN CODE ----
	// -- gestionnaire d'evement
	
	$(form).submit(function (e){
		e.preventDefault();
		var searchProject = $('#search-projet-input').val();
		var searchUser = $('#search-user-input').val();
		// alert(searchProject + searchUser);
		var requestObj = {
			url: "https://api.github.com/repos/" + searchUser + " / " + searchProject + "/commits",
			accepts: {
				githubType: "application/vnd.github.v3+json",
			},
			dataType:"json",
			type: "GET",
			headers:{Accept: "application/vnd.github.v3+json"},
			success: projectRequest,
			error: function(jqXHR, textStatus, errorThrown){
				// alert('server error !');
				$("#project_name").html("Erreur !");
				$(col_result).hide();
				$(error_well).show();
				$(error_well).html(errorThrown + ", " + JSON.parse(jqXHR.responseText).message);
				// console.log(jqXHR);
			}
		};
		$.ajax(requestObj);
	});
	
	// -- code additionnel --
	$(col_result).hide();
	$(error_well).hide();
	// console.log($(table_line));
})();