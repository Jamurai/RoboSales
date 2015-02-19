'use strict';

var prospects = require('../controllers/prospects');
var Multer = require('multer');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {

  if (!req.user.isAdmin && req.prospect.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Prospects, app, auth) {

  app.route('/prospects')
    .get(prospects.all)
    .post(auth.requiresLogin, prospects.create);

  app.route('/prospects/upload')
    .post(auth.requiresLogin, [Multer({dest:'./temp'}), prospects.upload]);

  app.route('/prospects/runcampaign')
        .post(auth.requiresLogin,hasAuthorization, prospects.runcampaign);

  app.route('/prospects/:prospectId')
      .get(auth.isMongoId, prospects.show)
      .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, prospects.update)
      .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, prospects.destroy);


  app.param('prospectId', prospects.prospect);

};
