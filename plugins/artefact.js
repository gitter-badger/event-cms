var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;
var validators = forms.validators;

var form = forms.create({
    title: fields.string({ required: true }),
    description: fields.string({ required: true }),
    theme: widgets.color(),
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
        handler: function(request, reply) {
          form.handle(request.request, {
              success: function (form) {
                console.log('yep');
                  // form.data contains the submitted data

              },
              error: function (form) {
                  reply.view('artefact', form.toHTML());
              },
              empty: function (form) {
                console.log('form empty');
                  // there was no form data in the request
              }
          });
        }
      })

      // register events

        next();
    }
}

artefact.register.attributes = {
    name: 'artefact',
    version: '1.0.0'
};

module.exports = artefact;
