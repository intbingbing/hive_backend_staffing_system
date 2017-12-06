let idquery=function(){
        let idqueryvalue=document.getElementById('idqueryvalue').value;
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
    let idsubmitvalue=document.getElementById('idsubmitvalue').value;
    let namesubmitvalue=document.getElementById('namesubmitvalue').value;
    let passwordsubmitvalue=document.getElementById('passwordsubmitvalue').value;
    let professionsubmitvalue=document.getElementById('professionsubmitvalue').value;
    data='id='+idsubmitvalue+'&'+'name='+namesubmitvalue+'&'+'password='+passwordsubmitvalue+'&'+'profession='+professionsubmitvalue;
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open('POST','addsubmit');
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.send(data);
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState===4){
            if(xmlhttp.status===200){
                document.getElementById('addsubmitresult').innerHTML='【数据已增加】：'+xmlhttp.responseText+'！'
            }else{
                console.log('ERROR:'+'status:'+xmlhttp.status+','+'state:'+xmlhttp.readyState);
            }
        }
    }

}