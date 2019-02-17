'use strict'
let counter=0;
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

    Users.observe('after save', function event (ctx, next) {
      const { Role, RoleMapping } = Users.app.models
      Role.findOne({ name: ctx.instance.role }, (err, data) => {
        console.log("here",counter++);
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

    // console.log(dataSource);

    //  Users.getDataSource().connector.connect(function (err, db) {
    //        var collection = db.collection('Users'); //name of db collection
    //        console.log(Object.keys(Users.app.models));
    //        collection.find(function(err, res){
    //          res.toArray(function(err, realRes){
    //            console.log(realRes);
    //          });
    //        });
    // });

    // Observe any insert/update event on Model
    // if (ctx.instance) {
    //   ctx.instance.createdAt = new Date()
    //   ctx.instance.createdBy = ctx.options.accessToken.userId
    //   ctx.instance.updatedAt = new Date()
    //   ctx.instance.updatedBy = ctx.options.accessToken.userId
    // } else {
    //   ctx.data.updatedAt = new Date()
    //   ctx.data.updatedBy = ctx.options.accessToken.userId
    // }
  })
}
