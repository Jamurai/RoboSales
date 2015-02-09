'use strict';

var contacts = require('../controllers/contacts');
var Multer = require('multer');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.contact.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Contacts, app, auth) {

  app.route('/contacts')
    .get(contacts.all)
    .post(auth.requiresLogin, contacts.create);

  app.route('/contacts/upload')
    .post(auth.requiresLogin, [Multer({dest:'./temp'}), contacts.upload]);

  app.param('contactId', contacts.contact);

};
