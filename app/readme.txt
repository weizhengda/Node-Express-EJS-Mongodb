#### 注册

    1. url   localhost:3000/reg

    2. api   localhost:3000/users/addUser    在注册页面点击注册按钮的时候的请求地址

        method   Post

        注册成功之后，就转到 登录页面
        不成功的话，就还是在注册页面

        不允许重复注册

        注册需要的字段：
            uid             用户唯一标识
            username        登录名
            password        密码
            nickname        昵称


        ？ uid 我们这里是使用的 按照条数来计算的。。。
            解决有可能出现的 uid相同的问题

            1. 最后一条记录的uid肯定是最大的。
                skip(0)
                4
                skip(4-1)
            2. 取出所有人。对他们的uid做一个 判断

#### 登录

    1. url   localhost:3000/login

    2. api   localhost:3000/users/login

        method  get

        username
        password

        登录成功之后，需要得到当前用户的昵称。。。然后回到首页 首页上面显示这个昵称


#### 首页

    1. url  localhost:3000

    2. 就有两个按钮   登录按钮  |  注册按钮

        当前有用户登录之后，登录按钮就隐藏   显示  退出按钮

#### 退出

    1. url  localhost:3000/logout

        清除cookie
        回到首页


####
    数据库名字： project
            集合：   users


    ？ 要给每个用户额外加上一个 uid 的字段

        先获取一下当前这个集合里面的条数

        条数+1 就是下一个注册人的uid

        使用 async   串行有关联   waterfall


#### get与post的区别

    1. get不安全，post相对安全
    2. get会把参数显示在url地址栏，post不会
    3. get有长度限制，而post的长度大小会比get大的多
    4. 增 删 改 查
        查       get
        增删改   post

#### express 中cookie的操作

    存
        res.cookie('key', value, { maxAge: 20 * 60 * 1000});
    取
        req.cookies.key

    删除
        res.cookie('key', '', {maxAge: -100})