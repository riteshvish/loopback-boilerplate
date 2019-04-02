// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var config = require('../../server/config.json');
var path = require('path');

//Replace this address with your actual address
var senderAddress = 'sender@email.id';

module.exports = function(User) {
  //send verification email after registration
  User.afterRemote('create', function(context, user, next) {
    var options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, function(err, response) {
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  // Method to render
  User.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent '+
        'to your email successfully',
      content: 'Please check your email and click on the verification link '+
        'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  //render UI page after password change
  User.afterRemote('changePassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password changed successfully',
      content: 'Please login again with new password',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //render UI page after password reset
  User.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });
};

// 'use strict'
// const path = require("path")
// module.exports = function (Users) {
//   const roles = []
//
//   //send verification email after registration
//   Users.afterRemote('create', function(context, userInstance, next) {
//     console.log('> Users.afterRemote triggered');
//
//     var verifyOptions = {
//       type: 'email',
//       to: userInstance.email,
//       from: 'noreply@loopback.com',
//       subject: 'Thanks for registering.',
//       template: path.resolve(__dirname, '../../server/views/verify.ejs'),
//       redirect: '/verified',
//       user: userInstance
//     };
//
//     userInstance.verify(verifyOptions, function(err, response, next) {
//       if (err) return next(err);
//
//       console.log('> verification email sent:', response);
//
//       context.res.render('response', {
//         title: 'Signed up successfully',
//         content: 'Please check your email and click on the verification link ' -
//             'before logging in.',
//         redirectTo: '/',
//         redirectToLinkText: 'Log in'
//       });
//     });
//   });
//   Users.validatesInclusionOf('role', { 'in': roles })
//
//   Users.observe('before save', function event (ctx, next) {
//     const { Role } = Users.app.models
//     Role.find({}, (err, data) => {
//       if (err) { return next(err) }
//       for (var i = 0; i < data.length; i++) { roles.push(data[i]['name']) }
//       next()
//     })
//   })
//
//   Users.observe('after save', function event (ctx, next) {
//     const { Role, RoleMapping } = Users.app.models
//     const role = (ctx.instance.role).toString()
//     Role.findOne({ where: { name: role } }, (err, data) => {
//       if (err) { return next(err) }
//       data.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: ctx.instance.id
//       }, function (err, principal) {
//         if (err) { return next(err) }
//         next()
//       })
//     })
//   })
//
//
// }
