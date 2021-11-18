import UserModel from "../model/user";
import Cache from "./cache";
import ModularModel from "../model/modular";
import { PostTemplateMessage } from "./wechat";
import crypto from "crypto";
import axios from "axios";
import nodemailer from "nodemailer";
import config from "config";

const EmailConfig: iEmail = config.get("email");

export async function PushMessage(token: string, ids: string, data: iData) {
    //token对应的用户获取
    const model = await getTokenUser(token);
    //获取id列表
    const list = await ModularModel.findAll(model.id, ids.split(","));
    list.forEach((item) => {
        if (item.type === 0) PushWechat(item, data);
        if (item.type === 1) PushEmail(item, data);
        if (item.type === 2) PushDDing(item, data);
    });
}

//获取token对应的用户信息
async function getTokenUser(token: string) {
    const data = await Cache.getRedisCache(token);
    if (data) return data;
    const model = await UserModel.findByToken(token);
    if (!model) throw new Error("失效的token");
    const newdata = {
        id: model.id,
        username: model.username,
    };
    await Cache.setRedisCache(token, newdata);
    return newdata;
}
//发送微信消息
async function PushWechat(model: any, data: iData) {
    await PostTemplateMessage(model.v1, model.v2, !data.data ? { content: data.content } : data.data);
}

//发送钉钉消息
async function PushDDing(model: any, data: iData) {
    const timestamp = Date.now();
    const sha = crypto.createHmac("SHA256", model.v2);
    sha.update(timestamp + "\n" + model.v2, "utf8");
    const sign = encodeURI(sha.digest("base64"));
    await axios.post(`${model.v1}&timestamp=${timestamp}&sign=${sign}`, {
        msgtype: "text",
        text: {
            content: data.content,
        },
    });
}

async function PushEmail(model: any, data: iData) {
    const smtpTransport = nodemailer.createTransport({
        host: EmailConfig.host,
        secureConnection: true,
        secure: true,
        port: 465,
        auth: {
            user: EmailConfig.from,
            pass: EmailConfig.pass,
        },
    });
    smtpTransport.sendMail(
        {
            from: EmailConfig.name + " " + "<" + EmailConfig.from + ">",
            to: model.v1,
            subject: data.title,
            //text    : msg,
            html: data.email ? data.email : data.content,
        },
        function (err, res) {
            if (err) {
                console.log("error: ", err);
            }
        }
    );
}

interface iData {
    title: string;
    content: string;
    data?: any;
    email?: string;
    sms?: string;
}
interface iEmail {
    name: string;
    host: string;
    from: string;
    pass: string;
}
