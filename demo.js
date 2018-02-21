const https = require('https');
const cheerio=require('cheerio');
const exec= require('child_process').exec;
const url='https://github.com/intbingbing/CRUD';
let html='';
let checkout=0;
function filterChapters(html){
        let $=cheerio.load(html);
        let result=$('div>a[class=message]').text();
        if(!(result===checkout)){
        	checkout=result;
        	exec('git pull',function(err,stdout,stderr){
        			console.log(stdout);
        	})
        	exec('node ./bin/www',function(err,stdout,stderr){
        			console.log(stdout);
        	})
        }else{
        	return;
        }
}
function settime(){
	https.get(url, (res) => {
	  res.on('data', (d) => {
	    html+=d;
	  });
	  res.on('end',function(){
	        filterChapters(html);
	  })

	}).on('error', (e) => {
	  console.error(e);
	});
}

setInterval(settime,3000);

