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
            idqueryresult='ID:'+result[0].ID+'   姓名:'+result[0].name+'   密码:'+result[0].password+'   生日:'+result[0].birthday;
            return res.send(idqueryresult);
        }else{
            return res.send(idqueryresult);
        }
    });
});
// post增加
router.post('/addsubmit',function(req,res){
    res.send(req.body);
})

module.exports = router;
