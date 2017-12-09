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
router.use(function(req,res,next){
    res.set({
        "Cache-Control":"no-cache",
        "Pragma":"no-cache",
        "Expires":0
    });
    next();
})

router.get('/', function(req, res) {
    let indexpath=path.resolve(__dirname, '../public/page');
    res.sendFile(indexpath+'/index.html');
});
// get查询
router.get('/idquery', function(req, res) {
    let idqueryresult='未查询到数据！';
    let idqueryvalue=parseInt(req.query.id);
    let idquerysqlway='SELECT * FROM user WHERE ID='+idqueryvalue;
    connection.query(idquerysqlway,function(err,result){
        if(result.length===1){
            let birthdayformat=new Date(result[0].birthday).getFullYear()+'-'+new Date(result[0].birthday).getMonth()+'-'+new Date(result[0].birthday).getDay();
            idqueryresult='ID:'+result[0].ID+'   姓名:'+result[0].name+'   密码:'+result[0].password+'   生日:'+birthdayformat;
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

router.post('/update',function (req,res) {
    let idupdatevalue=req.body.id;
    let nameupdatevalue=req.body.name;
    let passwordupdatevalue=req.body.password;
    let birthdayupdatevalue=req.body.birthday;
    let updateSql='UPDATE user SET name = ?,password = ? ,birthday= ? WHERE ID = ?';
    let updateSqlArr=[nameupdatevalue,passwordupdatevalue,birthdayupdatevalue,idupdatevalue];
    connection.query(updateSql,updateSqlArr,function (err, result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('服务器内部错误！');
            return;
        }
        let updateresult='ID:'+idupdatevalue+' Name:'+nameupdatevalue+' Password:'+passwordupdatevalue+' Birthday:'+birthdayupdatevalue;
        res.send(updateresult);
    });
})

router.post('/iddelete',function (req,res) {
    let iddeletevalue=req.body.id;
    console.log(iddeletevalue);
    let deleteSql='DELETE FROM user where ID=?';
    let deleteSqlArr=[iddeletevalue];
    connection.query(deleteSql,deleteSqlArr,function (err, result) {
        if(err){
            console.log('[SELECT ERROR]:',err.message);
            res.send('服务器内部错误！');
            return;
        }
        let deleteresult='ID:'+idupdatevalue+' Name:'+nameupdatevalue+' Password:'+passwordupdatevalue+' Birthday:'+birthdayupdatevalue;
        res.send(deleteresult);
    });
})

module.exports = router;
