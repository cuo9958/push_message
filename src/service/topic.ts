import ModularModel from "../model/modular";
import { GetUserInfo } from "./user";

/**
 *增加一条新的类型
 * @param uid 用户id
 * @param type 类型
 * @param name 名称
 * @param v1 值1
 * @param v2 值2
 */
export async function AddModular(username: string, type: number, name: string, v1: string, v2?: string, v3?: string, v4?: string) {
    const model = await GetUserInfo(username);
    if (!model) throw new Error("用户未登录或不存在");
    let data: any = {
        uid: model.id,
        type,
        name,
    };
    if (v1 != undefined && v1 != null) {
        data.v1 = v1;
    }
    if (v2 != undefined && v2 != null) {
        data.v2 = v2;
    }
    if (v3 != undefined && v3 != null) {
        data.v3 = v3;
    }
    if (v4 != undefined && v4 != null) {
        data.v4 = v4;
    }
    await ModularModel.insert(data);
}
/**
 * 获取通道类别
 * @param username 用户名
 * @param pageindex 页码
 * @returns
 */
export async function GetModularList(username: string, pageindex?: string) {
    const model = await GetUserInfo(username);
    if (!model) throw new Error("用户未登录或不存在");
    const data = await ModularModel.findList(model.id, parseInt(pageindex || "0"));
    return data;
}
/**
 * 删除某个通道
 * @param username 用户名
 * @param id
 */
export async function DelModular(username: string, id: number) {
    const model = await GetUserInfo(username);
    if (!model) throw new Error("用户未登录或不存在");
    await ModularModel.del(id, model.id);
}
