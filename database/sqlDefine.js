//实现与mysql交互
let mysql=require('mysql');
let $conf=require('../conf/db.js');
let $util=require('../util/util.js');
let $sql=require('./sqlDeclare.js');
// 使用连接池，提升性能
let pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
let jsonWrite = function (res, ret) {
    if ( typeof ret === 'undefined' ) {
        res.status(500).json({ statusCode : 500 , msg : 'Server Error!' });
    } else {
        res.json(ret);
    }
};

module.exports = {
    //增加商品
    crudCreate: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            let param = req.body ;
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
            let id = [req.body.id];
            connection.query($sql.crudDelete, id, function(err, result) {
                if(result.affectedRows === 1) {
                    result = {
                        statusCode: '200220',
                        msg:'Delete Successful'
                    };
                } else if(result.affectedRows === 0){
                    result = {
                        statusCode: '400221',
                        msg:'No data found'
                    }
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    crudUpdate: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            let param = req.body;
            // crudUpdate:'UPDATE `user` SET `name`=?,`password`=?,`birthday`=? WHERE `ID`=?',
            connection.query($sql.crudUpdate, [param.name, param.password,param.birthday,param.id], function(err, result) {
                if(result) {
                    result = {
                        id:param.id,
                        name:param.name,
                        statusCode: '200220',
                        msg:'Update Successful'
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
        let id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.crudRetrieve, id, function(err, result) {
                if(result.length===0){
                    result = {
                        statusCode: '400231',
                        msg:'No data found'
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    crudAuth: function (req, res, next) {
        let username = req.body.username;
        let secret = req.body.secret;
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
    },

    hiveReadAllEmployee: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveReadAllEmployee , function(err, result) {
                if(result.length===0){
                    result = {
                        statusCode: '400231',
                        msg:'No data found'
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    hiveGetPost: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveGetPost , function(err, result) {
                if(result.length===0){
                    result = {
                        statusCode: '400231',
                        msg:'No data found'
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    hiveGetDepartment: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveGetDepartment , function(err, result) {
                if(result.length===0){
                    result = {
                        statusCode: '400231',
                        msg:'No data found'
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    hivePostMapDepartment:function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.hivePostMapDepartment , function(err, result) {
                if(result.length===0){
                    result = {
                        statusCode: '400231',
                        msg:'No data found'
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //获取post和department映射表 tag1
    hivePostCascader:function (req, res, next) {
        pool.getConnection(function(err, connection) {
            let post=department=postCascader=[];
            connection.query($sql.hiveGetPost , function(err, result) {
                post=result;
            })
            connection.query($sql.hiveGetDepartment , function(err, result) {
                department=result;

                for(let val of department){
                    postCascader.push({value:val["department_id"],label:val["department_name"],children:[]});
                }

                for(let postVal of post){
                    for(let cascaderVal of postCascader){
                        if(postVal.department_id===cascaderVal.value){ //职位表的外键部门ID===瀑布表的value值（部门ID）
                            cascaderVal.children.push({value:postVal["post_id"],label:postVal["post_name"]});
                        }
                    }
                }
                jsonWrite(res, postCascader);
                connection.release();
            });
        });
    },

    //更新员工信息
    hiveUpdateEmployee:function (req, res, next) {
        let newEmpObj = req.body;
        let newEmpArr = [newEmpObj.employee_name,newEmpObj.employee_phone,newEmpObj.employee_edu,newEmpObj.employee_professional,newEmpObj.employee_entry_time,newEmpObj.employee_salary,newEmpObj.post_id,newEmpObj.employee_work_seniority,newEmpObj.employee_identity_card_number,newEmpObj.permissions_id,newEmpObj.employee_address,newEmpObj.employee_id]
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveUpdateEmployee , newEmpArr , function(err, result) {
                if(result.changedRows){
                    result = {
                        statusCode: '200220',
                        msg:`Update is successful! [System]:${result.message}`
                    }
                }else if(result.affectedRows){
                    result = {
                        statusCode: '400221',
                        msg:`No value to be updated! [System]:${result.message}`
                    }
                }else{
                    result = {
                        statusCode: '400231',
                        msg:`No data found! [System]:${result.message}`
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //删除员工信息
    hiveDeleteEmployee:function (req, res, next) {
        let id = [+req.params.id] ;
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveDeleteEmployee , id , function(err, result) {
                if(result.affectedRows){
                    result = {
                        statusCode: '200240',
                        msg:`Delete is successful! [System]:${result.message}`
                    }
                }else if(result.affectedRows===0){
                    result = {
                        statusCode: '400241',
                        msg:`No data found! [System]:${result.message}`
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //创建员工
    hiveCreateEmployee:function (req, res, next) {
        let tmp = req.body;
        let newEmpArr = [tmp.employee_name,tmp.employee_phone,tmp.employee_edu,tmp.employee_professional,tmp.employee_entry_time,tmp.employee_salary,tmp.post_id,tmp.employee_work_seniority,tmp.employee_identity_card_number,tmp.permissions_id,tmp.employee_address]
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveCreateEmployee , newEmpArr , function(err, result) {
                if(result){
                    result = {
                        statusCode: '200210',
                        msg:`Create is successful! [System]:${result.message}`,
                        data:{
                            employee_id:result.insertId
                        }
                    }
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    hiveTest:function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.hiveTest ,function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

};
