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
    /*
    * json格式转树状结构
    * @param   {json}      json数据
    * @param   {String}    id的字符串
    * @param   {String}    父id的字符串
    * @param   {String}    children的字符串
    * @return  {Array}     数组
    */
    formatJSonToTree:function(a, idStr, pidStr, chindrenStr) {
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
    //data_name：数据中的姓名，expected_id_str:格式化后的ID字符串，expected_name_str：格式化后的姓名字符串
    workedFormatJSonToTree:function (data,data_id,data_pid,chindren_str,data_name,expected_id_str,expected_name_str) {
        let workedData = formatJSonToTree(data,data_id,data_pid,chindren_str);
        let tmpStr = JSON.stringify(workedData);
        tmpStr = tmpStr.replace(/data_id/g, expected_id_str);
        tmpStr = tmpStr.replace(/data_name/g, expected_name_str);
        workedData = JSON.parse(tmpStr);
        return workedData;
    }
}
