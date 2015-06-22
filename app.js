var Hapi = require('hapi'),
    Path = require('path');

var server = new Hapi.Server();
server.connection({ port: 3300 });

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'views')
});

server.register([
    {
        register: require('./plugins/artefact')
    }
], function (err) {
    if (err) {
        console.error('Failed to load a plugin:', err);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
