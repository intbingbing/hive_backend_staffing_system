var express = require('express');
var path=require('path');
var router = express.Router();
var fs=require('fs');
var util=require('util');
/* GET home page. */

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

router.get('/idquery', function(req, res) {
    idqueryvalue=parseInt(req.query.id);
    let jsondata;
    let idqueryresult='未查询到数据！';
    jsondata=JSON.parse(fs.readFileSync('./sql.json','utf8'));
    for(let key in jsondata){
      if(jsondata[key].id===idqueryvalue){
          idqueryresult='ID:'+jsondata[key].id+'   姓名:'+jsondata[key].name+'   密码:'+jsondata[key].password+'   职业:'+jsondata[key].profession;
          return res.send(idqueryresult);
      }
    }
    res.send(idqueryresult);
});

router.post('/addsubmit',function(req,res){
    
    res.send(req.body);
})

module.exports = router;
