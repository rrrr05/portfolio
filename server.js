var http = require('http');
var fs = require('fs');

var DIR = 'C:\\Users\\\u043f\u043a1\\Desktop\\portfolio';
var PORT = 8080;

var types = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  ico: 'image/x-icon'
};

http.createServer(function(req, res) {
  var url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';

  var file = DIR + url;
  var ext = url.split('.').pop().toLowerCase();

  fs.readFile(file, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('<h1>404</h1><a href="/">Home</a>');
      return;
    }
    res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', function() {
  console.log('');
  console.log('  OK! Open in ANY browser:');
  console.log('  http://127.0.0.1:' + PORT);
  console.log('  http://localhost:' + PORT);
  console.log('');
});
