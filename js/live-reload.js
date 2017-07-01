 /* Auto-reload script */
       
// var path = './';
// var fs = require('fs');

// fs.watch(path, { recursive: true }, function() {
//     if (location)
//     location.reload();
// });

  var path = './';
  var fs = require('fs');

  fs.watch(path, function() {
    if (location)
      location.reload();
  });