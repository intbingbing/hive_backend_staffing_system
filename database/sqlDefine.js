//实现与mysql交互
var mysql=require('mysql');
var $conf=require('../conf/db.js');
var $util=require('../util/util.js');
var $sql=require('./sqlDeclare.js');
// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if ( typeof ret === 'undefined' ) {
        res.json({ statusCode : 500 , msg : 'Server Error!' });
    } else {
        res.json(ret);
    }
};

module.exports = {
    //增加商品
    crudCreate: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body ;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.crudCreate, [param.name, param.birthday,param.password], function(err, result) {
                if(result){
                    result={id:result.insertId,name:req.body.name};
                }
                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    crudDelete: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            var id = [req.body.id];
            connection.query($sql.crudDelete, id, function(err, result) {
                if(result.affectedRows === 1) {
                    result = {
                        statusCode: 200,
                        msg:'删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    crudUpdate: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.crudUpdate, [param.name, param.password,param.birthday,param.id], function(err, result) {
                if(result) {
                    result = {
                        statusCode: 200,
                        msg:'更新成功'
                    };
                }
                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    //得到所有商品 在路由routes调用本方法，这个方法调用sql语句 ，并返回相应结果jsonwrite
    crudAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.crudAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    crudRetrieve: function (req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.crudRetrieve, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    crudAuth: function (req, res, next) {
        var username = req.body.username;
        var secret = req.body.secret;
        pool.getConnection(function(err, connection) {
            connection.query($sql.crudAuth, username, function(err, result) {
                if(result){
                    if(result.length===1){
                        if(result[0].secret===secret) {
                            res.cookie('username',username,{ maxAge: 7200000 , path:'/' ,  httpOnly: true});
                            res.cookie('secret',secret,{ maxAge: 7200000 , path:'/' ,  httpOnly: true});
                            res.send({statusCode:'200112',tag:1,username});
                        }else{
                            res.send({statusCode:'400112',tag:0});
                        }
                    }else if(result.length===0){
                        res.send({statusCode:'400111',tag:0});
                    }else{
                        res.send({statusCode:'500100',tag:0});
                    }
                }else{
                    res.status(500).end();
                }
                connection.release();
            });
        });
    }
};
