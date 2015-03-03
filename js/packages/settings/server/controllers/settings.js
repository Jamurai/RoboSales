'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Setting = mongoose.model('Setting'),
  _ = require('lodash');


/**
 * Find setting by id
 */
exports.setting = function(req, res, next, id) {
  Setting.load(id, function(err, setting) {
    if (err) return next(err);
    if (!setting) return next(new Error('Failed to load setting ' + id));
    req.setting = setting;
    next();
  });
};

/**
 * Create an setting
 */
exports.create = function(req, res) {
  console.log(req.body);
  var setting = new Setting(req.body);
  setting.user = req.user;

  setting.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Cannot save the setting'
      });
    }
    res.json(setting);

  });
};

/**
 * Update an setting
 */
exports.update = function(req, res) {
  var setting = req.setting;

  setting = _.extend(setting, req.body);

  setting.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the setting'
      });
    }
    res.json(setting);

  });
};
/**
 * Delete an setting
 */
exports.destroy = function(req, res) {
  var setting = req.setting;

  setting.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the setting'
      });
    }
    res.json(setting);

  });
};


/**
 * Show an setting
 */
exports.show = function(req, res) {
  res.json(req.setting);
};

/**
 * List of Settings
 */
exports.all = function(req, res) {
  Setting.find({'user':req.user._id}).sort('-created').populate('user', 'name username').exec(function(err, settings) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the settings'
      });
    }
    res.json(settings);

  });
};
