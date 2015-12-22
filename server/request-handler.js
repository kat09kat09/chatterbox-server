/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var obj = { results: [] };
var fs = require('fs');
var express= require('express');
var app= express();

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var server= app.listen(3000, 'localhost', function (){
  console.log(server.address());
  var host= server.address().address;
  var port= server.address().port;
  console.log("Listening on http://" + host + ":" + port);

});

app.route('/classes/messages')
  .get(function(req, res) {
     fs.readFile('./messages.js', function (err,data) {
      // if(err) console.log(err);
      var messageList = data.toString('utf8')
                            .split('\n')
                            .slice(0,-1)
                            .map(function(item) {
                              if(item) {
                                  return JSON.parse(item);
                              }
                            });
      var obj= {results: messageList};
      res.set(defaultCorsHeaders);
      res.send(obj);
    });
  })
  .post(function(req, res) {
    res.set(defaultCorsHeaders);
    req.on('data', function(chunk) {
      console.log('it gets here');
      var message = JSON.parse(chunk.toString('utf8'));
      obj['results'].push(message);
      fs.appendFile('./messages.js', JSON.stringify(message)+'\n', function() {
        console.log('hey im done appending');
      });
    });
    res.send(JSON.stringify(obj));
  })
  .options(function (req, res) {
    res.set(defaultCorsHeaders);
    res.send(JSON.stringify(obj));
  });

app.use(function(err, req, res, next) {
  console.log('cant find it');
  console.error(err.stack);
  res.status(404).send('Sorry cant find that!');
});

// exports.requestHandler = function(request, response, body) {
//   // Request and Response come from node's http module.
//   //
//   // They include information about both the incoming request, such as
//   // headers and URL, and about the outgoing response, such as its status
//   // and content.
//   //
//   // Documentation for both request and response can be found in the HTTP section at
//   // http://nodejs.org/documentation/api/

//   // Do some basic logging.
//   //
//   // Adding more logging to your server can be an easy way to get passive
//   // debugging help, but you should always be careful about leaving stray
//   // console.logs in your code.
//   // console.log('what is body', body);
//   console.log("Serving request type " + request.method + " for url " + request.url);

//   // See the note below about CORS headers.
//   var headers = defaultCorsHeaders;

//   headers['Content-Type'] = "application/json";

//   // .writeHead() writes to the request line and headers of the response,
//   // which includes the status and all headers.

//   //If the url doesn't exist, then serve a 404
//   if ( request.url !== '/classes/messages') {
//     response.writeHead(404);
//     response.end();
//   }



//   // Make sure to always call response.end() - Node may not send
//   // anything back to the client until you do. The string you pass to
//   // response.end() will be the body of the response - i.e. what shows
//   // up in the browser.
//   //
//   // Calling .end "flushes" the response's internal buffer, forcing
//   // node to actually send all the data over to the client.
// };

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


