let express = require('express');
let path=require('path');
let router = express.Router();
let mysql=require('mysql');
/* GET home page. */

let connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'test'
});
connection.connect();
setInterval(function(){
    connection.query('SELECT 1');
},5000);
setInterval(function(){
    console.log(new Date().toISOString());
},1800000);

router.use(function(req,res,next){
    res.set({
        "Cache-Control":"no-cache",
        "Pragma":"no-cache",
        "Expires":0
    });
    console.log('ClientIP:',req.connection.remoteAddress);
    next();
})

router.get('/', function(req, res) {
    let indexpath=path.resolve(__dirname, '../public/page');
    res.set('Content-Type', 'text/html');
    res.sendFile(indexpath+'/index.html');
});
// get查询
router.get('/idquery', function(req, res) {
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
        let addsubmitresult='ID:'+result.insertId+' Name:'+req.body.name;
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
        let updateresult='ID:'+idupdatevalue;
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
            res.send('服务器内部错误！');
            return;
        }
        if(result.affectedRows===1){
            deleteresult='已成功删除！'
        }else{
            deleteresult='无该ID记录，删除失败！'
        }
        res.send(deleteresult);
    });
})

module.exports = router;
