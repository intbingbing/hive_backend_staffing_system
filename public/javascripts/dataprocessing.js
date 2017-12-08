let idquery=function(){
        let idqueryvalue=document.getElementById('idqueryvalue').value;
        if(isNaN(parseInt(idqueryvalue))){
            document.getElementById('idqueryresult').innerHTML='格式错误！';
            return 0;
        }
        let idqueryresult=document.getElementById('idqueryresult');
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open('GET','idquery?id='+idqueryvalue,true);
        xmlhttp.send();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState===4){
                if(xmlhttp.status===200){
                    idqueryresult.innerHTML=xmlhttp.responseText;
                }else{
                    console.log('ERROR:'+'status:'+xmlhttp.status+','+'state:'+xmlhttp.readyState);
                }
            }
        }
    }

let entersubmit=function(){
    event.keyCode===13?idquery():false;
}

let addsubmit=function(){
    let namesubmitvalue=document.getElementById('namesubmitvalue').value;
    let passwordsubmitvalue=document.getElementById('passwordsubmitvalue').value;
    let birthdaysubmitvalue=document.getElementById('birthdaysubmitvalue').value;
    if(namesubmitvalue&&passwordsubmitvalue&&birthdaysubmitvalue){
        data='name='+namesubmitvalue+'&'+'password='+passwordsubmitvalue+'&'+'birthday='+birthdaysubmitvalue;
    }else{
        document.getElementById('addsubmitresult').innerHTML='数据未填写完整！';
        return 0;
    }
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open('POST','addsubmit',true);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.send(data);
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState===4){
            if(xmlhttp.status===200){
                document.getElementById('addsubmitresult').innerHTML='【数据已增加】：'+xmlhttp.responseText+'！';
            }else{
                console.log('ERROR:'+'status:'+xmlhttp.status+','+'state:'+xmlhttp.readyState);
            }
        }
    }
};

let update=function(){
    let idupdatevalue=document.getElementById('idupdatevalue').value;
    let nameupdatevalue=document.getElementById('nameupdatevalue').value;
    let passwordupdatevalue=document.getElementById('passwordupdatevalue').value;
    let birthdayupdatevalue=document.getElementById('birthdayupdatevalue').value;
    let data='';
    if(isNaN(parseInt(idupdatevalue))){
        document.getElementById('updateresult').innerHTML='ID未填写或格式错误！';
        return 0;
    }else if(nameupdatevalue&&passwordupdatevalue&&birthdayupdatevalue){
        data='id='+idupdatevalue+'&name='+nameupdatevalue+'&password='+passwordupdatevalue+'&birthday='+birthdayupdatevalue;
    }else{
        document.getElementById('updateresult').innerHTML='请填写完整！';
        return 0;
    }
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open('POST','/update',true);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.send(data);
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState===4){
            if(xmlhttp.status===200){
                document.getElementById('updateresult').innerHTML='【数据已更新】：'+xmlhttp.responseText+'！'
            }else{
                console.log('ERROR:'+'status:'+xmlhttp.status+','+'state:'+xmlhttp.readyState);
            }
        }
    }
}

let delete=function(){
    let iddeletervalue=document.getElementById('iddeletervalue').value;
    if(isNaN(parseInt(idupdatevalue))){
        document.getElementById('updateresult').innerHTML='ID未填写或格式错误！';
        return 0;
    }
    data='id='+iddeletervalue;
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open('POST','/delete',true);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.send(data);
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState===4){
            if(xmlhttp.status===200){
                document.getElementById('deleteresult').innerHTML='【数据已删除】：'+xmlhttp.responseText+'！'
            }else{
                console.log('ERROR:'+'status:'+xmlhttp.status+','+'state:'+xmlhttp.readyState);
            }
        }
    }
}