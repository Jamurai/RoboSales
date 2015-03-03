'use strict';



var settings = require('../controllers/settings');

// Setting authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.setting.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Settings, app, auth) {

  app.route('/settings')
    .get(settings.all)
    .post(auth.requiresLogin, settings.create);
  app.route('/settings/:settingId')
    .get(auth.isMongoId, settings.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroy);

// Finish with setting up the settingId param
  app.param('settingId', settings.setting);
};
