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
    crudAuth:'SELECT secret FROM auth WHERE username=?',
    //department,post,employee,permissions三个表笛卡尔积
    hiveReadAllEmployee:'select * from department,post,employee,permissions where department.department_id=post.department_id and post.post_id=employee.post_id and employee.permissions_id=permissions.permissions_id ORDER BY employee_id ASC;',
    //department,post映射关系的表
    hivePostMapDepartment:'select * from post,department where post.department_id=department.department_id ORDER BY post_id ASC;',
    //获取职位表
    hiveGetPost:'select * from post;',
    //获取部门表
    hiveGetDepartment:'select * from department;',
    //replace=>association表自连接 tag1
    hiveGetAssociation:'select * from association;',
    //staff_management 编辑员工信息
    hiveUpdateEmployee:'UPDATE `employee` SET `employee_name`=?,`employee_phone`=?,`employee_edu`=?,`employee_professional`=?,`employee_entry_time`=?,`employee_salary`=?,`post_id`=?,`employee_work_seniority`=?,`employee_identity_card_number`=?,`permissions_id`=?,`employee_address`=? WHERE `employee_id`=?',
    //删除员工
    hiveDeleteEmployee:'DELETE from employee where employee_id=?',
    //创建员工
    hiveCreateEmployee:'INSERT INTO `employee` (`employee_name`,`employee_phone`,`employee_edu`,`employee_professional`,`employee_entry_time`,`employee_salary`,`post_id`,`employee_work_seniority`,`employee_identity_card_number`,`permissions_id`,`employee_address`) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
    //test
    hiveTest:'select * from department_copy ORDER BY department_id ASC;'
}

module.exports=crud;
