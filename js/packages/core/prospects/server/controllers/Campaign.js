var gapis = require('googleapis');
var config = require('meanio').loadConfig();
var OAuth2 = gapis.auth.OAuth2
var oauth2Client = new OAuth2(config.google.clientID, config.google.clientSecret,config.google.callbackURL);
var gmailapi = gapis.gmail('v1');
var _ = require('lodash');
var Handlebars = require('handlebars');
var TAG = 'Campaign';
var Q = require('q');
 var URLSafeBase64 = require('urlsafe-base64');

var Campaign = function(prospects,templates) {

  this.prospects = prospects;
  this.templates = templates;
};

var sendEmailsToUsers = function(prospects,templates,settings,user,callback){


  var self = this;
  var promises = [];

  var template = templates[0] || '';
  var setting = settings[0] || '';

  var htemplate = Handlebars.compile(template.body);

  var stemplate = Handlebars.compile(setting.signature);
  var sdata = {'User_FirstName': setting.first_name || '',
               'User_LastName': setting.last_name || '',
               'User_Email': setting.email || '',
               'User_Phone': setting.phone || ''
  };
  var signaturelayout = stemplate(sdata);
  console.log(TAG,'sendEmailsToUsers',signaturelayout);

  _.each(prospects,function(prospect){

    var data = {'first_name': prospect.first_name || '',
                'last_name': prospect.last_name || ''
    };
    var layout = htemplate(data);
    console.log(TAG,'sendEmailsToUsers',layout);

    var options = {
      //'from':user.name || '',
      //'from' : 'Prakash Baskaran <prakashbask@gmail.com>',
      'from' : user.name + ' ' + '<' + user.email +'>',
      'to': prospect.first_name + ' ' + prospect.last_name + ' <' + prospect.email +'>',
      'bcc':setting.bcc || template.bcc || '',
      'subject': template.subject,
      'layout' : layout,
      'signaturelayout':signaturelayout

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

  email_lines.push('From: ' + options.from);
  email_lines.push('To: ' + options.to);
  email_lines.push('Bcc: ' + options.bcc);
  email_lines.push('Content-type: text/plain;charset=utf-8');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push('Subject: ' + options.subject);
  email_lines.push('');
  email_lines.push(options.layout);
  email_lines.push(options.signaturelayout);


  var email =email_lines.join("\r\n").trim();
  console.log(TAG,email);
  //var base64EncodedEmail = new Buffer(email).toString('base64');
  var base64EncodedEmail = URLSafeBase64.encode(new Buffer(email));
  console.log(TAG,"Before encoding",base64EncodedEmail);
//  base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

  console.log(TAG,"After Encoding",base64EncodedEmail);
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
      console.log(err);
      deferred.reject(err);

   } else {
      deferred.resolve("Success");
   }

 });

 return deferred.promise;
}

Campaign.prototype.runcampaign = function(prospects,templates,settings,user, callback) {





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

 sendEmailsToUsers(prospects,templates,settings,user,callback);




};



module.exports = Campaign;
