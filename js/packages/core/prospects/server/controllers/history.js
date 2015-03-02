'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

  var ImportHistory = mongoose.model('History'),
  _ = require('lodash'),
  fs = require('fs'),
  TAG='History';

/**
 * Find history by id

 */
exports.history = function(req, res, next, id) {
  ImportHistory.load(id, function(err, history) {
    if (err) return next(err);
    if (!history) return next(new Error('Failed to load history ' + id));
    req.history = history;
    next();
  });
};

/**
 * Create an history
 */
exports.create = function(req, res) {
  var history = new ImportHistory(req.body);
  history.user = req.user;

  history.save(function(err) {
    if (err) {

      return res.status(500).json({
        error: 'Cannot save the history'
      });
    }
    res.json(history);

  });
};






/**
 * Update an history
 */
exports.update = function(req, res) {
  var history = req.history;

  history = _.extend(history, req.body);

  history.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the history'
      });
    }
    res.json(history);

  });
};

/**
 * Delete an history
 */
exports.destroy = function(req, res) {
  var history = req.history;

  history.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the history'
      });
    }
    res.json(history);

  });
};

/**
 * Show an history
 */
exports.show = function(req, res) {
  res.json(req.history);
};

/**
 * List of historys
 */
exports.all = function(req, res) {
  ImportHistory.find({'user':req.user._id}).sort('-created').populate('user', 'firstname lastname').exec(function(err, historys) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the histories'
      });
    }
    res.json(historys);

  });
};
