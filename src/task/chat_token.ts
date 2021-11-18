/**
 * 微信Access token
 */
import Redis from "../db/redis";
import config from "config";
import axios from "axios";
import { app_name } from "../service/application";
import { CronJob } from "cron";

const WechatConfig: iWechatConfig = config.get("wechat");
const Chat_Key = "wechat_access_token";
//提前过期时间
const Token_Expire_Last = 10;
//更新的主力key
const Token_Ignore = "wechat_token_main";

//token
export let AccessToken = "";
//初始化,获取当前存在的token
async function init() {
    try {
        const data = await Redis.get(Chat_Key);
        if (data) {
            AccessToken = data;
        }
        await checkToken();
    } catch (error) {
        console.log(error);
    }
}
//如果是更新机，则开始更新
async function checkToken() {
    try {
        const data = await Redis.get(Token_Ignore);
        if (data !== app_name && data !== null) {
            getTokenBack();
            return;
        }
        console.log("成为master");
        await Redis.set(Token_Ignore, app_name);
        startTask();
    } catch (error) {
        console.log(error);
    }
}
function getTokenBack() {
    new CronJob("0 */10 * * * *", async function () {
        const data = await Redis.get(Chat_Key);
        if (data) {
            AccessToken = data;
        }
    }).start();
}
//重新获取token
async function getToken() {
    try {
        console.log("远程获取AccessToken");
        const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WechatConfig.appid}&secret=${WechatConfig.secret}`);
        const data = res.data;
        if (!data.access_token) throw new Error(data.errmsg);
        AccessToken = data.access_token;
        await saveToken(data.access_token, data.expires_in);
    } catch (error) {
        console.log(error);
    }
}
//保存获取到的token,过期的秒数
function saveToken(token: string, expires_in: number) {
    Redis.set(Chat_Key, token, "EX", expires_in - Token_Expire_Last);
}
//开始定时任务
function startTask() {
    getToken();
    new CronJob("0 0 */1 * * *", function () {
        getToken();
    }).start();
}

init();

interface iWechatConfig {
    appid: string;
    secret: string;
}
