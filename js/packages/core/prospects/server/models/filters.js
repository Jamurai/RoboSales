'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var FilterSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  filterset: [],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

/**
 * Validations
 */
FilterSchema.path('name').validate(function(name) {
  return !!name;
}, 'Filter Name cannot be blank');

//FilterSchema.index({user: 1, email: 1}, {unique: true});

/**
 * Statics
 */
FilterSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'first_name last_name').exec(cb);
};

mongoose.model('Filter', FilterSchema);
