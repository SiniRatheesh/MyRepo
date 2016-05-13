// Script for checking whether user is logined or not

var LOGGED_IN_USER = null;

var appname = "Comikka";

$(function(){
	setTimeout(function() {
		userAuthentication();	
	}, 600);
});

function userAuthentication() {
	$.getJSON(REST_SERVER+'userAuthentication',
			function(data) {
				if(data == null || data.userName == null){
					LOGGED_IN_USER = null;
					logOut();
				}
				LOGGED_IN_USER = data;
				if(data.response == "notLogged"){
					if(window.location.href.indexOf("profile.html") != -1){
						window.location.href = "home.html";
					}
					
				}else{
					if((typeof piwikTrack) !== "undefined"){
						piwikTrack();
					}
					if(window.location.href.indexOf("profile.html") != -1){
						$(window.document).trigger("userInfoLoaded");
					}
					
					
				}
			},
			function(err){
				console.log(err);
			});
}
function logOut(){
	$.getJSON(REST_SERVER+'logOut',
			function(data) {
				if(window.location.href.indexOf("profile.html") != -1){
					window.location.href = "home.html";
				}
			});

}


function trackVisitor(){
	$.getJSON(REST_SERVER+"cachePiwikData", function(data){});
}


function resetSettings(callback) {
	var password = $("input#password").val();
	var repwd = $("input#repassword").val();
	var email = $("input#email").val();
	//	$("#resetMsg").hide();
	if (password == '' && repwd != '') {
		$("#resetMsg").show();
		$("#resetMsg").removeClass().addClass('messageboxerror').text(
				'Please Enter Password').fadeIn("slow").show().delay(5000).fadeOut();
		return false;
	}
	if (repwd == '' && password != '') {
		$("#resetMsg").show();
		$("#resetMsg").removeClass().addClass('messageboxerror').text(
				'Please Enter Confirm Password').fadeIn("slow").show().delay(5000).fadeOut();
		return false;
	}
	if (email == '' && repwd == '' && password == '') {

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
	if(email != ''){
		if (!testEmail.test(email)){
			$("#resetMsg").removeClass().addClass('messageboxerror')
			.text('Please Enter Valid Email').fadeIn("slow").show().delay(5000).fadeOut();
			return false;
		}
	}
		if (email == '') {
			email = 'undefined'
		}
		if (password == '') {
			password = 'undefined'
		}
		
		var postdata = {fPassword: password, fEmail: email};
		$.post(REST_SERVER+'resetSettings',postdata,
				function(data) {
					if(data.response=="success"){
						$("#resetMsg").removeClass()
						.addClass('messageboxok').text(data.message)
						.fadeIn("slow").show().delay(5000).fadeOut();
					
						//$('#myModal').modal('hide');
						//alert("Settings saved Successfully");
					}else if(data.response=="failure"){
						$("#resetMsg").removeClass()
						.addClass('messageboxerror').text(data.message)
						.fadeIn("slow").show().delay(5000).fadeOut();
					}
					
					if(callback != null && (typeof callback) !== "undefined"){
						callback();
					}
				});

	
}


