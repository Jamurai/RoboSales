'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var HistorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});



//HistorySchema.index({user: 1, email: 1}, {unique: true});

/**
 * Statics
 */
HistorySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'first_name last_name').exec(cb);
};

mongoose.model('History', HistorySchema);
