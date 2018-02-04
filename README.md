# hive_express

--------------

### **简介**

> - 使用express框架，前期（V1.0）主要用来给前端demo返回测试json数据和cookies管理，后期（V2.0）需求复杂了，决定后端也要优化一下，尝试各表分离。
> - 服务于前端 `staffing\_system\_vue` 的一个后端员工管理项目；
> - 提供了增删改查的api；
> - 封装了mysql连接池及语句；

### **Versions**
> - V2.0 ( Building... )  预期功能：
> > - 权限管理
> > - 登录管理WebStorage、UID
> > - 员工表、职位表、部门表、权限表、公告表等的关系设计及增删改查
> > - 提供文件服务器以管理头像、部门文件等资源
> > - 用内连接给前端提供图表的数据

------
> - V1.0 ( Done )  已实现功能：
> > - 登录功能 cookies实现 √
> > - mysql pool及语句的封装 √
> > - user表的增删改查 √
> > - 提供文件服务器管理不同用户头像资源 √

----------

### **V1.0 ( Done ) 截图：**
#### login界面
![](/screen_views/login.png "login界面")
#### create界面
![](/screen_views/create.png "create界面")
#### retrieve界面
![](/screen_views/retrieve.png "retrieve界面")
