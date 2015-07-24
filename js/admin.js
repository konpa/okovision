/*****************************************************
* Projet : Okovision - Supervision chaudiere OeKofen
* Auteur : Stawen Dronek
* Utilisation commerciale interdite sans mon accord
******************************************************/
$(document).ready(function() {
    
    
    
    $("#oko_typeconnect").change(function(){
	    
	    if ($(this).val() == 1 ){
	        $("#form-ip").show();
	    }else{
	        $("#form-ip").hide();
	    }
	});
    
    $('#test_oko_ip').click(function(){
        
        
        if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test($('#oko_ip').val())){
            
            var ip = $('#oko_ip').val();
            
            $.getJSON("ajax.php?type=admin&action=testIp&ip=" + ip , function(json) {
			
				if (json.response === true) {
				    $('#url_csv').html("");
					$.growlValidate("Communication établie");
					$('#url_csv').append('<a target="_blank" href="' + json.url +'"> Visualiser les fichiers sur la chaudiere </a>');
				} else {
					$.growlWarning("L'adresse Ip ne repond pas");
				}
			})
			.error(function() { 
				$.growlErreur('Error  - Probleme de communication !');
			});	
            
            
        }else{
            $.growlErreur('Adresse Ip Invalide !');
        }
    });
    
    $('#bt_save_infoge').click(function(){
        
        var tab = {
					oko_ip : $('#oko_ip').val(),
					param_tcref : $('#param_tcref').val(),
					param_poids_pellet : $('#param_poids_pellet').val(),
					surface_maison : $('#surface_maison').val(),
					oko_typeconnect : $('#oko_typeconnect').val(),
					send_to_web: 0
				};
				
				$.ajax({
					url: 'ajax.php?type=admin&action=saveInfoGe',
					type: 'POST',
					data: $.param(tab),
					async: false,
					success: function(a) {
					    console.log(a);
					    if (a.response === true) {
        				    $.growlValidate("Configuration sauvegardée");
        				} else {
        					$.growlWarning("Configuration non sauvegardée");
        				}
					},
                    error: function () {
                        $.growlErreur('Error  - Probleme lors de la sauvegarde !');
                      }
				});
        
    });
    
    
    $('#fileupload').fileupload({
    	
    	url: 'ajax.php?type=admin&action=uploadMatrice',
        dataType: 'json',
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(csv)$/i,
        maxFileSize: 3000000,
        formData: {actionFile: 'matrice'},
        start: function (e) {
    		//console.log('Uploads started');
		},
        done: function (e, data) {
           	$("#selectFile").hide();
           	makeMatrice();
        },
        progress: function (e, data) {
        	var progress = parseInt(data.loaded / data.total * 100, 10);
        	console.log('ici::'+ progress);
        	$('#bar').css(
	            'width',
            	progress + '%'
        	);
    	}
    });
    
    function makeMatrice(){
    	
    	$.getJSON("ajax.php?type=admin&action=getHeaderFromOkoCsv" , function(json) {
			
				if (json.response === true) {
				    $("#headerCsv > tbody").html("");
					
					$.each(json.data, function(key, val) {
					    console.log(val);
					    //$('#select_graphe').append('<option value="' + val.id + '">' + val.name + '</option>');
					   $('#headerCsv > tbody:last').append('<tr> \
					                                        	<td>'+ val.original_name +'</td>\
					                                        	<td>'+ val.name +'</td>\
					                                        	<td>'+ ((val.type!="")?'<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>':'') +'</td>\
					                                        </tr>');
					});
				
					
					$("#concordance").show();
					
				} else {
					$.growlWarning("Le fichier CSV de reference n'est pas trouvé.");
				}
			})
			.error(function() { 
				$.growlErreur('Error  - Probleme de communication !');
			});	
    	
    }
    
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
        
        if(e.target.hash == 'matrice'){
	        $.getJSON("ajax.php?type=admin&action=statusMatrice", function(json) {
				
					if (json.response === true) {
						$("#selectFile").hide();
					    makeMatrice();
					}
				})
				.error(function() { 
					$.growlErreur('Error  - Probleme de communication ! !');
				});	
        }
    });
    

	
    
});