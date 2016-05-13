$(document).bind("mobileinit", function(){
		  $.mobile.defaultPageTransition = "none";
		  $.mobile.touchOverflowEnabled = true;
		});
		
		var customdata			=	[];
		var CURRENT_USER_ID 	= 	11;
		var startTime 			= 	new Date().getTime();
		var ARTIST_LIST			= 	new Array();
		var ALL_ARTIST_LIST 	= 	new Array();
		var CURRENT_ARTIST_ID;
		var ART_COUNT ;
		var CURRENT_ARTIST;		
		var ARTIST_ONLINE_DATA;
		var loadedFromServer=false;
		var secondLoaded = false;
		var screenName;
		var loadinitialImageFavourite = false;
		
		$(window.document).bind("userInfoLoaded", function(){
			 CURRENT_USER_ID = LOGGED_IN_USER.user.id;
 			 loadFavouriteArtistList(CURRENT_USER_ID,function(){
			});
		 });
	 
		$(function(){
			$("#keywordSearch").keypress(function (e) {
			      if (e.which == 13 && typeof $("#keywordSearch").val() != 'undefined' && $("#keywordSearch").val() != '') {
		  			  $("#msg").hide();
			    	  $('#searchResultMsg').show();
				      $('#searchResultMsg').text("Search Result for  "+ '"'+ $("#keywordSearch").val() +'"');
				      solrSearch($("#keywordSearch").val());
					  $("#keywordSearch").blur();
			      }
	    	 });
		 
			$(document).ajaxStart(function() {
				 $.mobile.loading('show');
			});

			$(document).ajaxStop(function() {
				   $.mobile.loading('hide');
			});
		});	
		 
 		function solrSearch(value){
	 	    $("#favouriteArtistList").empty();
			$.ajax( {
				dataType: "json",
				url: "/solr/select",
				data: {
					q: "KEYWORD:"+value,
					wt:"json",
					//tr:"solr2json.xsl"
				},
				success: function(data){
					var array = data.response.docs;
					var ids = new Array();
					if(array.length != 0){
						$.each(array, function(k,v){
							ids.push(v.ARTIST_ID);
						})	
					}
					$.each(ALL_ARTIST_LIST, function(k,v){
						if( $.inArray(v.id, ids) > -1 ) {
							 $("#keywordSearchView").tmpl(v).appendTo("#favouriteArtistList").trigger( "create" );
						}
					});
					$(".comicCb").attr('checked', false);
					$.each(FAV_ARTIST_LIST, function(index, v) {
						 if( $.inArray(v.id, ids) > -1 ) {
							 $("input#cbComic-" + v.id).attr(
									"checked", true);
					 	}
					});
				}
			});
 		 } 

		function comicToFavorites(){
			var array = new Array();
			array.push({"artistId" : CURRENT_ARTIST_ID});
			$.post(REST_SERVER+'favouriteArtists/save', {artists:JSON.stringify(array),userId:CURRENT_USER_ID}, function(data, textStatus) {
				if (data.response == "success") {
					 bootbox.alert("Successfully added comic to your favorites ...");
				}
			});
		}
	
		function addComicsToFavorites(){
			 var array = new Array();
			 $('div#comicCheck input[type=checkbox]').each(function() {
				if ($(this).is(':checked')) {
					array.push({"artistId" : $(this).attr("id")});
				}
			});
			$.post(REST_SERVER+'favouriteArtists/save', {artists:JSON.stringify(array),userId:CURRENT_USER_ID}, function(data, textStatus) {
				if (data.response == "success") {
					 $('#searchResultMsg').hide();
						loadFavouriteArtistList(CURRENT_USER_ID,function(){});
				} 
	 		});
		}
	
		function loadArtsOfComic(id,count){
			  $.each(ALL_ARTIST_LIST,function(k,v){
			  if(v.id == id){
				  loadComics(id,count,v);
		 	 }
	 	 });
		}
   
		function loadComicsOfComic(){
			loadComics(CURRENT_ARTIST_ID,ART_COUNT,CURRENT_ARTIST);
		}
	  
		function gotoComicDescrption(artistId){
		 	 $('#comicScreenName').text('');
			 $('#comicDescription').text('');
			 $("#comicImages").empty();
			 setTimeout(function() {
				 $.getJSON(REST_SERVER+'getArtistById/' + artistId,
					function(data) {
					 	CURRENT_ARTIST = data.artist;
					 	ART_COUNT = data.artist.artcount;
					 	CURRENT_ARTIST_ID = artistId;					 	
						$('#comicScreenName').text(data.artist.screenName);
						if(typeof data.description != 'undefined' && data.description != ''){
							$('#comicDescription').html(data.description).text();
							if(typeof data.comics != 'undefined' && data.comics != null && data.comics.length > 0){
								 if(data.fromArtFIle) {
								 $.each(data.comics,function(k,v){
									 $("#comicViewTmpl").tmpl(v.artFile).appendTo("#comicImages").trigger( "create" );
								 });
								 }
								 else {
									 $.each(data.comics,function(k,v){
									 $("#comicViewTmpl").tmpl(v).appendTo("#comicImages").trigger( "create" );
								 });
								 }
							}
						}else{
							$('#comicDescription').text('This artist has not yet entered a description of their comic.').css({'color':'red'});
						}
				}); },1200);
			  $('#homeNavbar').hide();
		 	 $.mobile.changePage( "#descriptionPage", { transition: "none"} );
	 	 }
	
		function gotoSearchResult(){
			  $('#homeNavbar').show();
			  $.mobile.changePage( "#home", { transition: "none"} );
	 	 } 	 

		var artistList = new Array();
		var FAV_ARTIST_LIST;
				
		$(function(){
    		$("#openDialog").click(function() {
    			$("#myDialog").dialog( "open" );
    			$(".ui-dialog-titlebar").hide();
    			$("msg").hide()   
    		});
	   		 $("#closeDialog").click(function() {
	 			$("#myDialog").dialog( "close" );
	 		});

	    		 $("#settings").click(function() {
	    				$( "#passwordDialog" ).popup( "open" )
	    			});

		    		 $("#closeSettingsDialog").click(function() {
		 				$("#settingsDialog").dialog( "close" );
		 			});

		    		 $("#changePassword").click(function() {
		    				$("#settingsDialog").dialog( "close" );
		    				$("#passwordDialog").dialog( "open" );
		    				$(".ui-dialog-titlebar").hide();
		    				
		    			});

			    		 $("#closePasswordDialog").click(function() {
			 				$("#passwordDialog").dialog( "close" );
			 			});

			    		 $("#changeEmail").click(function() {
			    				$("#settingsDialog").dialog( "close" );
			    				$("#emailDialog").dialog( "open" );
			    				$(".ui-dialog-titlebar").hide();
			    			});

				    		 $("#closeEmailDialog").click(function() {
				 				$("#emailDialog").dialog( "close" );
				 			});

    			$("#msg").hide();
    			$("#msg1").hide();
    			$("#emailMsg").hide();
    			$("#passwordMsg").hide();
    			$("#resetButton").click(resetSettings);

    			 $(window).resize(function(){
    				var imgsrc = $("#artImgCont").attr("src");
    				if(imgsrc != null && imgsrc.length > 0){
    					// fireresize
    					reloadArt();
    				}
    			}); 
			
    	 });	
		
		function getUrlVars()	 {
    	     var vars = [], hash;
    	     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    	     for(var i = 0; i < hashes.length; i++)
    	     {
    	         hash = hashes[i].split('=');
    	         vars.push(hash[0]);
    	         vars[hash[0]] = hash[1];
    	     }
    	     return vars;
    	 } 
    
    	function deleteComicFromFavorites(id){
    		$.ajax({
			  url: REST_SERVER+"artist/deleteFavouriteArtist/"+id+"/"+CURRENT_USER_ID,
				type : "DELETE",
				dataType : 'text',
				success : function() {

				 	$("#favli-" + id).fadeOut('slow', function() {
						$("#favli-" + id).remove();
					});  
					//$(".artistcb").attr('checked', false);
					$("input#cbArtist-" + id).attr(
									"checked", false);		
				},
				error : function() {
					alert("Error in deleting artist from favorites");
				}
			});
	
			 for(var i = 0; i < ARTIST_LIST.length; i++){						
	      		var v = ARTIST_LIST[i];			      		
				if(v.id == id){
					ARTIST_LIST.splice(ARTIST_LIST.indexOf(v),1);
				}						
			 } 
      	}
   		function saveComicToFavorites(id){
			$.post(REST_SERVER+'favouriteArtists/save',	{
				artistId:id,userId:CURRENT_USER_ID},
				function(data, textStatus) {
					 $('#msg').hide();
					$.each(ALL_ARTIST_LIST, function(k,v){
						if(v.id == id ) {
							artistList.push(v);
							$("#artistViewTpl").tmpl(v).appendTo("#favouriteArtistList").trigger( "create" );
						}
					});
			});
    }	 
    	 
    function addToFavouriteArtist(id) {

    	if($('#cbArtist-'+id).is(':checked')){
    		//console.log('hi checked'+id);    		
    		saveComicToFavorites(id);
    	}else{
    		//console.log('hi unchecked'+id);
    		deleteComicFromFavorites(id)
    	}
    }	
    function addComicToFavouriteArtist(id) {

    	if($('#cbComic-'+id).is(':checked')){
    		//console.log('hi checked'+id);    		
    		saveComicToFavorites(id);
    	}else{
    		//console.log('hi unchecked'+id);
    		deleteComicFromFavorites(id)
    	}
    }	
     
    function artsByArtist(){
		//	$('#home').hide();	
		
		//loadInitialImage();
			$.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts',
				function(data) {
					currentArtistArts = data;
					//loadedFromServer=true;
					loadArtPanelIndex();
					loadInitialImage();
					preloadNextImage();
				});
			
			
		}

    function laodFavArtists(id,callback){
		 $.getJSON(REST_SERVER+'list/favouriteOnlineArtist/'+id,
					function(data) {
					 if (callback != null) {
							callback();
						}
						if(typeof data != "undefined" && data != null && data !=0){
							if (data.response == "loginAgain") {
							 window.location.href = "index.html";
							}else{
								$('#favouriteArtistList').empty();
								$("#artistViewTpl").tmpl(data).appendTo("#favouriteArtistList").trigger( "create" );
								artistList = data;
								FAV_ARTIST_LIST = null;
								FAV_ARTIST_LIST = data;
								ARTIST_LIST = data;
								}
							} else {
								
								FAV_ARTIST_LIST = 0;
								$("#favouriteArtistList").empty();
								$("#msg").show();
								$("#msg")
										.removeClass()
										.addClass('messageboxerror')
										.text(
												'You have not yet selected any favorite artists yet. Click on Manage Favorites to add some.')
										.fadeIn("slow");
							}
		                
						
					});
	
	}
	
	function loadFavouriteArtistList(CURRENT_USER_ID,callback) {
		CURRENT_USER_ROLE = LOGGED_IN_USER.user.role;
		CURRENT_USER_STATUS = LOGGED_IN_USER.user.artiststatus ;
		
		setTimeout(function(){
			$.getJSON( REST_SERVER+'getCustomData',function(customdata) {
					if(typeof customdata != 'undefined'  && customdata != null){
						 if(customdata[0].artistselfview==true && CURRENT_USER_ROLE=="ARTIST"){
							 setTimeout(function(){
								 $.getJSON(REST_SERVER+'artist/selfview/'+LOGGED_IN_USER.user.id,function(selfData) {
									 $('#favouriteArtistList').empty();
                                    $("#artistOwnViewTpl").tmpl(selfData).appendTo("#favouriteArtistList").trigger( "create" );
                                    ARTIST_LIST = selfData;
                                    selectedArtist = selfData;
								 });
							 },600);
						 }else{
							 $("#artistLink").css({'display':'block'});
							 laodFavArtists(LOGGED_IN_USER.user.id,function(){
									loadArtistList();
								});
						 }
												 
					}else{
						 $("#artistlist").css({'display':'block'});
						laodFavArtists(LOGGED_IN_USER.user.id,function(){
							loadArtistList();
						});
					}
			});
	   },1200); 			
	}
	
	function loadArtistList() {	
		CURRENT_USER_STATUS 	= 	LOGGED_IN_USER.user.artiststatus ;
		CURRENT_USER_ROLE 		= 	LOGGED_IN_USER.user.role;
		$("#dpArtistList").empty();
		setTimeout(function() {
			$.getJSON(REST_SERVER+'listartistonline/ARTIST',
					function(data) {
	            if(data != 'undefined' && data != null && data != ''){ 
					onlineArtistArray = data;
					 var present = false;
				        $.each(onlineArtistArray, function(k,v){
								if(LOGGED_IN_USER.user.id == v.id ) {					
									present = true;
								}
					        });
					         if(present == false && CURRENT_USER_ROLE == "ARTIST"){
						        }
								ALL_ARTIST_LIST = onlineArtistArray;
							
							///////////////////////////////////////////////
							artistList = ALL_ARTIST_LIST; 
							///////////////////////////////////////////////
							
							
							$("#personViewTpl").tmpl(onlineArtistArray).appendTo("#dpArtistList").trigger("create");
							$(".artistcb").attr('checked', false);
							$(".comicCb").attr('checked', false);
							 $.each(FAV_ARTIST_LIST, function(index, value) {
									$("input#cbArtist-" + value.id).attr(
											"checked", true);
									$("input#cbComic-" + value.id).attr(
											"checked", true);
								});
						}
				});

		 },600);
		
	}

	function deleteArtist(id) {
		var artistName;
		for(var i = 0; i < ARTIST_LIST.length; i++){						
      		var v = ARTIST_LIST[i];			      		
      		if(v.id == id){
				artistName = v.userid;
			}						
		}
		bootbox.confirm("Are you sure you want to delete &nbsp;'"+artistName+"'&nbsp; from your favorites ?", function(result) {
		if (result) {
			$.ajax({
			    url: REST_SERVER+"artist/deleteFavouriteArtist/"+id+"/"+CURRENT_USER_ID,
				type : "DELETE",
				dataType : 'text',
				success : function() {
					$("#favli-" + id).fadeOut('slow', function() {
						$("#favli-" + id).remove();
					});
					$("input#cbArtist-" + id).attr("checked", false);
				},
				error : function() {
					alert("Error in deleting artist from favorites");
				}
			});
      		for(var i = 0; i < ARTIST_LIST.length; i++){
			    var v = ARTIST_LIST[i];			      		
			    if(v.id == id){
					ARTIST_LIST.splice(ARTIST_LIST.indexOf(v),1);
				}						
			}
			if(ARTIST_LIST.length == 0){
				$("#favouriteArtistList").empty();
				$("#msg").show();
				$("#msg")
					.removeClass()
					.addClass('messageboxerror')
					.text(
						'You have not yet selected any favorite artists yet. Click on Manage Favorites to add some.')
						.fadeIn("slow");
			}
	}
	}
		);
		
	}	
