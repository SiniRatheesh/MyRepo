
	$(document).bind("mobileinit", function(){
	  $.mobile.defaultPageTransition = "none";
	  $.mobile.touchOverflowEnabled = true;
	});
		

	var artistList;
	var startTime = new Date().getTime();
	var endTime;
	var todayDate=new Date();
	var stHours=todayDate.getHours();
	var stMinutes=todayDate.getMinutes();
	var stSeconds=todayDate.getSeconds();
	var ARTIST_LIST = new Array();
	var CURRENT_ARTIST_ID;
	var ART_COUNT ;
	var CURRENT_ARTIST;
	var dataLength;
	var totArts;
	var secondLoaded =false;
	var initialLoadSize= 100;
	var userId;
  	var artistIdforDesc;
  	var descriptionforComic;
  	var imageUrl;
  	var screenName;
    var loadinitialimageIndex= false;	
    var artistIdinUrl;
    var artIdinURLRefresh;
    var isRefresh= false;
  	 $(function(){
		 if($.cookie("lastUrl") != null ){
		 	var url=$.cookie("lastUrl");
	   		window.location=url;	
		}
    	else{
    		window.location.hash = "";
    	}
	    
      $("#yourLinkId").on("click", function()	{console.log("clicked link id");
    	  $(this).attr("href", "http://www.facebook.com/sharer/sharer.php?u=www.comikka.com/artist/" +userId);
      });
    				
      $("#yourLinkIdfotTwitter").on("click", function(){
		   $(this).attr("href", "http://twitter.com/intent/tweet?text=CheckOut&hashtags=Comikka,mobileComics&url=http://www.comikka.com/artist/"+userId);
	  });
    	
      $("#yourLinkIdforFB").on("click", function(){
    	  //console.log("desc comic==="+descriptionforComic);
    	  
    	  var descriptionCOmics=$('#comicDescription').html(descriptionforComic).text();
    	 // console.log("desc remov text==="+descriptionCOmics);
       	  FB.ui({
    		  method: 'share',
    		  title:screenName,
    		  href: host + 'artist/' +userId,
    		  picture: imageUrl,
    	        caption: 'comikka',
    	        description: descriptionCOmics
    		}, function(response){console.log(response);});
      });

      $("#keywordSearch").keypress(function (e) {
   		 if (e.which == 13 && typeof $("#keywordSearch").val() != 'undefined' && $("#keywordSearch").val() != '') {
			window.location.hash = "#search";
			loading=false;
			loadNextSet();
   	   		$('#searchResultMsg').show();
			$('#searchResultMsg').text("Search Result for  "+ '"'+ $("#keywordSearch").val() +'"');
			$("#keywordSearch").blur();
 	      }
   	 });

      $("#retrieveDiv").hide();
      $("#signinButton").click(loginAuthentication);
      $("#continueButton").click(forgotPassword);
      $("#createBtn").click(newUserRegistration);

      $(document).ajaxStart(function() {
   		$.mobile.loading('show');
	   });

      $(document).ajaxStop(function() {
		setTimeout(function(){
		     $.mobile.loading('hide');
		},300);
	  });

      $("#newUser")
        .on("popupafteropen popupafterclose", function () { /* any of those events */
         $("input", this).val("");
	  });

      $("#loginDialog")
	       .on("popupafteropen popupafterclose", function () { /* any of those events */
	        $("input", this).val("");
	  });

      $("#forgotPasswordDialog")
	     .on("popupafteropen popupafterclose", function () { /* any of those events */
	     $("input", this).val("");
	  });
   	});
    	 
  	function listMasonry(){
 	   	 $('#masonry_Div').masonry({
	        // options
	        itemSelector : '.pin',
		    isAnimated: true,
		    isFitWidth: true
		 });	    	 
    }
    	
 	function solrSearch(value){
		console.log(value);
		$("#masonry_Div").empty();
		$.ajax( {
			dataType: "json",
			url: host + "/solr/select",
			data: {
				q: "KEYWORD:"+value,
				wt:"json"
			},
			success: function(data){
				var array = data.response.docs;
				var ids = new Array();
				if(array.length != 0){
					$.each(array, function(k,v){
						ids.push(v.ARTIST_ID);
					})	
				}
				var addedPanels = [];
				$.each(ARTIST_LIST, function(k,v){
					if( $.inArray(v.id, ids) > -1 && $.inArray(v.id, addedPanels) < 0) {
						 addedPanels.push(v.id);
						 $("#keywordSearchView").tmpl(v).appendTo("#masonry_Div").trigger( "create" );
						 $('#masonry_Div').masonry().masonry('reloadItems');
						 listMasonry();
					}
				});
				addedPanels = [];
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
		 var flag=false;
		 setTimeout(function() {
 			// listartistonline
			$.getJSON(REST_SERVER+'getArtistById/' + artistId,
			function(data) {
				//console.log("data="+JSON.stringify(data,null,4));
			 	CURRENT_ARTIST = data.artist;
			 	ART_COUNT = data.artist.artcount;
			 	CURRENT_ARTIST_ID = artistId;
				$('#comicScreenName').text(data.artist.screenName);
				if(typeof data.description != 'undefined' && data.description != ''){
					$('#comicDescription').html(data.description).text();
					flag=true;
				//	 $('#comicDescription').find('a').trigger('click');
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
			}); 
 		},1200);
		 $.mobile.changePage( "#descriptionPage", { transition: "none"} );
		
 	 }
	
 	 function gotoSearchResult(){
		  $.mobile.changePage( "#home", { transition: "none"} );
 	 }
 	 
	 function newUserRegistration() {
		var password =$("input#newPassword").val();
		var userName = $("input#newUserName").val();
		var email = $("input#newEmail").val();
		if(userName==''){
			$("#newMsgbox").removeClass().addClass('messageboxerror')
			.text('Please Enter Username').fadeIn("slow").show().delay(5000).fadeOut();
			return false;  
		}
		if(password==''){
			$("#newMsgbox").removeClass().addClass('messageboxerror')
			.text('Please Enter Password').fadeIn("slow").show().delay(5000).fadeOut();
			return false; 
		}
		var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
		if(email==''){
			$("#newMsgbox").removeClass().addClass('messageboxerror')
			.text('Please Enter Email').fadeIn("slow").show().delay(5000).fadeOut();
			return false;  
		}else{
			if (!testEmail.test(email)){
				$("#newMsgbox").removeClass().addClass('messageboxerror')
				.text('Please Enter Valid Email').fadeIn("slow").show().delay(5000).fadeOut();
				return false;
			}
		}

		var resturl = REST_SERVER+'newUserRegistration';
		$.post(resturl,{userName:userName, password:password,email:email},
		function(data) {
			if(data.response == "success"){
				$("#newMsgbox").removeClass().addClass('messageboxok')
				.text(data.message)
				.fadeIn("slow").delay(10000).fadeOut();
			
			}else {
				$("#newMsgbox").removeClass().addClass('messageboxerror')
				.text(data.message).fadeIn("slow").delay(5000).fadeOut();
			}	
		});
	}
	
	function isNumber(n) {
  	  return !isNaN(parseFloat(n)) && isFinite(n);
	} 	 

	function getCustomData(){
		var resturl = REST_SERVER+'getCustomData';
		$.getJSON(resturl,
			function(data) {
				fulldata = data;
			});
		return fulldata;
	}

	// Login Authentication
	function loginAuthentication(){
		var password =$("input#password").val();
		var userName = $("input#userName").val();
		authentication(userName,password);
	}

	function userAuthentication(){
		var password =$("input#password1").val();
		var userName = $("input#userName1").val();
		authentication(userName,password);
	}

    function authentication(userName,password){
   		if(userName==''){
   			$("#msgbox")
			.removeClass()
			.addClass('messageboxerror')
			.text(
					'Please Enter Username')
			.fadeIn("slow").delay(5000).fadeOut();
   			
   			$("#cMsgbox").removeClass()
			.addClass('messageboxerror')
			.text(
					'Please Enter Username')
			.fadeIn("slow").delay(5000).fadeOut();
   			return false; 
   		}
   		if(password==''){
   			$("#msgbox")
			.removeClass()
			.addClass('messageboxerror')
			.text('Please Enter Password')
			.fadeIn("slow").delay(5000).fadeOut();
    			
   			$("#cMsgbox")
			.removeClass()
			.addClass('messageboxerror')
			.text('Please Enter Password')
			.fadeIn("slow").delay(5000).fadeOut();
   			return false; 
   		}
		var resturl = REST_SERVER+'loginAuthentication';
			
		$.post(resturl, {userName:userName, password:password},
			function(data) {
  				if(data.role=="USER"){
   				//	getCustomData();
   				var resturl = REST_SERVER+'getCustomData';
				$.getJSON(resturl,
					function(fulldata) {
	   					if(fulldata[0].loginavailable==true){
    						if(data.response == "exists"){
        						document.location.href = 'profile.html';
    						}
    						else if(data.response == "notExists") {
        						$("#msgbox")
        							.removeClass()
        							.addClass('messageboxerror')
        							.text(
        								'The username or password you entered was not found.')
        							.fadeIn("slow").delay(5000).fadeOut(); 
        							$("#cMsgbox")
									.removeClass()
									.addClass('messageboxerror')
									.text(
										'The username or password you entered was not found.')
									.fadeIn("slow").delay(5000).fadeOut(); 
        					}
    						else if(data.response == "sameSession") {
        							$("#msgbox")
        							.removeClass()
        							.addClass('messageboxerror')
        							.text("It looks like you'"+"re already logged in - try reloading the page.")
        							.fadeIn("slow").delay(5000).fadeOut();
        							$("#cMsgbox")
        							.removeClass()
        							.addClass('messageboxerror')
        							.text(
        								"It looks like you'"+"re already logged in - try reloading the page.")
        							.fadeIn("slow").delay(5000).fadeOut();
        					}
    					}else{
    						alert("Sorry, User login is temporarily disabled.");
    						$("#loginDialog").popup('close');
    					}
					});
    			}
	   			else{
    				if(data.response == "exists"){
    					document.location.href = 'profile.html';
    				}
    				else if(data.response == "notExists") {
    					$("#msgbox")
    					.removeClass()
    					.addClass('messageboxerror')
    					.text(
    						'The username or password you entered is incorrect')
    					.fadeIn("slow").delay(5000).fadeOut(); 
    					$("#cMsgbox")
						.removeClass()
						.addClass('messageboxerror')
						.text(
							'The username or password you entered is incorrect')
						.fadeIn("slow").delay(5000).fadeOut(); 
    				}
    				else if(data.response == "sameSession") {
    					$("#msgbox")
    					.removeClass()
    					.addClass('messageboxerror')
    					.text(
    						"It looks like you'"+"re already logged in - try reloading the page.")
    					.fadeIn("slow").delay(5000).fadeOut();
						$("#cMsgbox")
						.removeClass()
						.addClass('messageboxerror')
						.text(
							"It looks like you'"+"re already logged in - try reloading the page.")
						.fadeIn("slow").delay(5000).fadeOut();
    				}
    			}
			},"json");
   	}
    $(document).on("click", "#comicDescription a", function(e){e.preventDefault();
    var link = $(this);
	
	console.log("href==="+link.attr("href"));
	window.open(link.attr("href"),"popupWindow", "width=600,height=600,scrollbars=yes");
    /*	$("#comicDescription a").click(function(e){e.preventDefault();
    		var link = $(this);
    		
    		console.log("href==="+link.attr("href"));
    	window.open(link.attr("href"),"popupWindow", "width=600,height=600,scrollbars=yes");
    	});*/
    });

    $(document).ready(function(){
    	
    });
    // Forgot Password
	function forgotPassword(){
		var email =$("input#email").val();
		validateEmail(email);
	}

    function forgotPasswordforDescription(){
		var email =$("input#email1").val();
		validateEmail(email);
	}
    
    function validateEmail(email) {
   		if(email==''){
    		$("#msgBox").removeClass().addClass('messageboxerror')
				.text('Please Enter Email').fadeIn("slow"); 
    			$("#msgBox1").removeClass().addClass('messageboxerror')
				.text('Please Enter Email').fadeIn("slow"); 
    			return false; 
    	}
    	var resturl = REST_SERVER+'emailAuthentication';
   		$.post(resturl,{email:email,loginType:1},
    		function(data) {
    			if(data.response == "exists"){
    				$("#forgetDiv").hide();
    				$("#retrieveDiv").show();
    				$("#forgetDiv1").hide();
    				$("#retrieveDiv1").show();
    			} 
    			else if(data.response == "notExists") {
    				$("#msgBox")
    					.removeClass()
    					.addClass('messageboxerror')
    					.text(
    						'That email address was not found.')
    					.fadeIn("slow"); 
					// for comic description
					$("#msgBox1")
						.removeClass()
						.addClass('messageboxerror')
						.text(
							'That email address was not found.')
						.fadeIn("slow"); 
    			}
    		});
    }
    	
    function getUrlVars()	 {
   	   var vars = [], hash;
       var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	   for(var i = 0; i < hashes.length; i++) {
           hash = hashes[i].split('=');
    	   vars.push(hash[0]);
    	   vars[hash[0]] = hash[1];
   	   }
       return vars;
    }
    
    function getQueryStrings(hash)	 {
    	var hash=hash;
   	    var vars=[];
    	var value;
   		var hashes;
	  	hashes=  hash.slice(hash.indexOf('?')+1).split('&');
    	for(var i = 0; i < hashes.length; i++)	     {
    	     value = hashes[i].split('=');
    	     vars.push(value[0]);
    	     vars[value[0]] = value[1];
	    }
    	return vars;
    }
    
    function getCurrentUrl() {
       var hash=window.location.hash;
       return hash;
    }	 
    		 
  	function calculateWidth(iHeight, iWidth, fWidth) {
	  var fHeight = (iHeight * fWidth) / iWidth;
 	  return fHeight;
  	}
  
  	function calculateHeight(iHeight, iWidth, fHeight) {
	   var fWidth = (iWidth * fHeight) / iHeight;
 	   return fHeight;
  	}
  
	function loadArtsByArtist(){
   		totArts = 0;
		$.getJSON(REST_SERVER+'artist/'+currentuserid+'/artsize',
		function(data) {
	  		 totArts = data.count;
	  		 if(!(isRefresh) && cookie){
				$.getJSON(REST_SERVER+'artist/'+currentuserid+'/artId/'+artIdinCookie+'/arts/parts/cookie',
				function(value) {
					currentArtistArts = value.response;
					//-------------------------------------------Code for facebook share---------------------------------------------
					$.each(value.userID, function(idx, vl){
						userId=vl.userid;
						if(vl.screenName != undefined){
							screenName=vl.screenName;
						}
					});
					if(value.response[1].artfile != null){
		   				var tempURL= value.response[1].artfile.s3ThumbUrl;
		   				imageUrl=tempURL.replace(/ /g, '%20');
					}else{
						imageUrl= host + "img/artist.jpg";
					}
					artistIdforDesc=currentuserid;
					$.getJSON(REST_SERVER+'getDescriptionbyID/' + artistIdforDesc,
		 	   		function(descriptionData) {
						 if(descriptionData.description !== undefined){
							 descriptionforComic=descriptionData.description;
						 } else if(descriptionData.description[0].artistDescription !== undefined){
					 	 	  descriptionforComic=descriptionData.description[0].artistDescription.description;
						 } else{
							 descriptionforComic='No Description';
						 }
					}); 
					//-------------------------------------------------------------------------------------------------
					loadArtPanelIndex();
				 	loadInitialImagebyPreviousIndex(value.index);
					preloadNextImage();
				 	cookie=false;
					$.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/fav/'+value.index,
					function(datas) {
						console.log("part 2 recieved =");
						if(datas.response != null)		{
							$.merge(currentArtistArts,datas.response);
						}
						if(datas.prevData != null)		{
							$.merge(datas.prevData,currentArtistArts);
							currentArtistArts=[];
							currentArtistArts=datas.prevData;
						}
						secondLoaded = true;
						loadArtPanelIndex();
						$("#lbl-count").val("/ " +data.artCount);
					});
				 });
			 } else{
				 $.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/parts/'+0,
				 function(data) {
						//-------------------------------------------Code for facebook share---------------------------------------------
						$.each(data.userID, function(idx, vl){
							userId=vl.userid;
							if(vl.screenName != undefined){
								screenName=vl.screenName;
							}
						});
						if(data.response[1].artfile != null){
   							var tempURL= data.response[1].artfile.s3ThumbUrl;
   							imageUrl=tempURL.replace(/ /g, '%20');
						}else{
							imageUrl= host + "img/artist.jpg";
						}
						artistIdforDesc=data.response[0].artfile.artistId;
						currentArtistArts = data.response;
						loadArtPanelIndex();
				 		$.getJSON(REST_SERVER+'getDescriptionbyID/' + artistIdforDesc,
 	   					function(descriptionData) {
							 if(descriptionData.description !== undefined){
								 descriptionforComic=descriptionData.description;
							 } else if(descriptionData.description[0].artistDescription !== undefined){
			 	     		 	 descriptionforComic=descriptionData.description[0].artistDescription.description;
							 } else{
								 descriptionforComic='No Description';
						 	}
			 	   		}); 
				 		//-------------------------------------------------------------------------------------------------
						loadInitialImage();
						preloadNextImage();
						if(totArts>initialLoadSize){
							setTimeout(function(){ 
								console.log("part2 called...");
								$.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/parts/'+1,
								function(data) {
									console.log("part2 received...");
									$.merge(currentArtistArts,data.response);
									secondLoaded = true;
									loadArtPanelIndex();
									$("#lbl-count").val("/ " +artPanelsOnly.length);
								});
							}, 3000);
						}else{
							secondLoaded = true;
						}
					});	
				 }
			});		
		}
	
		function loadArtsByArtistOnRefresh(){
   			totArts = 0;
			$.getJSON(REST_SERVER+'artist/'+currentuserid+'/artsize',
			function(data) {
	  		 	totArts = data.count;
	  	  		currentArtistArts=[];
				$.getJSON(REST_SERVER+'artist/'+currentuserid+'/artId/'+artIdinURLRefresh+'/arts/parts/cookie',
				function(value) {
					currentArtistArts = value.response;
					//----------------------------------       ---------Code for facebook share---------------------------------------------
					$.each(value.userID, function(idx, vl){
						userId=vl.userid;
						if(vl.screenName != undefined){
							screenName=vl.screenName;
						}
					});
					if(value.response[1].artfile != null){
		   				var tempURL= value.response[1].artfile.s3ThumbUrl;
		   				imageUrl=tempURL.replace(/ /g, '%20');
					}else{
						imageUrl= host + "img/artist.jpg";
					}
					artistIdforDesc=currentuserid;
					$.getJSON(REST_SERVER+'getDescriptionbyID/' + artistIdforDesc,
		 	   		function(descriptionData) {
						 if(descriptionData.description !== undefined){
							 descriptionforComic=descriptionData.description;
						 } else if(descriptionData.description[0].artistDescription !== undefined){
					 	 	  descriptionforComic=descriptionData.description[0].artistDescription.description;
						 } else{
							 descriptionforComic='No Description';
						 }
					}); 
					//-------------------------------------------------------------------------------------------------
					loadArtPanelIndex();
				 	loadInitialImagebyPreviousIndex(value.index);
					preloadNextImage();
				 	cookie=false;
					$.getJSON(REST_SERVER+'artist/'+currentuserid+'/arts/fav/'+value.index,
					function(datas) {
						console.log("part 2 recieved =");
						if(datas.response != null)		{
							$.merge(currentArtistArts,datas.response);
						}
						if(datas.prevData != null)		{
							$.merge(datas.prevData,currentArtistArts);
							currentArtistArts=[];
							currentArtistArts=datas.prevData;
						}
						secondLoaded = true;
						loadArtPanelIndex();
						$("#lbl-count").val("/ " +data.artCount);
					});
				 });
			 
			});		
		}
	
		function loadInitialImagebyPreviousIndex(index) {
			currentArtIndex = index;
			index=index-index;
			var file = currentArtistArts[index];
			var imgurl = getImgUrl(file);
			changeImageURL(imgurl, file);
			if(file.order != 1){
				$("#bl-goto").attr("title","Showing "+file.order+1+" of "+artPanelsOnly.length+ " Arts");
				$("#bl-goto").show();
				$("#bl-goto-text").val(file.order+1);
			}
		}
	
		function goToArtistList(){
			if(CUR_ITEM.artfile != null){
				$.removeCookie("lastUrl");
				window.location.href = "home.html";
			}
			else{
				gotopanelPopup();
			}
		}
	
	function resetMessages() {
		$("#retrieveDiv").hide();
		$("#forgetDiv").show();
	}
	
	function resetMessagesforComic() {
		$("#retrieveDiv1").hide();
		$("#forgetDiv1").show();
	}

	function backToArtistList(){
	
		$.mobile.changePage( "#home", { transition: "none"} );	
	} 

	function backToList(){
		$('#searchResultMsg').hide();
		$("#masonry_Div").empty();
		$("#keywordSearchView").tmpl(ARTIST_LIST).appendTo("#masonry_Div").trigger( "create" );
		$('#masonry_Div').masonry().masonry('reloadItems');
		listMasonry(); 
	} 