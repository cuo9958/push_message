import { BeError } from "../util/response";
import { CheckToken } from "../service/user";
import { validate, version } from "uuid";

/**
 * app的鉴权，head中添加uuid和token字段
 * @param toLogin 是否需要跳转登录
 */
export async function AppAuth(ctx, next) {
    const { username, token, deviceid } = ctx.headers;
    if (username && token) {
        try {
            await CheckToken(username, token);
            await next();
        } catch (error) {
            console.log(error.message);
            ctx.body = BeError("未登录", -1);
        }
    } else {
        ctx.body = BeError("还没有登录", 0);
    }
}
//检查token
export async function TokenAuth(ctx, next) {
    const { token } = ctx.params;
    if (validate(token) && version(token) === 4) {
        await next();
    } else {
        ctx.body = BeError("检验失败", -1);
    }
}