function gotoArtistListPage(){
	$.mobile.changePage( "#artistListPage", { transition: "none"} );
	
}
function artistDescriptionPage(artistId){
	$("#backToArtistLink").css({"display": 'block'});
	$("#backLink").css({"display": 'none'});
	
	gotoComicDescrption(artistId);
}

function searchDescriptionPage(artistId){
	$("#backToArtistLink").css({"display": 'none'});
	$("#backLink").css({"display": 'block'});
	
	gotoComicDescrption(artistId);
}

function goBacktoArtistList(){
	$.mobile.changePage( "#artistListPage", { transition: "none"} );
}

 function backToFavorites(){
	
	//$("#msg").hide();
	// $('#searchResultMsg').hide();
	// $("#favouriteArtistList").empty();
	// loadFavouriteArtistList(CURRENT_USER_ID,function(){});
	$.mobile.changePage( "#home", { transition: "none"} );	
} 
 
 
 function backToList(){
	     $("#msg").hide();
		 $('#searchResultMsg').hide();
		 $("#favouriteArtistList").empty();
		 $("#artistViewTpl").tmpl(artistList).appendTo("#favouriteArtistList").trigger( "create" );
	} 


 function loadArtsByArtist() {
	$.getJSON(REST_SERVER+'artist/'+currentuserid+'/artsize',
	function(data) { 
		 totArts = data.artCount;
		 console.log("tot:"+totArts);  
		 $.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/parts/fav',
		 function(value) {
			console.log("index=="+value.index);
			currentArtistArts=value.response;
			$.each(value.userID, function(idx, vl){
				userId=vl.userid;
				if(vl.screenName != undefined){
					screenName=vl.screenName;
				}
			});
			loadArtPanelIndex();
			if (value.index == "noSession" || currentAdvId != null
					|| currentFileId != null) {
				loadInitialImage();
				preloadNextImage();
			} else {
				preloadNextImage();
				loadInitialImagebyPreviousSession(value.index);
			}
			if(value.index !== "noSession" ){
				$.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/fav/'+value.index,
				function(datas) {
					console.log("part 2 recieved =");
					if(datas.response != null)		{
						$.merge(currentArtistArts,datas.response);
					}
					if(datas.prevData != null)	{
						$.merge(datas.prevData,currentArtistArts);
						currentArtistArts=[];
						currentArtistArts=datas.prevData;
					}
					secondLoaded = true;
					loadArtPanelIndex();
					$("#lbl-count").val("/ " +totArts);
				});
			}
			else{
				secondLoaded = true;
			}
		});
	 });
}

 function loadInitialImagebyPreviousSession(index) {
		currentArtIndex = index;
		index=index-index;
		var file = currentArtistArts[index];
		var imgurl = getImgUrl(file);
		changeImageURL(imgurl, file);
		if(currentArtIndex != 1){
			$("#bl-goto").attr("title","Showing "+currentArtIndex+1+" of "+artPanelsOnly.length+ " Arts");
			$("#bl-goto").show();
			$("#bl-goto-text").val(currentArtIndex+1);
		}
}

