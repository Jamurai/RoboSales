'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

  var Prospect = mongoose.model('Prospect'),
  Template = mongoose.model('Template'),
  _ = require('lodash'),
  fs = require('fs'),
  Parse = require('csv-parse'),
  TAG='Prospects',
  Campaign = require('./Campaign');
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

exports.runcampaign = function(req,res) {

  //var prospectPromise = Prospect.find({}).exec();
  //var templatePromise = Template.find({}).exec();

  //var templates = ["Hi {{first_name}}.. How are you."];

  //var templates = templatePromise.then(function(templates){

    //templates;
  //});
  
  Template.find({}).exec(function(err,templates) {

      if(err) {
        res.status(500).json({'error':err});
      }

      Prospect.find({}).exec(function(err,prospects) {  // <- this is the Promise interface.
            if(err) {
              res.status(500).json({'error':err});
            }
            var campaign = new Campaign(prospects,templates);
            campaign.runcampaign(prospects,templates,req.user,function(err,response){
              if(err) {
                res.status(500).json({'error':err});
              } else {
                res.status(200).json({ 'success':'Success'});
              }
            });
      });
  });
/*
  }, function(err) {
    console.log(TAG,'Run Campaign',err);
    res.status(500).json({'error':err});
  });*/


}
