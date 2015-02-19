'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateUniqueEmail = function(value, callback) {
  var Prospect = mongoose.model('Prospect');
  Prospect.find({
    $and: [{
      email: value
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
 * Article Schema
 */
var ProspectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    validate: [validateUniqueEmail, 'E-mail address is already in-use']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

/**
 * Validations
 */
ProspectSchema.path('first_name').validate(function(firstname) {
  return !!firstname;
}, 'First Name cannot be blank');
ProspectSchema.path('last_name').validate(function(lastname) {
  return !!lastname;
}, 'Last Name cannot be blank');



/**
 * Statics
 */
ProspectSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'first_name last_name').exec(cb);
};

mongoose.model('Prospect', ProspectSchema);
