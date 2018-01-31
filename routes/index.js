let express = require('express');
let path=require('path');
let router = express.Router();
let mysql=require('mysql');
let util = require('util');
let md5 = require('crypto-js/md5');
let hex = require('crypto-js/enc-hex');
//兼容前期connection.query()代码
let connection = require('../database/dbConnect');
let { auth } = require('../src/authCustom.js');
let { getClientIP } = require('../src/getClientIP.js');
let fs=require('fs');
//let connection = require('../public/javascripts/mysqlConnection.js');

/* GET home page. */

// let connection=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'test'
// });
// connection.connect();
// setInterval(function(){
//     connection.query('SELECT 1');
// },5000);

// router.all('/idquery?id=checkCookie',async function(req,res){
//     // console.log(req.path);
//     // console.log(req.cookies);
//     if(Object.keys(req.cookies).length===0){
//         return res.send({statusCode:'400114',tag:0});
//     }else{
//         return (await auth(req.cookies.u,req.cookies.p));
//     }
// })
router.get('/test',function (req,res) {
    res.set('content-type','image/jpeg')
    return res.sendFile('/usr/local/nginx/html/ftp/root.jpg');
})

router.get('/checkCookie', async function(req, res) {
    if(Object.keys(req.cookies).length===0){
        return res.send({statusCode:'400114',tag:0});
    }else{
        return res.send(await auth(req.cookies.username,req.cookies.secret));
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
// get查询
router.get('/idquery', function(req, res) {
    //for(let key in req.cookies){
    //    console.log('Cookies:  '+key+':'+req.cookies[key])
    //}
    //console.log('Cookie:'+req.cookies)
    let idqueryresult='未查询到数据！';
    let idqueryvalue=parseInt(req.query.id);
    let idquerysqlway='SELECT * FROM user WHERE ID='+idqueryvalue;
    connection.query(idquerysqlway,function(err,result){
        if(result.length===1){
            let birthdayformat=new Date(result[0].birthday).getFullYear()+'-'+(new Date(result[0].birthday).getMonth()+1)+'-'+new Date(result[0].birthday).getDate();
            idqueryresult=[{id:result[0].ID,name:result[0].name,password:result[0].password,birthday:birthdayformat}];
            return res.send(idqueryresult);
        }else{
            return res.send(idqueryresult);
        }
    });
});
// post增加
router.post('/addsubmit',function(req,res){
    let  addSql = 'INSERT INTO user(name,birthday,password)VALUES(?,?,?)';
    let  addSqlArr = [req.body.name,req.body.birthday,req.body.password];
    connection.query(addSql,addSqlArr,function (err, result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('服务器内部错误！');
            return;
        }
        let addsubmitresult=[{id:result.insertId,name:req.body.name}];
        res.send(addsubmitresult);
    });
});
/**
 * @param {{birthday:string}} data
 */
router.post('/update',function (req,res) {
    let idupdatevalue=req.body.id;
    let nameupdatevalue=req.body.name;
    let passwordupdatevalue=req.body.password;
    let birthdayupdatevalue=req.body.birthday;
    let nametmp,passwordtmp,birthdaytmp,data='';
    let nameswitch=0,passwordswitch=0,birthdayswitch=0,varswitch=0;
    let commacount=0;
    if(!(nameupdatevalue===undefined)){
        nametmp='name='+"'"+nameupdatevalue+"'";
        nameswitch=1;
    }
    if(!(passwordupdatevalue===undefined)){
        passwordtmp='password='+"'"+passwordupdatevalue+"'";
        passwordswitch=1;
    }
    if(!(birthdayupdatevalue===undefined)){
        birthdaytmp='birthday='+"'"+birthdayupdatevalue+"'";
        birthdayswitch=1;
    }

    varswitch=nameswitch+passwordswitch+birthdayswitch;
    commacount=varswitch-1;
    if(nameswitch===1){
        if(commacount===0){
            data+=nametmp;
        }else{
            data+=nametmp+",";
        }
    }
    if(passwordswitch===1){
        if(commacount!==0&&birthdayswitch===1){
            data+=passwordtmp+",";
        }else{
            data+=passwordtmp;
        }
    }
    if(birthdayswitch===1){
        data+=birthdaytmp;
    }
    let updateSql='UPDATE user SET '+data+' WHERE ID = '+idupdatevalue;
    // let updateSqlArr=[nameupdatevalue,passwordupdatevalue,birthdayupdatevalue,idupdatevalue];
    connection.query(updateSql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('服务器内部错误！');
            return;
        }
        let updateresult={id:idupdatevalue};
        res.send(updateresult);
    });
})

router.post('/iddelete',function (req,res) {
    let iddeletevalue=req.body.id;
    let deleteSql='DELETE FROM user where ID=?';
    let deleteSqlArr=[iddeletevalue];
    let deleteresult='';
    connection.query(deleteSql,deleteSqlArr,function (err, result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send({errCode:500}); //500服务器内部错误
            return;
        }
        if(result.affectedRows===1){
            deleteresult={statusCode:200}
        }else{
            deleteresult='无该ID记录，删除失败！'
        }
        // if(result.affectedRows===1){
        //     deleteresult='已成功删除！'
        // }else{
        //     deleteresult='无该ID记录，删除失败！'
        // }
        res.send(deleteresult);
    });
})

router.post('/login',async function(req,res){
    //console.log(req);
    // let salt = 'types.ID_QUERY_ERROR';
    // let secret = md5(password).toString(hex);
    // secret=md5(secret).toString(hex);
    let username = req.body.username;
    let secret = req.body.secret;
    let statusCodeObj=await auth(username,secret);
    if(statusCodeObj.statusCode==='200112'){
        res.cookie('username',username,{ maxAge: 7200000 , path:'/' ,  httpOnly: true});
        res.cookie('secret',secret,{ maxAge: 7200000 , path:'/' ,  httpOnly: true});
        //console.log(statusCodeObj);
        res.send(statusCodeObj);
    }else{
        res.send(statusCodeObj);
    }
    return 0;
    // let usernameSql=`SELECT secret FROM auth WHERE username='${username}'`;
    // connection.query(usernameSql,function(err,result){
    //     if(result.length===1){
    //         if(result[0].secret===secret) {
    //             res.cookie('u',username,{ maxAge: 30000 , path:'/' ,  httpOnly: true});
    //             res.cookie('p',secret,{ maxAge: 30000 , path:'/' ,  httpOnly: true});
    //             res.send({statusCode:'200112',tag:1});
    //         }else{
    //             res.send({statusCode:'400112',tag:0});
    //         }
    //         return 0;
    //     }else if(result.length===0){
    //         return res.send({statusCode:'400111',tag:0});
    //     }else{
    //         return res.send({statusCode:'500100',tag:0});
    //     }
    // });
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

connection.release();
module.exports = router;
