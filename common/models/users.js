'use strict'
let counter=0;
let app = require('../../server/server');
module.exports = function (Users) {
  const roles = []
  Users.validatesInclusionOf('role', { 'in': roles })

  Users.observe('before save', function event (ctx, next) {
    const { Role } = Users.app.models
    Role.find({}, (err, data) => {
      if (err) { return next(err) }
      for (var i = 0; i < data.length; i++) { roles.push(data[i]['name']) }
      next()
    })
  })
/*
db.Users.remove({})
db.RoleMapping.remove({})

    //  Users.getDataSource().connector.connect(function (err, db) {
    //        var collection = db.collection('Users'); //name of db collection
    //        console.log(Object.keys(Users.app.models));
    //        collection.find(function(err, res){
    //          res.toArray(function(err, realRes){
    //            console.log(realRes);
    //          });
    //        });
    // });

*/
Users.observe('after save', function event (ctx, next) {
    const { Role, RoleMapping } = Users.app.models
    const role=(ctx.instance.role).toString()
    Role.findOne({where: {name:role}} , (err, data) => {
      if (err) { return next(err) }
      data.principals.create({
        principalType: RoleMapping.USER,
        principalId: ctx.instance.id
      }, function (err, principal) {
        if (err) { return next(err) }
        next()
      })
    })
  })
}
