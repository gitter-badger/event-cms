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
    path: Path.join(__dirname, 'views'),
    layout: true
});

var EventEmitter = events.EventEmitter;
var emitter = new EventEmitter();
var events = [];

emitter.on('create', function(data) {
      console.log(sf('Created {content} content item {id}', data));
      events.push({event: 'create', data: data});
});

emitter.on('update', function(data) {
      console.log(sf('Updated attribute {attribute} of content item {content}#{id} to be "{value}"', data));
      events.push({event: 'update', data: data});
});

server.route({
    method: 'GET',
    path: '/feed',
    handler: function (request, reply) {
        reply(events);
        events = [];
    }
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
