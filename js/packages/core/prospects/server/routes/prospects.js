'use strict';

var prospects = require('../controllers/prospects');
var filters = require('../controllers/filters');
var history = require('../controllers/history');
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

  app.route('/prospects/filters')
    .get(filters.all)
    .post(auth.requiresLogin, filters.create);

  app.route('/prospects/filters/:filterId')
      .get(auth.isMongoId, filters.show)
      .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, filters.update)
      .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, filters.destroy);

  app.route('/prospects/history')
    .get(history.all);

  app.route('/prospects/search')
      .post(prospects.search);

  app.route('/prospects/runcampaign')
        .post(auth.requiresLogin,hasAuthorization, prospects.runcampaign);

  app.route('/prospects/:prospectId')
      .get(auth.isMongoId, prospects.show)
      .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, prospects.update)
      .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, prospects.destroy);


  app.param('filterId',filters.filter);
  app.param('prospectId', prospects.prospect);


};
