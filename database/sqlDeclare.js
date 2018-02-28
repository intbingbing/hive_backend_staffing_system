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
    //department,post,employee,permissions三个表笛卡尔积 tag3
    //hiveReadAllEmployee:'select * from department,post,employee,permissions where department.department_id=post.department_id and post.post_id=employee.post_id and employee.permissions_id=permissions.permissions_id ORDER BY employee_id ASC;',
    hiveReadAllEmployee:`select * from employee as em inner join permissions as per 
    inner join (select p.association_id,p.association_name as post_name,p.association_is_department,c.association_name as department_name ,c.association_id as department_id
    from association as p left join association as c on p.association_pid=c.association_id) as po 
    on em.permissions_id=per.permissions_id and em.association_id=po.association_id order by em.employee_id`,

    //department,post映射关系的表
    //hivePostMapDepartment:'select * from post,department where post.department_id=department.department_id ORDER BY post_id ASC;',
    //association表自连接 tag2,职位部门映射表
    hivePostMapDepartment:`select p.association_id,p.association_name,p.association_pid,p.association_is_department,c.association_name as parent_name ,c.association_id as parent_id
    from association as p left join association as c on p.association_pid=c.association_id`,
    hiveEmployeeCountByDepartment:`select department_id ,department_name ,count(department_id) as department_count from employee as em inner join permissions as per
    inner join (select p.association_id,p.association_name as post_name,p.association_is_department,c.association_name as department_name ,c.association_id as department_id
    from association as p left join association as c on p.association_pid=c.association_id) as po
    on em.permissions_id=per.permissions_id and em.association_id=po.association_id  group by department_id`,
    //当天打卡计数，部门分组（包括迟到早退）
    hiveCountAttendanceBydepartment:function () {
        return `select department_id,department_name,count(department_id) clock_in_count from (${this.hiveGetAttendanceByDay}) as alias group by department_id `
    },
    //获取职位表
    //hiveGetPost:'select * from post;',
    //获取部门表
    //hiveGetDepartment:'select * from department;',

    //replace=>association表自连接 tag1
    hiveGetAssociation:'select * from association',
    //获取打卡记录
    hiveGetAttendanceByDay:`select em.employee_id,em.employee_name,em.association_id,ass.association_pid as department_id, ass.association_name,ass.parent_name as department_name,at.attendance_id,at.attendance_am,at.attendance_pm
    from employee as em inner join (select p.association_id,p.association_name,p.association_pid,p.association_is_department,c.association_name as parent_name ,c.association_id as parent_id
    from association as p left join association as c on p.association_pid=c.association_id) as ass inner join attendance as at 
    on em.employee_id=at.employee_id and em.association_id=ass.association_id 
    where ( attendance_am > ? and attendance_am < ?) or ( attendance_pm > ? and attendance_pm < ?)`,
    hiveGetEmployeeCount:'select count(*) as employee_count from employee',
    // ? ? :开始时间 结束时间
    hiveGetClockInByDayCount:'select count(*) as clock_in_count from attendance as at where at.attendance_am > ? and at.attendance_pm < ?',
    hiveGetClockInByDayPunctualityCount:'select count(*) as clock_in_count from attendance as at where at.attendance_am > ? and at.attendance_am < ?',
    hiveGetClockOutByDayPunctualityCount:'select count(*) as clock_in_count from attendance as at where at.attendance_pm > ? and at.attendance_pm < ?',
    hiveGetClockInByDay:'',
    hiveUpdateAssociation:'UPDATE `association` SET `association_name`=?,`association_is_department`=?,`association_pid`=? WHERE `association_id`=?',
    //staff_management 编辑员工信息
    hiveUpdateEmployee:'UPDATE `employee` SET `employee_name`=?,`employee_phone`=?,`employee_edu`=?,`employee_professional`=?,`employee_entry_time`=?,`employee_salary`=?,`association_id`=?,`employee_work_seniority`=?,`employee_identity_card_number`=?,`permissions_id`=?,`employee_address`=? WHERE `employee_id`=?',
    //删除员工
    hiveDeleteEmployee:'DELETE from employee where employee_id=?',
    //删除职位部门
    hiveDeleteAssociation:'DELETE from association where association_id=?',
    //创建员工
    hiveCreateEmployee:'INSERT INTO `employee` (`employee_name`,`employee_phone`,`employee_edu`,`employee_professional`,`employee_entry_time`,`employee_salary`,`association_id`,`employee_work_seniority`,`employee_identity_card_number`,`permissions_id`,`employee_address`) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
    //创建职位部门
    hiveCreateAssociation:'INSERT INTO `association` (`association_name`,`association_is_department`,`association_pid`) VALUES(?,?,?)',

    //test
    hiveTest:'select * from department_copy ORDER BY department_id ASC',


//     select department_id,department_name,count(department_id) clock_in_count from (select em.employee_id,em.employee_name,em.association_id,ass.association_pid as department_id, ass.association_name,ass.parent_name as department_name,at.attendance_id,at.attendance_am,at.attendance_pm
// from employee as em inner join (select p.association_id,p.association_name,p.association_pid,p.association_is_department,c.association_name as parent_name ,c.association_id as parent_id
// from association as p left join association as c on p.association_pid=c.association_id) as ass inner join attendance as at
// on em.employee_id=at.employee_id and em.association_id=ass.association_id
// where ( attendance_am > '2018-02-22 00:00:00' and attendance_am < '2018-02-22 23:59:59') or ( attendance_pm > '2018-02-22 00:00:00' and attendance_pm < '2018-02-22 23:59:59')) as alias group by department_id ;
}



module.exports=crud;
