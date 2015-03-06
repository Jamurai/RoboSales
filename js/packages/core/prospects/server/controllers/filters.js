'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

  var Filter = mongoose.model('Filter'),
  _ = require('lodash'),
  fs = require('fs'),
  TAG='Filters';

/**
 * Find filter by id

 */
exports.filter = function(req, res, next, id) {
  
  Filter.load(id, function(err, filter) {
    if (err) return next(err);
    if (!filter) return next(new Error('Failed to load filter ' + id));
    req.filter = filter;
    next();
  });
};

/**
 * Create an filter
 */
exports.create = function(req, res) {
  var filter = new Filter(req.body);
  filter.user = req.user;

  filter.save(function(err) {
    if (err) {

      return res.status(500).json({
        error: 'Cannot save the filter'+err
      });
    }
    res.json(filter);

  });
};






/**
 * Update an filter
 */
exports.update = function(req, res) {
  var filter = req.filter;

  filter = _.extend(filter, req.body);

  filter.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the filter'
      });
    }
    res.json(filter);

  });
};

/**
 * Delete an filter
 */
exports.destroy = function(req, res) {
  var filter = req.filter;

  filter.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the filter'
      });
    }
    res.json(filter);

  });
};

/**
 * Show an filter
 */
exports.show = function(req, res) {
  res.json(req.filter);
};

/**
 * List of filters
 */
exports.all = function(req, res) {
  Filter.find({'user':req.user._id}).sort('-created').populate('user', 'firstname lastname').exec(function(err, filters) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the filters'
      });
    }
    res.json(filters);

  });
};
