'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose-q')(require('mongoose'));

  var Prospect = mongoose.model('Prospect'),
  Template = mongoose.model('Template'),
  Setting = mongoose.model('Setting'),
  ImportHistory = mongoose.model('History'),
  Q = require('q'),
  async = require('async'),
  _ = require('lodash'),
  fs = require('fs'),
  Parse = require('csv-parse'),
  TAG='Prospects',
  DUPLICATE_CODE=11000,
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
    var records = {
      'duplicate':0,
      'success':0,
      'failed':0
    }

    var result = {};
    var queue =[];
    var parser = Parse({
        delimiter: ',',
        columns:columns
    });


    parser.on("readable", function(){
      var record;

        while (record = parser.read()) {
            linesRead++;
            queue.push(onNewRecord(record));
        }



    });

    parser.on("error", function(error){
        handleError(error);
    });

    parser.on("end", function(){
        Q.allSettled(queue)
        .then(function (results) {
          var errors = [];
          results.forEach(function (result) {
              if (result.state === "fulfilled") {
                console.log("SAVED",result.state);
                var count = records['success'];
                records['success'] = count+1;

              } else {
                  //errors.push(result.reason);
                  console.log("SAVED",result.state);
                  if(result.reason.code && result.reason.code == DUPLICATE_CODE) {
                    var count = records['duplicate'];
                    records['duplicate'] = count+1;
                  } else {
                    var count = records['failed'];
                    records['failed'] = count+1;

                  }


              }
          });
          done(linesRead,records);
        });


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
        return prospect.saveQ();

    }

    function onError(error){
        console.log(error);
        return res.status(500).json({
          error: 'Cannot save the prospect'
        });
    }

    function done(linesRead,records){
      /*  Prospect.find({'user':req.user._id}).sort('-created').exec(function(err, prospects) {
          if (err) {
            return res.status(500).json({
              error: 'Cannot list the prospects'
            });
          }
          return res.status(200).json(prospects);

        });
      */
      var status = records.success + ' new, ' + records.duplicate + ' duplicate, ' + records.failed + ' failed';
      var history = new ImportHistory({
        'status': status,
        'user':req.user
      })
      history.saveQ()
      .then(function(result){

      })
      .catch(function(err){})
      .done(function() {
        ImportHistory.find({'user':req.user._id}).sort('-created').exec(function(err, historyitems) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot list the import history'
              });
            }
            return res.status(200).json(historyitems);

          });
      });

    }



    var columns = function(headerline) {
      console.log(TAG,"headerline",headerline);

      var remap;

      try {
          remap = JSON.parse(req.body.remap);
      }catch (err){
        console.log(err);
      }

      for(var i=0; i < headerline.length; i++) {

          var column = headerline[i];
          if(remap[column]){

            headerline[i] = remap[column];
            console.log("column",column);

          }
      };
      console.log("headerlinemodified",headerline);
      return headerline;

    };
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

var constructQuery = function(query,filterset){
  //$where : 'this.favouriteFoods.indexOf("sushi") != -1'
  //'equals','not equal to','starts with','contains','does not contain','less than','greater than'


  var operatorMap = {
    'equals':'$in',
    'not equal to': '$nin',
    'starts with':['$where','== 0'],
    'contains':['$where','!= -1'],
    'does not contain':['$where','== -1'],
    'less than':'$lt',
    'greater than':'$gt'
  }

  /*
  var filtersetObj =[];
  try {
     var parsedObj = JSON.parse(filterset);

     console.log(typeof parsedObj,parsedObj);
     if(typeof parsedObj == 'object') {
       filtersetObj.push(parsedObj);
     }
  } catch(err) {
    console.log(err);

  }
  */


  //var subquery = '$and:[ {' +   ;

  //console.log(TAG,"FilterSet",filtersetObj);

  if(filterset && filterset.length > 0) {
      query['$and'] = [];

    _.each(filterset, function(filter){
        var fieldname = filter['field'];
        var operator = operatorMap[filter['operator']];
        var value = filter['value'];
        var filterObj = {};
        if((typeof operator == "string") && (operator == '$in' || operator == '$nin')) {
          filterObj[fieldname]= {};
          var values=[];
          values.push(value);
          filterObj[fieldname][operator]=values
        } else if((typeof operator == "string") && (operator == '$lt' || operator == '$gt'))  {
          filterObj[fieldname]= {};
          filterObj[fieldname][operator]=value


        } else if((typeof operator == "object") && operator[0] == "$where") {
            filterObj[operator[0]] = 'this.' + fieldname +'.indexOf("'+value+'")' + operator[1];
        }



        //filterObj[fieldname]['$not']ex']= value;
        //filterObj[fieldname][operator]=value;

        query['$and'].push(filterObj);



      //var squery = '{' + filter['field'] + ':{' + operatorMap[filter['operator']] + ':' + filter['value'] + '}}';
      //subquery = subquery + ',' + squery;


    });

  }

  console.log(TAG,JSON.stringify(query));

  return query;

}
/**
 * List of prospects
 */
exports.search = function(req, res) {

  var query = {'user':req.user._id};
  console.log(TAG,req.body);

  if(req.body && req.body.filterset){
    query = constructQuery(query,req.body.filterset)
  }
  Prospect.find(query).sort('-created').populate('user', 'firstname lastname').exec(function(err, prospects) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the prospects' + err
      });
    }
    res.json(prospects);

  });
};


exports.all = function(req, res) {

  var query = {'user':req.user._id};

  Prospect.find(query).sort('-created').populate('user', 'firstname lastname').exec(function(err, prospects) {
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


  async.waterfall([
    function(cb) {
      Template.find({'user':req.user._id}).exec(function(err,templates) {
          if(err) {
             cb(err);
          } else {
            cb(null,templates);
          }
      });
    },
    function(templates,cb) {

      Setting.find({'user':req.user._id}).exec(function(err,settings) {

          if(err) {
             cb(err);
          } else {
            cb(null,templates,settings);
          }
      });
    },
    function(templates,settings,cb) {

      Prospect.find({'user':req.user._id}).exec(function(err,prospects) {
        if(err) {
           cb(err);
         } else {
          cb(null,templates,settings,prospects);
        }
      });


    },
    function(templates,settings,prospects,cb){
      var campaign = new Campaign(prospects,templates,settings);
      campaign.runcampaign(prospects,templates,settings,req.user,function(err,response){
        if(err) {
          cb(err);
        } else {
          cb(null,'Done');
        }
      });
    }
  ],function(err,results){

    if(err) {
      res.status(500).json({'error':err});
    } else {
      res.status(200).json({ 'success':'Success'});
    }


  });



};
