//let connection = require('../database/dbConnect');
// /login验证函数，形参用户密码，返回值对象
// 200112 passSuccess
// 400112 passErr
// 400111 noUser
// 500100 serverErr
// function auth(username,secret){
//     return new Promise(function(resolve,reject){
//         let usernameSql=`SELECT secret FROM auth WHERE username='${username}'`;
//         connection.query(usernameSql,function(err,result){
//             if(result.length===1){
//                 if(result[0].secret===secret) {
//                     resolve ({statusCode:'200112',tag:1,username});
//                 }else{
//                     resolve ({statusCode:'400112',tag:0});
//                 }
//             }else if(result.length===0){
//                 resolve ({statusCode:'400111',tag:0});
//             }else{
//                 resolve ({statusCode:'500100',tag:0});
//             }
//         });
//     })
// }
//
// exports = module.exports = { auth };
