        function ScreenToString(screen) {
            var string = "";
            //string += "screen id:" + screen.id + " ";
            var rect = screen.bounds;
            string += "<br>bound{" + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height + "} ";
            rect = screen.work_area;
            string += "<br>work_area{" + rect.x + ", " + rect.y + ", " + rect.width + ", " + rect.height + "} ";
            //string += "\nscaleFactor: " + screen.scaleFactor;
            //string += "\nisBuiltIn: " + screen.isBuiltIn;  
            //string += " \n\n";         
            return string;
        }

        function getScreensDetails() { 
            var string = [];
            var screens = gui.Screen.screens;
            // store all the screen information into string
            for (var i=0; i<screens.length; i++) {
                string.push( ScreenToString(screens[i]));
            }
            return string;
        }
        function updateScreens(screen) {
            var out = getScreensDetails();
            var screensLabel="";
            out.forEach(function(element) {
                screensLabel+=`<div class="row">
                    <div class="col-xs-6">  
                        <a class="btn btn-block btn-default" href="#" role="button">`+out[0]+`</a>
                    </div>
                    <div class="col-xs-6">  
                        <a class="btn btn-block btn-default" href="#" role="button">`+out[1]+`</a>                                  
                    </div>
                </div>` 
            }, this);
            var dialog = bootbox.dialog({
                    title: 'A custom dialog with init',
                    message: screensLabel
                });
        }


        var gui = require('nw.gui');
        var win = gui.Window.get();

       // gui.Window.open('live.html');
        
        win.isMaximized = false;
        gui.Screen.Init();
       

        var screenCB = {
        onDisplayBoundsChanged: function(screen) {
            var out = "OnDisplayBoundsChanged " + ScreenToString(screen);
            console.log(out);
        },

        onDisplayAdded: function(screen) { updateScreens(screen) },

        onDisplayRemoved: function(screen) { updateScreens(screen) }
        };

        // listen to screen events
        gui.Screen.on('displayBoundsChanged', screenCB.onDisplayBoundsChanged);
        gui.Screen.on('displayAdded', screenCB.onDisplayAdded);
        gui.Screen.on('displayRemoved', screenCB.onDisplayRemoved);
