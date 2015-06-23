var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;
var validators = forms.validators;

var form = forms.create({
    title: fields.string({ required: true }),
    description: fields.string({ required: true }),
    theme: fields.string({
      required: true,
      widget: widgets.color()
    }),
    image: fields.url()
});

var artefact = {
    register: function (server, options, next) {

      server.expose('form', form);

      server.route({
          method: 'GET',
          path: '/artefact',
          handler: function (request, reply) {
            reply.view('artefact', {form: form.toHTML()});
          }
      });

      server.route({
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
      })

      next();
    }
}

artefact.register.attributes = {
    name: 'artefact',
    version: '1.0.0'
};

module.exports = artefact;
