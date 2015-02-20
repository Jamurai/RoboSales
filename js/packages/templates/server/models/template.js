'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateUniqueName = function(value, callback) {
  var Template = mongoose.model('Template');
  Template.find({
    $and: [{
      name: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, user) {
    callback(err || user.length === 0);
  });
};
/**
 * Template Schema
 */

var TemplateSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true,
    //validate: [validateUniqueName, 'Template Name already in-use']
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  cc: {
    type: String,

    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']

  },
  bcc: {
    type: String,

    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']

  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

/**
 * Validations
 */
TemplateSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');



/**
 * Statics
 */
TemplateSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'first_name last_name').exec(cb);
};

mongoose.model('Template', TemplateSchema);
