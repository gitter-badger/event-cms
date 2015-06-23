var Hapi = require('hapi'),
    Path = require('path'),
    events = require('events'),
    sf = require('sf');

var server = new Hapi.Server();
server.connection({ port: 3300 });

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'views')
});

var EventEmitter = events.EventEmitter;
var emitter = new EventEmitter();

emitter.on('create', function(data){
      console.log(sf('Created {content} content item {id}', data));
});

emitter.on('update', function(data){
      console.log(sf('Updated attribute {attribute} of content item {content}#{id} to be "{value}"', data));
});

server.register([{
    register: require('./plugins/artefact'),
    options: {
      eventer: emitter
    }
}], function (err) {

    if (err) {
        console.error('Failed to load a plugin:', err);
    }

});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
