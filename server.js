
const express = require('express');
const app = express();
const https = require('https');
var path = require('path');

var token = process.env.BOTTOKEN;



app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

app.get('/file/:file/:name*?', function(req, res, next) {
  var file = req.params['file'];
  var request = require('request');

  request({url: 'https://api.telegram.org/bot'+token+'/getFile?file_id='+file, json: true}, function(err, resp, json) { //example file: AgADAgAD8aoxGwfwEUjVY2GIae1pEnu8UQ8ABDUSugqKHJo5Ie8AAgI
    if(err){
      throw err;
    }
    console.log(json);
    if(json.ok){
      var file_path = 'https://api.telegram.org/file/bot'+token+'/'+json.result.file_path;
      var file_name = path.basename(json.result.file_path);
      
      if(!file_name.includes('.')){
        file_name = req.params['name'];
      }

      https.get(file_path, (response) => {
        res.attachment(file_name);
        response.pipe(res);
      });
    }else{
      res.send('Error - file not found');
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
