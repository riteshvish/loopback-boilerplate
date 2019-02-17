// 5c66e0f480daf56f76d34066
// Role.create({
//       name: 'admin'
//     }, function(err, role) {
//       if (err) cb(err);
//
//       adminUsers.forEach(function(admin){
//           //make bob an admin
//           role.principals.create({
//             principalType: RoleMapping.USER,
//             principalId: admin.id
//           }, function(err, principal) {
//               cb(err);
//           });
//       });
//     });
// Role.create({
//       name: 'employee'
//     }, function(err, role) {
//       if (err) cb(err);
//
//       employeeUsers.forEach(function(employee){
//           //make bob an admin
//           role.principals.create({
//             principalType: RoleMapping.USER,
//             principalId: employee.id
//           }, function(err, principal) {
//               cb(err);
//           });
//       });
//     })