function goToArtistList() {
		if (CUR_ITEM.artfile != null) {
			window.location.href = "favouriteArtist.html";
			//window.location.hash = "";
		} else {
			gotopanelPopup();
		}

	}

	function resetSettings() {
		var password = $("input#password").val();
		console.log("inputedpasword" + password)
		var repwd = $("input#repassword").val();
		var email = $("input#email").val();
		//	$("#resetMsg").hide();

		if (email == '' && repwd == '' && password == '') {
			$("#resetMsg").show();
			$("#resetMsg").removeClass().addClass('messageboxerror').text(
					'Please Enter any settings to Change.').fadeIn("slow")
					.show().delay(5000).fadeOut();
			return false;
		}
		if (password == '' && repwd != '') {
			$("#resetMsg").show();
			$("#resetMsg").removeClass().addClass('messageboxerror').text(
					'Please Enter Password').fadeIn("slow").show().delay(5000)
					.fadeOut();
			return false;
		}
		if (repwd == '' && password != '') {
			$("#resetMsg").show();
			$("#resetMsg").removeClass().addClass('messageboxerror').text(
					'Please Enter Confirm Password').fadeIn("slow").show()
					.delay(5000).fadeOut();
			return false;
		}

		if (password != repwd) {
			$("#resetMsg").show();
			$("#resetMsg").removeClass().addClass('messageboxerror').text(
					'Password Mismatch. Please reenter password')
					.fadeIn("slow").show().delay(5000).fadeOut();
			return false;

		}
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		if (email != '') {
			if (!testEmail.test(email)) {
				$("#resetMsg").removeClass().addClass('messageboxerror').text(
						'Please Enter Valid Email').fadeIn("slow").show()
						.delay(5000).fadeOut();
				return false;
			}
		}
		if (email == '') {
			email = 'undefined'
		}
		if (password == '') {
			password = 'undefined'
		}

		var postdata = {
			fPassword : password,
			fEmail : email
		};
		$.post(REST_SERVER + 'resetSettings', postdata, function(data) {
			console.log("data " + JSON.stringify(data));
			if (data.response == "success") {
				$("#resetMsg").removeClass().addClass('messageboxok').text(
						data.message).fadeIn("slow").show().delay(5000)
						.fadeOut();

				$("input#password").val('');
				$("input#repassword").val('');
				$("input#email").val('');
				//	 $("#popupDialog").popup("close");
				//	 alert("Settings saved Successfully");

			} else if (data.response == "failure") {
				$("#resetMsg").removeClass().addClass('messageboxerror').text(
						data.message).fadeIn("slow").show().delay(5000)
						.fadeOut();
			}

		});

	}