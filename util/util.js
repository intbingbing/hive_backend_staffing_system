module.exports = {
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    formatDate:function (date){
        date=new Date(date);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    },
    getClientIP:function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    /*
    * json格式转树状结构
    * @param   {json}      json数据
    * @param   {String}    id的字符串
    * @param   {String}    父id的字符串
    * @param   {String}    children的字符串
    * @return  {Array}     数组
    */
    formatJsonToTree:function(a, idStr, pidStr, chindrenStr) {
        let r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0,
            len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            let aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    },
    //data_name_str：数据中的姓名，expected_id_str:格式化后的ID字符串，expected_name_str：格式化后的姓名字符串(result,'association_id','association_pid','chindren','association_name','value','label')
    // workedFormatJsonToTree:function (data,data_id_str,data_pid_str,chindren_str,data_name_str,expected_id_str,expected_name_str) {
    //     let workedData = this.formatJsonToTree(data,data_id_str,data_pid_str,chindren_str);
    //     let tmpStr = JSON.stringify(workedData);
    //     tmpStr = tmpStr.replace(new RegExp(data_id_str,'g'), expected_id_str);
    //     tmpStr = tmpStr.replace(new RegExp(data_name_str,'g'), expected_name_str);
    //     workedData = JSON.parse(tmpStr);
    //     return workedData;
    // },
    defaultCascaderArr:function (id,mapData) {
        let result = [];
        result.push(id);
        function traverse(id) {
            for(let val of mapData){
                if(val['association_id']===id&&val['association_pid']!==0){
                    result.push(val['association_pid']);
                    traverse(val['association_pid']);
                }
            }
        }
        traverse(id);
        return result;
    },

    //简单封装
    jsonWrite : function (res, ret) {
        if ( typeof ret === 'undefined' ) {
            res.status(500).json({ statusCode : 500 , msg : 'Server Error!' });
        } else {
            res.json(ret);
        }
    },
    /*
* param date:{ Date },日期
* param options:{ none | 'number'} none:2018-01-01 number:20180101
* return String
* */
    getDetailedTime:function(){
        let date=new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        //let millisecond = date.getMilliseconds();
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
    //let result=[]

    // defaultCascaderArr:function (id,mapData) {
    //     let result = [];
    //     result.push(id);
    //     function traverse(id) {
    //         for(let val of mapData){
    //             if(val['association_id']===id&&val['association_pid']!==0){
    //                 console.log(val);
    //                 result.push(val['association_pid']);
    //                 traverse(val['association_pid']);
    //             }
    //         }
    //     }
    //     traverse(id);
    //     return result;
    // }
}
