 var dataLength 		 = 	0;
 var loading  		 = 	false; 
 var fromIndex		 = 	0; 
 var nextFromIndex 	 = 	0;
 var uuid=0;
 var type="loadFirstSetArts";
 $(function(){ 
	 loadFirstSetArts(uuid);
	 $(window).scroll(function() { //detect page scroll
	   	  var u = $.mobile.path.parseUrl(location.href);
  	      if(u.hash != "#search" && u.hash != '#descriptionPage'){  
		      if($(document).scrollTop() + $(window).height() >= $('body').height())        {//user scrolled to bottom of the page?  
			     	loadNextSet();
			  }
  	      }// if u sesrch
	 });
 });

function loadFirstSetArts(uuid){
   	$.getJSON(REPORT_SERVER+'artistQuery?q=usageTracking&role=ADMIN&uuid='+uuid+'&type='+type+'&fromIndex='+fromIndex,
   	function(data) {
    	if (data.status) {
			 if(data.list != 'undefined' && data.list != null && data.list != ''){
				 dataLength = data.list.length;
				 artistList = data.list;
				 ARTIST_LIST = new Array();
				 ARTIST_LIST = data.list;
				 nextFromIndex = data.nextFromIndex;
				 $('#masonry_Div').empty();
				 $("#keywordSearchView").tmpl(data.list).appendTo("#masonry_Div").trigger( "create" );
				 $('#masonry_Div').masonry().masonry('reloadItems');
		   		listMasonry();
			 }else{
				 alert("Currently not showing any artist")
			 }
    	}else{
			loadFirstSetArts(data.uuid);
		}
	}); 
}

function loadNextSet(){
 	if(loading==false && dataLength >= 5 )      {//there's more data to load
         loading = true; //prevent further ajax loading
	     setTimeout(function() {
	       	  var u = $.mobile.path.parseUrl(location.href);
	       	  if(u.hash === "#search"){
		   		 solrSearch($("#keywordSearch").val());
		   	  }console.log("called 2nd time");
		   	  uuid=0;
		   	loadNextSEtArts(uuid);
 		},1200); 
    }
 }

function loadNextSEtArts(uuid){
	$.getJSON(REPORT_SERVER+'artistQuery?q=usageTracking&role=ADMIN&uuid='+uuid+'&type='+type+'&fromIndex='+nextFromIndex,
	function(data) {
		if (data.status) {
			 if(data.list != 'undefined' && data.list != null && data.list != ''){ 
				 $.merge(artistList,data.list);
				 $.merge(ARTIST_LIST, data.list);
				 var u = $.mobile.path.parseUrl(location.href);
		   	     if(u.hash != "#search"){
			   		$("#keywordSearchView").tmpl(data.list).appendTo("#masonry_Div").trigger( "create" );
			    	$('#masonry_Div').masonry().masonry('reloadItems');
			    	listMasonry();
			     }
				 nextFromIndex = data.nextFromIndex;
		         loading = false; 
		         if(data.list.length == 0)
		           	 loading = true;
			}else{
				 loading = true;
			}
		}else{
			loadNextSEtArts(data.uuid);
		}
	});
}

/*$(document).ready(function() {
    var track_load = 0; //total loaded record group(s)
    var loading  = false; //to prevents multipal ajax loads
    var total_groups = <?php echo $total_groups; ?>; //total record group(s)
    
    $('#results').load("autoload_process.php", {'page':track_load}, function() {track_load++;}); //load first group
    
    $(window).scroll(function() { //detect page scroll
        
        if($(window).scrollTop() + $(window).height() == $(document).height())  //user scrolled to bottom of the page?
        {
            
            if(track_load <= total_groups && loading==false) //there's more data to load
            {
                loading = true; //prevent further ajax loading
                $('.animation_image').show(); //show loading image
                
                //load data from the server using a HTTP POST request
                $.post('autoload_process.php',{'group_no': track_load}, function(data){
                                    
                    $("#results").append(data); //append received data into the element

                    //hide loading image
                    $('.animation_image').hide(); //hide loading image once data is received
                    
                    track_load++; //loaded group increment
                    loading = false; 
                
                }).fail(function(xhr, ajaxOptions, thrownError) { //any errors?
                    
                    alert(thrownError); //alert with HTTP error
                    $('.animation_image').hide(); //hide loading image
                    loading = false;
                
                });
                
            }
        }
    });
});*/