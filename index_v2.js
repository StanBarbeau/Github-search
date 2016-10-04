
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
		console.log(servData);
		data = servData;
		// console.log(data);
		$.each(data, function (index, value){
			value.codeline = {
				"a":0,
				"d":0,
				"c":0,
			};
			$.each( value.weeks , function(indexArray, valueArray){
				value.codeline.a += valueArray.a;
				value.codeline.d += valueArray.d;
				value.codeline.c += valueArray.c;
			});
		});
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
				'cont': {"user": value.author.login, "link": value.author.html_url},
				'mail': ((value.author.email)?"plouf":value.author.email),
				'commits': value.total,
				'code': value.codeline,
				'job': "idk",
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
					$(col).html("Added : " + value.a + " / Deleted : " + value.d + " / Commits : " + value.c);
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
		var requestObj = 
		{url: "https://api.github.com/repos/" + searchUser + "/" + searchProject + "/stats/contributors",
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
			console.log(jqXHR);
		}
		};
		$.ajax(requestObj);
	});
	
	// -- code additionnel --
	$(col_result).hide();
	$(error_well).hide();
	// console.log($(table_line));
})();