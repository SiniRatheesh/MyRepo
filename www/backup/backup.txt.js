// This is a JavaScript file
 
    /* 
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault(); 
    navigator.notification.confirm("Are you sure want to exit from App?", onConfirmExit, "Confirmation", "Yes,No");
    }, false );
}
 
function onConfirmExit(button) {
    if(button==2){ //If User select a No, then return back;
        return;
    }else{
        navigator.app.exitApp(); // If user select a Yes, quit from the app.
    }
}

 
    
    if (navigator.app) {
navigator.app.exitApp();
}
else if (navigator.device) {
  navigator.device.exitApp();
}
else {
          window.close();
}

<p><a href="#" onclick="showConfirm(); return false;">Show Confirm</a></p>

  function onConfirm(buttonIndex) {
        alert('You selected button ' + buttonIndex);
    }

    // Show a custom confirmation dialog
    //
    function showConfirm() {
        navigator.notification.confirm(
            'You are the winner!',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Game Over',            // title
            'Restart,Exit'          // buttonLabels
        );
    }
    
    // For ads opening new window
    
    $('.advertisement iframe').each(function() {
    $(this).one('load', function() {
        makeOpenWindowHref(this);
    });
});
    
    function makeOpenWindowHref(element) {
    if (isNativeApp){
        $(element).contents().find('a[href^="http"]').each(function() {
            $(this).click(function(event){
                event.preventDefault();
                navigator.app.loadUrl($(this).attr("href"), {
                    openExternal:true
                });
            });
        });
    }
}


$(document).on('pagebeforeshow', '#welcome-page', function(event, docdata){  //jqm 1.4
console.log('previous page was ' +docdata.prevPage.attr('id'));
    if ( docdata.prevPage.attr('id') == 'signin-page') {
        $(window).on("navigate", function (event, data) {
            var direction = data.state.direction;
            if (direction == 'back') {
                event.preventDefault();
                console.log('back button pressed');
                //$( "body" ).pagecontainer( "change", "#explanation-short", { transition: "fade" });
            }
            $(window).off("navigate");
        });
    }
});
    
    */