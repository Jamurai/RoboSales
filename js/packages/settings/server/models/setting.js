'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateUniqueName = function(value, callback) {
  var Setting = mongoose.model('Setting');
  Setting.find({
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
 * Setting Schema
 */

var SettingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
    //validate: [validateUniqueName, 'Setting Name already in-use']
  },
  last_name: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,

    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']

  },
  signature: {
    type: String,
    trim: true
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
SettingSchema.path('first_name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');



/**
 * Statics
 */
SettingSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'first_name last_name').exec(cb);
};

mongoose.model('Setting', SettingSchema);
