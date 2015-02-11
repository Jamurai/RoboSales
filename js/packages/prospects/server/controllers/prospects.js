'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Prospect = mongoose.model('Prospect'),
  _ = require('lodash'),
  fs = require('fs'),
  Parse = require('csv-parse');


/**
 * Find prospect by id
 */
exports.prospect = function(req, res, next, id) {
  Prospect.load(id, function(err, prospect) {
    if (err) return next(err);
    if (!prospect) return next(new Error('Failed to load prospect ' + id));
    req.prospect = prospect;
    next();
  });
};

/**
 * Create an prospect
 */
exports.create = function(req, res) {
  var prospect = new Prospect(req.body);
  prospect.user = req.user;

  prospect.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the prospect'
      });
    }
    res.json(prospect);

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
 * Create an prospect
 */
exports.upload = function(req, res,next) {

  var filePath = req.files.file.path;

    console.log(filePath);


    function onNewRecord(record){

        var prospect = new Prospect(record);
        prospect.user = req.user;

        prospect.save(function(err) {
          if (err) {
            //TODO




          } else {


          }


        });

    }

    function onError(error){
        console.log(error);
        return res.status(500).json({
          error: 'Cannot save the prospect'
        });
    }

    function done(linesRead){
        Prospect.find().sort('-created').exec(function(err, prospects) {
          if (err) {
            return res.status(500).json({
              error: 'Cannot list the prospects'
            });
          }
          res.json(prospects);

        });

    }



    var columns = true;
    parseCSVFile(filePath, columns, onNewRecord, onError, done);





/*  var prospect = new Prospect(req.body);
  prospect.user = req.user;

  prospect.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the prospect'
      });
    }
    res.json(prospect);

  });
*/
};


/**
 * Update an prospect
 */
exports.update = function(req, res) {
  var prospect = req.prospect;

  prospect = _.extend(prospect, req.body);

  prospect.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the prospect'
      });
    }
    res.json(prospect);

  });
};

/**
 * Delete an prospect
 */
exports.destroy = function(req, res) {
  var prospect = req.prospect;

  prospect.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the prospect'
      });
    }
    res.json(prospect);

  });
};

/**
 * Show an prospect
 */
exports.show = function(req, res) {
  res.json(req.prospect);
};

/**
 * List of prospects
 */
exports.all = function(req, res) {
  Prospect.find().sort('-created').populate('user', 'firstname lastname').exec(function(err, prospects) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the prospects'
      });
    }
    res.json(prospects);

  });
};
