let express = require('express');
let path=require('path');
let router = express.Router();
let mysql=require('mysql');
let util = require('util');
let md5 = require('crypto-js/md5');
let hex = require('crypto-js/enc-hex');
//兼容前期connection.query()代码
let { auth } = require('../src/authCustom.js');
let fs=require('fs');
let sqlDefine = require('../database/sqlDefine.js')

router.get('/test',function (req,res) {
    res.set('content-type','image/jpeg')
    return res.sendFile('/usr/local/nginx/html/ftp/root.jpg');
})

router.get('/checkCookie', function(req,res,next) {
    if(Object.keys(req.cookies).length===0){
        return res.send({statusCode:'400114',tag:0});
    }else{
        req.body=req.cookies;
        sqlDefine.crudAuth(req,res,next);
    }
});

router.get('/clear_cookie', async function(req, res) {
    console.log('clear_cookie');
    res.clearCookie('username',{path:'/'});
    res.clearCookie('secret',{path:'/'});
    return res.send({statusCode:'200131',tag:1});
});

router.get('/', function(req, res) {
    let indexpath=path.resolve(__dirname, '../public/page');
    res.set('Content-Type', 'text/html');
    res.sendFile(indexpath+'/index.html');
});

//CRUD
router.get('/idquery',function (req,res,next) {
    sqlDefine.crudRetrieve(req,res,next);
})

router.post('/addsubmit',function(req,res,next){
    sqlDefine.crudCreate(req,res,next)
})

router.post('/update',function (req,res,next) {
    sqlDefine.crudUpdate(req,res,next)
})

router.post('/iddelete',function (req,res,next) {
    sqlDefine.crudDelete(req,res,next)
})

//auth
router.post('/login',async function(req,res,next){
    sqlDefine.crudAuth(req,res,next);
})

//hiveReadAllEmployee
router.get('/user/hive_all_employee',function (req,res,next) {
    sqlDefine.hiveReadAllEmployee(req,res,next);
})

//hiveGetPost
router.get('/user/hive_post',function (req,res,next) {
    sqlDefine.hiveGetPost(req,res,next);
})

//hiveGetDepartment
router.get('/user/hive_department',function (req,res,next) {
    sqlDefine.hiveGetDepartment(req,res,next);
})

//hivePostMapDepartment
router.get('/user/hive_post_map_department',function (req,res,next) {
    sqlDefine.hivePostMapDepartment(req,res,next);
})

//前端需要的post、department瀑布级联表
router.get('/user/hive_post_cascader',function (req,res,next) {
    sqlDefine.hivePostCascader(req,res,next);
})

router.get('/user/hive_attendance/:date',function (req,res,next) {
    //data:20180224
    sqlDefine.hiveGetAttendanceByDay(req,res,next);
})

//更新员工信息
router.put('/user/hive_employee',function (req,res,next) {
    sqlDefine.hiveUpdateEmployee(req,res,next);
})

//更新职位部门信息
router.put('/user/hive_association',function (req,res,next) {
    sqlDefine.hiveUpdateAssociation(req,res,next);
})

//删除员工
router.delete('/user/hive_employee/:id',function (req,res,next) {
    sqlDefine.hiveDeleteEmployee(req,res,next);
})

//删除职位部门
router.delete('/user/hive_association/:id',function (req,res,next) {
    sqlDefine.hiveDeleteAssociation(req,res,next);
})

//创建员工
router.post('/user/hive_employee',function (req,res,next) {
    sqlDefine.hiveCreateEmployee(req,res,next);
})

//创建职位部门
router.post('/user/hive_association',function (req,res,next) {
    sqlDefine.hiveCreateAssociation(req,res,next);
})

//测试api
router.get('/user/hive_test/:id',function (req,res,next) {
    sqlDefine.hiveTest(req,res,next);
})

router.get('/get_header_portrait',function(req,res){
    let username=req.cookies.u;
    let headPortraitPath=path.format({
        root: '/',
        dir: '/usr/local/nginx/html/ftp',
        base: `${username}.jpg`
    });
    fs.stat(headPortraitPath, function (err, stat) {
        if(err===null){
            console.log(headPortraitPath);
            //res.set('Content-Type','image/jpeg')
            return res.send({statusCode:'200120',tag:1,path:headPortraitPath});
        }else{
            return res.send({statusCode:'400120',tag:0});
        }
    });

})

module.exports = router;
