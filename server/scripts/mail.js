var models = require('../server').models;
const async = require("async")
console.log(Object.keys(models));
var Email = models.Email;

var sendEmail = function(data, cb) {
  var subjecText = new Date();
  var contactUserOption = {
    type: 'email',
    to: '',
    from: "rtr.riteshvish@gmail.com",
    subject: 'subject',
    html: "<h1>Test</h1>"
  };
  if (contactUserOption) {
    var listOfEmails = ["rtr.riteshvish@gmail.com"];
    async.each(listOfEmails, function(email, eachcb) {
      contactUserOption.to = email;
      Email.send(contactUserOption, function(err, result) {
        console.log(err);
        console.log(result);
        eachcb(err, result)
      });
    }, function(err, results) {
      cb(err, results)
    })

  }
}

sendEmail({},(err,data)=>{
  console.log(err,data);
})
