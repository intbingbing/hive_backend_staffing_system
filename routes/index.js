let express = require('express');
let path=require('path');
let router = express.Router();
let mysql=require('mysql');
let jsonWrite=require('../util/util.js').jsonWrite;
let md5 = require('crypto-js/md5');
let hex = require('crypto-js/enc-hex');
var multer  = require('multer')
var request  = require('request')
//兼容前期connection.query()代码
let { auth } = require('../src/authCustom.js');
let fs=require('fs');
let sqlDefine = require('../database/sqlDefine.js')
let $util=require('../util/util.js');

//上传文件
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/usr/local/nginx/html/ftp/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'_'+file.originalname);
    }
})

var upload = multer({ storage: storage })

router.get('/test',function (req,res) {
    res.set('content-type','image/jpeg')
    return res.sendFile('/usr/local/nginx/html/ftp/root.jpg');
})

router.get('/api/proxy/weather', function(req,res,next) {
    let ip = $util.getClientIP(req).substr($util.getClientIP(req).lastIndexOf(':')+1);
    request(`https://api.seniverse.com/v3/weather/now.json?key=gf9evlzmq0whaes9&location=${ip}&language=zh-Hans&unit=c`,(error, response, body)=>{
        if(body){
            body = JSON.parse(body);
            return jsonWrite(res,body.results[0])
        }
        if(error){
            return jsonWrite(res,{code:'600110',msg:error})
        }
    })
});

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

////按天获取所有员工打卡记录
router.get('/user/hive_attendance/:date',function (req,res,next) {
    //data:20180224
    sqlDefine.hiveGetAttendanceByDay(req,res,next);
})

/*
* param: { Date } 20180224
* return:出勤率，准时到岗率，准时离岗率
* */
router.get('/user/hive_clock_in/:date',function (req,res,next) {
    sqlDefine.hiveGetClockInByDay(req,res,next);
})

/*
* param: { Date } 20180224
* return:出勤率，准时到岗率，准时离岗率,group by department
* */
router.get('/user/hive_clock_in_department/:date',function (req,res,next) {
    sqlDefine.hiveGetAttendanceByDepartment(req,res,next);
})

router.get('/user/hive_notice',function (req,res,next) {
    sqlDefine.hiveGetNotice(req,res,next);
})

//获取部门文件列表
router.get('/user/hive_department_file_list',function(req,res,next){
    //console.log(req.file)
    fs.readdir('/usr/local/nginx/html/ftp/upload',function(err,files){
        if(files){
            let tmp=[];
            for(let val of files){
                tmp.push({name:val,url:`http://122.112.210.98/ftp/upload/${val}`,originalname:val.substring(val.indexOf('_')+1)});
            }
            return jsonWrite(res,tmp) //列表数组
        }else{
            return jsonWrite(res,{code:'500110',msg:err})
        }
    })
});

//更新员工信息
router.put('/user/hive_employee',function (req,res,next) {
    sqlDefine.hiveUpdateEmployee(req,res,next);
})

//更新职位部门信息
router.put('/user/hive_association',function (req,res,next) {
    sqlDefine.hiveUpdateAssociation(req,res,next);
})

//重命名文件
router.put('/user/hive_department_file',function (req,res,next) {
    //fs.rename(oldPath, newPath, callback)
    fs.rename(`/usr/local/nginx/html/ftp/upload/${req.body.oldPath}`, `/usr/local/nginx/html/ftp/upload/${Date.now()}_${req.body.newPath}`, function(err){
        if(!err){
            return jsonWrite(res,{code:'200220',msg:'rename is OK'})
        }else{
            return jsonWrite(res,{code:'400220',msg:'rename is failed'})
        }
    })
})

//删除员工
router.delete('/user/hive_employee/:id',function (req,res,next) {
    sqlDefine.hiveDeleteEmployee(req,res,next);
})

//删除职位部门
router.delete('/user/hive_association/:id',function (req,res,next) {
    sqlDefine.hiveDeleteAssociation(req,res,next);
})

router.delete('/user/hive_department_file/:name',function (req,res,next) {
    fs.unlink(`/usr/local/nginx/html/ftp/upload/${req.params.name}`,function(error){
        if(!error){
            return jsonWrite(res,{code:'200240',msg:'delete is OK'})
        }else{
            return jsonWrite(res,{code:'400240',msg:`error:${error}`})
        }
    })
})

//创建员工
router.post('/user/hive_employee',function (req,res,next) {
    sqlDefine.hiveCreateEmployee(req,res,next);
})

//创建职位部门
router.post('/user/hive_association',function (req,res,next) {
    sqlDefine.hiveCreateAssociation(req,res,next);
})

//上传部门文件
router.post('/user/hive_department_file',upload.single("file"),function(req,res,next){
    //console.log(req.file)
    return jsonWrite(res,{code:'200210',msg:'ok'})
});

//增加公告记录
router.post('/user/hive_notice',function(req,res,next){
    //console.log(req.file)
    sqlDefine.hiveCreateNotice(req,res,next);
});

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
