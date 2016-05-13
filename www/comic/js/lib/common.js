var host			=	"http://www.comikka.com/";
var REST_SERVER 	= 	host + "services/data/";
var IMAGE_SERVER	= 	host + "services/image/";
var QUERY_SERVER 	= 	host + "services/query/"; 
var EXPORT_SERVER 	= 	host + "export";
var S3_BUCKETURL	= 	"https://s3.amazonaws.com/Comikka-Resources/Comikka/artImages/";
var REPORT_SERVER 	= 	host + "services/returnData/";

  /*  $(document).on('backbutton',
     function(e){ 
         alert('going to call the exit method from jQuery mobile callback.....');
        exitAppPopup();
    }); 
*/
/*    $(window).on("navigate", function (event, data) {
        alert('going to call the exit method from jQuery mobile callback.....');
        var direction = data.state.direction;
        alert('direction : ' + direction);
        if (!!direction) {
            if (direction == 'back') {            
                exitAppPopup();
            }  
        }else{
             alert('no direction  ');
        }
    });  */
    

    
    $(document).bind('keydown', function(event) {
        alert('hiiii' + event.keyCode);
        if (event.keyCode == 27) { //back button
            event.preventDefault();
            alert('back button pressed');
            exitAppPopup();
        }
    }); 

    function exitAppPopup() {
        alert('going to prompt the exit dialog..');
        navigator.notification.confirm(
            "Do you really want to close this app?", 
            function(buttonIndex){
                ConfirmExit(buttonIndex);
            }, 
            "Confirmation", 
            "Yes,No"
        ); 
    };

    function ConfirmExit(stat){
        if(stat == "1"){
             alert('exiting.....');
            navigator.app.exitApp();
        }else{
            return;
        };
    };