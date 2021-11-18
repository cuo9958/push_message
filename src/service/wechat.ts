/**
 * wechat的api列表
 */
import { AccessToken } from "../task/chat_token";
import axios from "axios";
import config from "config";
import Cache from "./cache";
import { nanoid } from "nanoid";
import ModularModel from "../model/modular";
import { GetUserInfo } from "./user";

const WechatConfig: iWechatConfig = config.get("wechat");

/**
 * 获取模版列表
 * @returns list
 */
export async function GetTemplateList() {
    const key = "wechat_template";
    const data = Cache.getTemp(key);
    if (data) return data;
    try {
        const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=${AccessToken}`);
        const data = res.data;
        Cache.setTemp(key, data.template_list);
        return data.template_list;
    } catch (error) {
        console.log(error);
        return [];
    }
}
/**
 * 发送模版消息
 * @param openid openid
 * @param template_id 消息id
 * @param data 数据对象
 */
export async function PostTemplateMessage(openid: string, template_id: string, data: any, url?: string) {
    try {
        for (const key in data) {
            data[key] = {
                value: data[key],
            };
        }
        const res = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${AccessToken}`, {
            touser: openid,
            template_id,
            url,
            data,
        });
        const res_data = res.data;
        console.log("模版消息发送完成", res_data);
        return res_data.msgid;
    } catch (error) {
        console.log(error);
    }
}
/**
 * 通过code换区用户信息，openid等
 * @param code code
 */
export async function Code2Openid(code: string) {
    try {
        const res = await axios.get(
            `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WechatConfig.appid}&secret=${WechatConfig.secret}&code=${code}&grant_type=authorization_code`
        );
        const data = res.data;
        if (!data.openid) throw new Error(data.errmsg);
        return {
            access_token: data.access_token,
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
            openid: data.openid,
            scope: data.scope,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}
/**
 * 获取登录的url
 * @returns
 */
export function GetLoginUrl(state?: string) {
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WechatConfig.appid}&redirect_uri=${encodeURIComponent(
        "https://push.bxiaob.top/api_node/wechat/logined"
    )}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
    return url;
}
/**
 * 创建一个用于验证的token
 * @param username 用户名
 * @param name 名称
 * @returns
 */
export async function CreateBindToken(username: string, name: string, v2: string) {
    const token = nanoid();
    const data = {
        username,
        name,
        token,
        v2,
        url: `https://push.bxiaob.top/api_node/wechat/login?token=${token}&username=${username}`,
    };
    await Cache.setRedisCache(`bind_${username}`, data, 65);
    return data;
}
/**
 * 绑定对应的openid到用户通道
 * @param username 用户名
 * @param token token
 */
export async function BindOpenid(username: string, token: string, openid: string) {
    const data = await Cache.getRedisCache(`bind_${username}`);
    if (!data) throw new Error("错误的验证码");
    if (data.token != token) throw new Error("验证码已失效");
    const userModel = await GetUserInfo(username);
    if (!userModel) throw new Error("用户不存在或未登录");
    await ModularModel.insert({
        uid: userModel.id,
        name: data.name,
        type: 0,
        v1: openid,
        v2: data.v2,
    });
}
interface iWechatConfig {
    appid: string;
    secret: string;
}
