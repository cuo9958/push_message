const nodemailer = require("nodemailer");

// 参数：发件人，收件人，主题，正文（支持html格式）
function sendMail(from, aliasName, tos, subject, msg) {
    const smtpTransport = nodemailer.createTransport({
        host: "smtp.qiye.aliyun.com",
        secureConnection: true, // use SSL
        secure: true,
        port: 465,
        auth: {
            user: from,
            pass: "zixiao521@",
        },
    });

    smtpTransport.sendMail(
        {
            from: aliasName + " " + "<" + from + ">",
            to: tos,
            subject: subject, //邮件主题
            //text    : msg,
            html: msg,
        },
        function (err, res) {
            if (err) {
                console.log("error: ", err);
            }
        }
    );
}

function nl2br(str, isXhtml) {
    var breakTag = isXhtml || typeof isXhtml === "undefined" ? "<br />" : "<br>";
    var str = (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
}

function main() {
    sendMail(
        "wx@bxiaob.top",
        "机器人",
        "guofangchao@daling.com",
        "这是邮件标题",
        '这是正文。<h2> 我的主页：</h2> 地址为：<a href= www.latelee.org" target="_blank">www.latelee.org</a></br>'
    );
}

// call main
main();
