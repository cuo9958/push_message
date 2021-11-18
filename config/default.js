/**
 * 默认配置
 */

module.exports = {
    //微信配置
    wechat: {
        appid: "wx123",
        secret: "123456",
    },
    //开发环境数据库
    db: {
        host: "127.0.0.1",
        port: "3306",
        database: "database",
        user: "user",
        password: "password",
        connectionLimit: 2,
    },
    //开发环境，普通redis配置
    redis: {
        host: "127.0.0.1",
        password: "123456",
    },

    //mongodb配置
    mg: {
        name: "mg",
        reset: "",
        url: "mongodb://127.0.0.1:27017",
    },

    //邮件配置
    email: {
        name: "小白推送",
        host: "smtp.qiye.aliyun.com",
        from: "wx@bxiaob.top",
        pass: "123456",
    },
};
