var express = require('express'),
    helmet = require('helmet'),
    marked = require('marked'),
    fs = require('fs'),
    app = express(),
    port = process.env.PORT || 8080,
    md = function(filename) {
        return marked(fs.readFileSync(__dirname + '/' + filename, 'utf8'));
    };
    
app.use(helmet());
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/api/whoami/', function(req, res) {
    var data = {};
    
    data.ipaddress = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     
    data.language = req.headers['accept-language'].split(',')[0].toLocaleLowerCase();
    data.software = req.headers['user-agent'].split('(')[1].split(')')[0];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
});

app.get('/LICENSE', function(req, res) {
    res.render('license', {title: 'Request Header Parser Microservice', md: md});
});

app.get('/', function(req, res) {
    res.render('index', {title: 'Request Header Parser Microservice', md: md});
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, function() {
    console.log('Request Header Parser Microservice running on ' + port); 
});