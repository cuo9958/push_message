import Router from "@koa/router";
import { AppAuth } from "../middleware/auth";
import { Code2Openid, CreateBindToken, GetLoginUrl, BindOpenid, GetTemplateList } from "../service/wechat";
import { BeError, BeSuccess } from "../util/response";

const router = new Router();

//去登录
router.get("/login", async function (ctx) {
    const { token, username } = ctx.query;
    ctx.redirect(GetLoginUrl("0|" + username + "|" + token));
});
router.get("/logined", async function (ctx) {
    const { code, state } = ctx.query;
    try {
        const data = await Code2Openid(code + "");
        if (state && data) {
            const list = state.split("|");
            await BindOpenid(list[1], list[2], data.openid);
            ctx.body = BeSuccess("绑定成功");
        } else {
            ctx.body = BeSuccess(data);
        }
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
//创建绑定微信的信息
router.post("/bind", AppAuth, async function (ctx) {
    const { name, v2 } = ctx.request.body;
    const { username } = ctx.headers;
    try {
        const data = await CreateBindToken(username, name, v2);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
//模版列表
router.get("/template", async function (ctx) {
    try {
        const data = await GetTemplateList();
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
export default router.routes();
