/**
 * 用户服务
 */
import UserModel from "../model/user";
import crypto from "crypto";
import { customAlphabet, nanoid } from "nanoid";
import Cache from "./cache";
import { v4 } from "uuid";

//登录的有效期,一周
const TOKENAGE = 604800;

function createPWD(pwd: string) {
    const md5 = crypto.createHash("md5");
    return md5.update(pwd + "@1ws").digest("hex");
}
function createToken(username: string, deviceid = "") {
    const token = nanoid();
    Cache.set(username, token, TOKENAGE);
    return token;
}
function transformUserCache(data: any, token = "") {
    if (!data) return data;
    const userCacheModel = {
        id: data.id,
        username: data.username,
        nickname: data.nickname,
        headimg: data.headimg,
        token,
    };
    Cache.setRedisCache("_user_" + userCacheModel.username, userCacheModel);
    return userCacheModel;
}

/**
 * 注册
 * @param username 用户名
 * @param pwd 密码
 */
export async function AddUser(username: string, pwd: string, email: string) {
    try {
        const data = await UserModel.findExist(username);
        if (data) throw new Error("用户名已存在");
        await UserModel.insert({
            username,
            email,
            pwd: createPWD(pwd),
            token: v4(),
        });
    } catch (error) {
        console.log(error);
    }
}
/**
 * 登录
 * @param username 用户名
 * @param pwd 密码
 */
export async function LoginUser(username: string, pwd: string, deviceid: string) {
    const model = await UserModel.findOne(username, createPWD(pwd));
    if (!model) throw new Error("用户名或密码错误");
    const token = createToken(username);
    return transformUserCache(model, token);
}
/**
 * 检查token是否正确
 * @param username 用户名
 * @param token token
 * @returns
 */
export async function CheckToken(username: string, token: string) {
    const token2 = await Cache.get(username);
    return token === token2;
}
/**
 * 根据用户名获取用户信息
 * @param username 用户名
 * @returns
 */
export async function GetUserInfo(username: string) {
    const data = await Cache.getRedisCache("_user_" + username);
    return data;
    // if (data) return data;
    // const model = await UserModel.findByUsername(username);
    // return model;
}
/**
 * 获取用户当前的token
 * @param username 用户名
 * @returns
 */
export async function GetAPIToken(username: string) {
    const key = `t_${username}`;
    const data = Cache.getRedisCache(key);
    if (data) return data;
    const model = await UserModel.findByUsername(username);
    if (!model) throw new Error("用户不存在");
    return model.token;
}
/**
 * 重新获取token
 * @param username 用户名
 */
export async function ReGetAPIToken(username: string) {
    const token = v4();
    await UserModel.update({ token }, username);
    const key = `t_${username}`;
    Cache.setRedisCache(key, token);
    return token;
}
