var express = require('express');
var ai = require('./test/map');
var app = express();

app.use(express.static('html'));
app.post('/learn', function(req, res, next) {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        var input = decodeURIComponent(body);
        console.log('body', input);
        ai.learn(input);
        res.status(201).end('learned: ' + input);
    });
});

app.post('/predict', function(req, res, next) {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        ai.predict(body, req.query.steps).then(function(phrase) {
            res.send(phrase.join(' '));
        });
    });
});


app.listen(3001);
