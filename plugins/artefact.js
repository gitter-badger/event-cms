var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;
var validators = forms.validators;

var eventer;

var form = forms.create({
    title: fields.string({ required: true }),
    description: fields.string({ required: true }),
    theme: fields.string({ required: true, widget: widgets.color() }),
    image: fields.url()
});

var getArtefact = {
    method: 'GET',
    path: '/artefact',
    handler: function (request, reply) {
      reply.view('artefact', {form: form.toHTML()});
    }
};

var postArtefact = {
  method: 'POST',
  path: '/artefact',
  config: {
    payload: {
      parse: true
    }
  },
  handler: function(request, reply) {

    form.handle(request.payload, {
        success: function (form) {
          eventer.emit('create', {content: 'artefact', id: 'dummy-id'});
          eventer.emit('update', {content: 'artefact', id: 'dummy-id', attribute: 'title', value: form.data.title});
          eventer.emit('update', {content: 'artefact', id: 'dummy-id', attribute: 'description', value: form.data.description});
          eventer.emit('update', {content: 'artefact', id: 'dummy-id', attribute: 'theme', value: form.data.theme});
          eventer.emit('update', {content: 'artefact', id: 'dummy-id', attribute: 'image', value: form.data.image});
          reply('cool');
        },
        error: function (form) {
            reply.view('artefact', {form: form.toHTML()});
        },
        empty: function (form) {
            reply('empty');
        }
    });

  }
};

var artefact = {
    register: function (server, options, next) {

      eventer = options.eventer;

      server.route(getArtefact);
      server.route(postArtefact);

      next();
    }
}

artefact.register.attributes = {
    name: 'artefact',
    version: '1.0.0'
};

module.exports = artefact;
