$(function(){

	$.ajax( {
		dataType: "json",
		url: host + "solr/collection1/dataimport?command=full-import",
		success: function(data){
		}
	});

	$.ajax( {
		url: host + "solr/collection1/dataimport?command=status&indent=true&wt=json",
		success: function(data){
		}
	});

	
});

