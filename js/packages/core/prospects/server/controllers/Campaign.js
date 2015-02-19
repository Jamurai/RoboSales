var gapis = require('googleapis');
var config = require('meanio').loadConfig();
var OAuth2 = gapis.auth.OAuth2
var oauth2Client = new OAuth2(config.google.clientID, config.google.clientSecret,config.google.callbackURL);
var gmailapi = gapis.gmail('v1');
var _ = require('lodash');
var Handlebars = require('handlebars');
var TAG = 'Campaign';
var Q = require('q');

var Campaign = function(prospects,templates) {

  this.prospects = prospects;
  this.templates = templates;
};

var sendEmailsToUsers = function(prospects,templates,callback){


  var self = this;
  var promises = [];

  var template = templates[0] || '';

  var htemplate = Handlebars.compile(template.body);

  _.each(prospects,function(prospect){

    var data = {'first_name': prospect.first_name || '',
                'last_name': prospect.last_name || ''
    };
    var layout = htemplate(data);
    console.log(TAG,'sendEmailsToUsers',layout);

    var options = {
      'to':prospect.email || '',
      'bcc':template.bcc || '',
      'subject': template.subject,
      'layout' : layout

    };
    promises.push(sendEmail(options));


  });

  Q.allSettled(promises)
  .then(function (results) {
    var errors = [];
    results.forEach(function (result) {
        if (result.state === "fulfilled") {
            var value = result.value;
        } else {
            errors.push(result.reason);
        }
    });

    if(errors.length == 0){
      callback(null,"Success");
    } else {
      callback(errors);
    }

  });



};

var sendEmail = function(options) {
  var email_lines = [];

  //email_lines.push("From: \"Some Name Here\" <rootyadaim@gmail.com>");
  email_lines.push('To: ' + options.to);
  email_lines.push('Content-type: text/html;charset=iso-8859-1');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push('Subject: ' + options.subject);
  email_lines.push('');
  email_lines.push(options.layout);


  var email =email_lines.join("\r\n").trim();

  var base64EncodedEmail = new Buffer(email).toString('base64');
  base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

  var params = {
    auth:oauth2Client,
    userId:'me',
    resource: {
      raw:base64EncodedEmail
      //threadId:"14b9da4698420d6f"
    }

  };

 var deferred = Q.defer();
 gmailapi.users.messages.send(params,function(err,response) {
   if(err) {
      deferred.reject(err);

   } else {
      deferred.resolve("Success");
   }

 });

 return deferred.promise;
}

Campaign.prototype.runcampaign = function(prospects,templates,user, callback) {





  oauth2Client.setCredentials({
          access_token: user.at || '',
          refresh_token: user.rt || ''
  });

/* oauth2Client.refreshAccessToken(function(err, tokens) {
  // your access_token is now refreshed and stored in oauth2Client
  // store these new tokens in a safe place (e.g. database)
    console.log(TAG,"RefreshTokens");
    if(err) {
      callback(err);
    } else {
      sendEmailsToUsers(prospects,templates,callback);
    }
  });*/

 sendEmailsToUsers(prospects,templates,callback);




};



module.exports = Campaign;
