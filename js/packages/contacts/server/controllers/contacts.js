'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Contact = mongoose.model('Contact'),
  _ = require('lodash'),
  fs = require('fs'),
  Parse = require('csv-parse');


/**
 * Find contact by id
 */
exports.contact = function(req, res, next, id) {
  Contact.load(id, function(err, contact) {
    if (err) return next(err);
    if (!contact) return next(new Error('Failed to load contact ' + id));
    req.contact = contact;
    next();
  });
};

/**
 * Create an contact
 */
exports.create = function(req, res) {
  var contact = new Contact(req.body);
  contact.user = req.user;

  contact.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the contact'
      });
    }
    res.json(contact);

  });
};

var parseCSVFile = function(sourceFilePath, columns, onNewRecord, handleError, done){
    var source = fs.createReadStream(sourceFilePath);

    var linesRead = 0;
    var result = {};

    var parser = Parse({
        delimiter: ',',
        columns:columns
    });


    parser.on("readable", function(){
      var record;
        while (record = parser.read()) {
            linesRead++;
            onNewRecord(record);
        }
    });

    parser.on("error", function(error){
        handleError(error);
    });

    parser.on("end", function(){

        done(linesRead);
    });



    source.pipe(parser);
}

/**
 * Create an contact
 */
exports.upload = function(req, res,next) {

  var filePath = req.files.file.path;

    console.log(filePath);


    function onNewRecord(record){

        var contact = new Contact(record);
        contact.user = req.user;

        contact.save(function(err) {
          if (err) {
            //TODO




          } else {


          }


        });

    }

    function onError(error){
        console.log(error);
        return res.status(500).json({
          error: 'Cannot save the contact'
        });
    }

    function done(linesRead){
        Contact.find().sort('-created').exec(function(err, contacts) {
          if (err) {
            return res.status(500).json({
              error: 'Cannot list the contacts'
            });
          }
          res.json(contacts);

        });

    }



    var columns = true;
    parseCSVFile(filePath, columns, onNewRecord, onError, done);





/*  var contact = new Contact(req.body);
  contact.user = req.user;

  contact.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the contact'
      });
    }
    res.json(contact);

  });
*/
};


/**
 * Update an contact
 */
exports.update = function(req, res) {
  var contact = req.contact;

  contact = _.extend(contact, req.body);

  contact.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the contact'
      });
    }
    res.json(contact);

  });
};

/**
 * Delete an contact
 */
exports.destroy = function(req, res) {
  var contact = req.contact;

  contact.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the contact'
      });
    }
    res.json(contact);

  });
};

/**
 * Show an contact
 */
exports.show = function(req, res) {
  res.json(req.contact);
};

/**
 * List of contacts
 */
exports.all = function(req, res) {
  Contact.find().sort('-created').populate('user', 'firstname lastname').exec(function(err, contacts) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the contacts'
      });
    }
    res.json(contacts);

  });
};
