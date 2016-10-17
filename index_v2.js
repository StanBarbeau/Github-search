// isolation and execution.

(function (){
	
	// ---- initialisation ----
	// -- var recuperation --
	
	var col_result = $('#col-result');
	var table_body = $('#table_body');
	var form = $('#form-search');
	var error_well = $('#error-well');
	var data = [];
	
	// -- functions declaration --
	function projectRequest( servData, textStatus, jqXHR )
	{
		// console.log(jqXHR);
		// alert('test');
		// console.log(servData);
		data = servData;
		// console.log(data);
		$.each(data, function (index, value){
			value.codeline = {
				"a":0,
				"d":0,
				"c":0,
			};
			value.author.mail = (value.author.mail)?value.author.mail:"Need more info?";
			value.author.job = (value.job)?value.author.job:"Need more info?";
			value.author.location = (value.location)?value.author.location:"Need more info?";
			$.each( value.weeks , function(indexArray, valueArray){
				value.codeline.a += valueArray.a;
				value.codeline.d += valueArray.d;
				value.codeline.c += valueArray.c;
			});
		});
		afficheData(data);
		$('#project_name').html("GitHub : " + $('#search-user-input').val() + "/" + $('#search-projet-input').val()).show();
		$(error_well).hide();
		$(col_result).show();
		
	}
	
	function afficheData( givenData )
	{
		$(table_body).html("");
		// console.log(data);
		$.each(givenData, function(index, value){
			// console.log(value);
			
			var obj = {
				'cont': {"user": value.author.login, "link": value.author.html_url, "id" : value.author.id},
				'mail' : ((value.author.mail)?value.author.mail:"need more info?"),
				'commits': value.total,
				'code': value.codeline,
				'job': ((value.author.job)?value.author.job:"need more info?"),
				'location': ((value.author.location)?value.author.location:"need more info?"),
				
			};
			var ligne = createLine( obj, index );
			// console.log(ligne);
			
			$(ligne).appendTo(table_body);
			// append an event "onclick" to the table line, in order to update it with an ajax query
			$(ligne).click(function (e){
				// Seetings of the ajax query
				var userSettings = {
					url: value.author.url,
					accepts: {
						githubType: "application/vnd.github.v3+json",
					},
					dataType:"json",
					type: "GET",
					headers:{Accept: "application/vnd.github.v3+json"},
					success: userRequest,
					error: function(jqXHR, textStatus, errorThrown){
						// alert('server error !');
			
						$(error_well).show();
						$(error_well).html(errorThrown + ", " + JSON.parse(jqXHR.responseText).message);
						console.log(jqXHR);
					}
				}
				$.ajax(userSettings);
				
			});
		});
	}
	
	function createLine( obj, nbr )
	{
		// console.log(obj);
		var ligne = $("<tr></tr>").attr('id', "user-" + obj.cont.id).attr('value', nbr);
		$.each(Object.keys(obj), function(index, value){
			// console.log(obj[value]);
			var col = $('<th></th>').attr('name', value);
			switch(value){
				case 'cont':
					$("<a></a>").attr("href", obj[value].link).html(obj[value].user).appendTo(col);
					
				break;
				case 'code':
					$(col).html("Added : " + obj[value].a + " / Deleted : " + obj[value].d + " / Commits : " + obj[value].c);
				break;
				default:
					$(col).html(obj[value]);
				break;
			}
			$(col).appendTo(ligne);
		});
		
		return ligne
	}
	
	function userRequest(servData, textStatus, jqXHR)
	{
		var ligne = $('#user-' + servData.id);
		var indexData = $(ligne).attr('value');
		
		// console.log(indexData);
		// console.log(servData);
		// console.log(ligne);
		// console.log(data);
		
		// get the mail column and modify the data array.
		var mailCol = $(ligne).children('th[name="mail"]');
		if (servData.email){
			$(mailCol).html(servData.email);
			data[indexData].author.mail = servData.email;
		} else {
			$(mailCol).html("non-public");
			data[indexData].author.mail = "non-public";
		}
		
		// get the hireable column and modify the data array.
		var jobCol = $(ligne).children('th[name="job"]');
		if (servData.hireable !== null){
			$(jobCol).html((servData.hireable)?"Yes !":"No...");
			data[indexData].author.job = (servData.hireable)?"Yes !":"No...";
		} else {
			$(jobCol).html("non-public");
			data[indexData].author.job = "non-public";
		}
		
		// get the location column and modify the data array.
		var locCol = $(ligne).children('th[name="location"]');
		if (servData.location){
			$(locCol).html(servData.location);
			data[indexData].author.location = servData.location;
		} else {
			$(locCol).html("non-public");
			data[indexData].author.location = "non-public";
		}
		
		// console.log($(ligne).children('th[name=mail]'));
	}
	
	// ---- MAIN CODE ----
	// -- events --
	
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
	
	$('#cont-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			return (a.author.login.toLowerCase().localeCompare(b.author.login.toLowerCase())*$(e.target).attr("value"));
		});
		afficheData(data);
	});
	
	$('#mail-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			return (a.author.mail.toLowerCase().localeCompare(b.author.mail.toLowerCase())*$(e.target).attr("value"));

		});
		afficheData(data);
	});
	
	$('#country-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			return (a.author.location.toLowerCase().localeCompare(b.author.location.toLowerCase())*$(e.target).attr("value"));
		});
		afficheData(data);
	});
	
	$('#job-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			var array = [a.author.job, b.author.job].sort();
			var flag;
			if (array[0] === array[1]){
				flag = 0;
			} else if (array[1] === a.author.job){
				flag = 1;
			} else {
				flag = -1;
			}
			return (flag*$(e.target).attr("value"));
		});
		afficheData(data);
	});
	
	
	$('#commits-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			
			return ((a.total - b.total)*$(e.target).attr("value"));
		});
		afficheData(data);
	});
	
	$('#code-head').click(function(e){
		$(e.target).attr("value", $(e.target).attr("value")*-1);
		// console.log($(e.target).attr("value"));
		data.sort(function(a, b){
			
			return ((a.codeline.a - b.codeline.a)*$(e.target).attr("value"));
		});
		afficheData(data);
	});
	
	// -- add code --
	$(col_result).hide();
	$(error_well).hide();
	// console.log($(table_line));
})();