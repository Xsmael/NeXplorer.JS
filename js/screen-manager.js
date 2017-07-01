    var GUI = require('nw.gui');
        var WIN= GUI.Window.get();
        WIN.maximize();
 $(function(){
    nw.Screen.Init();

    var LIVE_SCREEN;
    var LIVE_MONITOR_OFFSET=0;
    var LIVE_SCREEN_PATH='live.html';

    function ScreenToString(screen) {
        var string = "";
        string += "screen " + screen.id + " ";
        var rect = screen.bounds;
        string += "bound{" + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height + "} ";
        rect = screen.work_area;
        string += "work_area{" + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height + "} ";
        string += " scaleFactor: " + screen.scaleFactor;
        string += " isBuiltIn: " + screen.isBuiltIn;
        string += "<br>";
        return string;
    }

    function liveScreenOffset() {
        var screens = nw.Screen.screens;
        for(var i=0; i<screens.length ; i++) {
            
            var x= screens[i].bounds.x;
            if(x != 0 ) //if not the main screen
            {
                return x;
            }
        }
    }



        /** Window controls */

        // Min
        $('#windowControlMinimize').click(function()  {
            WIN.minimize();
        });
        // Close
        $('#windowControlClose').click( function() {
            WIN.close();
        });

        // Max
        $('#windowControlMaximize').click( function() {
            if (WIN.isMaximized)
                WIN.unmaximize();
            else
                WIN.maximize();
        });

        WIN.on('maximize', function(){
            WIN.isMaximized = true;
        });

        WIN.on('unmaximize', function(){
            WIN.isMaximized = false;
        });

    GUI.Window.open(LIVE_SCREEN_PATH, {
        frame: false,
        //always_on_top: true,
        show: false,
        fullscreen:true
    }, function (newWindow) {

        newWindow.on('loaded', function () {
            var x;
            newWindow.enterFullscreen();
            LIVE_MONITOR_OFFSET = liveScreenOffset();
            newWindow.moveTo(LIVE_MONITOR_OFFSET, 0);

            setTimeout(function() {
                newWindow.show();
            }, 500);
        });

        LIVE_SCREEN= newWindow;
    });


    var screenCB = {
        onDisplayBoundsChanged: function (screen) {
            console.log('displayBoundsChanged ' + JSON.stringify(screen));
        },

        onDisplayAdded: function (screen) {
            console.log('displayAdded ' + JSON.stringify(screen));
            setTimeout(function(){
                LIVE_SCREEN.show();            
                LIVE_SCREEN.moveTo(LIVE_MONITOR_OFFSET, 0);
            },5000);
        },

        onDisplayRemoved: function (screen) {
            console.log('displayRemoved ' + JSON.stringify(screen));
            LIVE_SCREEN.hide();
        }
    };
    // listen to screen events
    nw.Screen.on('displayBoundsChanged', screenCB.onDisplayBoundsChanged);
    nw.Screen.on('displayAdded', screenCB.onDisplayAdded);
    nw.Screen.on('displayRemoved', screenCB.onDisplayRemoved);

});