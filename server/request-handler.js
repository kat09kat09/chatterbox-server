/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var obj = { results: [] };

exports.requestHandler = function(request, response, body) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('what is body', body);
  console.log("Serving request type " + request.method + " for url " + request.url);


  // console.log('what is request',request);

  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/JSON";


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);
  console.log('request.url value: ', request.url);
  if ( request.url !== '/classes/messages') {
    console.log('getting stuck at 404');
    response.writeHead(404);
    response.end();
  }
  //*********example from online website
  if(request.method == 'OPTIONS') {
    console.log('options response');
     response.writeHead(200, {'Content-Type': 'application/json',
                              'Accept': 'application/json',
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                              "Access-Control-Allow-Headers": "content-type, accept",
                              "Access-Control-Max-Age": 10
      });
     response.end(JSON.stringify({ results: []  }));

  } else if (request.method == 'POST') {
    //console.log('post response');

    // pipe the request data to the console
    // request.pipe(process.stdout);
    // var obj = {results: []};

    // pipe the request data to the response to view on the web
    response.writeHead(201, {'Content-Type': 'application/json'});

    request.on('data', function(chunk) {
      console.log("Received body data:", typeof JSON.parse(chunk.toString('utf8')));
      obj['results'].push(JSON.parse(chunk.toString('utf8')));



    });
    response.end(JSON.stringify(obj));

  } else {
    console.log('everything else response');
    // for GET requests, serve up the contents in 'index.html'
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(obj));
  }

  ///*************

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end(JSON.stringify({ a: 1 }));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

