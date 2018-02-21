var mysql = require('mysql');
var dbconf = require('../conf/db.js');
// 使用连接池，提升性能
var pool  = mysql.createPool(dbconf.mysql);
function query(sqlHandle , sqlArr , callback){
    pool.getConnection(function(err,connection){
        connection.query(sqlHandle, sqlArr , function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}
//exports.query = query;
exports = module.exports= { query };
