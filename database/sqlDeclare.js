var crud={
    //增
    crudCreate:'INSERT INTO `user` (`name`,`birthday`,`password`) VALUES(?,?,?)',
    //删
    crudDelete: 'DELETE from user where ID=?',
    //改
    crudUpdate:'UPDATE `user` SET `name`=?,`password`=?,`birthday`=? WHERE `ID`=?',
    //查
    crudAll: 'select * from user',
    crudRetrieve: 'select * from user where ID=?',
    //auth
    crudAuth:'SELECT secret FROM auth WHERE username=?'
}

module.exports=crud;
